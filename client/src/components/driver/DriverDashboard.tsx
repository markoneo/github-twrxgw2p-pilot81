import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  MapPin, 
  Users, 
  Clock, 
  DollarSign, 
  Phone, 
  Car, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  Calendar,
  User,
  Building2,
  ExternalLink,
  ArrowRight,
  Bell,
  TrendingUp,
  Activity,
  XCircle,
  PlayCircle,
  PauseCircle
} from 'lucide-react';
import { DriverDataProvider, useDriverData } from '../../contexts/DriverDataContext';

interface DriverDashboardProps {
  driverId: string;
  driverName: string;
  driverUuid: string;
  onLogout: () => void;
}

// Project Card Component for Driver Portal
const DriverProjectCard = ({ project, companyName, carTypeName }: { 
  project: any; 
  companyName: string;
  carTypeName: string;
}) => {
  const { updateProjectStatus } = useDriverData();
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async (status: 'accepted' | 'started' | 'declined') => {
    setUpdating(true);
    try {
      await updateProjectStatus(project.id, status);
    } catch (error) {
      console.error('Failed to update project status:', error);
      alert('Failed to update project status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'started': return 'bg-green-100 text-green-800 border-green-200';
      case 'declined': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgency = () => {
    const projectDateTime = new Date(`${project.date}T${project.time}`);
    const now = new Date();
    const diffHours = (projectDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 0) return { type: 'past', color: 'bg-gray-200' };
    if (diffHours <= 2) return { type: 'urgent', color: 'bg-red-500' };
    if (diffHours <= 24) return { type: 'soon', color: 'bg-orange-500' };
    return { type: 'scheduled', color: 'bg-blue-500' };
  };

  const urgency = getUrgency();
  const displayPrice = project.driver_fee && project.driver_fee > 0 ? project.driver_fee : project.price;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Header with urgency indicator */}
      <div className={`h-2 ${urgency.color}`}></div>
      
      <div className="p-6">
        {/* Trip Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{project.client_name}</h3>
              <p className="text-sm text-gray-600 flex items-center">
                <Building2 className="w-4 h-4 mr-1" />
                {companyName}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              €{displayPrice.toFixed(2)}
            </div>
            {project.driver_fee && project.driver_fee !== project.price && (
              <div className="text-xs text-gray-500">
                Trip fee (Total: €{project.price.toFixed(2)})
              </div>
            )}
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="font-medium">{formatDate(project.date)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="font-bold text-lg">{formatTime(project.time)}</span>
          </div>
        </div>

        {/* Locations */}
        <div className="space-y-3 mb-4">
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 p-2 rounded-lg mt-1">
              <MapPin className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-green-600 uppercase tracking-wider">Pickup</p>
              <button
                onClick={() => {
                  const pickupUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.pickup_location)}`;
                  window.open(pickupUrl, '_blank');
                }}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 leading-relaxed text-left underline decoration-dotted hover:decoration-solid transition-all duration-200"
                title="Open in Google Maps"
              >
                {project.pickup_location}
              </button>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-red-100 p-2 rounded-lg mt-1">
              <MapPin className="w-4 h-4 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-red-600 uppercase tracking-wider">Dropoff</p>
              <button
                onClick={() => {
                  const dropoffUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.dropoff_location)}`;
                  window.open(dropoffUrl, '_blank');
                }}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 leading-relaxed text-left underline decoration-dotted hover:decoration-solid transition-all duration-200"
                title="Open in Google Maps"
              >
                {project.dropoff_location}
              </button>
            </div>
          </div>
          
          {/* Route Navigation Button */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => {
                const routeUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(project.pickup_location)}&destination=${encodeURIComponent(project.dropoff_location)}`;
                window.open(routeUrl, '_blank');
              }}
              className="w-full flex items-center justify-center space-x-2 bg-blue-50 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors duration-200"
              title="Get directions from pickup to dropoff"
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Get Directions</span>
            </button>
          </div>
            </div>
          </div>

        {/* Trip Details */}
        <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">{project.passengers} passenger{project.passengers !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-blue-600" />
            <a 
              href={`tel:${project.client_phone}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Call Client
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <Car className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">{carTypeName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span className={`text-sm font-medium ${
              project.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'
            }`}>
              {project.payment_status === 'paid' ? 'Already Paid' : 'Charge the Client'}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.acceptance_status)}`}>
            {project.acceptance_status === 'pending' && <Clock className="w-4 h-4 mr-1" />}
            {project.acceptance_status === 'accepted' && <CheckCircle className="w-4 h-4 mr-1" />}
            {project.acceptance_status === 'started' && <PlayCircle className="w-4 h-4 mr-1" />}
            {project.acceptance_status === 'declined' && <XCircle className="w-4 h-4 mr-1" />}
            {project.acceptance_status.charAt(0).toUpperCase() + project.acceptance_status.slice(1)}
          </span>
        </div>

        {/* Description */}
        {project.description && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-xs font-medium text-yellow-700 uppercase tracking-wider mb-1">
              Special Instructions
            </p>
            <p className="text-sm text-yellow-800">{project.description}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          {project.acceptance_status === 'pending' && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleStatusUpdate('accepted')}
                disabled={updating}
                className="flex items-center justify-center space-x-2 bg-green-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                <CheckCircle className="w-5 h-5" />
                <span>{updating ? 'Accepting...' : 'Accept Trip'}</span>
              </button>
              <button
                onClick={() => handleStatusUpdate('declined')}
                disabled={updating}
                className="flex items-center justify-center space-x-2 bg-red-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                <XCircle className="w-5 h-5" />
                <span>{updating ? 'Declining...' : 'Decline'}</span>
              </button>
            </div>
          )}
          
          {project.acceptance_status === 'accepted' && (
            <button
              onClick={() => handleStatusUpdate('started')}
              disabled={updating}
              className="flex items-center justify-center space-x-2 bg-blue-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              <PlayCircle className="w-5 h-5" />
              <span>{updating ? 'Starting...' : 'Start Trip'}</span>
            </button>
          )}

          {project.acceptance_status === 'started' && (
            <button
              onClick={() => handleStatusUpdate('completed')}
              disabled={updating}
              className="flex items-center justify-center space-x-2 bg-green-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{updating ? 'Completing...' : 'Complete Trip'}</span>
            </button>
          )}
          {project.acceptance_status === 'completed' && (
            <div className="flex items-center justify-center space-x-2 bg-blue-100 text-blue-800 py-3 px-4 rounded-xl font-medium">
              <CheckCircle2 className="w-5 h-5" />
              <span>Trip Completed</span>
            </div>
          )}

          {project.acceptance_status === 'declined' && (
            <div className="flex items-center justify-center space-x-2 bg-red-100 text-red-800 py-3 px-4 rounded-xl font-medium">
              <XCircle className="w-5 h-5" />
              <span>Trip Declined</span>
            </div>
          )}
        </div>

        {/* Booking ID */}
        {project.booking_id && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Booking Reference: <span className="font-mono">{project.booking_id}</span>
            </p>
          </div>
        )}
    </motion.div>
  );
};

