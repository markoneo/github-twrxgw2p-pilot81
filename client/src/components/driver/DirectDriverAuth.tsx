import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Car, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function DirectDriverAuth() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [driverInfo, setDriverInfo] = useState<any>(null);

  useEffect(() => {
    const authenticateWithToken = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid authentication link');
        return;
      }

      try {
        setStatus('loading');
        console.log('Authenticating with token:', token);
        
        // Use the secure function to get driver by token
        const { data: driverData, error } = await supabase
          .rpc('get_driver_by_token', {
            token_value: token
          });

        if (error || !driverData || driverData.length === 0) {
          console.error('Driver authentication error:', error);
          console.log('No driver found for token:', token);
          setStatus('error');
          setMessage('Invalid or expired authentication link. Please contact your dispatcher.');
          return;
        }

        const driver = driverData[0];
        console.log('Driver authenticated successfully:', driver);

        // Update last login timestamp
        // Only update last_login if the column exists
        try {
          await supabase
            .from('drivers')
            .update({ last_login: new Date().toISOString() })
            .eq('id', driver.id);
        } catch (loginUpdateError) {
          // Ignore errors if last_login column doesn't exist
          console.log('Note: last_login column not available, skipping update');
        }

        setDriverInfo(driver);
        setStatus('success');
        setMessage(`Welcome back, ${driver.name}!`);
        
        console.log('Navigating to driver dashboard with state:', {
          driverId: driver.license,
          driverName: driver.name,
          driverUuid: driver.id,
          authToken: token
        });

        // Auto-login after 2 seconds
        setTimeout(() => {
          navigate('/driver', {
            replace: true,
            state: {
              driverId: driver.license,
              driverName: driver.name,
              driverUuid: driver.id,
              authToken: token  // Use the token from URL params
            }
          });
        }, 2000);

      } catch (err) {
        console.error('Authentication error:', err);
        setStatus('error');
        setMessage('Authentication failed. Please try again.');
      }
    };

    authenticateWithToken();
  }, [token, navigate]);

  const handleManualLogin = () => {
    navigate('/driver');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
            <Car className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Driver Portal</h1>
          <p className="text-blue-200">Secure direct access</p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            {status === 'loading' && (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Authenticating...</h2>
                <p className="text-gray-600">Please wait while we verify your access</p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Successful!</h2>
                <p className="text-gray-600 mb-4">{message}</p>
                {driverInfo && (
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-green-700">
                      <strong>Driver:</strong> {driverInfo.name}<br />
                      <strong>ID:</strong> {driverInfo.license}<br />
                      <strong>Status:</strong> {driverInfo.status}
                    </p>
                  </div>
                )}
                <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
              </>
            )}

            {status === 'error' && (
              <>
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Failed</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <button
                  onClick={handleManualLogin}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Use Manual Login Instead
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-200 text-sm">
            RidePilot Driver Portal - Secure Access
          </p>
        </div>
      </div>
    </div>
  );
}