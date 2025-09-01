import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import { DataProvider } from './contexts/DataContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import UIDesignMockup from './components/UIDesignMockup';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen p-4">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
  </div>
);

// Lazy load components to reduce initial bundle size
const Dashboard = lazy(() => import('./components/Dashboard'));
const Statistics = lazy(() => import('./components/Statistics'));
const Pricing = lazy(() => import('./components/Pricing'));
const NewProject = lazy(() => import('./components/NewProject'));
const Companies = lazy(() => import('./components/settings/Companies'));
const CarTypes = lazy(() => import('./components/settings/CarTypes'));
const Drivers = lazy(() => import('./components/settings/Drivers'));
const Payments = lazy(() => import('./components/settings/Payments'));
const CompletedProjects = lazy(() => import('./components/CompletedProjects'));
const Hero = lazy(() => import('./components/Hero'));
const Features = lazy(() => import('./components/Features'));
const CTA = lazy(() => import('./components/CTA'));
const EditProject = lazy(() => import('./components/EditProject'));
const About = lazy(() => import('./components/About'));
const Footer = lazy(() => import('./components/Footer'));
const Terms = lazy(() => import('./components/Terms'));
const Privacy = lazy(() => import('./components/Privacy'));
const NotificationSettings = lazy(() => import('./components/NotificationSettings'));
const VoucherGenerator = lazy(() => import('./components/VoucherGenerator'));
const FinancialReport = lazy(() => import('./components/FinancialReport'));
const DriverApp = lazy(() => import('./components/driver/DriverApp'));
const DirectDriverAuth = lazy(() => import('./components/driver/DirectDriverAuth'));

// Custom component to conditionally render the footer
function AppContent() {
  const location = useLocation();
  
  // Check if the route is a dashboard route where footer should be hidden
  const isDashboardRoute = 
    location.pathname.includes('/dashboard') || 
    location.pathname.includes('/new-project') || 
    location.pathname.includes('/edit-project') ||
    location.pathname.includes('/settings') ||
    location.pathname.includes('/statistics') ||
    location.pathname.includes('/financial-report') ||
    location.pathname.includes('/completed-projects') ||
    location.pathname.includes('/voucher') ||
    location.pathname.includes('/ui-mockup') ||
    location.pathname.includes('/driver');

  // Fix iOS touch events when component mounts
  useEffect(() => {
    // Add empty touchstart listener to enable active CSS states
    document.addEventListener('touchstart', function() {}, {passive: true});
    
    // Fix 100vh issue on iOS
    const fixHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    // Set on mount and on resize/orientation change
    fixHeight();
    window.addEventListener('resize', fixHeight);
    window.addEventListener('orientationchange', fixHeight);
    
    return () => {
      window.removeEventListener('resize', fixHeight);
      window.removeEventListener('orientationchange', fixHeight);
    };
  }, []);

  // Add body class based on route
  useEffect(() => {
    if (isDashboardRoute) {
      document.body.classList.add('has-bottom-nav');
    } else {
      document.body.classList.remove('has-bottom-nav');
    }
  }, [isDashboardRoute]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Only show navbar for non-driver routes */}
      {!location.pathname.includes('/driver') && <Navbar />}
      
      <main className={`flex-grow ${!location.pathname.includes('/driver') ? 'pt-16' : ''}`}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={
                <main>
                  <Suspense fallback={<LoadingFallback />}>
                    <Hero />
                    <Features />
                    <CTA />
                  </Suspense>
                </main>
              } />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/new-project" element={<ProtectedRoute><NewProject /></ProtectedRoute>} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
              <Route path="/financial-report" element={<ProtectedRoute><FinancialReport /></ProtectedRoute>} />
              <Route path="/edit-project/:id" element={<ProtectedRoute><EditProject /></ProtectedRoute>} />
              <Route path="/voucher/:id" element={<ProtectedRoute><VoucherGenerator displayMode="page" projectId={''} /></ProtectedRoute>} />
              <Route path="/settings/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
              <Route path="/settings/car-types" element={<ProtectedRoute><CarTypes /></ProtectedRoute>} />
              <Route path="/settings/drivers" element={<ProtectedRoute><Drivers /></ProtectedRoute>} />
              <Route path="/settings/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
              <Route path="/settings/notifications" element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} />
              <Route path="/completed-projects" element={<ProtectedRoute><CompletedProjects /></ProtectedRoute>} />
              <Route path="/ui-mockup" element={<UIDesignMockup />} />
              <Route path="/driver" element={<DriverApp />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      
      {!isDashboardRoute && (
        <Suspense fallback={<div className="py-8"></div>}>
          <Footer />
        </Suspense>
      )}
    </div>
  );
}

// The main App component
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <Router>
            <AppContent />
          </Router>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;