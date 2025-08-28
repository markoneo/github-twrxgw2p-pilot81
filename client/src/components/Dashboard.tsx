import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Plus, 
  MapPin, 
  Users, 
  Edit, 
  Eye, 
  Trash2, 
  Play, 
  Check, 
  Car, 
  Home, 
  BarChart2, 
  Settings, 
  LogOut, 
  Search, 
  X, 
  FileText, 
  DollarSign, 
  RefreshCw, 
  AlertCircle,
  Calendar,
  Clock,
  Activity,
  TrendingUp,
  Zap,
  ArrowRight,
  Bell,
  Star,
  Grid3X3,
  List,
  Map,
  
  Settings2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import Modal from './Modal';
import { useAuth } from '../contexts/AuthContext';
import VoucherGenerator from './VoucherGenerator';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectGrid from './enhanced/ProjectGrid';
import ProjectListView from './enhanced/ProjectListView';

import LocationAnalytics from './LocationAnalytics';

// Memoized Enhanced Stats Card Component
const EnhancedStatsCard = React.memo(({ stat, index }: { stat: any, index: number }) => {
  const Icon = stat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
      whileHover={{ y: -2, scale: 1.01 }}
      className="group relative overflow-hidden will-change-transform"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-80 group-hover:opacity-100 transition-opacity duration-200`} />
      
      {/* Simplified background animation */}
      <div className={`absolute w-24 h-24 bg-gradient-to-r ${stat.color} rounded-full blur-xl -top-6 -right-6 opacity-10`} />

      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg group-hover:shadow-xl transition-shadow duration-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl shadow-lg transition-shadow duration-200`}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
          
          {stat.change && (
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              stat.trend === 'up' 
                ? 'bg-emerald-100 text-emerald-700' 
                : stat.trend === 'down' 
                ? 'bg-red-100 text-red-700'
                : 'bg-slate-100 text-slate-700'
            }`}>
              {stat.change}
            </span>
          )}
        </div>

        <div>
          <p className="text-slate-600 text-sm font-medium mb-1">{stat.title}</p>
          <p className="text-3xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
            {stat.value}
          </p>
        </div>

        <div className="mt-4 h-1 bg-slate-200 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${stat.color} rounded-full w-3/4 transition-all duration-500`} />
        </div>
      </div>
    </motion.div>
  );
});

// Color palette for company themes
const companyColorPalette = [
  'blue', 'green', 'purple', 'amber', 'teal', 'red', 'indigo', 'pink', 'orange', 'emerald'
];

const getCompanyTheme = (companyName: string, companyId?: string) => {
  const savedColors = localStorage.getItem('companyColors');
  const companyColors = savedColors ? JSON.parse(savedColors) : {};
  
  if (companyId && companyColors[companyId]) {
    return companyColors[companyId];
  }
  
  const specificThemes: Record<string, string> = {
    'RideConnect': 'rideconnect',
    'AlphaTransfers': 'purple',
    'EcoRides': 'emerald',
    'LuxuryTransport': 'amber',
    'SpeedyShuttle': 'red',
    'VIATOR': 'viator',
    'BOOKING': 'booking'
  };
  
  if (companyName && specificThemes[companyName]) {
    return specificThemes[companyName];
  }
  
  if (companyId) {
    const hashValue = companyId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return companyColorPalette[hashValue % companyColorPalette.length];
  }
  
  return 'green';
};

