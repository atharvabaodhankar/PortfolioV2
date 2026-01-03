import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';

const TransitionContext = createContext(null);

export const TransitionProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const tl = useRef(null);
  const overlayRef = useRef(null);

  const startTransition = useCallback((to) => {
    if (location.pathname === to) return;
    if (isTransitioning) return;

    setIsTransitioning(true);

    tl.current = gsap.timeline({
      onComplete: () => {
        setIsTransitioning(false);
        if (overlayRef.current) {
            gsap.set(overlayRef.current, { xPercent: -100 });
        }
      }
    });

    const overlay = overlayRef.current;
    
    // Defensive Reset
    if (tl.current) tl.current.kill();
    gsap.set(overlay, { opacity: 0, pointerEvents: 'none' });

    tl.current = gsap.timeline({
      onComplete: () => {
        setIsTransitioning(false);
        if (overlayRef.current) {
            gsap.set(overlayRef.current, { opacity: 0, pointerEvents: 'none' });
        }
      }
    });

    // Target content
    const currentContent = document.getElementById('app-content');

    // Smooth Blur & Fade Timeline
    tl.current
        .add('start')
        
        // 1. Exit: Fade Out & Blur Content + Darken Overlay
        .to(currentContent, {
            opacity: 0,
            scale: 0.95,
            filter: 'blur(10px)',
            duration: 1.0,
            ease: 'power2.inOut'
        }, 'start')
        .to(overlay, { 
            opacity: 1, 
            pointerEvents: 'auto',
            duration: 1.0, 
            ease: 'power2.inOut' 
        }, 'start')
        
        // 2. Navigate
        .call(() => {
            navigate(to);
            if (window.lenis) {
                window.lenis.scrollTo(0, { immediate: true });
            } else {
                window.scrollTo(0, 0);
            }
        })
        
        // 3. Stabilization
        .to({}, { duration: 0.1 })
        
        // 4. Reveal Setup
        .call(() => {
             const newContent = document.getElementById('app-content');
             gsap.set(newContent, { 
                 opacity: 0, 
                 scale: 1.05, 
                 filter: 'blur(15px)' 
             }); 
        })
        .add('enter')

        // 5. Enter: Unblur & Fade In
        .to(document.getElementById('app-content'), { 
            opacity: 1, 
            scale: 1, 
            filter: 'blur(0px)', 
            duration: 1.2, 
            ease: 'power2.out',
            clearProps: 'all'
        }, 'enter')
        .to(overlay, { 
            opacity: 0, 
            pointerEvents: 'none',
            duration: 1.2, 
            ease: 'power2.inOut' 
        }, 'enter');

  }, [navigate, location, isTransitioning]);

  return (
    <TransitionContext.Provider value={{ startTransition, overlayRef, isTransitioning }}>
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransition = () => useContext(TransitionContext);
