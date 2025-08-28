import React, { useState } from 'react';
import { 
  Home, 
  BarChart2, 
  Users, 
  Settings, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  Bell, 
  Search, 
  ChevronRight, 
  Menu, 
  X, 
  LogOut, 
  User
} from 'lucide-react';

export default function UIDesignMockup() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans antialiased">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 flex flex-col transition-all duration-300 ease-in-out bg-white border-r shadow-sm ${
          isExpanded ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className={`flex items-center space-x-3 ${isExpanded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
            <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg">
              <span className="text-indigo-600 font-bold text-lg">M</span>
            </div>
            <h1 className="text-lg font-medium text-gray-800">Mockup</h1>
          </div>
          <button 
            onClick={toggleSidebar} 
            className={`rounded-lg p-1.5 hover:bg-gray-100 transition-colors duration-200 ${isExpanded ? 'ml-auto' : 'mx-auto'}`}
          >
            {isExpanded ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                  activeItem === item.id
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-100'
                } ${isExpanded ? 'justify-start' : 'justify-center'}`}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className={`ml-3 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 absolute'}`}>
                  {item.label}
                </span>
                {activeItem === item.id && !isExpanded && (
                  <div className="absolute left-0 w-1 h-8 bg-indigo-600 rounded-r-md"></div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t">
          <button className={`flex items-center w-full p-3 text-red-500 rounded-lg hover:bg-red-50 transition-all duration-200 ${
            isExpanded ? 'justify-start' : 'justify-center'
          }`}>
            <LogOut size={20} />
            <span className={`ml-3 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 absolute'}`}>
              Logout
            </span>
          </button>
          
          <div className={`mt-4 flex items-center p-2 ${isExpanded ? 'justify-start' : 'justify-center'}`}>
            <div className="flex-shrink-0 relative">
              <img
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80"
                alt="User avatar"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div className={`ml-3 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 absolute'}`}>
              <p className="text-sm font-medium text-gray-700">Alex Morgan</p>
              <p className="text-xs text-gray-500">Product Designer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-medium text-gray-800">Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200 w-64"
              />
            </div>
            
            <button className="relative p-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80"
                alt="User avatar"
              />
              <ChevronRight size={16} className="text-gray-500" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome back, Alex</h2>
            <p className="text-gray-600">Here's what's happening with your projects today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Customers', value: '3,254', change: '+5.2%', color: 'bg-blue-50 text-blue-600' },
              { label: 'Revenue', value: '$15,342', change: '+8.1%', color: 'bg-green-50 text-green-600' },
              { label: 'Pending Tasks', value: '24', change: '-2.4%', color: 'bg-amber-50 text-amber-600' },
              { label: 'Support Tickets', value: '12', change: '-18.3%', color: 'bg-purple-50 text-purple-600' },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-gray-500 text-sm">{stat.label}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${stat.color}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Activity & Projects Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
                  View All
                </button>
              </div>
              
              <div className="space-y-5">
                {[
                  { 
                    icon: Users, 
                    color: 'bg-blue-100 text-blue-600',
                    title: 'New client onboarded',
                    desc: 'Globex Corporation',
                    time: '2 hours ago' 
                  },
                  { 
                    icon: MessageSquare, 
                    color: 'bg-green-100 text-green-600',
                    title: 'New message received',
                    desc: 'From Sarah Johnson',
                    time: '5 hours ago'
                  },
                  { 
                    icon: Calendar,
                    color: 'bg-purple-100 text-purple-600',
                    title: 'Meeting scheduled',
                    desc: 'Project kick-off at 10:00 AM',
                    time: 'Yesterday'
                  },
                ].map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start">
                      <div className={`p-2 rounded-lg ${activity.color} mr-4`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.desc}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Projects Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Current Projects</h3>
                <div className="flex space-x-2">
                  <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>All Projects</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                  <button className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                    + New
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  {
                    name: 'Website Redesign',
                    client: 'Acme Inc.',
                    progress: 75,
                    status: 'In Progress',
                    statusColor: 'bg-amber-100 text-amber-700',
                  },
                  {
                    name: 'Mobile App Development',
                    client: 'SkyNet Technologies',
                    progress: 32,
                    status: 'In Progress',
                    statusColor: 'bg-amber-100 text-amber-700',
                  },
                  {
                    name: 'Marketing Campaign',
                    client: 'Globex Corporation',
                    progress: 100,
                    status: 'Completed',
                    statusColor: 'bg-green-100 text-green-700',
                  },
                  {
                    name: 'Product Launch',
                    client: 'Stark Industries',
                    progress: 18,
                    status: 'In Progress',
                    statusColor: 'bg-amber-100 text-amber-700',
                  },
                ].map((project, index) => (
                  <div key={index} className="p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow duration-200">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{project.name}</h4>
                        <p className="text-sm text-gray-600">{project.client}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${project.statusColor}`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-600">Progress</span>
                        <span className="text-xs font-medium text-gray-900">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-indigo-600 h-1.5 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex -space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <img
                            key={i}
                            className="w-7 h-7 rounded-full border-2 border-white object-cover"
                            src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000}?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=48&h=48&q=80`}
                            alt={`Team member ${i + 1}`}
                          />
                        ))}
                        <span className="flex items-center justify-center w-7 h-7 text-xs font-medium text-gray-600 bg-gray-100 rounded-full border-2 border-white">
                          +2
                        </span>
                      </div>
                      <button className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Upcoming Schedule</h3>
              <div className="flex space-x-2">
                <button className="text-sm px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                  Today
                </button>
                <button className="text-sm px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  Week
                </button>
                <button className="text-sm px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  Month
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  time: '09:00 - 10:30',
                  title: 'Weekly Team Meeting',
                  location: 'Conference Room A',
                  color: 'border-blue-400'
                },
                { 
                  time: '12:00 - 13:30',
                  title: 'Lunch with Clients',
                  location: 'Downtown Bistro',
                  color: 'border-amber-400'
                },
                { 
                  time: '15:00 - 16:00',
                  title: 'Project Review',
                  location: 'Virtual Meeting',
                  color: 'border-green-400'
                },
              ].map((event, index) => (
                <div 
                  key={index} 
                  className={`border-l-4 ${event.color} bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200`}
                >
                  <p className="text-sm font-semibold text-gray-600">{event.time}</p>
                  <h4 className="font-medium text-gray-900 mt-1">{event.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="inline-flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </span>
                  </p>
                  <div className="mt-4 flex items-center">
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <img
                          key={i}
                          className="w-6 h-6 rounded-full border-2 border-white object-cover"
                          src={`https://images.unsplash.com/photo-${1500000000000 + i * 1500}?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=48&h=48&q=80`}
                          alt={`Attendee ${i + 1}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-xs text-gray-500">+2 others</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}