// Dashboard Content Component
const DashboardContent = ({ driverName, onLogout }: { 
  driverName: string; 
  onLogout: () => void;
}) => {
  const { projects, companies, carTypes, loading, error, refreshProjects, retryCount, driverInfo } = useDriverData();
  const [refreshing, setRefreshing] = useState(false);
  
  // Debug info
  useEffect(() => {
    console.log('DriverDashboard - Projects loaded:', projects.length);
    console.log('DriverDashboard - Driver info:', driverInfo);
    console.log('DriverDashboard - Loading:', loading);
    console.log('DriverDashboard - Error:', error);
  }, [projects, driverInfo, loading, error]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshProjects();
    } finally {
      setRefreshing(false);
    }
  };

  // Get company name helper
  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    return company?.name || 'Unknown Company';
  };

  // Get car type name helper
  const getCarTypeName = (carTypeId: string) => {
    const carType = carTypes.find(ct => ct.id === carTypeId);
    return carType?.name || 'Standard Vehicle';
  };

  // Organize projects by status and urgency
  const organizedProjects = useMemo(() => {
    const now = new Date();
    
    const categorized = {
      urgent: [] as any[],
      today: [] as any[],
      upcoming: [] as any[],
      completed: [] as any[]
    };

    projects.forEach(project => {
      if (project.status === 'completed') {
        categorized.completed.push(project);
        return;
      }

      const projectDateTime = new Date(`${project.date}T${project.time}`);
      const diffHours = (projectDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      const isToday = projectDateTime.toDateString() === now.toDateString();

      if (diffHours <= 2 && diffHours > 0) {
        categorized.urgent.push(project);
      } else if (isToday) {
        categorized.today.push(project);
      } else {
        categorized.upcoming.push(project);
      }
    });

    // Sort each category
    Object.keys(categorized).forEach(key => {
      categorized[key as keyof typeof categorized].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
    });

    return categorized;
  }, [projects]);

  const stats = useMemo(() => {
    const pending = projects.filter(p => p.acceptance_status === 'pending').length;
    const accepted = projects.filter(p => p.acceptance_status === 'accepted').length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const totalEarnings = projects
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + (p.driver_fee || p.price), 0);

    return { pending, accepted, completed, totalEarnings };
  }, [projects]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Your Projects</h2>
          <p className="text-gray-600">
            {retryCount > 0 ? `Retrying... (${retryCount}/3)` : 'Please wait while we fetch your assigned trips'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Projects</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {refreshing ? 'Retrying...' : 'Try Again'}
            </button>
            <button
              onClick={onLogout}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {driverName}!
              </h1>
              <p className="text-gray-600">Your driver portal dashboard</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`p-2 rounded-lg transition-colors ${
                  refreshing 
                    ? 'text-gray-400' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                title="Refresh projects"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Bell className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-blue-600">{stats.accepted}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Earnings</p>
                <p className="text-xl font-bold text-purple-600">€{stats.totalEarnings.toFixed(0)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Project Categories */}
        {organizedProjects.urgent.length > 0 && (
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-red-700">Urgent - Starting Soon!</h2>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                {organizedProjects.urgent.length} trip{organizedProjects.urgent.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {organizedProjects.urgent.map(project => (
                <DriverProjectCard
                  key={project.id}
                  project={project}
                  companyName={getCompanyName(project.company_id)}
                  carTypeName={getCarTypeName(project.car_type_id)}
                />
              ))}
            </div>
          </div>
        )}

        {organizedProjects.today.length > 0 && (
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-blue-700">Today's Trips</h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {organizedProjects.today.length} trip{organizedProjects.today.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {organizedProjects.today.map(project => (
                <DriverProjectCard
                  key={project.id}
                  project={project}
                  companyName={getCompanyName(project.company_id)}
                  carTypeName={getCarTypeName(project.car_type_id)}
                />
              ))}
            </div>
          </div>
        )}

        {organizedProjects.upcoming.length > 0 && (
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-green-700">Upcoming Trips</h2>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {organizedProjects.upcoming.length} trip{organizedProjects.upcoming.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {organizedProjects.upcoming.map(project => (
                <DriverProjectCard
                  key={project.id}
                  project={project}
                  companyName={getCompanyName(project.company_id)}
                  carTypeName={getCarTypeName(project.car_type_id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Projects State */}
        {projects.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips assigned yet</h3>
            <p className="text-gray-600 mb-6">
              Your dispatcher hasn't assigned any trips to you yet. Check back later or contact them directly.
            </p>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {refreshing ? 'Checking...' : 'Check for New Trips'}
            </button>
          </div>
        )}

        {/* Completed Trips Summary */}
        {organizedProjects.completed.length > 0 && (
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gray-100 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-gray-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-700">Recently Completed</h2>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                {organizedProjects.completed.length} trip{organizedProjects.completed.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            {/* Show only last 3 completed trips */}
            <div className="grid gap-4 md:grid-cols-2">
              {organizedProjects.completed.slice(0, 3).map(project => (
                <div key={project.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 opacity-75">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{project.client_name}</h4>
                    <span className="text-green-600 font-bold">€{(project.driver_fee || project.price).toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600">{formatDate(project.date)} at {formatTime(project.time)}</p>
                  <div className="flex items-center mt-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">Completed</span>
                  </div>
                </div>
              ))}
            </div>
            
            {organizedProjects.completed.length > 3 && (
              <div className="text-center mt-4">
                <span className="text-sm text-gray-500">
                  {organizedProjects.completed.length - 3} more completed trips
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions for date formatting
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
};

const formatTime = (time: string) => {
  return time.substring(0, 5);
};

// Main Dashboard Component
export default function DriverDashboard({ driverId, driverName, driverUuid, onLogout }: DriverDashboardProps) {
  return (
    <DriverDataProvider driverId={driverId} driverUuid={driverUuid}>
      <DashboardContent driverName={driverName} onLogout={onLogout} />
    </DriverDataProvider>
  );
}