import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const useParallaxTilt = (containerRef, options = {}) => {
  const elementRef = useRef(null);
  
  const {
    tiltStrength = 15,
    moveStrength = 20,
    perspective = 1000,
    scale = 1.05,
    speed = 0.6
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    const container = containerRef?.current;
    
    if (!element || !container) return;

    // Only apply on desktop
    if (!window.matchMedia('(min-width: 768px)').matches) {
      return;
    }

    // Set initial 3D properties
    gsap.set(element, {
      transformPerspective: perspective,
      transformStyle: "preserve-3d"
    });

    let tiltX = 0, tiltY = 0, moveX = 0, moveY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate mouse position relative to center (-1 to 1)
      const mouseX = (e.clientX - centerX) / (rect.width / 2);
      const mouseY = (e.clientY - centerY) / (rect.height / 2);
      
      // Calculate tilt values
      tiltX = mouseY * tiltStrength;
      tiltY = -mouseX * tiltStrength;
      
      // Calculate movement values
      moveX = mouseX * moveStrength;
      moveY = mouseY * moveStrength;
      
      // Apply transformations
      gsap.to(element, {
        duration: speed,
        rotationX: tiltX,
        rotationY: tiltY,
        x: moveX,
        y: moveY,
        scale: scale,
        ease: "power2.out"
      });
    };

    const handleMouseEnter = () => {
      gsap.to(element, {
        duration: 0.3,
        scale: scale,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        duration: 0.8,
        rotationX: 0,
        rotationY: 0,
        x: 0,
        y: 0,
        scale: 1,
        ease: "power2.out"
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [containerRef, tiltStrength, moveStrength, perspective, scale, speed]);

  return elementRef;
};

export default useParallaxTilt;