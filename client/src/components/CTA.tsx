import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Modal from './Modal';
import LoginForm from './auth/LoginForm';
import SignUpForm from './auth/SignUpForm';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Play, ArrowRight, Users, Clock, TrendingUp, Shield, MessageCircle } from 'lucide-react';

export default function CTA() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  
  // Set up animations
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Start animations when section comes into view
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const buttonVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.4)",
      transition: {
        duration: 0.3
      }
    },
    tap: {
      scale: 0.98
    }
  };

  // Background movement effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-[95vh] py-24 sm:py-32 overflow-hidden bg-gradient-to-br from-gray-900 via-green-900 to-blue-900">
      {/* Enhanced animated background elements */}
      <motion.div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div className="absolute -top-[40%] -left-[15%] w-[60%] h-[60%] rounded-full bg-gradient-to-r from-green-400/30 to-emerald-400/30 blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute -bottom-[30%] right-[0%] w-[50%] h-[60%] rounded-full bg-gradient-to-l from-blue-400/30 to-cyan-400/30 blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-gradient-to-br from-purple-400/30 to-pink-400/30 blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        
        {/* Interactive elements */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-green-400/20 mix-blend-multiply filter blur-3xl"
          animate={{
            x: mousePosition.x * 0.01,
            y: mousePosition.y * 0.01,
          }}
          transition={{ type: "spring", damping: 50, stiffness: 100 }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-blue-400/20 mix-blend-multiply filter blur-3xl"
          animate={{
            x: mousePosition.x * -0.01,
            y: mousePosition.y * -0.01,
          }}
          transition={{ type: "spring", damping: 50, stiffness: 100 }}
        />
        
        {/* Geometric shapes */}
        <div className="absolute top-[15%] left-[10%] w-20 h-20 border border-green-300/30 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute bottom-[30%] right-[15%] w-16 h-16 bg-blue-300/30 rounded-lg opacity-40 transform rotate-45 animate-bounce"></div>
        <div className="absolute top-[60%] left-[5%] w-12 h-12 bg-purple-300/30 rounded-full opacity-50 animate-ping"></div>
      </motion.div>
      
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
      >
        <motion.div 
          variants={itemVariants}
          className="mb-4"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-400/20 text-green-300 backdrop-blur-sm">
            <Play className="w-4 h-4 mr-2" />
            Ready to transform your business
          </span>
        </motion.div>
        
        <motion.h2 
          variants={itemVariants}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white"
        >
          Ready to simplify your{' '}
          <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            transportation management?
          </span>
        </motion.h2>
        
        <motion.p 
          variants={itemVariants}
          className="mt-6 text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto"
        >
          Join thousands of professionals who have streamlined their operations with RidePilot.
          Our all-in-one solution helps you manage your entire fleet with ease.
        </motion.p>
        
        <motion.div 
          variants={itemVariants}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button 
            onClick={() => currentUser ? navigate('/dashboard') : setShowSignUpModal(true)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-5 rounded-xl text-xl font-semibold transition-all duration-300 shadow-2xl"
          >
            <Play className="w-6 h-6 mr-3" />
            <span>Get Started Today</span>
            <ArrowRight className="w-6 h-6 ml-3" />
          </motion.button>

          <motion.button 
            onClick={() => navigate('/contact')}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white border border-white/20 px-10 py-5 rounded-xl text-xl font-semibold transition-all duration-300 shadow-lg"
          >
            <MessageCircle className="w-6 h-6 mr-3" />
            <span>Suggest Features</span>
          </motion.button>
        </motion.div>

        {/* Feature highlights */}
        <motion.div 
          variants={itemVariants}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { icon: Users, value: '1000+', label: 'Happy Clients' },
            { icon: Clock, value: '24/7', label: 'Support' },
            { icon: TrendingUp, value: '99.9%', label: 'Uptime' },
            { icon: Shield, value: '30+', label: 'Features' }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                custom={index}
                className="flex flex-col items-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 + (index * 0.1), duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl mb-4"
                >
                  <Icon className="w-8 h-8 text-green-400" />
                </motion.div>
                <motion.span
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 + (index * 0.1), duration: 0.5 }}
                  className="text-3xl font-bold text-white"
                >
                  {stat.value}
                </motion.span>
                <span className="text-gray-300 mt-1">{stat.label}</span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Social proof / testimonial */}
        <motion.div
          variants={itemVariants}
          className="mt-20 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl p-8 max-w-3xl mx-auto"
        >
          <blockquote className="text-lg text-gray-200 italic mb-4">
            "RidePilot transformed how we manage our transportation business. The intuitive interface and powerful analytics have helped us increase efficiency by 40% and improve customer satisfaction significantly."
          </blockquote>
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold">M</span>
            </div>
            <div>
              <p className="text-white font-semibold">Marco Silva</p>
              <p className="text-gray-300 text-sm">CEO, Premium Transfers</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
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
    </div>
  );
}