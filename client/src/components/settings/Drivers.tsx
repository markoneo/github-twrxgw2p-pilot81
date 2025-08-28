import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit2, Key, Eye, EyeOff, Link, QrCode, Smartphone, Copy, ExternalLink } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import SettingsLayout from './SettingsLayout';
import Modal from '../Modal';

export default function Drivers() {
  const navigate = useNavigate();
  const { drivers, addDriver, deleteDriver, updateDriver } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState<string | null>(null);
  const [showPins, setShowPins] = useState<Set<string>>(new Set());
  const [showDirectAccess, setShowDirectAccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    license: '',
    status: 'available' as 'available' | 'busy' | 'offline',
    pin: '1234', // Default PIN
  });

  const togglePinVisibility = (driverId: string) => {
    setShowPins(prev => {
      const newSet = new Set(prev);
      if (newSet.has(driverId)) {
        newSet.delete(driverId);
      } else {
        newSet.add(driverId);
      }
      return newSet;
    });
  };

  const generateDirectLink = (driver: any) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/driver/auth/${driver.auth_token || driver.id}`;
  };

  const generateQRCodeUrl = (driver: any) => {
    const directLink = generateDirectLink(driver);
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(directLink)}`;
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${label} copied to clipboard!`);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  const copyDriverId = (license: string) => {
    copyToClipboard(license, 'Driver ID');
  };

  const copyDirectLink = (driver: any) => {
    const link = generateDirectLink(driver);
    copyToClipboard(link, 'Direct access link');
  };

  const generateWhatsAppMessage = (driver: any) => {
    const directLink = generateDirectLink(driver);
    const message = `🚗 *RidePilot Driver Portal Access*

Hi ${driver.name}! 👋

Your personal driver portal is ready. Click the link below for instant access to your assigned trips:

🔗 *Direct Access Link:*
${directLink}

📱 *Quick Setup:*
• Tap the link above
• Bookmark it for easy access
• No need to remember login details!

✅ This link is secure and only works for your account.

Questions? Contact your dispatcher.

