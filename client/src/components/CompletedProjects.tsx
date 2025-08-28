import React, { useState, useEffect } from 'react';
import { Check, MapPin, Users, ArrowLeft } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';

// Color palette for company themes
const companyColorPalette = [
  'blue',   // Primary blue
  'green',  // Primary green
  'purple', // Deep purple
  'amber',  // Warm amber
  'teal',   // Teal/cyan
  'red',    // Warm red
  'indigo', // Deep indigo
  'pink',   // Vibrant pink
  'orange', // Bright orange
  'emerald' // Rich emerald
];

const getCompanyTheme = (companyName: string, companyId?: string) => {
  // Load custom colors from localStorage
  const savedColors = localStorage.getItem('companyColors');
  const companyColors = savedColors ? JSON.parse(savedColors) : {};
  
  // If we have a saved color for this company, use it
  if (companyId && companyColors[companyId]) {
    return companyColors[companyId]; // This could be a predefined color name or a hex color
  }
  
  // Pre-defined mappings for specific companies
  const specificThemes: Record<string, string> = {
    'RideConnect': 'rideconnect', // Custom #BF3131 red
    'AlphaTransfers': 'purple',
    'EcoRides': 'emerald',
    'LuxuryTransport': 'amber',
    'SpeedyShuttle': 'red',
    'VIATOR': 'viator',         // Custom #328E6E green
    'BOOKING': 'booking'        // Custom #3D365C purple
  };
  
  // If we have a specific theme for this company, use it
  if (companyName && specificThemes[companyName]) {
    return specificThemes[companyName];
  }
  
  // Otherwise, generate a deterministic color based on the company name or ID
  if (companyId) {
    // Create a simple hash from the company ID
    const hashValue = companyId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Use the hash to pick a color from the palette
    return companyColorPalette[hashValue % companyColorPalette.length];
  }
  
  // Default to green if nothing else works
  return 'green';
};

const getThemeClasses = (theme: string) => {
  const themeClasses: Record<string, Record<string, string>> = {
    blue: {
      accent: 'bg-blue-500 hover:bg-blue-600',
      text: 'text-blue-600',
      border: 'border-blue-500 border-2',
      light: 'bg-blue-50',
      icon: 'text-blue-500',
    },
    green: {
      accent: 'bg-green-500 hover:bg-green-600',
      text: 'text-green-600',
      border: 'border-green-500 border-2',
      light: 'bg-green-50',
      icon: 'text-green-500',
    },
    purple: {
      accent: 'bg-purple-500 hover:bg-purple-600',
      text: 'text-purple-600',
      border: 'border-purple-500 border-2',
      light: 'bg-purple-50',
      icon: 'text-purple-500',
    },
    amber: {
      accent: 'bg-amber-500 hover:bg-amber-600',
      text: 'text-amber-600',
      border: 'border-amber-500 border-2',
      light: 'bg-amber-50',
      icon: 'text-amber-500',
    },
    teal: {
      accent: 'bg-teal-500 hover:bg-teal-600',
      text: 'text-teal-600',
      border: 'border-teal-500 border-2',
      light: 'bg-teal-50',
      icon: 'text-teal-500',
    },
    red: {
      accent: 'bg-red-500 hover:bg-red-600',
      text: 'text-red-600',
      border: 'border-red-500 border-2',
      light: 'bg-red-50',
      icon: 'text-red-500',
    },
    indigo: {
      accent: 'bg-indigo-500 hover:bg-indigo-600',
      text: 'text-indigo-600',
      border: 'border-indigo-500 border-2',
      light: 'bg-indigo-50',
      icon: 'text-indigo-500',
    },
    pink: {
      accent: 'bg-pink-500 hover:bg-pink-600',
      text: 'text-pink-600',
      border: 'border-pink-500 border-2',
      light: 'bg-pink-50',
      icon: 'text-pink-500',
    },
    orange: {
      accent: 'bg-orange-500 hover:bg-orange-600',
      text: 'text-orange-600',
      border: 'border-orange-500 border-2',
      light: 'bg-orange-50',
      icon: 'text-orange-500',
    },
    emerald: {
      accent: 'bg-emerald-500 hover:bg-emerald-600',
      text: 'text-emerald-600',
      border: 'border-emerald-500 border-2',
      light: 'bg-emerald-50',
      icon: 'text-emerald-500',
    },
    viator: {
      accent: 'bg-[#328E6E] hover:bg-[#2a7a5e]',
      text: 'text-[#328E6E] font-semibold',
      border: 'border-[#328E6E] border-2',
      light: 'bg-green-50',
      icon: 'text-[#328E6E]',
    },
    booking: {
      accent: 'bg-[#3D365C] hover:bg-[#332d4d]',
      text: 'text-[#3D365C] font-semibold',
      border: 'border-[#3D365C] border-2',
      light: 'bg-indigo-50',
      icon: 'text-[#3D365C]',
    },
    rideconnect: {
      accent: 'bg-[#BF3131] hover:bg-[#a62a2a]',
      text: 'text-[#BF3131] font-semibold',
      border: 'border-[#BF3131] border-2',
      light: 'bg-red-50',
      icon: 'text-[#BF3131]',
    }
  };
  
  // Check if the theme is a hex color
  if (theme.startsWith('#')) {
    return {
      accent: `bg-[${theme}] hover:bg-[${theme}]/90`,
      text: `text-[${theme}] font-semibold`,
      border: `border-[${theme}] border-2`,
      light: 'bg-gray-50',
      icon: `text-[${theme}]`,
    };
  }
  
  return themeClasses[theme] || themeClasses.green;
};

