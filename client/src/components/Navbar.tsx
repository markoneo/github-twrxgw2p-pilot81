import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, Settings, Building2, Users, LogIn, UserPlus, BarChart2, Menu, X, Bell, DollarSign, FileText, Truck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Modal from './Modal';
import LoginForm from './auth/LoginForm';
import SignUpForm from './auth/SignUpForm';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const { currentUser, logout } = useAuth();
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  
  const isDashboard = location.pathname.includes('/dashboard') || 
                     location.pathname.includes('/new-project') || 
                     location.pathname.includes('/edit-project') ||
                     location.pathname.includes('/settings');
  const isCompletedProjects = location.pathname === '/completed-projects';
  const isFinancialReport = location.pathname === '/financial-report';

  // Close menus when location changes
  useEffect(() => {
    setShowMobileMenu(false);
    setShowSettings(false);
  }, [location.pathname]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      navigate('/');
    }
  };

  // Handle mobile menu toggle with better touch handling
  const handleMobileMenuToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMobileMenu(prev => !prev);
  };

  // Handle settings toggle
  const handleSettingsToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSettings(prev => !prev);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white z-40 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and site title */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Car className="h-7 w-7 text-green-500" />
              <span className="ml-2 text-xl font-semibold">RidePilot</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button
            onClick={handleMobileMenuToggle}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 active:bg-gray-200"
            aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
            type="button"
          >
            {showMobileMenu ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {isCompletedProjects || isFinancialReport ? (
              <Link 
                to="/dashboard" 
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                Back to Dashboard
              </Link>
            ) : isDashboard ? (
              currentUser ? (
              <>
                {/* Primary Navigation Group */}
                <div className="flex items-center space-x-1 mr-6">
                  <Link 
                    to="/dashboard" 
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/statistics" 
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center"
                  >
                    <BarChart2 className="w-4 h-4 mr-2" />
                    Statistics
                  </Link>
                  <Link 
                    to="/financial-report" 
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Reports
                  </Link>
                </div>

                {/* Secondary Navigation Group */}
                <div className="flex items-center space-x-1 mr-6">
                  <Link 
                    to="/completed-projects" 
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  >
                    Projects
                  </Link>
                  <Link 
                    to="/driver" 
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center"
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Driver Portal
                  </Link>
                </div>

                {/* Action Buttons Group */}
                <div className="flex items-center space-x-2">
                  <Link 
                    to="/settings/payments" 
                    className="px-3 py-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all duration-200 flex items-center font-medium"
                  >
                    <DollarSign className="w-4 h-4 mr-1" />
                    Payments
                  </Link>
                  
                  <div className="h-6 w-px bg-gray-200 mx-2"></div>
                  
                  <Link 
                    to="/settings/notifications" 
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                  </Link>
                  
                  <button
                    onClick={handleSettingsToggle}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
                    title="Settings"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => setShowSignUpModal(true)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </button>
                </div>
              )
            ) : (
              <>
                <div className="flex items-center space-x-1 mr-6">
                  <Link 
                    to="/" 
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  >
                    Home
                  </Link>
                  <Link 
                    to="/about" 
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  >
                    About
                  </Link>
                  <Link 
                    to="/pricing" 
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  >
                    Pricing
                  </Link>
                  <Link 
                    to="/driver" 
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 flex items-center font-medium"
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Driver Portal
                  </Link>
                </div>
                {!currentUser && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => setShowSignUpModal(true)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </button>
                </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {isCompletedProjects || isFinancialReport ? (
              <Link 
                to="/dashboard" 
                className="block px-3 py-3 text-base text-gray-700 rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                Back to Dashboard
              </Link>
            ) : isDashboard ? (
              currentUser && (
                <>
                  <Link 
                    to="/dashboard" 
                    className="block px-3 py-3 text-base text-gray-700 rounded-md"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/statistics"
                    className="block px-3 py-3 text-base text-gray-700 rounded-md"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Statistics
                  </Link>
                  <Link 
                    to="/financial-report"
                    className="block px-3 py-3 text-base text-gray-700 rounded-md"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Financial Report
                  </Link>
                  <Link 
                    to="/completed-projects" 
                    className="block px-3 py-3 text-base text-gray-700 rounded-md"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Completed Projects
                  </Link>
                  <Link 
                    to="/driver" 
                    className="block px-3 py-3 text-base text-gray-700 rounded-md"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Driver Portal
                  </Link>
                  <button
                    onClick={() => {
                      setShowSettings(true);
                      setShowMobileMenu(false);
                    }}
                    className="block w-full text-left px-3 py-3 text-base text-gray-700 rounded-md"
                  >
                    Settings
                  </button>
                  <Link
                    to="/settings/payments" 
                    className="block px-3 py-3 text-base text-gray-700 rounded-md"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Payments
                  </Link>
                  <button
                    onClick={(e) => {
                      handleLogout(e);
                      setShowMobileMenu(false);
                    }}
                    className="block w-full text-left px-3 py-3 text-base text-gray-700 rounded-md"
                  >
                    Logout
                  </button>
                </>
              )
            ) : (
              <>
                <Link 
                  to="/" 
                  className="block px-3 py-3 text-base text-gray-700 rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className="block px-3 py-3 text-base text-gray-700 rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                >
                  About
                </Link>
                <Link 
                  to="/pricing" 
                  className="block px-3 py-3 text-base text-gray-700 rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Pricing
                </Link>
                <Link 
                  to="/driver" 
                  className="block px-3 py-3 text-base text-gray-700 rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Driver Portal
                </Link>
                {!currentUser && (
                  <div className="pt-4 pb-3 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setShowLoginModal(true);
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex justify-center px-4 py-3 text-base rounded-md border border-gray-300 text-gray-700 bg-white"
                    >
                      <LogIn className="w-5 h-5 mr-3" />
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setShowSignUpModal(true);
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex justify-center px-4 py-3 text-base rounded-md bg-green-500 text-white mt-3"
                    >
                      <UserPlus className="w-5 h-5 mr-3" />
                      Sign Up
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Settings side panel */}
      {showSettings && isDashboard && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-25"
          onClick={() => setShowSettings(false)}
        >
          <div 
            className="absolute right-0 top-16 w-3/4 max-w-xs bg-white h-screen shadow-xl overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 space-y-4">
              <h3 className="font-medium text-lg text-gray-900">Settings</h3>
              
              <Link
                to="/settings/companies"
                className="flex items-center p-3 rounded-md hover:bg-gray-50"
                onClick={() => setShowSettings(false)}
              >
                <Building2 className="w-5 h-5 text-green-500 mr-3" />
                <span>Companies</span>
              </Link>
              
              <Link
                to="/settings/car-types"
                className="flex items-center p-3 rounded-md hover:bg-gray-50"
                onClick={() => setShowSettings(false)}
              >
                <Car className="w-5 h-5 text-green-500 mr-3" />
                <span>Car Types</span>
              </Link>
              
              <Link
                to="/settings/drivers"
                className="flex items-center p-3 rounded-md hover:bg-gray-50"
                onClick={() => setShowSettings(false)}
              >
                <Users className="w-5 h-5 text-green-500 mr-3" />
                <span>Drivers</span>
              </Link>
              
              <Link
                to="/settings/payments"
                className="flex items-center p-3 rounded-md hover:bg-gray-50"
                onClick={() => setShowSettings(false)}
              >
                <DollarSign className="w-5 h-5 text-green-500 mr-3" />
                <span>Payments</span>
              </Link>
              
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setShowSettings(false);
                    handleLogout({ preventDefault: () => {} });
                  }}
                  className="flex items-center p-3 rounded-md hover:bg-gray-50 text-red-600 w-full text-left"
                >
                  <LogIn className="w-5 h-5 mr-3 transform rotate-180" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modals */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Login"
      >
        <LoginForm onSuccess={() => setShowLoginModal(false)} />
      </Modal>

      <Modal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        title="Sign Up"
      >
        <SignUpForm onSuccess={() => setShowSignUpModal(false)} />
      </Modal>
    </nav>
  );
}