import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SettingsLayoutProps {
  title: string;
  children: React.ReactNode;
  onAdd?: () => void;
  addButtonText?: string;
}

export default function SettingsLayout({ title, children, onAdd, addButtonText }: SettingsLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="text-sm sm:text-base">Back</span>
            </button>
          </div>
          {onAdd && (
            <button
              onClick={onAdd}
              className="bg-green-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center text-sm"
            >
              <span>{addButtonText || 'Add New'}</span>
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h2>
          </div>
          <div className="overflow-x-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}