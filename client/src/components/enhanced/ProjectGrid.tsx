import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  Search, 
  SortAsc, 
  Calendar,
  MapPin,
  Users,
  Building2,
  X,
  ChevronDown,
  Clock,
  AlertCircle
} from 'lucide-react';
import ProjectCard from './ProjectCard';

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

interface ProjectGridProps {
  projects: Project[];
  companies: Array<{ id: string; name: string }>;
  drivers: Array<{ id: string; name: string }>;
  carTypes: Array<{ id: string; name: string }>;
  onProjectAction: (projectId: string, action: string) => void;
  getCompanyName: (id: string) => string;
  getDriverName: (id: string) => string;
  getCarTypeName: (id: string) => string;
  getCompanyTheme: (companyId: string) => string;
  startedProjects?: Set<string>;
  cardSettings?: {
    collapsible: boolean;
    defaultExpanded: boolean;
  };
}

// Memoized Project Card wrapper
const MemoizedProjectCard = React.memo(ProjectCard);

export default function ProjectGrid({
  projects,
  companies,
  drivers,
  carTypes,
  onProjectAction,
  getCompanyName,
  getDriverName,
  getCarTypeName,
  getCompanyTheme,
  cardSettings = { collapsible: false, defaultExpanded: true }
}: ProjectGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'client'>('date');
  const [showFilters, setShowFilters] = useState(false);

  // Calculate urgency for projects
  const getProjectUrgency = React.useCallback((project: Project) => {
    const now = new Date();
    const projectDateTime = new Date(`${project.date}T${project.time}`);
    const diffMinutes = Math.floor((projectDateTime.getTime() - now.getTime()) / (1000 * 60));
    
    return {
      isUpcoming: diffMinutes > 0 && diffMinutes <= 24 * 60, // Within 24 hours
      isUrgent: diffMinutes > 0 && diffMinutes <= 2 * 60, // Within 2 hours
      timeUntil: diffMinutes
    };
  }, []);

  // Filter and sort projects - Optimized with useMemo
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = searchQuery === '' || 
        project.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.dropoffLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.bookingId && project.bookingId.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCompany = selectedCompany === '' || project.company === selectedCompany;
      
      return matchesSearch && matchesCompany;
    });

    // Sort projects by date and time
    filtered.sort((a, b) => {
      const aDateTime = new Date(`${a.date}T${a.time}`).getTime();
      const bDateTime = new Date(`${b.date}T${b.time}`).getTime();
      return aDateTime - bDateTime;
    });

    return filtered;
  }, [projects, searchQuery, selectedCompany, sortBy]);

  // Group projects by date, then by urgency within each date - Optimized
  const groupedProjectsByDate = useMemo(() => {
    const groups: { [date: string]: { urgent: Project[], upcoming: Project[], regular: Project[] } } = {};

    filteredAndSortedProjects.forEach(project => {
      const dateKey = project.date;
      
      if (!groups[dateKey]) {
        groups[dateKey] = { urgent: [], upcoming: [], regular: [] };
      }

      const urgency = getProjectUrgency(project);
      if (urgency.isUrgent) {
        groups[dateKey].urgent.push(project);
      } else if (urgency.isUpcoming) {
        groups[dateKey].upcoming.push(project);
      } else {
        groups[dateKey].regular.push(project);
      }
    });

    // Sort dates
    const sortedDates = Object.keys(groups).sort((a, b) => 
      new Date(a).getTime() - new Date(b).getTime()
    );

    return { groups, sortedDates };
  }, [filteredAndSortedProjects, getProjectUrgency]);

  const clearFilters = React.useCallback(() => {
    setSearchQuery('');
    setSelectedCompany('');
    setSortBy('date');
  }, []);

  // Helper function to format date for display
  const formatDateHeader = React.useCallback((dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    if (isToday) {
      return {
        main: 'Today',
        sub: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
        color: 'from-blue-600 to-blue-800',
        bgColor: 'from-blue-50 to-blue-100'
      };
    } else if (isTomorrow) {
      return {
        main: 'Tomorrow',
        sub: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
        color: 'from-green-600 to-green-800',
        bgColor: 'from-green-50 to-green-100'
      };
    } else {
      return {
        main: date.toLocaleDateString('en-US', { weekday: 'long' }),
        sub: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        color: 'from-slate-600 to-slate-800',
        bgColor: 'from-slate-50 to-slate-100'
      };
    }
  }, []);

  // Calculate total projects count
  const totalProjectsCount = filteredAndSortedProjects.length;

  return (
    <div className="space-y-6 will-change-scroll">
      {/* Enhanced Filter Bar - Optimized */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects, clients, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  showFilters || selectedCompany 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {(searchQuery || selectedCompany) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-slate-200 bg-slate-50"
            >
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Building2 className="w-4 h-4 inline mr-1" />
                    Company
                  </label>
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Companies</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <SortAsc className="w-4 h-4 inline mr-1" />
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'price' | 'client')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date">Date & Time</option>
                    <option value="price">Price (High to Low)</option>
                    <option value="client">Client Name</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">{totalProjectsCount}</span> projects found
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Projects Grouped by Date - Optimized with sticky headers positioned correctly */}
      <div className="space-y-10">
        {groupedProjectsByDate.sortedDates.map((dateKey, dateIndex) => {
          const dateGroup = groupedProjectsByDate.groups[dateKey];
          const dateInfo = formatDateHeader(dateKey);
          const totalProjectsOnDate = dateGroup.urgent.length + dateGroup.upcoming.length + dateGroup.regular.length;
          
          return (
            <motion.section
              key={dateKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dateIndex * 0.05, duration: 0.3 }}
              className="space-y-6"
            >
              {/* Sticky Date Header - Fixed positioning to avoid overlap */}
              <div className="sticky top-20 z-50 pb-4">
                <div className={`bg-gradient-to-r ${dateInfo.bgColor} rounded-2xl border-2 border-white shadow-xl overflow-hidden backdrop-blur-sm bg-opacity-95`}>
                  <div className={`bg-gradient-to-r ${dateInfo.color} p-6`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                          <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-white mb-1">
                            {dateInfo.main}
                          </h2>
                          <p className="text-white/90 text-lg">
                            {dateInfo.sub}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                          <span className="text-2xl font-bold text-white">{totalProjectsOnDate}</span>
                          <p className="text-white/90 text-sm">trip{totalProjectsOnDate !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Urgent Projects for this date */}
              {dateGroup.urgent.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-red-700">Urgent - Starting Soon</h3>
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                      {dateGroup.urgent.length} trip{dateGroup.urgent.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 optimized-grid">
                    {dateGroup.urgent.map((project, index) => (
                      <div key={project.id} className="will-change-transform">
                        <MemoizedProjectCard
                          project={project}
                          companyName={getCompanyName(project.company)}
                          driverName={getDriverName(project.driver)}
                          carTypeName={getCarTypeName(project.carType)}
                          colorTheme={getCompanyTheme(project.company)}
                          isUpcoming={true}
                          isUrgent={true}
                          onEdit={() => onProjectAction(project.id, 'edit')}
                          onView={() => onProjectAction(project.id, 'view')}
                          onDelete={() => onProjectAction(project.id, 'delete')}
                          onStart={() => onProjectAction(project.id, 'start')}
                          onVoucher={() => onProjectAction(project.id, 'voucher')}
                          isCollapsible={cardSettings.collapsible}
                          defaultExpanded={cardSettings.defaultExpanded}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Projects for this date */}
              {dateGroup.upcoming.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-bold text-orange-700">Upcoming Soon</h3>
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                      {dateGroup.upcoming.length} trip{dateGroup.upcoming.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 optimized-grid">
                    {dateGroup.upcoming.map((project, index) => (
                      <div key={project.id} className="will-change-transform">
                        <MemoizedProjectCard
                          project={project}
                          companyName={getCompanyName(project.company)}
                          driverName={getDriverName(project.driver)}
                          carTypeName={getCarTypeName(project.carType)}
                          colorTheme={getCompanyTheme(project.company)}
                          isUpcoming={true}
                          onEdit={() => onProjectAction(project.id, 'edit')}
                          onView={() => onProjectAction(project.id, 'view')}
                          onDelete={() => onProjectAction(project.id, 'delete')}
                          onStart={() => onProjectAction(project.id, 'start')}
                          onVoucher={() => onProjectAction(project.id, 'voucher')}
                          isCollapsible={cardSettings.collapsible}
                          defaultExpanded={cardSettings.defaultExpanded}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Projects for this date */}
              {dateGroup.regular.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-slate-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700">Scheduled</h3>
                    <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm font-medium">
                      {dateGroup.regular.length} trip{dateGroup.regular.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 optimized-grid">
                    {dateGroup.regular.map((project, index) => (
                      <div key={project.id} className="will-change-transform">
                        <MemoizedProjectCard
                          project={project}
                          companyName={getCompanyName(project.company)}
                          driverName={getDriverName(project.driver)}
                          carTypeName={getCarTypeName(project.carType)}
                          colorTheme={getCompanyTheme(project.company)}
                          onEdit={() => onProjectAction(project.id, 'edit')}
                          onView={() => onProjectAction(project.id, 'view')}
                          onDelete={() => onProjectAction(project.id, 'delete')}
                          onStart={() => onProjectAction(project.id, 'start')}
                          onVoucher={() => onProjectAction(project.id, 'voucher')}
                          isCollapsible={cardSettings.collapsible}
                          defaultExpanded={cardSettings.defaultExpanded}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>
          );
        })}

        {/* No Results */}
        {totalProjectsCount === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No projects found</h3>
            <p className="text-slate-600 mb-6">
              {searchQuery || selectedCompany 
                ? "Try adjusting your search or filters" 
                : "Create your first project to get started"}
            </p>
            {(searchQuery || selectedCompany) && (
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}