import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function NewProject() {
  const navigate = useNavigate();
  const { companies, drivers, carTypes, addProject } = useData();
  const [formData, setFormData] = useState({
    company: '',
    description: '',
    driver: '',
    date: '',
    time: '',
    passengers: 1,
    pickupLocation: '',
    dropoffLocation: '',
    carType: '',
    price: 0,
    driverFee: 0, // Change to number instead of string
    clientName: '',
    clientPhone: '',
    paymentStatus: 'charge'
  });
  const [dateTimeError, setDateTimeError] = useState('');
  const [showVoucherAfterSave, setShowVoucherAfterSave] = useState(false);

  // Function to validate if date and time are in the future
  const isDateTimeValid = () => {
    if (!formData.date || !formData.time) return false;
    
    const projectDateTime = new Date(`${formData.date}T${formData.time}`);
    const now = new Date();
    
    return projectDateTime > now;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only validate date and time as required fields
    if (!formData.date || !formData.time) {
      alert('Please fill in the date and time fields');
      return;
    }
    
    // Validate that date and time are in the future
    if (!isDateTimeValid()) {
      setDateTimeError('Project date and time must be in the future');
      return;
    }
    
    // Clear any previous errors
    setDateTimeError('');
    
    try {
      // Convert driver fee - if 0 or empty, set to null
      const projectData = {
        ...formData,
        driverFee: formData.driverFee > 0 ? formData.driverFee : null
      };
      
      await addProject(projectData);
      // If the user wants to generate a voucher after saving, navigate to the dashboard first
      // and then the flow will continue to the voucher page
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Create New Transportation Project</h2>
          
          {dateTimeError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {dateTimeError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <select
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                >
                  <option value="">Select Company</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Driver
                </label>
                <select
                  value={formData.driver}
                  onChange={(e) => setFormData({...formData, driver: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                >
                  <option value="">Select Driver</option>
                  {drivers
                    .filter(driver => driver.status === 'available')
                    .map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => {
                    setFormData({...formData, date: e.target.value});
                    setDateTimeError('');
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => {
                    setFormData({...formData, time: e.target.value});
                    setDateTimeError('');
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Passengers
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.passengers}
                  onChange={(e) => setFormData({...formData, passengers: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Car Type
                </label>
                <select
                  value={formData.carType}
                  onChange={(e) => setFormData({...formData, carType: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                >
                  <option value="">Select Car Type</option>
                  {carTypes.map((carType) => (
                    <option key={carType.id} value={carType.id}>
                      {carType.name} ({carType.capacity} passengers)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pick-up Location
                </label>
                <input
                  type="text"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({...formData, pickupLocation: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Drop-off Location
                </label>
                <input
                  type="text"
                  value={formData.dropoffLocation}
                  onChange={(e) => setFormData({...formData, dropoffLocation: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Price
                  <span className="text-xs text-gray-500 block mt-1">
                    The full trip price for clients and reports
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trip Fee for Driver <span className="text-gray-400">(Optional)</span>
                  <span className="text-xs text-gray-500 block mt-1">
                    What the driver sees as the trip fee (leave 0 to show full price)
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.driverFee}
                  onChange={(e) => setFormData({...formData, driverFee: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({...formData, paymentStatus: e.target.value as 'paid' | 'charge'})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                >
                  <option value="paid">Already Paid</option>
                  <option value="charge">Charge the Client</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Phone
                </label>
                <input
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({...formData, clientPhone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>
            </div>

            <div className="items-center mb-4 mt-2">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Driver Fee vs Total Price</h4>
                <div className="text-xs text-blue-700 space-y-1">
                  <p><strong>Total Price:</strong> What clients pay and what appears in financial reports</p>
                  <p><strong>Trip Fee for Driver:</strong> Optional separate amount shown to drivers in their portal</p>
                  <p><strong>If set to 0:</strong> Drivers will see the full "Total Price" amount</p>
                </div>
              </div>
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="voucher"
                checked={showVoucherAfterSave}
                onChange={(e) => setShowVoucherAfterSave(e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="voucher" className="ml-2 block text-sm text-gray-700">
                Generate client voucher after saving
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}