export default function CompletedProjects() {
  const { projects, companies, drivers, carTypes } = useData();
  const navigate = useNavigate();
  const [groupedProjects, setGroupedProjects] = useState<{ [key: string]: any[] }>({});

  // Remember company colors to keep them consistent in the UI
  const [companyColorCache] = React.useState<Record<string, string>>({});

  const getCompanyName = (id: string) => {
    const company = companies.find(c => c.id === id);
    return company?.name || 'Unknown Company';
  };

  const getDriverName = (id: string) => {
    const driver = drivers.find(d => d.id === id);
    return driver?.name || 'Unknown Driver';
  };
  
  const getCarTypeName = (id: string) => {
    const carType = carTypes.find(c => c.id === id);
    return carType?.name || 'Standard';
  };

  const getCompanyColorTheme = (companyId: string) => {
    if (!companyColorCache[companyId]) {
      const companyName = getCompanyName(companyId);
      companyColorCache[companyId] = getCompanyTheme(companyName, companyId);
    }
    return companyColorCache[companyId];
  };

  // Group completed projects by date
  useEffect(() => {
    const completedProjects = projects
      .filter(p => p.status === 'completed')
      .sort((a, b) => {
        // Sort by date in descending order (newest first)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

    const grouped = completedProjects.reduce((acc, project) => {
      const date = new Date(project.date);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(project);
      return acc;
    }, {} as { [key: string]: typeof completedProjects });

    setGroupedProjects(grouped);
  }, [projects]);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="flex items-center mb-4 sm:mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Back to Dashboard</span>
          </button>
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Completed Projects</h1>
        
        {Object.keys(groupedProjects).length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">No completed projects yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedProjects).map(([dateKey, dateProjects]) => (
              <div key={dateKey}>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">
                  {new Date(dateKey).toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short'
                  })}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dateProjects.map((project) => {
                    // Get color theme for this company
                    const colorTheme = getCompanyColorTheme(project.company);
                    const themeClasses = getThemeClasses(colorTheme);
                    
                    return (
                      <div key={project.id} className={`bg-white rounded-lg shadow-sm p-4 ${themeClasses.border}`}>
                        <div className="flex items-center justify-end mb-2">
                          <span className="flex items-center text-green-600 text-xs">
                            <Check className="w-4 h-4 mr-1" />
                            Completed
                          </span>
                        </div>

                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-base font-semibold">
                                {new Date(project.date).toLocaleDateString('en-US', { 
                                  day: 'numeric', 
                                  month: 'short'
                                })}
                              </span>
                              <span className="text-base font-semibold">{project.time.substring(0, 5)}</span>
                            </div>
                            <div className={`text-sm ${themeClasses.text} mb-1`}>
                              {getCompanyName(project.company)}
                            </div>
                            <div className="text-sm text-gray-600 mb-3">{project.clientName}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-base font-bold text-blue-600">€{project.price.toFixed(2)}</div>
                            <div className="text-xs text-gray-500 mt-1">#{project.bookingId}</div>
                          </div>
                        </div>

                        <div className="space-y-2 mt-3 text-sm">
                          <div className="flex items-start space-x-1">
                            <MapPin className={`w-4 h-4 ${themeClasses.icon} mt-1`} />
                            <div>
                              <div className="font-medium text-xs">Pick-up</div>
                              <div className="text-gray-600">{project.pickupLocation}</div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-1">
                            <MapPin className={`w-4 h-4 ${themeClasses.icon} mt-1`} />
                            <div>
                              <div className="font-medium text-xs">Drop-off</div>
                              <div className="text-gray-600">{project.dropoffLocation}</div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-600">{project.passengers}</span>
                            </div>
                            <div className="text-gray-600">{getCarTypeName(project.carType)}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{getDriverName(project.driver)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}