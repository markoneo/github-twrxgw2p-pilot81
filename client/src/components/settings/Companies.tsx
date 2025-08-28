import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit2, Palette } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import SettingsLayout from './SettingsLayout';

// Color options for companies
const colorOptions = [
  { name: 'Blue', value: 'blue', tailwindClass: 'bg-blue-500' },
  { name: 'Green', value: 'green', tailwindClass: 'bg-green-500' },
  { name: 'Purple', value: 'purple', tailwindClass: 'bg-purple-500' },
  { name: 'Amber', value: 'amber', tailwindClass: 'bg-amber-500' },
  { name: 'Teal', value: 'teal', tailwindClass: 'bg-teal-500' },
  { name: 'Red', value: 'red', tailwindClass: 'bg-red-500' },
  { name: 'Indigo', value: 'indigo', tailwindClass: 'bg-indigo-500' },
  { name: 'Pink', value: 'pink', tailwindClass: 'bg-pink-500' },
  { name: 'Orange', value: 'orange', tailwindClass: 'bg-orange-500' },
  { name: 'Emerald', value: 'emerald', tailwindClass: 'bg-emerald-500' },
  // Custom colors for specific companies
  { name: 'Viator', value: 'viator', tailwindClass: 'bg-[#328E6E]' },
  { name: 'Booking', value: 'booking', tailwindClass: 'bg-[#3D365C]' },
  { name: 'RideConnect', value: 'rideconnect', tailwindClass: 'bg-[#BF3131]' },
];

// Custom color input options
const customColorOptions = [
  { label: 'Viator Green', value: '#328E6E' },
  { label: 'Booking Purple', value: '#3D365C' },
  { label: 'RideConnect Red', value: '#BF3131' },
];

export default function Companies() {
  const navigate = useNavigate();
  const { companies, addCompany, deleteCompany, updateCompany } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    color: 'blue', // Default color
  });
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [customColor, setCustomColor] = useState('');
  const [companyColors, setCompanyColors] = useState<Record<string, string>>({});

  // Load company colors from localStorage on component mount
  useEffect(() => {
    const savedColors = localStorage.getItem('companyColors');
    if (savedColors) {
      setCompanyColors(JSON.parse(savedColors));
    }
  }, []);

  // Save company colors to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(companyColors).length > 0) {
      localStorage.setItem('companyColors', JSON.stringify(companyColors));
    }
  }, [companyColors]);

  const handleEdit = (company: any) => {
    // Get the company's saved color or default to blue
    const color = companyColors[company.id] || 'blue';
    setFormData({
      name: company.name,
      address: company.address,
      phone: company.phone,
      color
    });
    setEditingCompany(company.id);
    setShowForm(true);

    if (!colorOptions.some(opt => opt.value === color) && color.startsWith('#')) {
      setShowCustomColor(true);
      setCustomColor(color);
    } else {
      setShowCustomColor(false);
      setCustomColor('');
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCompany) {
      // Update the company in the database without the color field
      const { color, ...companyData } = formData;
      updateCompany(editingCompany, companyData);

      // Save the color separately in localStorage
      setCompanyColors(prev => ({
        ...prev,
        [editingCompany]: showCustomColor && customColor ? customColor : formData.color
      }));
      
      setEditingCompany(null);
    }
    setFormData({ name: '', address: '', phone: '', color: 'blue' });
    setShowForm(false);
    setShowCustomColor(false);
    setCustomColor('');
  };

  const handleDeleteCompany = (id: string) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      deleteCompany(id);
      // Also remove the company's color from localStorage
      const newColors = { ...companyColors };
      delete newColors[id];
      setCompanyColors(newColors);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add the company to the database without the color field
    const { color, ...companyData } = formData;
    addCompany(companyData).then((newCompany) => {
      if (newCompany?.id) {
        // Save the color separately in localStorage
        setCompanyColors(prev => ({
          ...prev,
          [newCompany.id]: showCustomColor && customColor ? customColor : formData.color
        }));
      }
    });
    
    setFormData({ name: '', address: '', phone: '', color: 'blue' });
    setShowForm(false);
    setShowCustomColor(false);
    setCustomColor('');
  };

  const getCompanyColorClass = (companyId: string) => {
    const color = companyColors[companyId];
    if (!color) return 'bg-gray-200';
    
    // For predefined colors
    const predefinedColor = colorOptions.find(opt => opt.value === color);
    if (predefinedColor) return predefinedColor.tailwindClass;
    
    // For custom hex colors
    if (color.startsWith('#')) return `bg-[${color}]`;
    
    return 'bg-gray-200';
  };

  return (
    <SettingsLayout 
      title="Companies" 
      onAdd={() => setShowForm(true)}
      addButtonText="Add Company"
    >
        {/* Information Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                About Companies
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  You can add multiple company sources from which you receive projects (such as Viator, Booking.com, or partner agencies), 
                  or simply add your own company if you work independently. Each company can have its own color theme for easy identification 
                  in your dashboard and reports.
                </p>
              </div>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingCompany ? 'Edit Company' : 'Add New Company'}
            </h3>
            <form onSubmit={editingCompany ? handleUpdate : handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Color selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Palette className="w-4 h-4 mr-1" />
                  Company Color
                </label>
                
                {/* Color options */}
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {colorOptions.map(color => (
                    <div 
                      key={color.value}
                      className={`h-8 rounded cursor-pointer border-2 ${
                        formData.color === color.value && !showCustomColor
                          ? 'border-black'
                          : 'border-transparent'
                      } ${color.tailwindClass}`}
                      onClick={() => {
                        setFormData({ ...formData, color: color.value });
                        setShowCustomColor(false);
                      }}
                      title={color.name}
                    />
                  ))}
                  
                  {/* Custom color option */}
                  <div 
                    className={`h-8 rounded cursor-pointer border-2 ${
                      showCustomColor ? 'border-black' : 'border-transparent'
                    } bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500`}
                    onClick={() => setShowCustomColor(true)}
                    title="Custom color"
                  />
                </div>

                {/* Custom color input */}
                {showCustomColor && (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="w-10 h-10 p-0 border-0"
                      />
                      <input
                        type="text"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        placeholder="#HEX Color"
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    {/* Quick color presets */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {customColorOptions.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setCustomColor(option.value)}
                          className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                          style={{ color: option.value }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCompany(null);
                    setShowCustomColor(false);
                    setCustomColor('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  {editingCompany ? 'Update Company' : 'Add Company'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Color
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companies.map((company) => (
                <tr key={company.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div 
                      className={`w-6 h-6 rounded-full ${getCompanyColorClass(company.id)}`}
                      title="Company color"
                    ></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {company.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                    <button
                      onClick={() => handleEdit(company)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCompany(company.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </SettingsLayout>
  );
}