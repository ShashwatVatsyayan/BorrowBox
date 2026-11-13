import React, { useEffect, useState } from 'react';
import { LightTunnel } from './LightTunnel';
import { ShieldCheck } from 'lucide-react';

export const AuthTunnelTransition = ({
  isActive = false,
  title = 'Entering Campus Network...',
  subtitle = 'Connecting to Chandigarh University Student Hub',
  duration = 1600,
  onComplete
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isActive) {
      setMounted(true);
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setMounted(false);
    }
  }, [isActive, duration, onComplete]);

  if (!isActive && !mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center overflow-hidden transition-opacity duration-300 ${
        isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-live="polite"
      role="status"
    >
      {/* Background WebGL2 LightTunnel Warp */}
      <div className="absolute inset-0 w-full h-full">
        <LightTunnel
          cableColor="#3a1c08"
          pulseColor="#ff6b00"
          tunnelColor="#ff7a00"
          tunnelOpacity={0.25}
          speed={0.4}
          pulseSpeed={4.8}
          pulseDensity={0.8}
          pulseLength={0.35}
          flowDirection="inward"
          cableCount={64}
          glow={1.8}
          thickness={0.4}
          brightness={1.2}
          mouseInteraction={true}
          clickSurge={true}
          intro={true}
        />
      </div>

      {/* Center High-Contrast Badge & Status Display */}
      <div className="relative z-10 flex flex-col items-center text-center p-6 max-w-sm mx-4 rounded-3xl bg-black/75 backdrop-blur-md border border-orange-500/40 shadow-[0_0_50px_rgba(255,107,0,0.35)] animate-in fade-in zoom-in-95 duration-300">
        {/* Visible Standalone Logo - No Box, No Circle */}
        <div className="mb-4 flex items-center justify-center">
          <img
            src="/logo-dark.png"
            alt="BorrowBox - Community Borrowing Platform"
            className="h-20 sm:h-24 w-auto object-contain drop-shadow-[0_0_16px_rgba(13,184,166,0.4)]"
          />
        </div>

        {/* Text Details */}
        <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed">
          {subtitle}
        </p>

        {/* Animated Warp Energy Bar */}
        <div className="w-48 h-1.5 bg-zinc-900 rounded-full overflow-hidden mt-4 border border-zinc-800">
          <div className="h-full bg-gradient-to-r from-orange-600 via-amber-400 to-orange-500 rounded-full w-full animate-pulse shadow-[0_0_12px_rgba(255,107,0,0.8)]" />
        </div>
      </div>
    </div>
  );
};

export default AuthTunnelTransition;

