import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Users, 
  Clock, 
  DollarSign, 
  Calendar,
  Phone,
  Car,
  ArrowRight,
  Edit,
  Trash2,
  Play,
  CheckCircle2,
  FileText,
  Star,
  AlertCircle,
  Zap,
  ChevronDown
} from 'lucide-react';

interface ProjectCardProps {
  project: {
    id: string;
    clientName: string;
    clientPhone?: string;
    date: string;
    time: string;
    pickupLocation: string;
    dropoffLocation: string;
    passengers: number;
    price: number;
    company: string;
    driver: string;
    carType: string;
    status: string;
    paymentStatus: string;
    acceptance_status?: 'pending' | 'accepted' | 'started' | 'declined';
    bookingId?: string;
    description?: string;
  };
  companyName: string;
  driverName?: string;
  carTypeName?: string;
  colorTheme: string;
  isUpcoming?: boolean;
  isUrgent?: boolean;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
  onStart?: () => void;
  onVoucher?: () => void;
  isStarted?: boolean;
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
}

const ProjectCard = React.memo(({ 
  project, 
  companyName, 
  driverName,
  carTypeName,
  colorTheme, 
  isUpcoming = false,
  isUrgent = false,
  onEdit, 
  onView, 
  onDelete,
  onStart,
  onVoucher,
  isStarted = false,
  isCollapsible = false,
  defaultExpanded = true
}: ProjectCardProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isWorking, setIsWorking] = useState(false);

  const handleTripAction = React.useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWorking) return; // Prevent multiple clicks while processing
    
    // Required confirmation dialog for trip completion
    const confirmed = window.confirm(
      `Complete this trip for ${project.clientName}?\n\nThis will move the trip to completed history and cannot be undone.`
    );
    
    if (!confirmed) return;
    
    setIsWorking(true);
    
    try {
      if (onStart) {
        await onStart();
        console.log('Trip completion successful');
      }
    } catch (error) {
      console.error('Failed to complete trip:', error);
      alert('Failed to complete trip. Please try again.');
    } finally {
      setIsWorking(false);
    }
  }, [onStart, isWorking]);

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeUntil = () => {
    const now = new Date();
    const projectDateTime = new Date(`${project.date}T${project.time}`);
    const diff = projectDateTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours < 1 && minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h ${minutes}m`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const getUrgencyConfig = () => {
    if (isUrgent) return {
      borderColor: 'border-red-400',
      bgGradient: 'from-red-50 to-red-100',
      accentColor: 'bg-red-500',
      textColor: 'text-red-700',
      pulseAnimation: 'animate-pulse'
    };
    if (isUpcoming) return {
      borderColor: 'border-orange-400',
      bgGradient: 'from-orange-50 to-orange-100',
      accentColor: 'bg-orange-500',
      textColor: 'text-orange-700',
      pulseAnimation: ''
    };
    return {
      borderColor: 'border-slate-200',
      bgGradient: 'from-white to-slate-50',
      accentColor: 'bg-slate-400',
      textColor: 'text-slate-700',
      pulseAnimation: ''
    };
  };

  // Get button color class that ensures good contrast with white text
  const getButtonColorClass = () => {
    if (isStarted) {
      return 'bg-gradient-to-r from-emerald-600 to-emerald-500';
    }

    // Map theme colors to button-safe versions that work with white text
    const buttonColorMap: { [key: string]: string } = {
      'blue': 'bg-gradient-to-r from-blue-600 to-blue-500',
      'green': 'bg-gradient-to-r from-green-600 to-green-500',
      'purple': 'bg-gradient-to-r from-purple-600 to-purple-500',
      'amber': 'bg-gradient-to-r from-amber-600 to-amber-500',
      'teal': 'bg-gradient-to-r from-teal-600 to-teal-500',
      'red': 'bg-gradient-to-r from-red-600 to-red-500',
      'indigo': 'bg-gradient-to-r from-indigo-600 to-indigo-500',
      'pink': 'bg-gradient-to-r from-pink-600 to-pink-500',
      'orange': 'bg-gradient-to-r from-orange-600 to-orange-500',
      'emerald': 'bg-gradient-to-r from-emerald-600 to-emerald-500',
      'viator': 'bg-gradient-to-r from-[#328E6E] to-[#2a7a5e]',
      'booking': 'bg-gradient-to-r from-[#3D365C] to-[#332d4d]',
      'rideconnect': 'bg-gradient-to-r from-[#BF3131] to-[#a62a2a]'
    };

    // Extract the base color from the theme
    let baseColor = colorTheme;
    if (colorTheme.includes('from-')) {
      // If it's already a gradient, extract the base color
      const match = colorTheme.match(/from-(\w+)-/);
      if (match) {
        baseColor = match[1];
      }
    }

    return buttonColorMap[baseColor] || 'bg-gradient-to-r from-blue-600 to-blue-500';
  };

  const urgencyConfig = getUrgencyConfig();

  // Get acceptance status styling
  const getAcceptanceStatusConfig = () => {
    switch (project.acceptance_status) {
      case 'pending':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          icon: Clock,
          label: 'Pending Driver Response'
        };
      case 'accepted':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          icon: CheckCircle2,
          label: 'Driver Accepted'
        };
      case 'started':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          icon: Play,
          label: 'Trip Started'
        };
      case 'declined':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          icon: AlertCircle,
          label: 'Driver Declined'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: Clock,
          label: 'Status Unknown'
        };
    }
  };

  const acceptanceConfig = getAcceptanceStatusConfig();
  const AcceptanceIcon = acceptanceConfig.icon;

  // Get company-specific border and accent colors
  const getCompanyBorderColors = () => {
    const colorMap: { [key: string]: { border: string; accent: string; shadow: string } } = {
      'blue': { 
        border: 'border-blue-400', 
        accent: 'bg-blue-500', 
        shadow: 'shadow-blue-500/25' 
      },
      'green': { 
        border: 'border-green-400', 
        accent: 'bg-green-500', 
        shadow: 'shadow-green-500/25' 
      },
      'purple': { 
        border: 'border-purple-400', 
        accent: 'bg-purple-500', 
        shadow: 'shadow-purple-500/25' 
      },
      'amber': { 
        border: 'border-amber-400', 
        accent: 'bg-amber-500', 
        shadow: 'shadow-amber-500/25' 
      },
      'teal': { 
        border: 'border-teal-400', 
        accent: 'bg-teal-500', 
        shadow: 'shadow-teal-500/25' 
      },
      'red': { 
        border: 'border-red-400', 
        accent: 'bg-red-500', 
        shadow: 'shadow-red-500/25' 
      },
      'indigo': { 
        border: 'border-indigo-400', 
        accent: 'bg-indigo-500', 
        shadow: 'shadow-indigo-500/25' 
      },
      'pink': { 
        border: 'border-pink-400', 
        accent: 'bg-pink-500', 
        shadow: 'shadow-pink-500/25' 
      },
      'orange': { 
        border: 'border-orange-400', 
        accent: 'bg-orange-500', 
        shadow: 'shadow-orange-500/25' 
      },
      'emerald': { 
        border: 'border-emerald-400', 
        accent: 'bg-emerald-500', 
        shadow: 'shadow-emerald-500/25' 
      },
      'viator': { 
        border: 'border-[#328E6E]', 
        accent: 'bg-[#328E6E]', 
        shadow: 'shadow-[#328E6E]/25' 
      },
      'booking': { 
        border: 'border-[#3D365C]', 
        accent: 'bg-[#3D365C]', 
        shadow: 'shadow-[#3D365C]/25' 
      },
      'rideconnect': { 
        border: 'border-[#BF3131]', 
        accent: 'bg-[#BF3131]', 
        shadow: 'shadow-[#BF3131]/25' 
      }
    };

    // Extract base color from theme
    let baseColor = colorTheme;
    if (colorTheme.includes('from-')) {
      const match = colorTheme.match(/from-(\w+)-/);
      if (match) {
        baseColor = match[1];
      }
    }

    return colorMap[baseColor] || colorMap.blue;
  };

  const companyColors = getCompanyBorderColors();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -4, 
        scale: 1.01,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      className={`group relative overflow-hidden will-change-transform ${urgencyConfig.pulseAnimation}`}
    >
      {/* Background Effects - Simplified */}
      <div className={`absolute inset-0 bg-gradient-to-br ${urgencyConfig.bgGradient} opacity-60`} />
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />

      {/* Enhanced Company Colorized Border - Full perimeter with gradient effect */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${companyColors.accent.replace('bg-', 'from-')} ${companyColors.accent.replace('bg-', 'to-').replace(/(\w+)-(\d+)/, '$1-400')} p-1`}>
        <div className="w-full h-full bg-white rounded-lg" />
      </div>
      
      {/* Corner accent elements for extra visual impact */}
      <div className={`absolute top-0 left-0 w-8 h-8 ${companyColors.accent} rounded-br-full opacity-20`} />
      <div className={`absolute top-0 right-0 w-8 h-8 ${companyColors.accent} rounded-bl-full opacity-20`} />
      <div className={`absolute bottom-0 left-0 w-8 h-8 ${companyColors.accent} rounded-tr-full opacity-20`} />
      <div className={`absolute bottom-0 right-0 w-8 h-8 ${companyColors.accent} rounded-tl-full opacity-20`} />

      <div className={`relative bg-white/95 backdrop-blur-sm rounded-lg shadow-lg ${companyColors.shadow} group-hover:shadow-xl group-hover:${companyColors.shadow.replace('/20', '/40')} transition-all duration-300 overflow-hidden m-1`}>

        {/* Top Status Bar */}
        <div className={`flex justify-between items-center p-3 border-b border-slate-200 bg-gradient-to-r from-white/90 to-slate-50/90`}>
          <div className="flex items-center gap-2">
            {/* Driver Acceptance Status */}
            {project.acceptance_status && (
              <div className={`flex items-center gap-2 ${acceptanceConfig.bgColor} ${acceptanceConfig.textColor} px-3 py-1 rounded-full text-xs font-medium border ${acceptanceConfig.borderColor} shadow-sm`}>
                <AcceptanceIcon className="w-3 h-3" />
                <span>{acceptanceConfig.label}</span>
              </div>
            )}

            {isUpcoming && (
              <div className={`flex items-center gap-1 ${urgencyConfig.accentColor} text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg`}>
                {isUrgent ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                <span className="text-xs">{getTimeUntil()}</span>
              </div>
            )}

            {project.paymentStatus === 'paid' && (
              <div className="bg-emerald-500 text-white p-1 rounded-full" title="Payment Received">
                <CheckCircle2 className="w-3 h-3" />
              </div>
            )}
          </div>

          {project.bookingId && (
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
              <span className="text-xs font-mono text-slate-600">#{project.bookingId}</span>
            </div>
          )}
        </div>

        {/* Main Header - Separated into clear sections */}
        <div className="p-4 space-y-3">
          {/* Collapse Toggle Button */}
          {isCollapsible && (
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors bg-slate-50 hover:bg-blue-50 px-3 py-2 rounded-lg font-medium"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
                <span className="text-sm font-medium">
                  {isExpanded ? 'Hide' : 'Show'} Details
                </span>
              </button>
              <div className="text-xs text-slate-500">
                {isExpanded ? 'Full view' : 'Summary view'}
              </div>
            </div>
          )}

          {/* Time and Date Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <div className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                {formatTime(project.time)}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                  {formatDate(project.date)}
                </span>
              </div>
            </div>

            {/* Price Section - Moved to separate area */}
            <div className="text-right">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                €{project.price.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Company and Payment Status Row */}
          <div className="flex items-center justify-between">
            <span className={`text-sm font-bold`} style={{ color: companyColors.accent.replace('bg-', '').replace('[', '').replace(']', '') }}>
              {companyName}
            </span>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              project.paymentStatus === 'paid' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-amber-100 text-amber-700'
            }`}>
              <DollarSign className="w-3 h-3 mr-1" />
              {project.paymentStatus === 'paid' ? 'Paid' : 'To Charge'}
            </div>
          </div>

          {/* Client Information Row */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 truncate mb-1">
              {project.clientName}
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone className="w-4 h-4" />
              <span>Contact available</span>
            </div>
          </div>

          {/* Summary Route Info - Always visible */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="truncate">{project.pickupLocation}</span>
              <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span className="truncate">{project.dropoffLocation}</span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{project.passengers}</span>
              </div>
              <div className="flex items-center gap-1">
                <Car className="w-4 h-4" />
                <span>{carTypeName || 'Standard'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span>{driverName || 'TBA'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Detailed Content */}
        <AnimatePresence>
          {(!isCollapsible || isExpanded) && (
            <motion.div
              initial={isCollapsible ? { height: 0, opacity: 0 } : { height: 'auto', opacity: 1 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              {/* Location Section - Better organized */}
              <div className={`px-4 py-3 bg-gradient-to-r from-slate-50/50 to-white/50 border-y border-slate-200`}>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 group/location">
                    <div className={`${companyColors.accent}/20 p-3 rounded-xl group-hover/location:${companyColors.accent}/30 transition-colors flex-shrink-0 border border-emerald-200`}>
                      <MapPin className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                        Pickup Location
                      </p>
                      <p className="text-sm font-medium text-slate-900 leading-relaxed break-words">
                        {project.pickupLocation}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group/location">
                    <div className="bg-red-100 p-3 rounded-xl group-hover/location:bg-red-200 transition-colors flex-shrink-0 border border-red-200">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
                        Dropoff Location
                      </p>
                      <p className="text-sm font-medium text-slate-900 leading-relaxed break-words">
                        {project.dropoffLocation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Details - Reorganized as separate section */}
              <div className="p-4">
                <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mb-2 mx-auto">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Passengers</p>
                    <p className="text-lg font-bold text-slate-900">{project.passengers}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mb-2 mx-auto">
                      <Car className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Vehicle</p>
                    <p className="text-lg font-bold text-slate-900">{carTypeName || 'Standard'}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-amber-100 rounded-lg mb-2 mx-auto">
                      <Star className="w-4 h-4 text-amber-600" />
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Driver</p>
                    <p className="text-lg font-bold text-slate-900">{driverName || 'TBA'}</p>
                  </div>
                </div>

                {onStart && project.status === 'active' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      if (isWorking) return;
                      
                     // Required confirmation dialog for trip completion
                     const confirmed = window.confirm(
                       `Complete this trip for ${project.clientName}?\n\nThis will move the trip to completed history and cannot be undone.`
                     );
                     
                     if (!confirmed) return;
                      
                      setIsWorking(true);
                      
                      try {
                        if (onStart) {
                          await onStart();
                         console.log('Trip completion successful');
                        }
                      } catch (error) {
                        console.error('Failed to complete trip:', error);
                        alert('Failed to complete trip. Please try again.');
                      } finally {
                        setIsWorking(false);
                      }
                    }}
                    disabled={isWorking}
                    className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 ${isWorking ? 'opacity-75 cursor-not-allowed' : ''}`}
                    aria-label="Complete trip - requires confirmation"
                  >
                    {isWorking ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <CheckCircle2 className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      <>
                        <CheckCircle2 className="w-6 h-6" />
                        Complete Trip
                      </>
                    )}
                  </motion.button>
                )}
                {/* Client Contact Section */}
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Client Contact
                  </p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-600" />
                    <a 
                      href={`tel:${project.clientPhone || ''}`}
                      className="text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {project.clientPhone || 'Not provided'}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions Section - Clear separation */}
        <div className={`p-4 bg-gradient-to-r from-slate-50/80 to-white/80 border-t border-slate-200`}>
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            {/* Left Side - Primary Action */}
            <div className="flex items-center gap-3">
              {onStart && project.status === 'active' && project.acceptance_status !== 'declined' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleTripAction}
                  disabled={isWorking}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 ${isWorking ? 'opacity-75 cursor-not-allowed' : ''}`}
                  aria-label="Complete trip - requires confirmation"
                >
                  {isWorking ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <>
                      <CheckCircle2 className="w-6 h-6" />
                      Complete Trip
                    </>
                  )}
                </motion.button>
              )}

              {/* Completed Trip Badge */}
              {project.status === 'completed' && (
                <div className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-emerald-700 bg-emerald-100 border border-emerald-200">
                  <CheckCircle2 className="w-5 h-5" />
                  ✅ Trip Completed
                </div>
              )}
            </div>

            {/* Secondary Actions - Icon-only for cleaner UI */}
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <button
                onClick={onEdit}
                className="flex items-center justify-center p-2 rounded-lg hover:bg-indigo-100 text-indigo-600 transition-colors"
                title="Edit project details, time, location, or driver"
              >
                <Edit className="w-5 h-5" />
              </button>

              {onVoucher && (
                <button
                  onClick={onVoucher}
                  className="flex items-center justify-center p-2 rounded-lg hover:bg-emerald-100 text-emerald-600 transition-colors"
                  title="Generate voucher for client - share via WhatsApp, email, or print"
                >
                  <FileText className="w-5 h-5" />
                </button>
              )}

              <button
                onClick={onDelete}
                className="flex items-center justify-center p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                title="Delete project"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;