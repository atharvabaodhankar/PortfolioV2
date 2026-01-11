
import gsap from 'gsap';
import './ferro.css';

const Ferro = {
  /**
   * Ferro Mouse Follower
   * @param {number} sp - Speed/smoothness (0-5)
   * @param {string} size - Size of the cursor (e.g., "50px")
   * @param {boolean} blendMode - Enable mix-blend-mode difference
   * @param {string[]} selectors - Array of selectors to trigger hover scaling
   * @param {number} se - Scale enhancer level (0-5)
   */
  mouseFollower: function(sp = 0, size = "50px", blendMode = true, selectors = [], se = 0) {
    // Only run on desktop
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
    
    // Start with black cursor
    FerroMouseBall.style.cssText = `
      width: ${size};
      height: ${size};
      position: fixed;
      top: 0;
      left: 0;
      background-color: #000;
      border-radius: 50%;
      z-index: 9999;
      pointer-events: none;
      transform: translate(-50%, -50%);
      transition: background-color 0.3s ease;
    `;
    
    document.body.appendChild(FerroMouseBall);
    
    // Function to detect background and change cursor color
    const updateCursorColor = (x, y) => {
      // Temporarily hide cursor to get element below
      FerroMouseBall.style.visibility = 'hidden';
      const elementBelow = document.elementFromPoint(x, y);
      FerroMouseBall.style.visibility = 'visible';
      
      if (elementBelow) {
        // Check for dark sections by ID or class
        const isDarkSection = 
          elementBelow.closest('#footer') || 
          elementBelow.closest('#work') ||
          elementBelow.closest('.footer') ||
          elementBelow.closest('.bg-black') ||
          elementBelow.closest('[style*="background-color: #000"]') ||
          elementBelow.closest('[style*="background-color: black"]');
        
        // Also check computed styles
        let hasBlackBackground = false;
        let currentElement = elementBelow;
        
        // Check up to 5 parent elements for black background
        for (let i = 0; i < 5 && currentElement; i++) {
          const computedStyle = window.getComputedStyle(currentElement);
          const bgColor = computedStyle.backgroundColor;
          
          if (bgColor === 'rgb(0, 0, 0)' || bgColor === '#000' || bgColor === 'black') {
            hasBlackBackground = true;
            break;
          }
          currentElement = currentElement.parentElement;
        }
        
        // Set cursor color: white on dark backgrounds, black on light backgrounds
        const shouldBeWhite = isDarkSection || hasBlackBackground;
        FerroMouseBall.style.backgroundColor = shouldBeWhite ? '#fff' : '#000';
      }
    };
    
    const speedMap = {
      0: 0.08,
      1: 0.1,
      2: 0.2,
      3: 0.3,
      4: 0.4,
      5: 0.5,
    };
    
    const ScaleEnchancer = {
        0: 20,
        1: 40,
        2: 60,
        3: 80,
        4: 100,
        5: 120,
    };

    const speed = speedMap[sp] || 0.1;

    gsap.set(FerroMouseBall, {
        xPercent: -50,
        yPercent: -50,
        scale: 1
    });

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };

    const xSet = gsap.quickSetter(FerroMouseBall, "x", "px");
    const ySet = gsap.quickSetter(FerroMouseBall, "y", "px");

    const mouseMoveHandler = (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        // Update cursor color based on background (throttled)
        if (!mouseMoveHandler.lastUpdate || Date.now() - mouseMoveHandler.lastUpdate > 100) {
          updateCursorColor(e.clientX, e.clientY);
          mouseMoveHandler.lastUpdate = Date.now();
        }
    };
    
    window.addEventListener("mousemove", mouseMoveHandler);

    const tickerFunc = () => {
        const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
        pos.x += (mouse.x - pos.x) * dt;
        pos.y += (mouse.y - pos.y) * dt;
        xSet(pos.x);
        ySet(pos.y);
    };

    gsap.ticker.add(tickerFunc);

    // Store listeners to remove them later
    const cleanupListeners = [];

    if (selectors && selectors.length > 0) {
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                const enterHandler = () => {
                    // Calculate new scale based on element font size + enhancer
                    let fontSize = 20;
                    try {
                        fontSize = parseFloat(window.getComputedStyle(element).fontSize);
                    } catch(e) {}
                    
                    const enhancer = ScaleEnchancer[se] !== undefined ? ScaleEnchancer[se] : 80;
                    const targetSize = fontSize + enhancer;
                    const currentSizeVal = parseFloat(size) || 50;
                    // Safety check for div by zero
                    const scale = currentSizeVal > 0 ? targetSize / currentSizeVal : 3;

                    gsap.to(FerroMouseBall, { scale: scale, duration: 0.3, ease: "power2.out" });
                };

                const leaveHandler = () => {
                    gsap.to(FerroMouseBall, { scale: 1, duration: 0.3, ease: "power2.out" });
                };

                element.addEventListener('mouseenter', enterHandler);
                element.addEventListener('mouseleave', leaveHandler);

                cleanupListeners.push({ element, type: 'mouseenter', handler: enterHandler });
                cleanupListeners.push({ element, type: 'mouseleave', handler: leaveHandler });
            });
        });
    }

    // Initial color update
    setTimeout(() => {
      updateCursorColor(window.innerWidth / 2, window.innerHeight / 2);
    }, 100);

    // Return an object with destroy method
    return {
        destroy: () => {
            window.removeEventListener("mousemove", mouseMoveHandler);
            gsap.ticker.remove(tickerFunc);
            cleanupListeners.forEach(({ element, type, handler }) => {
                element.removeEventListener(type, handler);
            });
            if (FerroMouseBall && FerroMouseBall.parentNode) {
                FerroMouseBall.parentNode.removeChild(FerroMouseBall);
            }
        },
        el: FerroMouseBall
    };
  }
};

export default Ferro;
