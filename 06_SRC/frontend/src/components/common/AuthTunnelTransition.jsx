import React, { useEffect, useState, useRef } from 'react';
import { LightTunnel } from './LightTunnel';

export const AuthTunnelTransition = ({
  isActive = false,
  title = 'Entering Campus Network...',
  subtitle = 'Connecting to Chandigarh University Student Hub',
  duration = 1700,
  onComplete
}) => {
  const [mounted, setMounted] = useState(false);
  const [isDissolving, setIsDissolving] = useState(false);
  const timersRef = useRef([]);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (isActive) {
      setMounted(true);
      setIsDissolving(false);

      // Trigger smooth card dissolve 300ms before navigation completes
      const dissolveTimer = setTimeout(() => {
        setIsDissolving(true);
      }, Math.max(300, duration - 300));
      timersRef.current.push(dissolveTimer);

      // Finish transition and navigate seamlessly without revealing previous page
      const completeTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, duration);
      timersRef.current.push(completeTimer);

      return () => {
        timersRef.current.forEach(clearTimeout);
      };
    } else {
      setMounted(false);
      setIsDissolving(false);
    }
  }, [isActive, duration, onComplete]);

  if (!isActive && !mounted) return null;

  return (
    <div
      className={`fixed inset-0 min-h-screen min-h-[100dvh] w-full h-full z-[99999] bg-black flex flex-col items-center justify-center overflow-hidden transition-opacity duration-300 ${
        isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-live="polite"
      role="status"
    >
      {/* Background WebGL2 LightTunnel Warp */}
      <div
        className="absolute inset-0 w-full h-full"
      >
        <LightTunnel
          cableColor="#061F17"
          pulseColor="#D4A853"
          tunnelColor="#0F382A"
          tunnelOpacity={0.35}
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

      {/* Center High-Contrast Dissolve Card - Standalone Logo, Zero Circles/Boxes/Shields */}
      <div
        className={`relative z-10 flex flex-col items-center text-center p-6 sm:p-7 w-[calc(100%-2rem)] max-w-sm mx-auto rounded-3xl bg-black/85 backdrop-blur-md border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.25)] transition-all duration-450 ${
          isDissolving
            ? 'opacity-0 scale-105 blur-lg translate-y-2'
            : 'opacity-100 scale-100 blur-0 translate-y-0 animate-in fade-in zoom-in-95 duration-300'
        }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Centered Standalone Logo */}
        <div className="mb-5 flex items-center justify-center w-full">
          <img
            src="/logo-dark.svg"
            alt="BorrowBox"
            className="h-12 sm:h-14 md:h-16 w-auto max-w-[260px] object-contain drop-shadow-[0_0_20px_rgba(16,185,129,0.45)] mx-auto"
            draggable={false}
          />
        </div>

        {/* Text Details */}
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-zinc-300 mt-1 max-w-xs leading-relaxed">
          {subtitle}
        </p>

        {/* Animated Warp Energy Bar in Emerald & Gold */}
        <div className="w-48 h-1.5 bg-zinc-900 rounded-full overflow-hidden mt-5 border border-zinc-800">
          <div className="h-full bg-gradient-to-r from-emerald-600 via-[#D4A853] to-emerald-500 rounded-full w-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
        </div>
      </div>
    </div>
  );
};

export default AuthTunnelTransition;

