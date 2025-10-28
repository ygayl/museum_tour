import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

/**
 * Cleanup any existing service workers and caches from old PWA version
 * This ensures all users get fresh code and prevents issues with stale caches
 */
async function cleanupServiceWorkers() {
  if ('serviceWorker' in navigator) {
    try {
      // Get all registered service workers
      const registrations = await navigator.serviceWorker.getRegistrations();

      if (registrations.length > 0) {
        console.log(`Found ${registrations.length} service worker(s) to unregister`);

        // Unregister all service workers
        for (const registration of registrations) {
          await registration.unregister();
          console.log('Service worker unregistered:', registration.scope);
        }
      }

      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();

        if (cacheNames.length > 0) {
          console.log(`Clearing ${cacheNames.length} cache(s)`);

          for (const cacheName of cacheNames) {
            await caches.delete(cacheName);
            console.log('Cache deleted:', cacheName);
          }
        }
      }

      console.log('Service worker cleanup complete');
    } catch (error) {
      console.error('Error during service worker cleanup:', error);
    }
  }
}

// Run cleanup before initializing the app
cleanupServiceWorkers().then(() => {
  const root = createRoot(document.getElementById('root')!);

  // Direct rendering for better LCP performance
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
});
