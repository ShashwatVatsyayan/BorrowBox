'use client';

import React, { useRef, useEffect, useCallback } from 'react';

/**
 * ClickSpark component from React Bits
 * Generates an interactive burst of dynamic sparks on user click.
 *
 * Props:
 * - sparkColor: Color of the sparks (default '#fff')
 * - shape: 'line' | 'streak' | 'dot' | 'star' (default 'line')
 * - sparkCount: Number of sparks per burst (default 8)
 * - sparkSize: Size/length of each spark in px (default 14)
 * - sparkRadius: Travel distance from center in px (default 30)
 * - duration: Animation duration in ms (default 500)
 */
export const ClickSpark = ({
  sparkColor = '#fff',
  shape = 'line',
  sparkCount = 8,
  sparkSize = 14,
  sparkRadius = 30,
  duration = 500,
  extraScale = 1.0,
  children,
  className = '',
  style = {}
}) => {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);

  // Resize canvas according to high-DPI display and parent container
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

    canvas.width = Math.max(rect.width * dpr, 1);
    canvas.height = Math.max(rect.height * dpr, 1);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    resizeCanvas();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resizeCanvas) : null;
    ro?.observe(parent);

    return () => ro?.disconnect();
  }, [resizeCanvas]);

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const now = performance.now();
    const count = Math.max(Number(sparkCount) || 8, 1);

    const newSparks = Array.from({ length: count }, (_, i) => {
      const angle = (2 * Math.PI * i) / count + (Math.random() * 0.2 - 0.1);
      return {
        x,
        y,
        angle,
        startTime: now,
        randomSpeed: 0.85 + Math.random() * 0.3
      };
    });

    sparksRef.current.push(...newSparks);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;

    const draw = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = time - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = Math.min(1, elapsed / duration);
        // Ease out quad
        const eased = 1 - (1 - progress) * (1 - progress);
        const distance = eased * sparkRadius * extraScale * spark.randomSpeed;
        const lineLen = sparkSize * (1 - progress);

        const currentX = spark.x + distance * Math.cos(spark.angle);
        const currentY = spark.y + distance * Math.sin(spark.angle);

        ctx.save();
        ctx.strokeStyle = sparkColor;
        ctx.fillStyle = sparkColor;
        ctx.lineWidth = Math.max(1, (1 - progress) * 2.2);
        ctx.lineCap = 'round';
        ctx.globalAlpha = Math.max(0, 1 - progress);

        if (shape === 'line' || shape === 'streak') {
          const tailDist = Math.max(0, distance - lineLen);
          const tailX = spark.x + tailDist * Math.cos(spark.angle);
          const tailY = spark.y + tailDist * Math.sin(spark.angle);

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(currentX, currentY);
          ctx.stroke();
        } else if (shape === 'dot') {
          ctx.beginPath();
          ctx.arc(currentX, currentY, Math.max(1, (sparkSize * 0.3) * (1 - progress)), 0, Math.PI * 2);
          ctx.fill();
        } else if (shape === 'star') {
          const r = Math.max(1, (sparkSize * 0.35) * (1 - progress));
          ctx.beginPath();
          for (let s = 0; s < 5; s++) {
            ctx.lineTo(
              currentX + r * Math.cos((18 + s * 72) * (Math.PI / 180)),
              currentY - r * Math.sin((18 + s * 72) * (Math.PI / 180))
            );
            ctx.lineTo(
              currentX + (r / 2) * Math.cos((54 + s * 72) * (Math.PI / 180)),
              currentY - (r / 2) * Math.sin((54 + s * 72) * (Math.PI / 180))
            );
          }
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
        return true;
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [sparkColor, sparkRadius, sparkSize, duration, extraScale, shape]);

  return (
    <div
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center overflow-visible ${className}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-30 w-full h-full overflow-visible"
        aria-hidden="true"
      />
      {children}
    </div>
  );
};

export default ClickSpark;

