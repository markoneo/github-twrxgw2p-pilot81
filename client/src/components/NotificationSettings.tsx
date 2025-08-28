import React from 'react';
import SettingsLayout from './settings/SettingsLayout';

// Empty settings page as notifications are removed
export default function NotificationSettings() {
  return (
    <SettingsLayout title="Notification Settings">
      <div className="p-4 sm:p-6">
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Notifications Disabled</h3>
          <p className="text-sm text-yellow-700">
            Notifications have been disabled in this version of the application.
          </p>
        </div>
      </div>
    </SettingsLayout>
  );
}