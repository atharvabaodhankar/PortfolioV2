
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
    
    // Ultra crisp styling for perfect edges
    FerroMouseBall.style.cssText = `
      width: ${size};
      height: ${size};
      position: fixed;
      top: 0;
      left: 0;
      background-color: #ffffff;
      border-radius: 50%;
      z-index: 99999;
      pointer-events: none;
      mix-blend-mode: difference;
      transform-origin: center center;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    `;
    
    document.body.appendChild(FerroMouseBall);
    
    const speedMap = {
      0: 0.05,
      1: 0.08,
      2: 0.12,
      3: 0.15,
      4: 0.18,
      5: 0.22,
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

    // Ultra smooth GSAP setup
    gsap.set(FerroMouseBall, {
        xPercent: -50,
        yPercent: -50,
        scale: 1,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    });

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };

    const mouseMoveHandler = (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        // Keep consistent white background for proper invert effect
    };
    
    window.addEventListener("mousemove", mouseMoveHandler);

    // Smooth trailing animation using GSAP's ticker
    const tickerFunc = () => {
        // Smooth interpolation for trailing effect
        const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
        
        // Calculate the distance for smooth easing
        const dx = mouse.x - pos.x;
        const dy = mouse.y - pos.y;
        
        // Apply smooth easing with distance-based adjustment
        pos.x += dx * dt;
        pos.y += dy * dt;
        
        // Smooth GSAP animation for trailing effect
        gsap.set(FerroMouseBall, {
            x: pos.x,
            y: pos.y
        });
    };

    gsap.ticker.add(tickerFunc);

    // Store listeners to remove them later
    const cleanupListeners = [];

    if (selectors && selectors.length > 0) {
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                const enterHandler = () => {
                    // Calculate smooth scale based on element font size + enhancer
                    let fontSize = 20;
                    try {
                        fontSize = parseFloat(window.getComputedStyle(element).fontSize);
                    } catch(e) {}
                    
                    const enhancer = ScaleEnchancer[se] !== undefined ? ScaleEnchancer[se] : 80;
                    const targetSize = fontSize + enhancer;
                    const currentSizeVal = parseFloat(size) || 50;
                    const scale = currentSizeVal > 0 ? targetSize / currentSizeVal : 3;

                    // Ultra smooth scaling animation
                    gsap.to(FerroMouseBall, { 
                        scale: scale, 
                        duration: 0.8, 
                        ease: "power4.out"
                    });
                };

                const leaveHandler = () => {
                    // Ultra smooth return to normal size
                    gsap.to(FerroMouseBall, { 
                        scale: 1, 
                        duration: 0.6, 
                        ease: "power4.out" 
                    });
                };

                element.addEventListener('mouseenter', enterHandler);
                element.addEventListener('mouseleave', leaveHandler);

                cleanupListeners.push({ element, type: 'mouseenter', handler: enterHandler });
                cleanupListeners.push({ element, type: 'mouseleave', handler: leaveHandler });
            });
        });
    }

    // Return the cursor instance
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
