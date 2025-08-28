import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, DollarSign, Users, ChevronDown, ChevronUp, TrendingUp, Calendar, Clock, BarChart3, Download } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import Modal from '../Modal';

interface Payment {
  id: string;
  driver_id: string;
  amount: number;
  date: string;
  status: 'pending' | 'paid';
  description: string;
  completed_at?: string;
  created_at: string;
}

interface GroupedPayments {
  [driverId: string]: {
    pending: Payment[];
    paid: Payment[];
    totalPending: number;
    totalPaid: number;
  }
}

interface MonthlyReport {
  [month: string]: {
    [driverId: string]: {
      pending: number;
      paid: number;
      driverName: string;
    };
    totalPending: number;
    totalPaid: number;
  };
}

export default function Payments() {
  const navigate = useNavigate();
  const { drivers, payments, addPayment, updatePayment, deletePayment, completePayment } = useData();
  const [expandedDrivers, setExpandedDrivers] = useState<Set<string>>(new Set());
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<string | null>(null);
  const [groupedPayments, setGroupedPayments] = useState<GroupedPayments>({});
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport>({});
  const [showMonthlyReport, setShowMonthlyReport] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [selectedDriverStats, setSelectedDriverStats] = useState<{
    driverId: string;
    name: string;
    stats: {
      totalEarnings: number;
      pendingAmount: number;
      paidAmount: number;
      lastPayment?: Payment;
      monthlyEarnings: { [key: string]: number };
    };
  } | null>(null);
  const [formData, setFormData] = useState({
    driver_id: '',
    amount: 0,
    date: '',
    status: 'pending' as const,
    description: '',
  });

  // Generate available years from payment data
  useEffect(() => {
    const years = Array.from(new Set(
      payments.map(payment => new Date(payment.date).getFullYear())
    )).sort((a, b) => b - a);
    
    if (years.length === 0) {
      years.push(new Date().getFullYear());
    }
    
    setAvailableYears(years);
  }, [payments]);

  useEffect(() => {
    const grouped = payments.reduce((acc, payment) => {
      if (!acc[payment.driver_id]) {
        acc[payment.driver_id] = {
          pending: [],
          paid: [],
          totalPending: 0,
          totalPaid: 0
        };
      }
      
      if (payment.status === 'pending') {
        acc[payment.driver_id].pending.push(payment);
        acc[payment.driver_id].totalPending += payment.amount;
      } else {
        acc[payment.driver_id].paid.push(payment);
        acc[payment.driver_id].totalPaid += payment.amount;
      }
      
      return acc;
    }, {} as GroupedPayments);
    
    setGroupedPayments(grouped);
  }, [payments]);

  // Generate monthly report
  useEffect(() => {
    const monthlyData: MonthlyReport = {};
    
    // Filter payments by selected year
    const yearPayments = payments.filter(payment => 
      new Date(payment.date).getFullYear() === selectedYear
    );
    
    yearPayments.forEach(payment => {
      const date = new Date(payment.date);
      const monthKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      const driver = drivers.find(d => d.id === payment.driver_id);
      const driverName = driver?.name || 'Unknown Driver';
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          totalPending: 0,
          totalPaid: 0
        };
      }
      
      if (!monthlyData[monthKey][payment.driver_id]) {
        monthlyData[monthKey][payment.driver_id] = {
          pending: 0,
          paid: 0,
          driverName
        };
      }
      
      if (payment.status === 'pending') {
        monthlyData[monthKey][payment.driver_id].pending += payment.amount;
        monthlyData[monthKey].totalPending += payment.amount;
      } else {
        monthlyData[monthKey][payment.driver_id].paid += payment.amount;
        monthlyData[monthKey].totalPaid += payment.amount;
      }
    });
    
    setMonthlyReport(monthlyData);
  }, [payments, drivers, selectedYear]);

  // Generate CSV for monthly report
  const downloadMonthlyReport = () => {
    let csvContent = 'Month,Driver,Pending Amount,Paid Amount,Total Amount\n';
    
    // Get sorted month keys
    const sortedMonths = Object.keys(monthlyReport).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });
    
    sortedMonths.forEach(month => {
      const monthData = monthlyReport[month];
      
      // Add driver rows
      Object.keys(monthData).forEach(key => {
        if (key !== 'totalPending' && key !== 'totalPaid') {
          const driverData = monthData[key];
          const total = driverData.pending + driverData.paid;
          csvContent += `"${month}","${driverData.driverName}",€${driverData.pending.toFixed(2)},€${driverData.paid.toFixed(2)},€${total.toFixed(2)}\n`;
        }
      });
      
      // Add month total
      const monthTotal = monthData.totalPending + monthData.totalPaid;
      csvContent += `"${month}","MONTH TOTAL",€${monthData.totalPending.toFixed(2)},€${monthData.totalPaid.toFixed(2)},€${monthTotal.toFixed(2)}\n`;
      csvContent += '\n'; // Empty line between months
    });
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const filename = `monthly_payment_report_${selectedYear}.csv`;
    
    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = (payment: any) => {
    setFormData({
      driver_id: payment.driver_id,
      amount: payment.amount,
      date: payment.date,
      status: payment.status,
      description: payment.description,
    });
    setEditingPayment(payment.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      deletePayment(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPayment) {
      updatePayment(editingPayment, formData);
      setEditingPayment(null);
    } else {
      addPayment(formData);
    }
    
    setFormData({ driver_id: '', amount: 0, date: '', status: 'pending', description: '' });
    setShowForm(false);
  };

  const toggleDriverExpanded = (driverId: string) => {
    const newExpanded = new Set(expandedDrivers);
    if (newExpanded.has(driverId)) {
      newExpanded.delete(driverId);
    } else {
      newExpanded.add(driverId);
    }
    setExpandedDrivers(newExpanded);
  };

  const calculateDriverStats = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    if (!driver) return null;

    const driverPayments = groupedPayments[driverId];
    if (!driverPayments) return null;

    // Calculate monthly earnings
    const monthlyEarnings = driverPayments.paid.reduce((acc, payment) => {
      const month = new Date(payment.date).toLocaleString('default', { month: 'long', year: 'numeric' });
      acc[month] = (acc[month] || 0) + payment.amount;
      return acc;
    }, {} as { [key: string]: number });

    return {
      driverId,
      name: driver.name,
      stats: {
        totalEarnings: driver.total_earnings || 0,
        pendingAmount: driverPayments.totalPending,
        paidAmount: driverPayments.totalPaid,
        lastPayment: [...driverPayments.paid].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0],
        monthlyEarnings
      }
    };
  };

  const showDriverStats = (driverId: string) => {
    const stats = calculateDriverStats(driverId);
    if (stats) {
      setSelectedDriverStats(stats);
      setShowStats(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Payment
            </button>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <label className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700 font-medium">Filter by Driver:</span>
              </label>
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Drivers</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Monthly Report Toggle */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowMonthlyReport(!showMonthlyReport)}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  <BarChart3 className="w-5 h-5" />
                  {showMonthlyReport ? 'Hide Monthly Report' : 'Show Monthly Report'}
                </button>
                
                {showMonthlyReport && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Year:</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="px-3 py-1 border rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      {availableYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              {showMonthlyReport && (
                <button
                  onClick={downloadMonthlyReport}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Monthly Report Section */}
        {showMonthlyReport && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
                  Monthly Payment Report - {selectedYear}
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Month
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Driver
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pending
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paid
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.keys(monthlyReport)
                      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
                      .map((month) => {
                        const monthData = monthlyReport[month];
                        const driverKeys = Object.keys(monthData).filter(key => 
                          key !== 'totalPending' && key !== 'totalPaid'
                        );
                        
                        return (
                          <React.Fragment key={month}>
                            {/* Driver rows */}
                            {driverKeys.map((driverId, index) => {
                              const driverData = monthData[driverId];
                              const total = driverData.pending + driverData.paid;
                              
                              return (
                                <tr key={`${month}-${driverId}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {index === 0 && month}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {driverData.driverName}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-medium">
                                    €{driverData.pending.toFixed(2)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                                    €{driverData.paid.toFixed(2)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                    €{total.toFixed(2)}
                                  </td>
                                </tr>
                              );
                            })}
                            
                            {/* Month total row */}
                            <tr className="bg-blue-50 border-t-2 border-blue-200">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                {month}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-800">
                                MONTH TOTAL
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-yellow-700">
                                €{monthData.totalPending.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700">
                                €{monthData.totalPaid.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-800">
                                €{(monthData.totalPending + monthData.totalPaid).toFixed(2)}
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                  </tbody>
                </table>
                
                {Object.keys(monthlyReport).length === 0 && (
                  <div className="text-center py-8">
                    <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No payment data</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No payments found for {selectedYear}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form Section */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingPayment ? 'Edit Payment' : 'Add New Payment'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Driver
                </label>
                <select
                  value={formData.driver_id}
                  onChange={(e) => setFormData({ ...formData, driver_id: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select a driver</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>{driver.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'paid' })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
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
                  {editingPayment ? 'Update Payment' : 'Add Payment'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Payment Lists - Stack on mobile, side-by-side on larger screens */}
        <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-6">
          {/* Pending Payments */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4 sm:mb-6">
                <DollarSign className="w-6 h-6 mr-2 text-yellow-500" />
                Pending Payments
              </h2>

              <div className="space-y-4">
                {drivers.map(driver => {
                  const driverPayments = groupedPayments[driver.id];
                  if (!driverPayments?.pending.length || (selectedDriver && selectedDriver !== driver.id)) return null;
                  const isExpanded = expandedDrivers.has(driver.id);
                  
                  return (
                    <div key={driver.id} className="border rounded-lg p-4">
                      <button
                        onClick={() => toggleDriverExpanded(driver.id)}
                        className="w-full flex justify-between items-center"
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center">
                          <Users className="w-5 h-5 mr-2 text-gray-500" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              showDriverStats(driver.id);
                            }}
                            className="text-lg font-semibold hover:text-blue-600 transition-colors text-left"
                          >
                            {driver.name}
                          </button>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-yellow-600 font-semibold">
                            €{driverPayments.totalPending.toFixed(2)}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </button>
                      
                      <div className={`space-y-3 mt-4 ${isExpanded ? '' : 'hidden'}`}>
                        {driverPayments.pending.map(payment => (
                          <div key={payment.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="mr-2">
                              <div className="font-medium">€{payment.amount.toFixed(2)}</div>
                              <div className="text-sm text-gray-500">{payment.description}</div>
                              <div className="text-xs text-gray-400">
                                {new Date(payment.date).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex space-x-2 flex-shrink-0">
                              <button
                                onClick={() => handleEdit(payment)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Edit payment"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => completePayment(payment.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                title="Mark as paid"
                              >
                                <DollarSign className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(payment.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Paid Payments */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h2 className="text-xl font-bold flex items-center mb-4 sm:mb-6 text-green-600">
                <DollarSign className="w-6 h-6 mr-2 text-green-500" />
                Paid Payments
              </h2>
              
              <div className="space-y-4">
                {drivers.map(driver => {
                  const driverPayments = groupedPayments[driver.id];
                  if (!driverPayments?.paid.length || (selectedDriver && selectedDriver !== driver.id)) return null;
                  const isExpanded = expandedDrivers.has(driver.id);
                  
                  return (
                    <div key={driver.id} className="border rounded-lg p-4">
                      <button
                        onClick={() => toggleDriverExpanded(driver.id)}
                        className="w-full flex justify-between items-center"
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center">
                          <Users className="w-5 h-5 mr-2 text-gray-500" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              showDriverStats(driver.id);
                            }}
                            className="text-lg font-semibold hover:text-blue-600 transition-colors text-left"
                          >
                            {driver.name}
                          </button>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-green-600 font-semibold">
                            €{driverPayments.totalPaid.toFixed(2)}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </button>
                      
                      <div className={`space-y-3 mt-4 ${isExpanded ? '' : 'hidden'}`}>
                        {driverPayments.paid.map(payment => (
                          <div key={payment.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="mr-2">
                              <div className="font-medium">€{payment.amount.toFixed(2)}</div>
                              <div className="text-sm text-gray-500">{payment.description}</div>
                              <div className="text-xs text-gray-400">
                                {new Date(payment.date).toLocaleDateString()}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDelete(payment.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Modal */}
        <Modal
          isOpen={showStats}
          onClose={() => setShowStats(false)}
          title={`${selectedDriverStats?.name}'s Statistics`}
        >
          {selectedDriverStats && (
            <div className="space-y-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-500">Total Earnings</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    €{selectedDriverStats.stats.totalEarnings.toFixed(2)}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-gray-500">Pending</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    €{selectedDriverStats.stats.pendingAmount.toFixed(2)}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-500">Paid</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    €{selectedDriverStats.stats.paidAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Monthly Earnings */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                  Monthly Earnings
                </h3>
                <div className="space-y-3">
                  {Object.entries(selectedDriverStats.stats.monthlyEarnings)
                    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                    .map(([month, amount]) => (
                    <div key={month} className="flex items-center justify-between">
                      <span className="text-gray-600">{month}</span>
                      <span className="font-medium">€{amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Last Payment */}
              {selectedDriverStats.stats.lastPayment && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-gray-500" />
                    Last Payment
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Amount</span>
                      <span className="font-medium">
                        €{selectedDriverStats.stats.lastPayment.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Date</span>
                      <span className="text-gray-700">
                        {new Date(selectedDriverStats.stats.lastPayment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm mt-2">
                      {selectedDriverStats.stats.lastPayment.description}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}