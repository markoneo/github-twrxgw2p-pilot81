import React, { useState, useEffect } from 'react';
import DriverLogin from './DriverLogin';
import DriverDashboard from './DriverDashboard';
import DirectDriverAuth from './DirectDriverAuth';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

export default function DriverApp() {
  const [driver, setDriver] = useState<{id: string, name: string, uuid: string, token?: string} | null>(null);
  const { token } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have driver data from DirectDriverAuth navigation state
    if (location.state?.driverId && location.state?.driverName && location.state?.driverUuid) {
      console.log('Setting driver from navigation state:', location.state);
      setDriver({
        id: location.state.driverId,
        name: location.state.driverName,
        uuid: location.state.driverUuid,
        token: location.state.authToken
      });
      // Clear the navigation state to prevent re-processing
      navigate('/driver', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const handleDriverLogin = (driverId: string, driverName: string, driverUuid: string) => {
    console.log('Driver login successful:', { driverId, driverName, driverUuid });
    setDriver({ id: driverId, name: driverName, uuid: driverUuid });
  };

  const handleDriverLogout = () => {
    console.log('Driver logout');
    setDriver(null);
    // Clear any cached data
    navigate('/driver', { replace: true, state: {} });
  };

  // If we have a token in the URL, show the direct auth component
  if (token) {
    return <DirectDriverAuth />;
  }

  if (!driver) {
    return <DriverLogin onDriverLogin={handleDriverLogin} />;
  }

  return (
    <DriverDashboard 
      driverId={driver.id}
      driverName={driver.name}
      driverUuid={driver.uuid}
      authToken={driver.token}
      onLogout={handleDriverLogout}
    />
  );
}