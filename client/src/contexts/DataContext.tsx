import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';

interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
}

interface CarType {
  id: string;
  name: string;
  capacity: number;
  luggage_capacity: number;
  description: string;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  license: string;
  status: 'available' | 'busy' | 'offline';
  pin?: string;
  total_earnings?: number;
}

interface Project {
  id: string;
  company: string;
  status: 'active' | 'completed';
  description: string;
  driver: string;
  date: string;
  time: string;
  passengers: number;
  pickupLocation: string;
  dropoffLocation: string;
  carType: string;
  price: number;
  driverFee?: number | null; // Optional driver fee field
  clientName: string;
  clientPhone: string;
  paymentStatus: 'paid' | 'charge';
  distance?: string;
  bookingId?: string;
}

interface Payment {
  id: string;
  driver_id: string;
  amount: number;
  date: string;
  status: 'pending' | 'paid';
  description: string;
  completed_at?: string;
  created_at: string;
}

interface DataContextType {
  companies: Company[];
  drivers: Driver[];
  carTypes: CarType[];
  projects: Project[];
  payments: Payment[];
  addCompany: (company: Omit<Company, 'id'>) => Promise<Company | null>;
  addDriver: (driver: Omit<Driver, 'id'>) => Promise<void>;
  addCarType: (carType: Omit<CarType, 'id'>) => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'status'>) => Promise<void>;
  addPayment: (payment: Omit<Payment, 'id' | 'created_at' | 'completed_at'>) => Promise<void>;
  updatePayment: (id: string, payment: Partial<Payment>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  completePayment: (id: string) => Promise<void>;
  deleteDriver: (id: string) => Promise<void>;
  deleteCarType: (id: string) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  updateCompany: (id: string, company: Partial<Company>) => Promise<void>;
  updateCarType: (id: string, carType: Partial<CarType>) => Promise<void>;
  updateDriver: (id: string, driver: Partial<Driver>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | null>(null);

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [carTypes, setCarTypes] = useState<CarType[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const [dataFetched, setDataFetched] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null);

  // Reset error when user changes
  useEffect(() => {
    setError(null);
    if (currentUser) {
      // Reset data fetch status when user changes
      setDataFetched(false);
    }
  }, [currentUser?.id]);

  // Load data when authenticated
  useEffect(() => {
    if (currentUser && !dataFetched) {
      setLoading(true);
      console.log("Fetching data for user:", currentUser.id);

      // Use Promise.allSettled to handle partial failures
      Promise.allSettled([
        fetchCompanies(),
        fetchDrivers(),
        fetchCarTypes(),
        fetchProjects(),
        fetchPayments()
      ]).then(results => {
        // Check if any fetches failed
        const errors = results.filter(r => r.status === 'rejected');
        if (errors.length > 0) {
          console.error("Some data failed to load:", errors);
          setError("Some data could not be loaded. Please try refreshing.");

          // Retry loading if less than 3 attempts
          if (retryCount < 3) {
            setRetryCount(prev => prev + 1);
            setDataFetched(false); // Will trigger a retry
          } else {
            setDataFetched(true); // Stop retrying after 3 attempts
          }
        } else {
          // Success - reset retry count and mark data as fetched
          setRetryCount(0);
          setDataFetched(true);
        }
      }).finally(() => {
        setLoading(false);
      });
    } else if (!currentUser) {
      // Clear data when user logs out
      setCompanies([]);
      setDrivers([]);
      setCarTypes([]);
      setProjects([]);
      setPayments([]);
      setDataFetched(false);
      setRetryCount(0);
      setLoading(false);
    }
  }, [currentUser, dataFetched, retryCount]);

  // Set up real-time subscription for projects
  useEffect(() => {
    if (!currentUser?.id || !dataFetched) return;

    console.log('Setting up real-time subscription for projects...');

    // Create a channel for real-time updates
    const channel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${currentUser.id}` // Only listen to current user's projects
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          handleRealtimeUpdate(payload);
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to real-time updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Real-time subscription error');
        }
      });

    setRealtimeChannel(channel);

    // Cleanup function
    return () => {
      console.log('Cleaning up real-time subscription...');
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [currentUser?.id, dataFetched]);

  // Handle real-time updates
  const handleRealtimeUpdate = useCallback((payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    console.log('Processing real-time update:', { eventType, newRecord, oldRecord });

    switch (eventType) {
      case 'INSERT':
        if (newRecord) {
          const transformedProject = {
            ...newRecord,
            company: newRecord.company_id,
            driver: newRecord.driver_id,
            carType: newRecord.car_type_id,
            pickupLocation: newRecord.pickup_location,
            dropoffLocation: newRecord.dropoff_location,
            clientName: newRecord.client_name,
            clientPhone: newRecord.client_phone,
            paymentStatus: newRecord.payment_status,
            bookingId: newRecord.booking_id,
            driverFee: newRecord.driver_fee,
          };
          
          setProjects(prev => {
            // Check if project already exists to avoid duplicates
            const exists = prev.some(p => p.id === transformedProject.id);
            if (exists) return prev;
            return [transformedProject, ...prev];
          });
          console.log('Added new project via real-time update');
        }
        break;

      case 'UPDATE':
        if (newRecord) {
          const transformedProject = {
            ...newRecord,
            company: newRecord.company_id,
            driver: newRecord.driver_id,
            carType: newRecord.car_type_id,
            pickupLocation: newRecord.pickup_location,
            dropoffLocation: newRecord.dropoff_location,
            clientName: newRecord.client_name,
            clientPhone: newRecord.client_phone,
            paymentStatus: newRecord.payment_status,
            bookingId: newRecord.booking_id,
            driverFee: newRecord.driver_fee,
          };

          setProjects(prev => prev.map(project =>
            project.id === transformedProject.id ? transformedProject : project
          ));
          console.log('Updated project via real-time update:', transformedProject.id);
        }
        break;

      case 'DELETE':
        if (oldRecord) {
          setProjects(prev => prev.filter(project => project.id !== oldRecord.id));
          console.log('Deleted project via real-time update:', oldRecord.id);
        }
        break;

      default:
        console.log('Unknown real-time event type:', eventType);
    }
  }, []);

  // Helper function to check if date and time are in the future
  const isDateTimeValid = (date: string, time: string): boolean => {
    try {
      const now = new Date();
      const [year, month, day] = date.split('-').map(Number);
      const [hours, minutes] = time.split(':').map(Number);

      const projectDateTime = new Date(year, month - 1, day, hours, minutes);
      return projectDateTime > now;
    } catch (err) {
      console.error("Date validation error:", err);
      return false;
    }
  };

  // Add error handling to all data fetch functions
  async function fetchPayments() {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', currentUser?.id)
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }
      setPayments(data || []);
    } catch (err) {
      console.error('Error fetching payments:', err);
      throw err;
    }
  }

  const addPayment = async (payment: Omit<Payment, 'id' | 'created_at' | 'completed_at'>) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([{ ...payment, user_id: currentUser?.id }])
        .select()
        .single();

      if (error) {
        throw error;
      }
      setPayments([...payments, data]);
    } catch (err) {
      console.error('Error adding payment:', err);
      setError('Failed to add payment');
    }
  };

  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update(updates)
        .eq('id', id);

      if (error) {
        throw error;
      }

      setPayments(payments.map(payment =>
        payment.id === id ? { ...payment, ...updates } : payment
      ));
    } catch (err) {
      console.error('Error updating payment:', err);
      setError('Failed to update payment');
    }
  };

  const deletePayment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setPayments(payments.filter(payment => payment.id !== id));
    } catch (err) {
      console.error('Error deleting payment:', err);
      setError('Failed to delete payment');
    }
  };

  const completePayment = async (id: string) => {
    try {
      const payment = payments.find(p => p.id === id);
      if (!payment) return;

      // First try using the RPC function
      try {
        const { error } = await supabase.rpc('mark_payment_paid', {
          payment_id: id
        });

        if (error) {
          console.log("RPC failed, trying direct update:", error);
          throw error;
        }
      } catch (rpcError) {
        // If RPC fails, try direct update
        console.log("Direct update fallback for payment:", id);
        const { error } = await supabase
          .from('payments')
          .update({ 
            status: 'paid', 
            completed_at: new Date().toISOString() 
          })
          .eq('id', id);

        if (error) {
          console.log("Direct update also failed:", error);
          throw error;
        }
      }

      // Update local state
      setPayments(payments.map(p =>
        p.id === id ? { ...p, status: 'paid', completed_at: new Date().toISOString() } : p
      ));

      // If you need to update driver's UI immediately
      if (payment.driver_id) {
        const driver = drivers.find(d => d.id === payment.driver_id);
        if (driver) {
          // Update local state only
          setDrivers(drivers.map(d =>
            d.id === payment.driver_id 
              ? { ...d, total_earnings: (d.total_earnings || 0) + payment.amount } 
              : d
          ));
        }
      }

      // Force refresh data to ensure UI is in sync with database
      setTimeout(() => {
        fetchPayments().catch(e => console.error("Failed to refresh payments after completion:", e));
      }, 500);

    } catch (err) {
      console.error('Error completing payment:', err);
      setError(`Error completing payment: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  async function fetchCompanies() {
    try {
      console.log("Fetching companies for user:", currentUser?.id);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', currentUser?.id);

      if (error) {
        throw error;
      }
      setCompanies(data || []);
    } catch (err) {
      console.error('Error fetching companies:', err);
      throw err;
    }
  }

  async function fetchDrivers() {
    if (!currentUser?.id) return;

    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('user_id', currentUser.id);

      if (error) {
        console.error('Error fetching drivers:', error);
        return;
      }

      // Ensure all drivers have a PIN field (fallback to '1234' if missing)
      const driversWithPin = (data || []).map(driver => ({
        ...driver,
        pin: (typeof driver.pin === 'string' && driver.pin) ? driver.pin : '1234'
      }));

      console.log('Fetched drivers:', driversWithPin);
      setDrivers(driversWithPin);
    } catch (err) {
      console.error('Error fetching drivers:', err);
    }
  }

  async function fetchCarTypes() {
    try {
      console.log("Fetching car types for user:", currentUser?.id);
      const { data, error } = await supabase
        .from('car_types')
        .select('*')
        .eq('user_id', currentUser?.id);

      if (error) {
        throw error;
      }
      setCarTypes(data || []);
    } catch (err) {
      console.error('Error fetching car types:', err);
      throw err;
    }
  }

  async function fetchProjects() {
    try {
      console.log("Fetching projects for user:", currentUser?.id);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', currentUser?.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const transformedData = (data || []).map(project => ({
        ...project,
        company: project.company_id,
        driver: project.driver_id,
        carType: project.car_type_id,
        pickupLocation: project.pickup_location,
        dropoffLocation: project.dropoff_location,
        clientName: project.client_name,
        clientPhone: project.client_phone,
        paymentStatus: project.payment_status,
        bookingId: project.booking_id,
        driverFee: project.driver_fee, // Map driver_fee from database
      }));

      setProjects(transformedData);
    } catch (err) {
      console.error('Error fetching projects:', err);
      throw err;
    }
  }

  // Helper function to transform project data for the database
  const transformProjectForDB = useCallback((project: any) => ({
    company_id: project.company,
    driver_id: project.driver,
    car_type_id: project.carType,
    pickup_location: project.pickupLocation,
    dropoff_location: project.dropoffLocation,
    client_name: project.clientName,
    client_phone: project.clientPhone,
    payment_status: project.paymentStatus,
    date: project.date,
    time: project.time,
    passengers: project.passengers,
    price: project.price,
    driver_fee: project.driverFee, // Include driver fee in database transformation
    description: project.description,
    status: project.status || 'active',
    booking_id: project.bookingId
  }), []);

  const addCompany = async (company: Omit<Company, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([{ ...company, user_id: currentUser?.id }])
        .select()
        .single();

      if (error) {
        throw error;
      }
      setCompanies([...companies, data]);
      return data;
    } catch (err) {
      console.error('Error adding company:', err);
      setError('Failed to add company');
      return null;
    }
  };

  const addDriver = async (driver: Omit<Driver, 'id'>) => {
    try {
      // Handle PIN column that might not exist in database
      const dbDriver = { ...driver, user_id: currentUser?.id };

      const { data, error } = await supabase
        .from('drivers')
        .insert([dbDriver])
        .select()
        .single();

      if (error) {
        // If error mentions PIN column, remove it and try again
        if (error.message.includes('pin') && driver.pin) {
          delete dbDriver.pin;
          const { data: retryData, error: retryError } = await supabase
            .from('drivers')
            .insert([dbDriver])
            .select()
            .single();

          if (retryError) {
            throw retryError;
          }
          // Add PIN to local data even if not in database
          setDrivers([...drivers, { ...retryData, pin: driver.pin }]);
          return;
        } else {
          throw error;
        }
      }

      setDrivers([...drivers, data]);
    } catch (err) {
      console.error('Error adding driver:', err);
      setError('Failed to add driver');
    }
  };

  const addCarType = async (carType: Omit<CarType, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('car_types')
        .insert([{ 
          name: carType.name,
          capacity: carType.capacity,
          luggage_capacity: carType.luggage_capacity,
          description: carType.description,
          user_id: currentUser?.id 
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }
      setCarTypes([...carTypes, data]);
    } catch (err) {
      console.error('Error adding car type:', err);
      setError('Failed to add car type');
    }
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    try {
      const projectData = transformProjectForDB(project);

      // Generate a random booking ID if none is provided
      if (!projectData.booking_id) {
        projectData.booking_id = Math.floor(Math.random() * 1000000000).toString();
      }

      // Add user_id
      projectData.user_id = currentUser?.id;

      // For optional fields that might be empty, provide default values
      if (!projectData.company_id) projectData.company_id = null;
      if (!projectData.driver_id) projectData.driver_id = null;
      if (!projectData.car_type_id) projectData.car_type_id = null;
      if (!projectData.pickup_location) projectData.pickup_location = 'Not specified';
      if (!projectData.dropoff_location) projectData.dropoff_location = 'Not specified';
      if (!projectData.client_name) projectData.client_name = 'Anonymous';

      console.log("Adding project with data:", projectData);

      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      const transformedData = {
        ...data,
        company: data.company_id,
        driver: data.driver_id,
        carType: data.car_type_id,
        pickupLocation: data.pickup_location,
        dropoffLocation: data.dropoff_location,
        clientName: data.client_name,
        clientPhone: data.client_phone,
        paymentStatus: data.payment_status,
        bookingId: data.booking_id,
        driverFee: data.driver_fee, // Include driver fee in transformed data
      };

      setProjects([transformedData, ...projects]);
      console.log("Project added successfully:", transformedData);
    } catch (err) {
      console.error('Error adding project:', err);
      setError('Failed to create project');
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      // For completed projects, we don't need to validate the date/time
      const project = projects.find(p => p.id === id);
      const isCompleting = updates.status === 'completed';

      // Only validate date/time for active projects
      if (!isCompleting && project) {
        // Validate date and time are in the future if they are part of the updates
        const dateToCheck = updates.date || project.date;
        const timeToCheck = updates.time || project.time;

        if (!isDateTimeValid(dateToCheck, timeToCheck)) {
          throw new Error('Project date and time must be in the future');
        }
      }

      // For simple status updates, don't transform the entire object
      let transformedUpdates;
      if (Object.keys(updates).length === 1 && updates.status) {
        // Simple status update - just update the status field
        transformedUpdates = { status: updates.status };
      } else {
        // Full update - use the transform function
        transformedUpdates = transformProjectForDB(updates);
      }

      console.log('Updating project with:', transformedUpdates);

      const { error } = await supabase
        .from('projects')
        .update(transformedUpdates)
        .eq('id', id);

      if (error) {
        console.error('Database update error:', error);
        throw error;
      }

      console.log('Project updated successfully, updating local state');
      
      setProjects(projects.map(project =>
        project.id === id ? { ...project, ...updates } : project
      ));
      
      // Log the updated project for debugging
      console.log('Project status updated to:', updates.status);
    } catch (error) {
      console.error('Error updating project:', error);
      setError(error instanceof Error ? error.message : 'Failed to update project');
      throw error; // Re-throw so the UI can handle the error
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setProjects(projects.filter(project => project.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project');
    }
  };

  const deleteDriver = async (id: string) => {
    try {
      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setDrivers(drivers.filter(driver => driver.id !== id));
    } catch (err) {
      console.error('Error deleting driver:', err);
      setError('Failed to delete driver');
    }
  };

  const deleteCarType = async (id: string) => {
    try {
      const { error } = await supabase
        .from('car_types')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setCarTypes(carTypes.filter(carType => carType.id !== id));
    } catch (err) {
      console.error('Error deleting car type:', err);
      setError('Failed to delete car type');
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setCompanies(companies.filter(company => company.id !== id));
    } catch (err) {
      console.error('Error deleting company:', err);
      setError('Failed to delete company');
    }
  };

  const updateCompany = async (id: string, updates: Partial<Company>) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', id);

      if (error) {
        throw error;
      }

      setCompanies(companies.map(company => 
        company.id === id ? { ...company, ...updates } : company
      ));
    } catch (err) {
      console.error('Error updating company:', err);
      setError('Failed to update company');
    }
  };

  const updateCarType = async (id: string, updates: Partial<CarType>) => {
    try {
      const { error } = await supabase
        .from('car_types')
        .update({
          name: updates.name,
          capacity: updates.capacity,
          luggage_capacity: updates.luggage_capacity,
          description: updates.description
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setCarTypes(carTypes.map(carType => 
        carType.id === id ? { ...carType, ...updates } : carType
      ));
    } catch (err) {
      console.error('Error updating car type:', err);
      setError('Failed to update car type');
    }
  };

  const updateDriver = async (id: string, updates: Partial<Driver>) => {
    try {
      // Handle PIN column that might not exist in database
      const dbUpdates = { ...updates };

      const { error } = await supabase
        .from('drivers')
        .update(dbUpdates)
        .eq('id', id);

      if (error) {
        // If error mentions PIN column, remove it and try again
        if (error.message.includes('pin') && updates.pin) {
          delete dbUpdates.pin;
          const { error: retryError } = await supabase
            .from('drivers')
            .update(dbUpdates)
            .eq('id', id);

          if (retryError) {
            throw retryError;
          }
        } else {
          throw error;
        }
      }

      // Update local state with all changes including PIN
      setDrivers(drivers.map(driver => 
        driver.id === id ? { ...driver, ...updates } : driver
      ));
    } catch (err) {
      console.error('Error updating driver:', err);
      setError('Failed to update driver');
    }
  };

  // Force reload data method
  const refreshData = useCallback(async () => {
    if (currentUser) {
      setError(null);
      setLoading(true);
      try {
        await Promise.all([
          fetchCompanies(),
          fetchDrivers(),
          fetchCarTypes(),
          fetchProjects(),
          fetchPayments()
        ]);
        console.log("Data refresh completed successfully");
      } catch (err) {
        console.error("Failed to refresh data:", err);
        setError("Failed to refresh data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  }, [currentUser]);

  // Cleanup real-time subscription on unmount
  useEffect(() => {
    return () => {
      if (realtimeChannel) {
        console.log('Cleaning up real-time channel on unmount...');
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, [realtimeChannel]);

  return (
    <DataContext.Provider value={{ 
      companies, 
      drivers, 
      carTypes,
      projects, 
      payments,
      addCompany, 
      addDriver, 
      addCarType,
      addProject,
      addPayment,
      updatePayment,
      deletePayment,
      completePayment,
      updateProject,
      deleteProject,
      deleteDriver,
      deleteCarType,
      deleteCompany,
      updateCompany,
      updateCarType,
      updateDriver,
      refreshData,
      loading,
      error
    }}>
      {children}
    </DataContext.Provider>
  );
}