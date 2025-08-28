import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import SettingsLayout from './SettingsLayout';

interface CarType {
  id: string;
  name: string;
  capacity: number;
  luggage_capacity: number;
  description: string;
}

export default function CarTypes() {
  const navigate = useNavigate();
  const { carTypes, addCarType, deleteCarType, updateCarType } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingCarType, setEditingCarType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: 4,
    luggage_capacity: 2,
    description: '',
  });

  const handleDeleteCarType = (id: string) => {
    if (window.confirm('Are you sure you want to delete this car type?')) {
      deleteCarType(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCarType(formData);
    setFormData({ name: '', capacity: 4, luggage_capacity: 2, description: '' });
    setShowForm(false);
  };

  const handleEdit = (carType: CarType) => {
    setFormData({
      name: carType.name,
      capacity: carType.capacity,
      luggage_capacity: carType.luggage_capacity,
      description: carType.description,
    });
    setEditingCarType(carType.id);
    setShowForm(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCarType) {
      updateCarType(editingCarType, formData);
      setEditingCarType(null);
    }
    setFormData({ name: '', capacity: 4, luggage_capacity: 2, description: '' });
    setShowForm(false);
  };

  return (
    <SettingsLayout 
      title="Car Types" 
      onAdd={() => setShowForm(true)}
      addButtonText="Add Car Type"
    >
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingCarType ? 'Edit Car Type' : 'Add New Car Type'}
            </h3>
            <form onSubmit={editingCarType ? handleUpdate : handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Car Type Name
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
                  Passenger Capacity
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Luggage Capacity
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.luggage_capacity}
                  onChange={(e) => setFormData({ ...formData, luggage_capacity: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  {editingCarType ? 'Update Car Type' : 'Add Car Type'}
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
                  Car Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Luggage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {carTypes.map((carType) => (
                <tr key={carType.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {carType.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {carType.capacity} passengers
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {carType.luggage_capacity} pieces
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {carType.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                    <button
                      onClick={() => handleEdit(carType)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCarType(carType.id)}
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