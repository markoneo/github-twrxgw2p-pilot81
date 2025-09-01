import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useParams } from 'react-router-dom';

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
  authToken?: string;
}

export function DriverDataProvider({ children, driverId, driverUuid, authToken }: DriverDataProviderProps) {
  const [projects, setProjects] = useState<DriverProject[]>([]);
  const [companies, setCompanies] = useState<DriverCompany[]>([]);
  const [carTypes, setCarTypes] = useState<DriverCarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Create driver-specific Supabase client
  const driverClient = React.useMemo(() => {
    if (authToken) {
      return createClient(
        import.meta.env.VITE_SUPABASE_URL || "https://xvurxeuwgzmzkpgkekah.supabase.co",
        import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2dXJ4ZXV3Z3ptemtwZ2tla2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMDkyNzgsImV4cCI6MjA1OTg4NTI3OH0.dRa4m8yD-UV-SbBsyaolOz8sY_PmsgfRePYgkOmfb4s",
        {
          auth: { autoRefreshToken: false, persistSession: false },
          global: {
            headers: { 'x-driver-token': authToken }
          }
        }
      );
    }
    return supabase;
  }, [authToken]);

  // Fetch driver-specific projects
  const fetchDriverProjects = useCallback(async () => {
    if (!driverUuid) {
      setError('Driver ID not provided');
      return;
    }

    try {
      console.log('Fetching projects for driver UUID:', driverUuid);

      // Use driver client for queries
      const { data: projectsData, error: projectsError } = await driverClient
        .from('projects')
        .select(`
          id,
          company_id,
          car_type_id,
          client_name,
          client_phone,
          pickup_location,
          dropoff_location,
          date,
          time,
          passengers,
          price,
          driver_fee,
          status,
          payment_status,
          description,
          booking_id,
          acceptance_status,
          created_at
        `)
        .eq('driver_id', driverUuid)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (projectsError) {
        console.error('Error fetching driver projects:', projectsError);
        throw projectsError;
      }

      console.log('Fetched driver projects:', projectsData?.length || 0, 'projects');
      setProjects(projectsData || []);

      // Fetch companies for the projects
      if (projectsData && projectsData.length > 0) {
        const companyIds = [...new Set(projectsData.map(p => p.company_id).filter(Boolean))];
        
        if (companyIds.length > 0) {
          const { data: companiesData, error: companiesError } = await driverClient
            .from('companies')
            .select('id, name, phone')
            .in('id', companyIds);

          if (companiesError) {
            console.error('Error fetching companies:', companiesError);
            // Don't throw here, we can still show projects without company details
          } else {
            setCompanies(companiesData || []);
          }
        }
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
  }, [driverUuid, retryCount, driverClient]);

  // Update project acceptance status
  const updateProjectStatus = useCallback(async (projectId: string, status: 'accepted' | 'started' | 'declined' | 'completed') => {
    try {
      console.log('Updating project status:', { projectId, status });
      
      const updates: any = {};

      // Handle different status types
      if (status === 'completed') {
        // For completion, update the main project status, not acceptance_status
        updates.status = 'completed';
        updates.completed_at = new Date().toISOString();
        updates.completed_by = driverUuid;
      } else {
        // For other statuses, update acceptance_status
        updates.acceptance_status = status;
        
        // If accepting, set accepted_at and accepted_by
        if (status === 'accepted') {
          updates.accepted_at = new Date().toISOString();
          updates.accepted_by = driverUuid;
        }
      }

      console.log('Sending updates to database:', updates);

      const { error } = await driverClient
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .eq('driver_id', driverUuid);

      if (error) {
        console.error('Database update error:', error);
        throw error;
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
    } catch (err) {
      console.error('Failed to update project status:', err);
      throw err;
    }
  }, [driverUuid, driverClient]);

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

    loadData();

    return () => {
      mounted = false;
    };
  }, [fetchDriverProjects]);

  // Auto-retry on error
  useEffect(() => {
    if (error && retryCount > 0 && retryCount <= 3) {
      console.log(`Auto-retrying data fetch (attempt ${retryCount + 1})`);
      fetchDriverProjects().finally(() => setLoading(false));
    }
  }, [retryCount, error, fetchDriverProjects]);

  const value = {
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