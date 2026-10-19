import gsap from 'gsap';
import './ferro.css';

const NATIVE_SIZE = 64; // High-density native geometry to prevent GPU raster blur
const RESTING_SCALE = 14 / NATIVE_SIZE; // ~0.218 (renders as precise 14px circle)
const STANDARD_HOVER_SCALE = 38 / NATIVE_SIZE; // ~0.593 (renders as crisp 38px circle)
const LARGE_HOVER_SCALE = 64 / NATIVE_SIZE; // 1.0 (renders as 64px magnifying lens, never exceeds native size)

const Ferro = {
  /**
   * Ferro Mouse Follower - Razor Sharp Awwwards Motion
   * @param {number} sp - Speed/smoothness (0-5)
   * @param {string} size - Target resting size (default 14px)
   * @param {boolean} blendMode - Enable mix-blend-mode difference
   * @param {string[]} selectors - Array of selectors to trigger hover scaling
   * @param {number} se - Scale enhancer level
   */
  mouseFollower: function(sp = 2, size = "14px", blendMode = true, selectors = []) {
    // Only run on desktop with fine pointer
    if (!window.matchMedia('(min-width: 768px)').matches) {
      return { destroy: () => {} };
    }

    // Clean up any existing instance to prevent duplicates
    const existingBall = document.querySelector('.ferro-mouse-follower-ball');
    if (existingBall) {
      existingBall.remove();
    }

    const FerroMouseBall = document.createElement("div");
    FerroMouseBall.className = "ferro-mouse-follower-ball";
    
    // Explicit inline base styles
    FerroMouseBall.style.cssText = `
      width: ${NATIVE_SIZE}px;
      height: ${NATIVE_SIZE}px;
      position: fixed;
      top: 0;
      left: 0;
      background-color: #ffffff;
      border-radius: 50%;
      z-index: 999999;
      pointer-events: none;
      mix-blend-mode: ${blendMode ? 'difference' : 'normal'};
      transform-origin: center center;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      will-change: transform, opacity;
    `;
    
    document.body.appendChild(FerroMouseBall);
    
    const speedMap = {
      0: 0.08,
      1: 0.12,
      2: 0.16,
      3: 0.20,
      4: 0.24,
      5: 0.30,
    };

    const speed = speedMap[sp] || 0.16;

    // Track active state
    let isHidden = false;
    let currentInteractiveEl = null;
    let currentScale = RESTING_SCALE;

    // Initial positioning
    gsap.set(FerroMouseBall, {
      xPercent: -50,
      yPercent: -50,
      scale: RESTING_SCALE,
      opacity: 1,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };

    /**
     * Check if an element or its ancestor is an image or media element
     */
    const isMediaOrImage = (el) => {
      if (!el || !(el instanceof Element)) return false;
      return !!(
        el.matches('img, picture, video, canvas, [data-cursor-hide], .no-cursor') ||
        el.closest('img, picture, video, canvas, [data-cursor-hide], .no-cursor, .work-portrait, .image-container, .tilt-card, [role="img"]')
      );
    };

    /**
     * Get the interactive target container if hovering one
     */
    const getInteractiveElement = (el) => {
      if (!el || !(el instanceof Element)) return null;

      // Standard interactive elements
      const standard = el.closest('a, button, input, select, textarea, [role="button"], .ferro-btn, .nav-btn, .hero-hover, .project-card, .menu, .nav-item-wrapper');
      if (standard) return standard;

      // Check user configured selectors
      if (selectors && selectors.length > 0) {
        for (const selector of selectors) {
          try {
            const found = el.closest(selector);
            if (found) return found;
          } catch (e) {}
        }
      }
      return null;
    };

    /**
     * Calculate sharp, non-distorted scale
     */
    const calculateScaleForElement = (el) => {
      if (!el) return RESTING_SCALE;

      // For large menu links (like / Projects, / About in the navbar)
      if (el.closest('.nav-item-wrapper')) {
        return LARGE_HOVER_SCALE; // 64px
      }

      // For regular buttons, links, cards, tabs
      return STANDARD_HOVER_SCALE; // 38px
    };

    /**
     * Mouse movement handler
     */
    const mouseMoveHandler = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const target = e.target;

      // Rule 1: Vanish on images and media
      if (isMediaOrImage(target)) {
        if (!isHidden) {
          isHidden = true;
          currentInteractiveEl = null;
          gsap.to(FerroMouseBall, {
            scale: 0,
            opacity: 0,
            duration: 0.18,
            ease: "power2.out",
            overwrite: "auto"
          });
        }
        return;
      }

      // Rule 2: If we were hidden over an image, restore visibility
      if (isHidden) {
        isHidden = false;
        gsap.to(FerroMouseBall, {
          opacity: 1,
          duration: 0.22,
          ease: "power2.out"
        });
      }

      // Rule 3: Interactive elements scaling
      const interactiveEl = getInteractiveElement(target);

      if (interactiveEl) {
        if (currentInteractiveEl !== interactiveEl) {
          currentInteractiveEl = interactiveEl;
          const targetScale = calculateScaleForElement(interactiveEl);
          currentScale = targetScale;
          gsap.to(FerroMouseBall, {
            scale: targetScale,
            opacity: 1,
            duration: 0.3,
            ease: "power3.out",
            overwrite: "auto"
          });
        }
      } else {
        if (currentInteractiveEl !== null) {
          currentInteractiveEl = null;
          currentScale = RESTING_SCALE;
          gsap.to(FerroMouseBall, {
            scale: RESTING_SCALE,
            opacity: 1,
            duration: 0.3,
            ease: "power3.out",
            overwrite: "auto"
          });
        }
      }
    };

    // When mouse leaves the browser window
    const mouseLeaveWindowHandler = () => {
      gsap.to(FerroMouseBall, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power2.out"
      });
    };

    const mouseEnterWindowHandler = () => {
      if (!isHidden) {
        gsap.to(FerroMouseBall, {
          scale: currentScale,
          opacity: 1,
          duration: 0.25,
          ease: "power2.out"
        });
      }
    };

    window.addEventListener("mousemove", mouseMoveHandler, { passive: true });
    document.documentElement.addEventListener("mouseleave", mouseLeaveWindowHandler);
    document.documentElement.addEventListener("mouseenter", mouseEnterWindowHandler);

    // Smooth trailing animation using GSAP's ticker
    const tickerFunc = () => {
      const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
      const dx = mouse.x - pos.x;
      const dy = mouse.y - pos.y;
      
      pos.x += dx * dt;
      pos.y += dy * dt;
      
      gsap.set(FerroMouseBall, {
        x: pos.x,
        y: pos.y
      });
    };

    gsap.ticker.add(tickerFunc);

    // Return the cursor instance
    return {
      destroy: () => {
        window.removeEventListener("mousemove", mouseMoveHandler);
        document.documentElement.removeEventListener("mouseleave", mouseLeaveWindowHandler);
        document.documentElement.removeEventListener("mouseenter", mouseEnterWindowHandler);
        gsap.ticker.remove(tickerFunc);
        if (FerroMouseBall && FerroMouseBall.parentNode) {
          FerroMouseBall.parentNode.removeChild(FerroMouseBall);
        }
      },
      hide: () => {
        isHidden = true;
        gsap.to(FerroMouseBall, { scale: 0, opacity: 0, duration: 0.18 });
      },
      show: () => {
        isHidden = false;
        gsap.to(FerroMouseBall, { scale: currentScale, opacity: 1, duration: 0.22 });
      },
      el: FerroMouseBall
    };
  }
};

export default Ferro;
