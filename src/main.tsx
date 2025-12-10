import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Remove any existing service workers and clear caches
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().then((success) => {
        if (success) {
          console.log('Service Worker unregistered');
        }
      });
    }
  });

  // Clear all caches
  if ('caches' in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName).then((success) => {
          if (success) {
            console.log('Cache deleted:', cacheName);
          }
        });
      });
    });
  }
}

// Fix viewport height for iOS Safari
const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Set initial viewport height
setViewportHeight();

// Update on resize and orientation change
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', () => {
  // Small delay to ensure the viewport has updated
  setTimeout(setViewportHeight, 100);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
