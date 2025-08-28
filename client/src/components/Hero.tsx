import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Modal from './Modal';
import LoginForm from './auth/LoginForm';
import SignUpForm from './auth/SignUpForm';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Play, MapPin, BarChart3, Users, Shield, Check, MessageCircle } from 'lucide-react';

export default function Hero() {
  const { currentUser } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  // Animation refs
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate features showcase
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    if (!currentUser) {
      setShowSignUpModal(true);
    }
  };

  // Text animation variants
  const headingVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  const paragraphVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        delay: 0.2,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        delay: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 1,
        delay: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const features = [
    {
      title: "Dashboard Overview",
      description: "Complete business analytics with real-time performance metrics, revenue tracking, and quick actions",
      image: "/Screenshot 2025-06-23 at 19.13.21.png",
      highlight: "Real-time Analytics"
    },
    {
      title: "Driver Portal", 
      description: "Dedicated interface for drivers with priority trips, detailed bookings, navigation, and earnings tracking",
      image: "/Screenshot 2025-06-23 at 19.16.01 copy.png",
      highlight: "Driver Experience"
    },
    {
      title: "Location Analytics",
      description: "Advanced geolocation insights with comprehensive trip management, heat map visualization, and popular destination tracking",
      image: "/Screenshot 2025-06-23 at 19.31.12.png",
      highlight: "Smart Analytics"
    }
  ];

  return (
    <div className="relative min-h-[95vh] pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Enhanced decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[15%] w-[60%] h-[60%] rounded-full bg-gradient-to-r from-green-100 to-emerald-100 blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-[30%] right-[0%] w-[50%] h-[60%] rounded-full bg-gradient-to-l from-blue-100 to-cyan-100 blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-gradient-to-br from-purple-100 to-pink-100 blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-[15%] left-[10%] w-20 h-20 border border-green-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[30%] right-[15%] w-16 h-16 bg-blue-200 rounded-lg opacity-20 transform rotate-45 animate-bounce"></div>
        <div className="absolute top-[60%] left-[5%] w-12 h-12 bg-purple-200 rounded-full opacity-25 animate-ping"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }}
            className="relative z-10"
          >
            <motion.h1 
              variants={headingVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
            >
              Simplify Dispatching and{' '}
              <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent animate-pulse">
                Manage Rides Effortlessly
              </span>
            </motion.h1>
            
            <motion.p 
              variants={paragraphVariants}
              className="mt-6 text-xl text-gray-700 leading-relaxed max-w-2xl"
            >
              Never miss any rides. Keep your bookings, drivers, and clients perfectly organized with our comprehensive transportation management platform.
              <span className="block mt-2 text-lg text-gray-600 font-medium">
                ✨ Trusted by 500+ transportation companies worldwide
              </span>
            </motion.p>

            {/* Enhanced Key Features List */}
            <motion.div
              variants={paragraphVariants}
              className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {[
                { icon: BarChart3, text: "Real-time Analytics", color: "from-blue-500 to-cyan-500" },
                { icon: Users, text: "Driver Management", color: "from-purple-500 to-pink-500" },
                { icon: MapPin, text: "Location Insights", color: "from-green-500 to-emerald-500" },
                { icon: Shield, text: "Secure & Reliable", color: "from-orange-500 to-red-500" }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div 
                    key={index} 
                    className="flex items-center space-x-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`bg-gradient-to-r ${feature.color} p-2.5 rounded-lg shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-800 text-sm font-semibold">{feature.text}</span>
                  </motion.div>
                );
              })}
            </motion.div>
            
            {currentUser ? (
              <motion.div variants={buttonVariants}>
                <Link to="/dashboard" className="mt-8 inline-block">
                  <button className="bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                    Go to Dashboard
                  </button>
                </Link>
              </motion.div>
            ) : (
              <motion.div 
                variants={buttonVariants}
                className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
              >
                <motion.button
                  onClick={() => setShowSignUpModal(true)}
                  className="relative bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:shadow-green-500/25 transition-all duration-300 flex items-center justify-center group overflow-hidden"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Play className="w-6 h-6 mr-3 relative z-10 group-hover:animate-pulse" />
                  <span className="relative z-10">Get Started Free</span>
                  <div className="absolute top-0 right-0 w-8 h-8 bg-white/20 rounded-full transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                </motion.button>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/contact"
                    className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-700 px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-white hover:border-gray-300 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl group"
                  >
                    <MessageCircle className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                    Suggest Features
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
          
          <motion.div 
            className="mt-12 lg:mt-0 relative"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Increased padding to accommodate floating elements better */}
            <div className="relative px-12 py-12">
              {/* Feature showcase container */}
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Feature tabs */}
                <div className="flex bg-gray-50 border-b border-gray-200">
                  {features.map((feature, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveFeature(index)}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeFeature === index
                          ? 'text-green-600 bg-white border-b-2 border-green-500'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {feature.highlight}
                    </button>
                  ))}
                </div>

                {/* Feature content */}
                <div className="relative h-80 sm:h-96">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: activeFeature === index ? 1 : 0,
                        scale: activeFeature === index ? 1 : 0.95
                      }}
                      transition={{ duration: 0.5 }}
                      className={`absolute inset-0 ${activeFeature === index ? 'z-10' : 'z-0'}`}
                    >
                      <div className="h-full flex flex-col">
                        <div className="flex-1 relative overflow-hidden">
                          <img
                            src={feature.image}
                            alt={feature.title}
                            className="w-full h-full object-cover object-top"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                        </div>
                        <div className="p-4 bg-white">
                          <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Progress indicators */}
                <div className="absolute bottom-20 left-4 flex space-x-2">
                  {features.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        activeFeature === index ? 'bg-green-500' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Enhanced floating elements with glassmorphism - repositioned to avoid overlap */}
              <motion.div 
                className="absolute -top-12 -right-12 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-5 z-40 hidden sm:block max-w-[220px] border border-white/20"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, -5, 0],
                  scale: 1
                }}
                transition={{ 
                  delay: 0.6, 
                  duration: 0.8,
                  y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900">99 Locations</p>
                    <p className="text-xs text-gray-600 font-medium">90 Total Trips</p>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                      <span className="text-xs text-green-600 font-semibold">Live</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-20 -left-16 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-5 z-40 hidden sm:block max-w-[260px] border border-white/20"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, 5, 0],
                  scale: 1
                }}
                transition={{ 
                  delay: 0.9, 
                  duration: 0.8,
                  y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900">Top Pickup: Trieste Port</p>
                    <p className="text-xs text-gray-600 font-medium">Top Dropoff: Venice</p>
                    <div className="flex items-center mt-1 space-x-1">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">Trending</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        </div>
      
      {/* Login Modal */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Login"
      >
        <LoginForm 
          onSuccess={() => {
            setShowLoginModal(false);
          }} 
        />
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => {
                setShowLoginModal(false);
                setShowSignUpModal(true);
              }}
              className="text-green-600 hover:text-green-700 hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </Modal>

      {/* Sign Up Modal */}
      <Modal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        title="Sign Up"
      >
        <SignUpForm 
          onSuccess={() => {
            setShowSignUpModal(false);
          }} 
        />
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => {
                setShowSignUpModal(false);
                setShowLoginModal(true);
              }}
              className="text-green-600 hover:text-green-700 hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </Modal>
    </div>
  );
}