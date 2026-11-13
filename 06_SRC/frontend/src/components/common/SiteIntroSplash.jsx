'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StrokeText } from './StrokeText';

export const SiteIntroSplash = ({ onFinish }) => {
  const [phase, setPhase] = useState('drawing'); // 'drawing' | 'zooming' | 'done'
  const [fontSize, setFontSize] = useState(104);
  const timerRef = useRef(null);

  // Responsive font sizing strictly calibrated for Android & mobile screens
  useEffect(() => {
    const computeSize = () => {
      const w = window.innerWidth;
      if (w < 340) {
        setFontSize(22);
      } else if (w < 380) {
        setFontSize(25);
      } else if (w < 440) {
        setFontSize(29);
      } else if (w < 640) {
        setFontSize(38);
      } else if (w < 1024) {
        setFontSize(54);
      } else {
        setFontSize(74);
      }
    };

    computeSize();
    window.addEventListener('resize', computeSize);
    return () => window.removeEventListener('resize', computeSize);
  }, []);

  // Prevent page scroll and ink bleed interference while splash is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('has-intro-splash');
    return () => {
      document.body.style.overflow = originalOverflow;
      document.documentElement.classList.remove('has-intro-splash');
    };
  }, []);

  const triggerZoomBlend = useCallback(() => {
    if (phase !== 'drawing') return;
    setPhase('zooming');

    timerRef.current = setTimeout(() => {
      setPhase('done');
      if (typeof onFinish === 'function') {
        onFinish();
      }
    }, 850);
  }, [phase, onFinish]);

  // Handle stroke text draw and fill completion
  const handleDrawComplete = useCallback(() => {
    // Hold the completed filled text for 260ms before zooming into site
    timerRef.current = setTimeout(() => {
      triggerZoomBlend();
    }, 260);
  }, [triggerZoomBlend]);

  // Keyboard escape or click anywhere skips animation smoothly
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ') {
        triggerZoomBlend();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [triggerZoomBlend]);

  if (phase === 'done') return null;

  const isZooming = phase === 'zooming';

  return (
    <div
      onClick={triggerZoomBlend}
      onTouchStart={triggerZoomBlend}
      className={`fixed inset-0 min-h-screen min-h-[100dvh] w-full h-full z-[999999] flex flex-col items-center justify-center bg-black select-none cursor-pointer touch-manipulation transition-all duration-[850ms] ${
        isZooming
          ? 'opacity-0 scale-[2.2] pointer-events-none blur-[14px]'
          : 'opacity-100 scale-100 pointer-events-auto blur-0'
      }`}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, opacity, filter'
      }}
      aria-label="BorrowBox introductory animation - tap or click to skip"
    >
      {/* Ambient center radial glow in brand emerald */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${
          isZooming ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="w-[520px] h-[520px] rounded-full bg-emerald-500/15 blur-[120px]" />
      </div>

      {/* Main animated StrokeText wordmark */}
      <div className="relative z-10 w-full max-w-[92vw] sm:max-w-4xl px-2 sm:px-4 flex flex-col items-center">
        <StrokeText
          text="BorrowBox"
          strokeColor="#10B981"
          fillColor="#F5F2EB"
          strokeWidth={2.0}
          drawDuration={1.35}
          fillDelay={0.12}
          stagger={0.045}
          ease="power2.out"
          trigger="mount"
          fillMode="wipe"
          wipeFrom="left"
          fontSize={fontSize}
          fontWeight={900}
          letterSpacing={-1}
          shadow={true}
          shadowColor="rgba(16, 185, 129, 0.45)"
          onAnimationComplete={handleDrawComplete}
        />

        {/* Minimalist campus caption */}
        <div
          className={`flex items-center gap-3 mt-6 transition-all duration-700 delay-300 ${
            isZooming ? 'opacity-0 translate-y-4' : 'opacity-80 translate-y-0'
          }`}
        >
          <span className="h-px w-6 bg-gradient-to-r from-transparent to-emerald-500" />
          <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.28em] text-[#F5F2EB]/90">
            Community Borrowing Platform
          </span>
          <span className="h-px w-6 bg-gradient-to-l from-transparent to-emerald-500" />
        </div>
      </div>

      {/* Subtle skip prompt */}
      <div
        className={`absolute bottom-[calc(2rem+env(safe-area-inset-bottom,0px))] px-4 text-center text-[11px] text-neutral-400 font-medium tracking-wider transition-opacity duration-500 ${
          isZooming ? 'opacity-0' : 'opacity-60 hover:opacity-100'
        }`}
      >
        Tap anywhere or press Esc to skip
      </div>
    </div>
  );
};
