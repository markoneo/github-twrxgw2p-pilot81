import { useState, useCallback, useMemo } from 'react';
import { ChevronDown, ChevronRight, Users, Calendar, DollarSign, MapPin, Phone, Car, User, Clock, Eye, Edit, Trash2, Play, Receipt } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  id: string;
  clientName: string;
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
  bookingId?: string;
  description?: string;
}

interface ProjectListViewProps {
  projects: Project[];
  companies: Array<{ id: string; name: string }>;
  drivers: Array<{ id: string; name: string }>;
  carTypes: Array<{ id: string; name: string }>;
  onProjectAction: (projectId: string, action: string) => void;
  getCompanyName: (id: string) => string;
  getDriverName: (id: string) => string;
  getCarTypeName: (id: string) => string;
  getCompanyTheme: (companyId: string) => string;
}

interface ListItemProps {
  project: Project;
  companyName: string;
  driverName: string;
  carTypeName: string;
  colorTheme: string;
  isExpanded: boolean;
  onToggle: () => void;
  onAction: (action: string) => void;
  isUpcoming: boolean;
  isUrgent: boolean;
}

const ProjectListItem: React.FC<ListItemProps> = ({
  project,
  companyName,
  driverName,
  carTypeName,
  colorTheme,
  isExpanded,
  onToggle,
  onAction,
  isUpcoming,
  isUrgent
}) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    completed: 'bg-blue-100 text-blue-800 border-blue-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  };

  const paymentColors = {
    paid: 'bg-green-100 text-green-800',
    charge: 'bg-orange-100 text-orange-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg mb-4 shadow-sm"
      style={{ 
        borderLeftColor: colorTheme, 
        borderLeftWidth: '4px',
        borderTopLeftRadius: '16px',
        borderBottomLeftRadius: '16px',
        boxShadow: isUrgent ? '0 4px 20px rgba(239, 68, 68, 0.15), 0 0 0 2px rgba(239, 68, 68, 0.2)' : '0 2px 12px rgba(0, 0, 0, 0.08)'
      }}
    >
      {/* Main List Item */}
      <div
        className="p-4 cursor-pointer select-none"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          {/* Left Content */}
          <div className="flex items-center space-x-4 flex-1">
            {/* Expand/Collapse Icon */}
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-400 hover:text-gray-600"
            >
              <ChevronRight size={16} />
            </motion.div>

            {/* Project Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-medium text-gray-900 truncate">
                  {project.clientName}
                </h3>
                {isUrgent && (
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    Urgent
                  </span>
                )}
                <span className={`px-3 py-1 text-xs font-medium rounded-full border shadow-sm ${statusColors[project.status as keyof typeof statusColors] || statusColors.pending}`}>
                  {project.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{project.date} at {project.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={14} />
                    <span>{project.passengers} passenger{project.passengers !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <MapPin size={14} className="text-emerald-600" />
                    <span className="truncate max-w-xs">From: {project.pickupLocation}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin size={14} className="text-red-600" />
                    <span className="truncate max-w-xs">To: {project.dropoffLocation}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User size={14} className="text-blue-600" />
                    <span className="truncate max-w-xs">Driver: {driverName}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex items-center space-x-3 ml-4">
            <div className="text-right">
              <div className="font-medium text-gray-900">
                ${project.price.toFixed(2)}
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-lg shadow-sm ${paymentColors[project.paymentStatus as keyof typeof paymentColors] || paymentColors.pending}`}>
                {project.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 p-4 bg-gray-50 rounded-b-2xl">
              {/* Detailed Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {/* Trip Details */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <MapPin size={16} className="mr-2" />
                    Trip Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">From:</span>
                      <div className="font-medium">{project.pickupLocation}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">To:</span>
                      <div className="font-medium">{project.dropoffLocation}</div>
                    </div>
                    {project.bookingId && (
                      <div>
                        <span className="text-gray-600">Booking ID:</span>
                        <div className="font-medium font-mono text-xs">{project.bookingId}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Team & Resources */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <User size={16} className="mr-2" />
                    Assignment
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Company:</span>
                      <div className="font-medium">{companyName}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Driver:</span>
                      <div className="font-medium">{driverName}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Vehicle:</span>
                      <div className="font-medium flex items-center">
                        <Car size={14} className="mr-1" />
                        {carTypeName}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client & Payment */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <DollarSign size={16} className="mr-2" />
                    Client & Payment
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Client:</span>
                      <div className="font-medium">{project.clientName}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Price:</span>
                      <div className="font-medium">${project.price.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ml-1 ${paymentColors[project.paymentStatus as keyof typeof paymentColors] || paymentColors.pending}`}>
                        {project.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {project.description && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-700 bg-white p-3 rounded-xl border">
                    {project.description}
                  </p>
                </div>
              )}

              {/* Progress Metrics */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Clock size={16} className="mr-2" />
                  Status Information
                </h4>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${project.status === 'active' ? 'bg-green-500' : project.status === 'completed' ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                    <span>Status: {project.status}</span>
                  </div>
                  {isUpcoming && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      Upcoming
                    </span>
                  )}
                  {isUrgent && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                      Requires Attention
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={(e) => { e.stopPropagation(); onAction('view'); }}
                  className="flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors shadow-sm hover:shadow-md"
                >
                  <Eye size={14} className="mr-1" />
                  View
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onAction('edit'); }}
                  className="flex items-center px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors shadow-sm hover:shadow-md"
                >
                  <Edit size={14} className="mr-1" />
                  Edit
                </button>
                {project.status === 'active' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onAction('start'); }}
                    className="flex items-center px-3 py-1.5 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors shadow-sm hover:shadow-md"
                  >
                    <Play size={14} className="mr-1" />
                    Start Trip
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); onAction('voucher'); }}
                  className="flex items-center px-3 py-1.5 text-sm bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors shadow-sm hover:shadow-md"
                >
                  <Receipt size={14} className="mr-1" />
                  Voucher
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onAction('delete'); }}
                  className="flex items-center px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors shadow-sm hover:shadow-md"
                >
                  <Trash2 size={14} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function ProjectListView({
  projects,
  companies,
  drivers,
  carTypes,
  onProjectAction,
  getCompanyName,
  getDriverName,
  getCarTypeName,
  getCompanyTheme
}: ProjectListViewProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [expandAll, setExpandAll] = useState(false);

  const toggleExpanded = useCallback((projectId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  }, []);

  const toggleExpandAll = useCallback(() => {
    if (expandAll) {
      setExpandedItems(new Set());
    } else {
      setExpandedItems(new Set(projects.map(p => p.id)));
    }
    setExpandAll(!expandAll);
  }, [expandAll, projects]);

  const getProjectUrgency = useCallback((project: Project) => {
    const projectDate = new Date(`${project.date} ${project.time}`);
    const now = new Date();
    const hoursUntil = (projectDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return {
      isUpcoming: hoursUntil > 0 && hoursUntil <= 24,
      isUrgent: hoursUntil > 0 && hoursUntil <= 2
    };
  }, []);

  // Group projects by date and sort
  const groupedProjects = useMemo(() => {
    const groups: Record<string, Project[]> = {};
    
    projects.forEach(project => {
      const dateKey = project.date;
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(project);
    });

    // Sort projects within each date group by time
    Object.keys(groups).forEach(date => {
      groups[date].sort((a, b) => {
        const timeA = a.time || '00:00';
        const timeB = b.time || '00:00';
        return timeA.localeCompare(timeB);
      });
    });

    // Sort dates
    const sortedDates = Object.keys(groups).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });

    return sortedDates.map(date => ({
      date,
      projects: groups[date]
    }));
  }, [projects]);

  const formatDateHeader = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  }, []);

  const getDateStatus = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    if (date < today) return 'past';
    if (date.getTime() === today.getTime()) return 'today';
    if (date.getTime() === today.getTime() + 24 * 60 * 60 * 1000) return 'tomorrow';
    return 'future';
  }, []);

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Calendar size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
        <p className="text-gray-600">Start by creating your first transportation project.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* List Controls */}
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl shadow-sm">
        <div className="text-sm text-gray-600">
          {projects.length} project{projects.length !== 1 ? 's' : ''} found across {groupedProjects.length} date{groupedProjects.length !== 1 ? 's' : ''}
        </div>
        <button
          onClick={toggleExpandAll}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          {expandAll ? 'Collapse All' : 'Expand All'}
        </button>
      </div>
      {/* Project List Grouped by Date */}
      <div className="space-y-6">
        {groupedProjects.map(({ date, projects: dateProjects }) => {
          const dateStatus = getDateStatus(date);
          
          return (
            <div key={date} className="space-y-3">
              {/* Date Header */}
              <div className="sticky top-0 z-10 backdrop-blur-sm bg-gradient-to-r from-[#2b819e] to-[#3a94b5] rounded-2xl shadow-lg border border-white/20 p-6 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-[#f2f4f7] text-[19px]">
                      {formatDateHeader(date)}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      dateStatus === 'today' ? 'bg-blue-100 text-blue-800' : 
                      dateStatus === 'tomorrow' ? 'bg-orange-100 text-orange-800' : 
                      dateStatus === 'past' ? 'bg-gray-100 text-gray-600' : 'bg-gray-50 text-gray-700'
                    }`}>
                      {dateProjects.length} trip{dateProjects.length !== 1 ? 's' : ''}
                    </span>
                    {dateStatus === 'today' && (
                      <span className="flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                      </span>
                    )}
                  </div>
                  <div className="text-[#fafbff] text-[18px]">
                    {new Date(date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              {/* Projects for this date */}
              <div className="space-y-2">
                {dateProjects.map((project) => {
                  const { isUpcoming, isUrgent } = getProjectUrgency(project);
                  
                  return (
                    <ProjectListItem
                      key={project.id}
                      project={project}
                      companyName={getCompanyName(project.company)}
                      driverName={getDriverName(project.driver)}
                      carTypeName={getCarTypeName(project.carType)}
                      colorTheme={getCompanyTheme(project.company)}
                      isExpanded={expandedItems.has(project.id)}
                      onToggle={() => toggleExpanded(project.id)}
                      onAction={(action) => onProjectAction(project.id, action)}
                      isUpcoming={isUpcoming}
                      isUrgent={isUrgent}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}