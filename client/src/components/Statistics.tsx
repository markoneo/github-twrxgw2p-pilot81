import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  BarChart2, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Building2,
  Download,
  Users,
  Clock,
  Activity,
  PieChart,
  LineChart,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { saveAs } from 'file-saver';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface CompanyEarnings {
  companyId: string;
  companyName: string;
  totalEarnings: number;
  dailyBreakdown: { [date: string]: number };
  weeklyBreakdown: { [week: string]: number };
  monthlyBreakdown: { [month: string]: number };
  projectCount: number;
}

interface TimePeriodsData {
  daily: { [date: string]: number };
  weekly: { [week: string]: number };
  monthly: { [month: string]: number };
}

export default function Statistics() {
  const navigate = useNavigate();
  const { projects, companies, drivers, carTypes, loading, refreshData } = useData();
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get available years from project data
  const availableYears = useMemo(() => {
    const years = [...new Set(projects.map(p => new Date(p.date).getFullYear()))];
    return years.sort((a, b) => b - a);
  }, [projects]);

  // Calculate company earnings data
  const companyEarningsData = useMemo(() => {
    const earningsMap = new Map<string, CompanyEarnings>();

    // Initialize all companies
    companies.forEach(company => {
      earningsMap.set(company.id, {
        companyId: company.id,
        companyName: company.name,
        totalEarnings: 0,
        dailyBreakdown: {},
        weeklyBreakdown: {},
        monthlyBreakdown: {},
        projectCount: 0
      });
    });

    // Filter projects by selected year
    const yearProjects = projects.filter(project => {
      const projectYear = new Date(project.date).getFullYear();
      return projectYear === selectedYear;
    });

    // Process each project
    yearProjects.forEach(project => {
      const companyData = earningsMap.get(project.company);
      if (!companyData) return;

      const date = new Date(project.date);
      const dateKey = project.date; // YYYY-MM-DD format
      const monthKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      // Calculate week of year for weekly breakdown
      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
      const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
      const weekKey = `Week ${weekNumber}, ${date.getFullYear()}`;

      // Update earnings
      companyData.totalEarnings += project.price;
      companyData.projectCount += 1;
      
      // Daily breakdown
      companyData.dailyBreakdown[dateKey] = (companyData.dailyBreakdown[dateKey] || 0) + project.price;
      
      // Weekly breakdown
      companyData.weeklyBreakdown[weekKey] = (companyData.weeklyBreakdown[weekKey] || 0) + project.price;
      
      // Monthly breakdown
      companyData.monthlyBreakdown[monthKey] = (companyData.monthlyBreakdown[monthKey] || 0) + project.price;
    });

    return Array.from(earningsMap.values()).filter(company => company.totalEarnings > 0);
  }, [projects, companies, selectedYear]);

  // Get selected company data
  const selectedCompanyData = useMemo(() => {
    if (!selectedCompany) return null;
    return companyEarningsData.find(company => company.companyId === selectedCompany) || null;
  }, [companyEarningsData, selectedCompany]);

  // Get time period data for selected company
  const timePeriodData = useMemo(() => {
    if (!selectedCompanyData) return { data: {}, labels: [], totals: [] };

    let breakdown: { [key: string]: number } = {};
    
    switch (timePeriod) {
      case 'daily':
        // For daily view, filter by selected month
        const monthStart = new Date(selectedYear, selectedMonth - 1, 1);
        const monthEnd = new Date(selectedYear, selectedMonth, 0);
        
        breakdown = Object.keys(selectedCompanyData.dailyBreakdown)
          .filter(dateKey => {
            const date = new Date(dateKey);
            return date >= monthStart && date <= monthEnd;
          })
          .reduce((acc, dateKey) => {
            acc[dateKey] = selectedCompanyData.dailyBreakdown[dateKey];
            return acc;
          }, {} as { [key: string]: number });
        break;
      
      case 'weekly':
        breakdown = selectedCompanyData.weeklyBreakdown;
        break;
      
      case 'monthly':
        breakdown = selectedCompanyData.monthlyBreakdown;
        break;
    }

    const sortedEntries = Object.entries(breakdown).sort((a, b) => {
      if (timePeriod === 'daily') {
        return new Date(a[0]).getTime() - new Date(b[0]).getTime();
      }
      if (timePeriod === 'weekly') {
        const weekA = parseInt(a[0].match(/Week (\d+)/)?.[1] || '0');
        const weekB = parseInt(b[0].match(/Week (\d+)/)?.[1] || '0');
        return weekA - weekB;
      }
      // Monthly
      return new Date(a[0]).getTime() - new Date(b[0]).getTime();
    });

    return {
      data: breakdown,
      labels: sortedEntries.map(([key]) => key),
      totals: sortedEntries.map(([, value]) => value)
    };
  }, [selectedCompanyData, timePeriod, selectedYear, selectedMonth]);

  // Calculate overview statistics
  const overviewStats = useMemo(() => {
    const yearProjects = projects.filter(p => new Date(p.date).getFullYear() === selectedYear);
    const totalRevenue = yearProjects.reduce((sum, p) => sum + p.price, 0);
    const totalTrips = yearProjects.length;
    const totalCompanies = new Set(yearProjects.map(p => p.company)).size;
    const avgTripValue = totalTrips > 0 ? totalRevenue / totalTrips : 0;

    return {
      totalRevenue,
      totalTrips,
      totalCompanies,
      avgTripValue
    };
  }, [projects, selectedYear]);

  // Chart configuration
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${selectedCompanyData?.companyName || 'All Companies'} - ${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Earnings`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '€' + value.toFixed(0);
          }
        }
      }
    }
  };

  const chartData = {
    labels: timePeriodData.labels,
    datasets: [
      {
        label: 'Earnings (€)',
        data: timePeriodData.totals,
        backgroundColor: selectedCompany 
          ? 'rgba(34, 197, 94, 0.5)' 
          : 'rgba(59, 130, 246, 0.5)',
        borderColor: selectedCompany 
          ? 'rgba(34, 197, 94, 1)' 
          : 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Company distribution chart
  const companyDistributionData = {
    labels: companyEarningsData.map(company => company.companyName),
    datasets: [
      {
        data: companyEarningsData.map(company => company.totalEarnings),
        backgroundColor: [
          '#22C55E', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', 
          '#10B981', '#6366F1', '#F97316', '#EC4899', '#84CC16'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      },
    ],
  };

  // Export data as CSV
  const exportData = () => {
    if (!selectedCompanyData) {
      alert('Please select a company to export data');
      return;
    }

    let csvContent = '';
    let filename = '';

    switch (timePeriod) {
      case 'daily':
        csvContent = 'Date,Earnings\n';
        filename = `${selectedCompanyData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_daily_earnings_${selectedYear}_${selectedMonth.toString().padStart(2, '0')}.csv`;
        Object.entries(timePeriodData.data).forEach(([date, earnings]) => {
          csvContent += `"${date}",€${earnings.toFixed(2)}\n`;
        });
        break;
      
      case 'weekly':
        csvContent = 'Week,Earnings\n';
        filename = `${selectedCompanyData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_weekly_earnings_${selectedYear}.csv`;
        Object.entries(selectedCompanyData.weeklyBreakdown).forEach(([week, earnings]) => {
          csvContent += `"${week}",€${earnings.toFixed(2)}\n`;
        });
        break;
      
      case 'monthly':
        csvContent = 'Month,Earnings\n';
        filename = `${selectedCompanyData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_monthly_earnings_${selectedYear}.csv`;
        Object.entries(selectedCompanyData.monthlyBreakdown).forEach(([month, earnings]) => {
          csvContent += `"${month}",€${earnings.toFixed(2)}\n`;
        });
        break;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, filename);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Format label for display
  const formatLabel = (label: string) => {
    if (timePeriod === 'daily') {
      return new Date(label).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
    if (timePeriod === 'weekly') {
      return label.replace('Week ', 'W');
    }
    return label;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Statistics & Analytics</h1>
              <p className="text-gray-600 mt-1">
                Detailed earnings breakdown by company and time period
              </p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Revenue ({selectedYear})</p>
                <p className="text-2xl font-bold text-green-600">€{overviewStats.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Trips</p>
                <p className="text-2xl font-bold text-blue-600">{overviewStats.totalTrips}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Active Companies</p>
                <p className="text-2xl font-bold text-purple-600">{overviewStats.totalCompanies}</p>
              </div>
              <Building2 className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Avg Trip Value</p>
                <p className="text-2xl font-bold text-orange-600">€{overviewStats.avgTripValue.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Company Selection */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="w-4 h-4 inline mr-1" />
                Company
              </label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Companies Overview</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Period Selection */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Time Period
              </label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['daily', 'weekly', 'monthly'].map(period => (
                  <button
                    key={period}
                    onClick={() => setTimePeriod(period as 'daily' | 'weekly' | 'monthly')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 ${
                      timePeriod === period 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Year Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Month Selection (only for daily view) */}
            {timePeriod === 'daily' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Export Button */}
            {selectedCompany && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 opacity-0">
                  Export
                </label>
                <button
                  onClick={exportData}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Company Overview or Specific Company Analysis */}
            {!selectedCompany ? (
              <>
                {/* All Companies Overview */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <PieChart className="w-6 h-6 mr-2 text-gray-600" />
                    Company Revenue Distribution ({selectedYear})
                  </h2>
                  
                  {companyEarningsData.length > 0 ? (
                    <div className="grid lg:grid-cols-2 gap-8">
                      <div className="h-80">
                        <Pie 
                          data={companyDistributionData} 
                          options={{ 
                            responsive: true, 
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'bottom'
                              }
                            }
                          }} 
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 mb-4">Company Breakdown</h3>
                        {companyEarningsData.map((company, index) => {
                          const percentage = (company.totalEarnings / overviewStats.totalRevenue) * 100;
                          return (
                            <div key={company.companyId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-4 h-4 rounded-full"
                                  style={{ 
                                    backgroundColor: companyDistributionData.datasets[0].backgroundColor[index] 
                                  }}
                                />
                                <div>
                                  <button
                                    onClick={() => setSelectedCompany(company.companyId)}
                                    className="font-medium text-gray-900 hover:text-blue-600"
                                  >
                                    {company.companyName}
                                  </button>
                                  <p className="text-sm text-gray-500">{company.projectCount} trips</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">€{company.totalEarnings.toFixed(2)}</div>
                                <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
                      <p className="text-gray-600">No earnings data found for {selectedYear}</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Selected Company Analysis */}
                {selectedCompanyData && (
                  <>
                    {/* Company Stats Header */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {selectedCompanyData.companyName}
                          </h2>
                          <p className="text-gray-600">
                            {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} earnings analysis for {selectedYear}
                            {timePeriod === 'daily' && ` - ${new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' })}`}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedCompany('')}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                          View All Companies
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-blue-600 font-medium">Total Earnings</p>
                              <p className="text-2xl font-bold text-blue-900">
                                €{selectedCompanyData.totalEarnings.toFixed(2)}
                              </p>
                            </div>
                            <DollarSign className="w-8 h-8 text-blue-500" />
                          </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-green-600 font-medium">Total Projects</p>
                              <p className="text-2xl font-bold text-green-900">
                                {selectedCompanyData.projectCount}
                              </p>
                            </div>
                            <Activity className="w-8 h-8 text-green-500" />
                          </div>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-purple-600 font-medium">Avg Per Trip</p>
                              <p className="text-2xl font-bold text-purple-900">
                                €{selectedCompanyData.projectCount > 0 
                                  ? (selectedCompanyData.totalEarnings / selectedCompanyData.projectCount).toFixed(2) 
                                  : '0.00'}
                              </p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-purple-500" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Earnings Chart */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                          <BarChart2 className="w-6 h-6 mr-2" />
                          {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Earnings Breakdown
                        </h3>
                        
                        {timePeriod === 'daily' && (
                          <div className="text-sm text-gray-600">
                            {new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' })} {selectedYear}
                          </div>
                        )}
                      </div>
                      
                      {timePeriodData.labels.length > 0 ? (
                        <div className="h-96">
                          <Bar 
                            data={chartData} 
                            options={{
                              ...chartOptions,
                              maintainAspectRatio: false,
                              scales: {
                                ...chartOptions.scales,
                                x: {
                                  ticks: {
                                    callback: function(value: any, index: number) {
                                      return formatLabel(timePeriodData.labels[index]);
                                    }
                                  }
                                }
                              }
                            }} 
                          />
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <BarChart2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h4 className="text-lg font-medium text-gray-900 mb-2">No data for this period</h4>
                          <p className="text-gray-600">
                            No earnings data found for {selectedCompanyData.companyName} in this time period
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Detailed Data Table */}
                    {timePeriodData.labels.length > 0 && (
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <LineChart className="w-5 h-5 mr-2" />
                            Detailed {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Breakdown
                          </h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  {timePeriod === 'daily' ? 'Date' : timePeriod === 'weekly' ? 'Week' : 'Month'}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Earnings
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  % of Total
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {timePeriodData.labels.map((label, index) => {
                                const earnings = timePeriodData.totals[index];
                                const percentage = (earnings / selectedCompanyData.totalEarnings) * 100;
                                
                                return (
                                  <tr key={label} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {timePeriod === 'daily' 
                                        ? new Date(label).toLocaleDateString('en-US', { 
                                            weekday: 'short', 
                                            month: 'short', 
                                            day: 'numeric' 
                                          })
                                        : label
                                      }
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                                      €{earnings.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      <div className="flex items-center">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                                          <div 
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                          />
                                        </div>
                                        <span>{percentage.toFixed(1)}%</span>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                            <tfoot>
                              <tr className="bg-gray-100 border-t-2 border-gray-300">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                  Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-green-700">
                                  €{selectedCompanyData.totalEarnings.toFixed(2)}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                                  100%
                                </th>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* No data state for selected company */}
                {selectedCompany && !selectedCompanyData && (
                  <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No data found</h3>
                    <p className="text-gray-600 mb-6">
                      No earnings data found for the selected company in {selectedYear}
                    </p>
                    <button
                      onClick={() => setSelectedCompany('')}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      View All Companies
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Quick Navigation */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/financial-report')}
              className="flex items-center gap-3 p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BarChart2 className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Financial Reports</p>
                <p className="text-sm text-gray-600">Detailed financial analysis</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/completed-projects')}
              className="flex items-center gap-3 p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Activity className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Completed Projects</p>
                <p className="text-sm text-gray-600">View project history</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/settings/payments')}
              className="flex items-center gap-3 p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="w-6 h-6 text-purple-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Driver Payments</p>
                <p className="text-sm text-gray-600">Manage driver earnings</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}