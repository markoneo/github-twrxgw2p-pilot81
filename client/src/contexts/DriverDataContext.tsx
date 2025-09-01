import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface DriverProject {
  id: string;
  company_id: string;
  car_type_id: string;
  client_name: string;
  client_phone: string;
  pickup_location: string;
  dropoff_location: string;
  date: string;
  time: string;
  passengers: number;
  price: number;
  driver_fee?: number;
  status: 'active' | 'completed';
  payment_status: 'paid' | 'charge';
  description?: string;
  booking_id?: string;
  acceptance_status: 'pending' | 'accepted' | 'started' | 'declined';
  created_at: string;
}

interface DriverCompany {
  id: string;
  name: string;
  phone?: string;
}

interface DriverCarType {
  id: string;
  name: string;
  capacity: number;
  description?: string;
}
interface DriverDataContextType {
  projects: DriverProject[];
  companies: DriverCompany[];
  carTypes: DriverCarType[];
  loading: boolean;
  error: string | null;
  refreshProjects: () => Promise<void>;
  updateProjectStatus: (projectId: string, status: 'accepted' | 'started' | 'declined' | 'completed') => Promise<void>;
  retryCount: number;
}

const DriverDataContext = createContext<DriverDataContextType | null>(null);

export function useDriverData() {
  const context = useContext(DriverDataContext);
  if (!context) {
    throw new Error('useDriverData must be used within a DriverDataProvider');
  }
  return context;
}

interface DriverDataProviderProps {
  children: React.ReactNode;
  driverId: string;
  driverUuid: string;
}

export function DriverDataProvider({ children, driverId, driverUuid }: DriverDataProviderProps) {
  const [projects, setProjects] = useState<DriverProject[]>([]);
  const [companies, setCompanies] = useState<DriverCompany[]>([]);
  const [carTypes, setCarTypes] = useState<DriverCarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch driver-specific projects
  const fetchDriverProjects = useCallback(async () => {
    if (!driverUuid) {
      setError('Driver ID not provided');
      return;
    }

    try {
      console.log('Fetching projects for driver UUID:', driverUuid);

      // Use the secure function that sets proper context for RLS
      const { data: projectsData, error: projectsError } = await supabase
        .rpc('get_driver_projects_with_context', {
          driver_uuid: driverUuid
        });

      if (projectsError) {
        console.error('Error fetching driver projects:', projectsError);
        throw projectsError;
      }

      console.log('Fetched driver projects:', projectsData?.length || 0, 'projects');
      setProjects(projectsData || []);

      console.log('Fetching companies...');
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('id, name, phone');

      if (companiesError) {
        console.error('Error fetching companies:', companiesError);
        throw companiesError;
      }

      console.log('Fetched companies:', companiesData?.length || 0, 'companies');
      setCompanies(companiesData || []);

      console.log('Fetching car types...');
      const { data: carTypesData, error: carTypesError } = await supabase
        .from('car_types')
        .select('id, name, capacity, description');

      if (carTypesError) {
        console.error('Error fetching car types:', carTypesError);
        throw carTypesError;
      }

      console.log('Fetched car types:', carTypesData?.length || 0, 'car types');
      setCarTypes(carTypesData || []);

      // Only update last_login if the column exists
      try {
        await supabase
          .from('drivers')
          .update({ last_login: new Date().toISOString() })
          .eq('id', driverUuid);
      } catch (loginUpdateError) {
        // Ignore errors if last_login column doesn't exist
        console.log('Note: last_login column not available, skipping update');
      }

      setError(null);
      setRetryCount(0);
    } catch (err) {
      console.error('Failed to fetch driver data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load projects';
      setError(errorMessage);
      
      // Implement retry logic for transient errors
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 2000 * (retryCount + 1)); // Exponential backoff
      }
    }
  }, [driverUuid, retryCount]);

  // Update project acceptance status
  const updateProjectStatus = useCallback(async (projectId: string, status: 'accepted' | 'started' | 'declined' | 'completed') => {
    try {
      console.log('Updating project status:', { projectId, status });
      
      // Use the secure function to update project status
      const { data: updateResult, error } = await supabase
        .rpc('update_driver_project_status', {
          project_uuid: projectId,
          driver_uuid: driverUuid,
          new_status: status
        });

      if (error) {
        console.error('Database update error:', error);
        throw error;
      }

      if (!updateResult) {
        throw new Error('Failed to update project - project not found or not assigned to this driver');
      }

      // Update local state
      setProjects(prev => prev.map(project =>
        project.id === projectId 
          ? { 
              ...project, 
              ...(status === 'completed' 
                ? { status: 'completed' }
                : { acceptance_status: status }
              )
            }
          : project
      ));

      console.log(`Project ${projectId} status updated to ${status}`);
      
      // Note: The real-time subscription in the main DataContext will automatically 
      // update the dashboard, so we don't need to manually refresh here
    } catch (err: any) {
      console.error('Failed to update project status:', err);
      throw err;
    }
  }, [driverUuid]);

  // Refresh projects manually
  const refreshProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    await fetchDriverProjects();
    setLoading(false);
  }, [fetchDriverProjects]);

  // Initial data fetch
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (!mounted) return;
      
      setLoading(true);
      await fetchDriverProjects();
      
      if (mounted) {
        setLoading(false);
      }
    };

    if (driverUuid) {
      loadData();
    }

    return () => {
      mounted = false;
    };
  }, [fetchDriverProjects, driverUuid]);

  // Auto-retry on error
  useEffect(() => {
    if (error && retryCount > 0 && retryCount <= 3) {
      console.log(`Auto-retrying data fetch (attempt ${retryCount + 1})`);
      setTimeout(() => {
        fetchDriverProjects().finally(() => setLoading(false));
      }, 1000 * retryCount);
    } else {
      setRetryCount(0);
    }
  }, [retryCount, error, fetchDriverProjects]);

  const value: DriverDataContextType = {
    projects,
    companies,
    carTypes,
    loading,
    error,
    refreshProjects,
    updateProjectStatus,
    retryCount
  };

  return (
    <DriverDataContext.Provider value={value}>
      {children}
    </DriverDataContext.Provider>
  );
}