Safe driving! 🛣️`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEdit = (driver: any) => {
    setFormData({
      name: driver.name,
      phone: driver.phone,
      license: driver.license,
      status: driver.status,
      pin: driver.pin || '1234',
    });
    setEditingDriver(driver.id);
    setShowForm(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDriver) {
      // Check for duplicate driver ID (license)
      const duplicateId = drivers.find(driver => 
        driver.license === formData.license && driver.id !== editingDriver
      );
      
      if (duplicateId) {
        alert('A driver with this ID already exists. Please use a unique Driver ID.');
        return;
      }
      
      // Check for duplicate PIN
      const duplicatePin = drivers.find(driver => 
        driver.pin === formData.pin && driver.id !== editingDriver
      );
      
      if (duplicatePin) {
        alert('A driver with this PIN already exists. Please use a unique PIN.');
        return;
      }
      
      updateDriver(editingDriver, formData);
      setEditingDriver(null);
    }
    setFormData({ name: '', phone: '', license: '', status: 'available', pin: '1234' });
    setShowForm(false);
  };

  const handleDeleteDriver = (id: string) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      deleteDriver(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for duplicate driver ID (license)
    const duplicateId = drivers.find(driver => 
      driver.license === formData.license && driver.id !== editingDriver
    );
    
    if (duplicateId) {
      alert('A driver with this ID already exists. Please use a unique Driver ID.');
      return;
    }
    
    // Check for duplicate PIN
    const duplicatePin = drivers.find(driver => 
      driver.pin === formData.pin && driver.id !== editingDriver
    );
    
    if (duplicatePin) {
      alert('A driver with this PIN already exists. Please use a unique PIN.');
      return;
    }
    
    addDriver(formData);
    setFormData({ name: '', phone: '', license: '', status: 'available', pin: '1234' });
    setShowForm(false);
  };

  return (
    <SettingsLayout 
      title="Drivers" 
      onAdd={() => setShowForm(true)}
      addButtonText="Add Driver"
    >
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingDriver ? 'Edit Driver' : 'Add New Driver'}
            </h3>
            <form onSubmit={editingDriver ? handleUpdate : handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Driver Name
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
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Number / Driver ID
                  <span className="text-xs text-gray-500 block mt-1">
                    This will be used as the Driver ID for the driver portal login
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.license}
                  onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., DRV001, LICENSE123"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Driver Portal PIN
                  <span className="text-xs text-gray-500 block mt-1">
                    4-6 digit PIN for driver portal access
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="1234"
                  maxLength={6}
                  pattern="[0-9]{4,6}"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'available' | 'busy' | 'offline' })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </select>
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
                  {editingDriver ? 'Update Driver' : 'Add Driver'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-200">
            {drivers.map((driver) => (
              <div key={driver.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{driver.name}</h3>
                    <p className="text-sm text-gray-600">{driver.phone}</p>
                  </div>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${driver.status === 'available' ? 'bg-green-100 text-green-800' : 
                      driver.status === 'busy' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Driver ID:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                        {driver.license}
                      </code>
                      <button
                        onClick={() => copyDriverId(driver.license)}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                        title="Copy Driver ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Portal PIN:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                        {showPins.has(driver.id) ? (driver.pin || '1234') : '••••'}
                      </code>
                      <button
                        onClick={() => togglePinVisibility(driver.id)}
                        className="text-gray-400 hover:text-gray-600"
                        title={showPins.has(driver.id) ? "Hide PIN" : "Show PIN"}
                      >
                        {showPins.has(driver.id) ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Used for driver portal login
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowDirectAccess(driver.id)}
                      className="p-2 text-green-600 hover:text-green-900 rounded-lg hover:bg-green-50 transition-colors"
                      title="Generate direct access links and QR codes"
                    >
                      <Link className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(driver)}
                      className="p-2 text-blue-600 hover:text-blue-900 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDriver(driver.id)}
                      className="p-2 text-red-600 hover:text-red-900 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[800px] divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Driver Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Driver ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Portal PIN
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drivers.map((driver) => (
                <tr key={driver.id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 w-48">
                    {driver.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 w-40">
                    {driver.phone}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 w-48">
                    <div className="flex items-center space-x-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                        {driver.license}
                      </code>
                      <button
                        onClick={() => copyDriverId(driver.license)}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                        title="Copy Driver ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Used for driver portal login
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 w-32">
                    <div className="flex items-center space-x-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                        {showPins.has(driver.id) ? (driver.pin || '1234') : '••••'}
                      </code>
                      <button
                        onClick={() => togglePinVisibility(driver.id)}
                        className="text-gray-400 hover:text-gray-600"
                        title={showPins.has(driver.id) ? "Hide PIN" : "Show PIN"}
                      >
                        {showPins.has(driver.id) ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap w-28">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${driver.status === 'available' ? 'bg-green-100 text-green-800' : 
                        driver.status === 'busy' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 w-32">
                    <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setShowDirectAccess(driver.id)}
                      className="text-green-600 hover:text-green-900 transition-colors p-1.5 rounded hover:bg-green-50"
                      title="Generate direct access links and QR codes"
                    >
                      <Link className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(driver)}
                      className="text-blue-600 hover:text-blue-900 transition-colors p-1.5 rounded hover:bg-blue-50"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDriver(driver.id)}
                      className="text-red-600 hover:text-red-900 transition-colors p-1.5 rounded hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
          
          {drivers.length === 0 && (
            <div className="text-center py-8 px-4">
              <Key className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No drivers</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a new driver.
              </p>
            </div>
          )}
        </div>

        {/* Direct Access Modal */}
        <Modal
          isOpen={showDirectAccess !== null}
          onClose={() => setShowDirectAccess(null)}
          title="Driver Direct Access Solutions"
          size="large"
        >
          {showDirectAccess && (() => {
            const driver = drivers.find(d => d.id === showDirectAccess);
            if (!driver) return null;
            
            const directLink = generateDirectLink(driver);
            const qrCodeUrl = generateQRCodeUrl(driver);
            
            return (
              <div className="space-y-6 max-w-full">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">✨ No More Login Hassles!</h3>
                  <p className="text-blue-800 text-sm">
                    Give {driver.name} instant access to their driver portal with these secure, personalized solutions.
                    No need to remember usernames or passwords!
                  </p>
                </div>

                {/* Solution 1: Direct Link */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <Link className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">1. Direct Access Link</h3>
                      <p className="text-sm text-gray-600">Personal URL that logs the driver in automatically</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                      <code className="text-sm text-gray-700 break-all flex-1 min-w-0 max-w-full overflow-hidden">
                        {directLink}
                      </code>
                      <button
                        onClick={() => copyDirectLink(driver)}
                        className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 flex-shrink-0 w-full lg:w-auto justify-center"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => window.open(directLink, '_blank')}
                      className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Test Link
                    </button>
                    <button
                      onClick={() => generateWhatsAppMessage(driver)}
                      className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full sm:w-auto"
                    >
                      <Smartphone className="w-4 h-4" />
                      Send via WhatsApp
                    </button>
                  </div>
                </div>

                {/* Solution 2: QR Code */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                      <QrCode className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">2. QR Code Access</h3>
                      <p className="text-sm text-gray-600">Print or share this QR code for instant mobile access</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row items-center gap-6">
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
                      <img 
                        src={qrCodeUrl}
                        alt={`QR Code for ${driver.name}`}
                        className="w-32 h-32"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-2">📱 Perfect for Mobile</h4>
                      <ul className="text-sm text-gray-600 space-y-1 mb-4">
                        <li>• Driver scans with their phone camera</li>
                        <li>• Instant access to their portal</li>
                        <li>• Can save to home screen as app</li>
                        <li>• Works offline once loaded</li>
                      </ul>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => window.open(qrCodeUrl, '_blank')}
                          className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 text-center w-full sm:w-auto"
                        >
                          Download QR
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Solution 3: Bookmark Instructions */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-100 p-2 rounded-lg mr-3">
                      <Smartphone className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">3. Instructions for {driver.name}</h3>
                      <p className="text-sm text-gray-600">Copy these instructions to send to your driver</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 overflow-hidden">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <strong>Hi {driver.name}!</strong><br /><br />
                      
                      Your personal driver portal link: <br />
                      <code className="bg-white px-2 py-1 rounded border break-all text-xs">{directLink}</code><br /><br />
                      
                      <strong>📱 On your phone:</strong><br />
                      1. Tap the link above<br />
                      2. Add to Home Screen for easy access<br />
                      3. Use it anytime to check your trips<br /><br />
                      
                      <strong>💻 On computer:</strong><br />
                      1. Click the link and bookmark it<br />
                      2. It will remember you automatically<br /><br />
                      
                      Questions? Contact your dispatcher.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      const instructions = `Hi ${driver.name}!\n\nYour personal driver portal link:\n${directLink}\n\n📱 On your phone:\n1. Tap the link above\n2. Add to Home Screen for easy access\n3. Use it anytime to check your trips\n\n💻 On computer:\n1. Click the link and bookmark it\n2. It will remember you automatically\n\nQuestions? Contact your dispatcher.`;
                      copyToClipboard(instructions, 'Instructions');
                    }}
                    className="mt-4 flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 w-full sm:w-auto justify-center"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Instructions
                  </button>
                </div>

                {/* Security Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">🔒 Security Notice</h4>
                  <div className="text-sm text-yellow-700 space-y-1">
                    <p>• Each link is unique and secure for this driver only</p>
                    <p>• Links automatically expire if driver is deactivated</p>
                    <p>• You can regenerate new links anytime if needed</p>
                    <p>• All access is logged for security auditing</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </Modal>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 overflow-hidden">
          <div className="flex">
            <Key className="w-5 h-5 text-blue-400 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Driver Portal Access Options</h3>
              <div className="mt-2 text-sm text-blue-700 space-y-2">
                <p className="mb-3">
                  <strong>Multiple ways for drivers to access their portal:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs ml-4">
                  <li><strong>Direct Links:</strong> Click the 🔗 button to generate personal access links</li>
                  <li><strong>QR Codes:</strong> Mobile-friendly instant access via camera scan</li>
                  <li><strong>Manual Login:</strong> Traditional login at /driver with ID + PIN</li>
                  <li><strong>WhatsApp Sharing:</strong> Send access links directly via WhatsApp</li>
                  <li><strong>Security:</strong> All methods provide secure, isolated access to assigned trips only</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
    </SettingsLayout>
  );
}