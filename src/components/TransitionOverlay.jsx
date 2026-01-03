import React, { useEffect } from 'react';
import { useTransition } from '../context/TransitionContext';

const TransitionOverlay = () => {
  const { overlayRef } = useTransition();

  return (
    <div 
      ref={overlayRef}
      className="transition-overlay fixed top-0 left-0 w-full h-full pointer-events-none z-[9998]"
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        opacity: 0,
        pointerEvents: 'none',
        willChange: 'opacity'
      }}
    >
      {/* Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default TransitionOverlay;
