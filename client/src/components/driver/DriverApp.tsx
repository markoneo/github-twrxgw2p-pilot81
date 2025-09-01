import React, { useState, useEffect } from 'react';
import DriverLogin from './DriverLogin';
import DriverDashboard from './DriverDashboard';
import { useLocation, useNavigate } from 'react-router-dom';

export default function DriverApp() {
  const [driver, setDriver] = useState<{id: string, name: string, uuid: string} | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any navigation state
    if (location.state) {
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
    navigate('/driver', { replace: true, state: {} });
  };

  if (!driver) {
    return <DriverLogin onDriverLogin={handleDriverLogin} />;
  }

  return (
    <DriverDashboard 
      driverId={driver.id}
      driverName={driver.name}
      driverUuid={driver.uuid}
      onLogout={handleDriverLogout}
    />
  );
}