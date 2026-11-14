import React, { useEffect, useState, useRef } from 'react';
import { LightTunnel } from './LightTunnel';

export const AuthTunnelTransition = ({
  isActive = false,
  title = 'Entering Campus Network...',
  subtitle = 'Connecting to Chandigarh University Student Hub',
  duration = 1700,
  onComplete
}) => {
  const [isDissolving, setIsDissolving] = useState(false);
  const timersRef = useRef([]);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (isActive) {
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
      setIsDissolving(false);
    }
  }, [isActive, duration, onComplete]);

  return (
    <div
      className={`fixed inset-0 min-h-screen min-h-[100dvh] w-full h-full bg-black flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${
        isActive
          ? 'z-[99999] opacity-100 pointer-events-auto visible'
          : '-z-50 opacity-0 pointer-events-none invisible'
      }`}
      aria-live="polite"
      role="status"
      aria-hidden={!isActive}
    >
      {/* Background WebGL2 LightTunnel Warp - Pre-warmed & Compiled Ahead of Time */}
      <div className="absolute inset-0 w-full h-full">
        <LightTunnel
          cableColor="#061F17"
          pulseColor="#D4A853"
          tunnelColor="#0F382A"
          tunnelOpacity={0.35}
          speed={isActive ? 0.4 : 0.05}
          pulseSpeed={4.8}
          pulseDensity={0.8}
          pulseLength={0.35}
          flowDirection="inward"
          cableCount={64}
          glow={1.8}
          thickness={0.4}
          brightness={1.2}
          mouseInteraction={isActive}
          clickSurge={isActive}
          intro={true}
        />
      </div>

      {/* Center High-Contrast Dissolve Card */}
      <div
        className={`relative z-10 flex flex-col items-center text-center p-6 sm:p-7 w-[calc(100%-2rem)] max-w-sm mx-auto rounded-3xl bg-black/85 backdrop-blur-md border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.25)] transition-all duration-450 ${
          isDissolving
            ? 'opacity-0 scale-105 blur-lg translate-y-2'
            : isActive
            ? 'opacity-100 scale-100 blur-0 translate-y-0 animate-in fade-in zoom-in-95 duration-300'
            : 'opacity-0 scale-95'
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
        <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed max-w-xs">
          {subtitle}
        </p>

        {/* High-Tech Pulse Line */}
        <div className="mt-5 w-24 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />
      </div>
    </div>
  );
};

export default AuthTunnelTransition;
