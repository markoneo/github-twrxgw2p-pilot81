import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error handler for uncaught exceptions
window.onerror = (message, source, lineno, colno, error) => {
  console.error('Global error:', { message, source, lineno, colno, error });
  
  // Display error message to user
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const errorHTML = `
      <div style="padding: 20px; max-width: 500px; margin: 0 auto; text-align: center;">
        <div style="background-color: #fee2e2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px;">
          <h2 style="color: #b91c1c; font-size: 18px; margin-bottom: 12px;">Something went wrong</h2>
          <p style="color: #4b5563; margin-bottom: 16px;">The application encountered an error. Please try refreshing the page.</p>
          <button 
            onclick="window.location.reload()" 
            style="background-color: #ef4444; color: white; border: none; border-radius: 6px; padding: 8px 16px; font-size: 14px; cursor: pointer;"
          >
            Refresh Page
          </button>
        </div>
      </div>
    `;
    
    // Only replace content if it's an error (not during normal loading)
    if (message && typeof message === 'string' && !message.includes('Loading chunk')) {
      rootElement.innerHTML = errorHTML;
    }
  }
  
  return false; // Let the error propagate
};

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled Promise Rejection:', event.reason);
});

// Fix viewport height issues on mobile
const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Set on initialization
setViewportHeight();

// Update on resize and orientation change
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', () => {
  // Small delay to ensure correct height after orientation change
  setTimeout(setViewportHeight, 150);
});

// Fix iOS Safari 100vh issues
const fixIOSHeight = () => {
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    // Fix for iOS full-screen elements
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    
    // Add iOS class to root for specific CSS fixes
    document.documentElement.classList.add('ios-device');
  }
};

fixIOSHeight();

// Remove initial loader after app has rendered
const removeLoader = () => {
  const loader = document.querySelector('.initial-loader');
  if (loader) {
    loader.classList.add('fade-out');
    setTimeout(() => {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 300);
  }
};

// Initialize the application
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found - DOM not ready');
  }
  
  // Clear any existing content in the root except the loader
  const loader = document.querySelector('.initial-loader');
  if (loader) {
    rootElement.innerHTML = '';
    rootElement.appendChild(loader);
  }
  
  // Create root and render app with error boundaries
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  // Remove loader after a short delay to ensure rendering is complete
  setTimeout(removeLoader, 500);
} catch (error) {
  console.error('Error initializing React application:', error);
  
  // Display fallback UI
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <div style="background-color: #fee2e2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #b91c1c; font-size: 18px; margin-bottom: 12px;">Unable to load application</h2>
          <p style="color: #4b5563; margin-bottom: 16px;">Please try refreshing the page or check your connection.</p>
          <button 
            onclick="window.location.reload()" 
            style="background-color: #ef4444; color: white; border: none; border-radius: 6px; padding: 8px 16px; font-size: 14px; cursor: pointer;"
          >
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
}