const getThemeClasses = (theme: string) => {
  const themeClasses: Record<string, Record<string, string>> = {
    blue: {
      accent: 'from-blue-500 to-blue-600',
      text: 'text-blue-600',
      border: 'border-l-4 border-blue-500',
      light: 'bg-blue-50',
      icon: 'text-blue-500',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
    },
    green: {
      accent: 'from-green-500 to-green-600',
      text: 'text-green-600',
      border: 'border-l-4 border-green-500',
      light: 'bg-green-50',
      icon: 'text-green-500',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
    },
    purple: {
      accent: 'from-purple-500 to-purple-600',
      text: 'text-purple-600',
      border: 'border-l-4 border-purple-500',
      light: 'bg-purple-50',
      icon: 'text-purple-500',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
    },
    viator: {
      accent: 'from-[#328E6E] to-[#2a7a5e]',
      text: 'text-[#328E6E]',
      border: 'border-l-4 border-[#328E6E]',
      light: 'bg-green-50',
      icon: 'text-[#328E6E]',
      color: 'from-[#328E6E] to-[#2a7a5e]',
      bgColor: 'from-green-50 to-green-100',
    },
    booking: {
      accent: 'from-[#3D365C] to-[#332d4d]',
      text: 'text-[#3D365C]',
      border: 'border-l-4 border-[#3D365C]',
      light: 'bg-indigo-50',
      icon: 'text-[#3D365C]',
      color: 'from-[#3D365C] to-[#332d4d]',
      bgColor: 'from-indigo-50 to-indigo-100',
    },
    rideconnect: {
      accent: 'from-[#BF3131] to-[#a62a2a]',
      text: 'text-[#BF3131]',
      border: 'border-l-4 border-[#BF3131]',
      light: 'bg-red-50',
      icon: 'text-[#BF3131]',
      color: 'from-[#BF3131] to-[#a62a2a]',
      bgColor: 'from-red-50 to-red-100',
    }
  };
  
  if (theme.startsWith('#')) {
    return {
      accent: `from-[${theme}] to-[${theme}]/90`,
      text: `text-[${theme}]`,
      border: `border-l-4 border-[${theme}]`,
      light: 'bg-gray-50',
      icon: `text-[${theme}]`,
      color: `from-[${theme}] to-[${theme}]/90`,
      bgColor: 'from-gray-50 to-gray-100',
    };
  }
  
  return themeClasses[theme] || themeClasses.green;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { projects, companies, drivers, carTypes, updateProject, deleteProject, loading, error, refreshData } = useData();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [startedProjects, setStartedProjects] = useState<Set<string>>(new Set());
  const [upcomingProjects, setUpcomingProjects] = useState<any[]>([]);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [voucherProjectId, setVoucherProjectId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'analytics'>('grid');
  const [cardSettings, setCardSettings] = useState({
    collapsible: true,
    defaultExpanded: false
  });

  // Memoized company color cache
  const [companyColorCache] = useState<Record<string, string>>({});

  // Memoized helper functions
  const getCompanyName = useCallback((id: string) => {
    const company = companies.find(c => c.id === id);
    return company?.name || 'Unknown Company';
  }, [companies]);

  const getDriverName = useCallback((id: string) => {
    const driver = drivers.find(d => d.id === id);
    return driver?.name || 'Unknown Driver';
  }, [drivers]);

  const getCarTypeName = useCallback((id: string) => {
    const carType = carTypes.find(c => c.id === id);
    return carType?.name || 'Standard';
  }, [carTypes]);

  const getCompanyColorTheme = useCallback((companyId: string) => {
    if (!companyColorCache[companyId]) {
      const companyName = getCompanyName(companyId);
      companyColorCache[companyId] = getCompanyTheme(companyName, companyId);
    }
    return companyColorCache[companyId];
  }, [companyColorCache, getCompanyName]);

  // Memoized dashboard statistics
  const dashboardStats = useMemo(() => {
    const today = new Date().toDateString();
    const activeProjects = projects.filter(p => p.status === 'active');
    const todayCompleted = projects.filter(p => 
      p.status === 'completed' && new Date(p.date).toDateString() === today
    );
    const todayRevenue = todayCompleted.reduce((sum, p) => sum + p.price, 0);
    const availableDrivers = drivers.filter(d => d.status === 'available').length;
    const weeklyGrowth = Math.floor(Math.random() * 20) + 5;

    return {
      totalProjects: projects.length,
      activeProjects: activeProjects.length,
      completedToday: todayCompleted.length,
      todayRevenue,
      availableDrivers,
      weeklyGrowth
    };
  }, [projects, drivers]);

  // Memoized upcoming projects check
  const upcomingProjectsCheck = useMemo(() => {
    const now = new Date();
    return projects.filter(project => {
      if (project.status !== 'active') return false;
      
      const projectDate = new Date(`${project.date}T${project.time}`);
      const timeDiff = projectDate.getTime() - now.getTime();
      
      return timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000;
    });
  }, [projects]);

  // Update upcoming projects
  useEffect(() => {
    setUpcomingProjects(upcomingProjectsCheck);
  }, [upcomingProjectsCheck]);

  const handleManualRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await refreshData();
      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Error refreshing data:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshData]);

  const handleProjectAction = useCallback((projectId: string, action: string) => {
    switch (action) {
      case 'edit':
        navigate(`/edit-project/${projectId}`);
        break;
      case 'view':
        setSelectedProject(projectId);
        setShowDetailsModal(true);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this project?')) {
          deleteProject(projectId);
        }
        break;
      case 'start':
        if (startedProjects.has(projectId)) {
          // Completing project - show confirmation
          if (window.confirm('Are you sure you want to complete this trip?')) {
            console.log('Completing project:', projectId);
            updateProject(projectId, { status: 'completed' })
              .then(() => {
                console.log('Project completed successfully');
                // Remove from started projects set
                const newStartedProjects = new Set(startedProjects);
                newStartedProjects.delete(projectId);
                setStartedProjects(newStartedProjects);
              })
              .catch((error) => {
                console.error('Failed to complete project:', error);
                alert('Failed to complete the trip. Please try again.');
              });
          }
        } else {
          // Starting project
          console.log('Starting project:', projectId);
          setStartedProjects(prev => new Set([...prev, projectId]));
        }
        break;
      case 'voucher':
        setVoucherProjectId(projectId);
        setShowVoucherModal(true);
        break;
    }
  }, [navigate, deleteProject, updateProject, startedProjects]);

  const handleLogout = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      navigate('/');
    }
  }, [logout, navigate]);

  // Active projects for display
  const activeProjects = useMemo(() => projects.filter(p => p.status === 'active'), [projects]);

  // Enhanced stats data
  const enhancedStats = useMemo(() => [
    {
      title: "Total Projects",
      value: dashboardStats.totalProjects,
      icon: Activity,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      change: `+${dashboardStats.weeklyGrowth}%`,
      trend: "up"
    },
    {
      title: "Active Projects",
      value: dashboardStats.activeProjects,
      icon: Clock,
      color: "from-amber-500 to-orange-500",
      bgColor: "from-amber-50 to-orange-100",
      change: "+8%",
      trend: "up"
    },
    {
      title: "Completed Today",
      value: dashboardStats.completedToday,
      icon: Check,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "from-emerald-50 to-emerald-100",
      change: "+12%",
      trend: "up"
    },
    {
      title: "Today's Revenue",
      value: `€${dashboardStats.todayRevenue.toFixed(0)}`,
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      change: "+15%",
      trend: "up"
    }
  ], [dashboardStats]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header - Now scrollable */}
      <div className="bg-white/70 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Welcome back!
                </h1>
                <p className="text-slate-600 mt-1">
                  Here's what's happening with your transportation business
                  {!loading && (
                    <span className="text-xs text-slate-500 ml-2">
                      (Updated: {lastRefreshed.toLocaleTimeString()})
                    </span>
                  )}
                </p>
              </div>
              
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="p-2 text-gray-400 hover:text-green-600 rounded-full transition-colors lg:hidden"
                title="Refresh data"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              {/* Mobile: New Project Button First */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/new-project')}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 lg:order-last"
              >
                <Plus className="w-5 h-5" />
                <span className="sm:inline">New Project</span>
              </motion.button>

              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-white/50 transition-colors flex-shrink-0"
                  title="Refresh data"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="text-sm">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
                
                {/* View Mode Toggle - Mobile Optimized */}
                <div className="flex items-center bg-white/50 rounded-lg p-1 gap-1 flex-shrink-0">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-1 px-2 py-2 rounded-md transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-white shadow-sm text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="Grid View"
                  >
                    <Grid3X3 className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:inline">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-1 px-2 py-2 rounded-md transition-all ${
                      viewMode === 'list' 
                        ? 'bg-white shadow-sm text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:inline">List</span>
                  </button>
                  
                  <button
                    onClick={() => setViewMode('analytics')}
                    className={`flex items-center gap-1 px-2 py-2 rounded-md transition-all ${
                      viewMode === 'analytics' 
                        ? 'bg-white shadow-sm text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="Analytics View"
                  >
                    <Map className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:inline">Map</span>
                  </button>
                </div>
                
                {/* View Settings - Mobile Optimized */}
                {(viewMode === 'grid' || viewMode === 'list') && (
                  <div className="flex items-center bg-white/50 rounded-lg p-1 gap-1 flex-shrink-0">
                    <div className="flex items-center gap-1">
                      <Settings2 className="w-4 h-4 text-gray-500" />
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={cardSettings.collapsible}
                          onChange={(e) => setCardSettings(prev => ({ 
                            ...prev, 
                            collapsible: e.target.checked 
                          }))}
                          className="rounded w-3 h-3"
                        />
                        <span className="text-gray-700 hidden sm:inline">Collapsible</span>
                      </label>
                      {cardSettings.collapsible && (
                        <label className="flex items-center gap-1 text-xs">
                          <input
                            type="checkbox"
                            checked={cardSettings.defaultExpanded}
                            onChange={(e) => setCardSettings(prev => ({ 
                              ...prev, 
                              defaultExpanded: e.target.checked 
                            }))}
                            className="rounded w-3 h-3"
                          />
                          <span className="text-gray-700 hidden sm:inline">Default Expanded</span>
                        </label>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Error loading data</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button 
              onClick={handleManualRefresh}
              className="ml-auto bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Show Location Analytics if selected */}
        {viewMode === 'analytics' ? (
          <LocationAnalytics />
        ) : (
          <>
            {/* Enhanced Stats Cards - Optimized */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {enhancedStats.map((stat, index) => (
                <EnhancedStatsCard key={stat.title} stat={stat} index={index} />
              ))}
            </div>

            {/* Quick Actions & Insights - Simplified animations */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
              <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: BarChart2, label: "Statistics", action: () => navigate('/statistics'), color: "emerald" },
                    { icon: FileText, label: "Financial Report", action: () => navigate('/financial-report'), color: "purple" },
                    { icon: Users, label: "Manage Drivers", action: () => navigate('/settings/drivers'), color: "blue" },
                    { icon: Settings, label: "Settings", action: () => navigate('/settings/companies'), color: "amber" }
                  ].map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.label}
                        onClick={action.action}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-${action.color}-50 to-${action.color}-100 hover:from-${action.color}-100 hover:to-${action.color}-200 transition-all duration-200 group`}
                      >
                        <div className={`bg-gradient-to-r from-${action.color}-500 to-${action.color}-600 p-2 rounded-lg shadow-md group-hover:shadow-lg transition-shadow`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-slate-700">{action.label}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:text-slate-600 transition-colors" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 shadow-lg p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold">Performance</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">This Week</span>
                    <span className="text-emerald-400 font-bold">+{dashboardStats.weeklyGrowth}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Active Drivers</span>
                    <span className="text-blue-400 font-bold">{dashboardStats.availableDrivers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Completion Rate</span>
                    <span className="text-yellow-400 font-bold">98%</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>Excellent performance this week!</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg p-6 h-full">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
                  
                  <div className="space-y-3">
                    {upcomingProjects.slice(0, 3).map((project, index) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-3 bg-white/60 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full" />
                          <div>
                            <p className="font-medium text-slate-900">{project.clientName}</p>
                            <p className="text-sm text-slate-600">{project.time} today</p>
                          </div>
                        </div>
                        <span className="text-sm text-orange-600 font-medium">Upcoming</span>
                      </div>
                    ))}
                    
                    {upcomingProjects.length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-slate-500 text-sm">No upcoming trips today</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Projects Section - Optimized */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Active Projects
                  {upcomingProjects.length > 0 && (
                    <span className="ml-3 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                      {upcomingProjects.length} upcoming in 24h
                    </span>
                  )}
                </h2>
              </div>
              
              {loading && (
                <div className="flex justify-center items-center py-20 bg-white/70 rounded-2xl shadow-lg">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
                </div>
              )}
              
              {!loading && activeProjects.length === 0 && (
                <div className="text-center py-12 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg">
                  <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg mb-4">No projects yet. Create your first project!</p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={handleManualRefresh}
                      disabled={isRefreshing}
                      className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                      {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                    
                    <button
                      onClick={() => navigate('/new-project')}
                      className="inline-flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Project
                    </button>
                  </div>
                </div>
              )}
              
              {!loading && activeProjects.length > 0 && (
                <div className="will-change-scroll">
                  {viewMode === 'grid' ? (
                    <ProjectGrid
                      projects={activeProjects}
                      companies={companies}
                      drivers={drivers}
                      carTypes={carTypes}
                      onProjectAction={handleProjectAction}
                      getCompanyName={getCompanyName}
                      getDriverName={getDriverName}
                      getCarTypeName={getCarTypeName}
                      getCompanyTheme={getCompanyColorTheme}
                      startedProjects={startedProjects}
                      cardSettings={cardSettings}
                    />
                  ) : viewMode === 'list' ? (
                    <ProjectListView
                      projects={activeProjects}
                      companies={companies}
                      drivers={drivers}
                      carTypes={carTypes}
                      onProjectAction={handleProjectAction}
                      getCompanyName={getCompanyName}
                      getDriverName={getDriverName}
                      getCarTypeName={getCarTypeName}
                      getCompanyTheme={getCompanyColorTheme}
                    />
                  ) : null}
                </div>
              )}
            </div>
          </>
        )}

        {/* Modals */}
        {showDetailsModal && selectedProject && (
          <Modal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            title="Project Details"
          >
            {(() => {
              const project = projects.find(p => p.id === selectedProject);
              if (!project) return null;
              
              return (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Contact Details</h3>
                    <p className="text-gray-600 text-lg mb-4">{project.clientPhone}</p>
                    
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Additional Information</h3>
                    <p className="text-gray-600">{project.description}</p>
                  </div>
                </div>
              );
            })()}
          </Modal>
        )}

        {showVoucherModal && voucherProjectId && (
          <Modal
            isOpen={showVoucherModal}
            onClose={() => setShowVoucherModal(false)}
            title="Transfer Voucher"
            size="large"
          >
            <VoucherGenerator 
              projectId={voucherProjectId}
              onClose={() => setShowVoucherModal(false)}
            />
          </Modal>
        )}
      </div>
      {/* Mobile Bottom Navigation - Optimized */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 md:hidden shadow-lg will-change-transform">
        <div className="grid grid-cols-5 gap-1 p-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex flex-col items-center justify-center py-2 text-green-600"
          >
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1 font-medium">Home</span>
          </button>
          
          <button
            onClick={() => navigate('/statistics')}
            className="flex flex-col items-center justify-center py-2 text-gray-600"
          >
            <BarChart2 className="w-5 h-5" />
            <span className="text-xs mt-1">Stats</span>
          </button>
          
          <button
            onClick={() => navigate('/new-project')}
            className="flex flex-col items-center justify-center py-2 text-gray-600"
          >
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-full p-2 -mt-4 shadow-lg border-4 border-white">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs mt-1">New</span>
          </button>
          
          <button
            onClick={() => navigate('/settings/companies')}
            className="flex flex-col items-center justify-center py-2 text-gray-600"
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs mt-1">Settings</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center py-2 text-gray-600"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}