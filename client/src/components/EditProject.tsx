import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import VoucherGenerator from './VoucherGenerator';
import Modal from './Modal';

export default function EditProject() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { projects, companies, drivers, carTypes, updateProject } = useData();
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
    paymentStatus: 'charge' as const
  });
  const [dateTimeError, setDateTimeError] = useState('');
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  useEffect(() => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setFormData({
        company: project.company,
        description: project.description,
        driver: project.driver,
        date: project.date,
        time: project.time,
        passengers: project.passengers,
        pickupLocation: project.pickupLocation,
        dropoffLocation: project.dropoffLocation,
        carType: project.carType,
        price: project.price,
        driverFee: project.driverFee || 0, // Convert to number, default to 0
        clientName: project.clientName,
        clientPhone: project.clientPhone,
        paymentStatus: project.paymentStatus
      });
    }
  }, [id, projects]);

  // Function to validate if date and time are in the future
  const isDateTimeValid = () => {
    if (!formData.date || !formData.time) return false;
    
    const projectDateTime = new Date(`${formData.date}T${formData.time}`);
    const now = new Date();
    
    return projectDateTime > now;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that date and time are in the future
    if (!isDateTimeValid()) {
      setDateTimeError('Project date and time must be in the future');
      return;
    }
    
    // Clear any previous errors
    setDateTimeError('');
    
    if (id) {
      // Convert driver fee - if 0 or empty, set to null
      const updateData = {
        ...formData,
        driverFee: formData.driverFee > 0 ? formData.driverFee : null
      };
      
      updateProject(id, updateData);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span className="text-sm">Back</span>
          </button>
          
          <button
            onClick={() => setShowVoucherModal(true)}
            className="flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <FileText className="w-4 h-4 mr-1" />
            <span className="text-sm">Generate Voucher</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Edit Project</h2>
          
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
                  required
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
                  required
                >
                  <option value="">Select Driver</option>
                  {drivers
                    .filter(driver => driver.status === 'available' || driver.id === formData.driver)
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
                  required
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
                  required
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
                required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Voucher Modal */}
      {showVoucherModal && id && (
        <Modal
          isOpen={showVoucherModal}
          onClose={() => setShowVoucherModal(false)}
          title="Transfer Voucher"
          size="large"
        >
          <VoucherGenerator 
            projectId={id} 
            onClose={() => setShowVoucherModal(false)} 
          />
        </Modal>
      )}
    </div>
  );
}