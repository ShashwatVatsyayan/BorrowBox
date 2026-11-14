/**
 * Preload Transitions & Heavy Graphical Assets
 * Pre-warms WebGL shaders, lazy code chunks, and HTML snapshot engines during browser idle time
 * so that user interactions (theme switching, login tunnel transitions) execute with zero frame drops.
 */

export const preloadTransitions = () => {
  if (typeof window === 'undefined') return;

  const scheduleIdle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1200));

  scheduleIdle(() => {
    try {
      // 1. Preload html2canvas used by InkTransition so theme toggles never stall on network
      import('html2canvas').catch(() => {});

      // 2. Preload LightTunnel & AuthTunnelTransition WebGL assets
      import('../components/common/LightTunnel').catch(() => {});
      import('../components/common/AuthTunnelTransition').catch(() => {});

      // 3. Preload core page chunks
      import('../pages/public/LoginPage').catch(() => {});
      import('../pages/public/SignupPage').catch(() => {});
      import('../pages/dashboard/DashboardPage').catch(() => {});
      import('../pages/items/ExplorePage').catch(() => {});
    } catch (err) {
      // Non-blocking preloading catch
      console.debug('Idle preloading caught:', err);
    }
  });
};

export default preloadTransitions;
