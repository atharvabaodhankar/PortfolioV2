
import gsap from 'gsap';
import MouseFollower from 'mouse-follower';
import 'mouse-follower/dist/mouse-follower.min.css';

// Register GSAP with MouseFollower if not already done
MouseFollower.registerGSAP(gsap);

const Ferro = {
  /**
   * Ferro Mouse Follower
   * @param {number} sp - Speed/smoothness (0-5)
   * @param {string} size - Size of the cursor (e.g., "15px")
   * @param {boolean} blendMode - Enable mix-blend-mode difference
   * @param {string[]} selectors - Array of selectors to trigger hover scaling
   * @param {number} se - Scale enhancer level (0-5)
   */
  mouseFollower: function(sp = 0, size = "15px", blendMode = true, selectors = [], se = 0) {
    // Clean up any existing instance to prevent duplicates if called multiple times (e.g. strict mode)
    if (window.ferroCursor) {
      window.ferroCursor.destroy();
    }

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

    const speed = speedMap[sp] || 0.05;

    // Initialize MouseFollower
    const cursor = new MouseFollower({
      container: document.body,
      speed: speed,
      stateDetection: {
        '-pointer': 'a,button',
        '-hidden': 'iframe',
      },
    });

    // Store instance globally for cleanup
    window.ferroCursor = cursor;

    // Apply custom styles
    if (cursor.el) {
       // Size
       cursor.el.style.setProperty('--cursor-size', size);
       // We might need to override the library's default size logic or use their API
       // The library usually uses css variables or width/height. 
       // Let's force it via style to be sure it matches 'size' param.
       // Actually, the library uses --cursor-size in its css? 
       // Checking standard mouse-follower css, it uses width/height.
       // Let's set the variable AND direct style to be safe.
       cursor.el.style.width = size;
       cursor.el.style.height = size;
       
       // Blend Mode
       if (blendMode) {
         cursor.el.style.mixBlendMode = 'difference';
       } else {
         cursor.el.style.mixBlendMode = 'normal';
       }
    }

    // Handle Custom Selectors
    if (selectors && selectors.length > 0) {
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.addEventListener('mouseenter', () => {
                    // Logic from old code:
                    // const fontSize = parseFloat(window.getComputedStyle(element).fontSize) + ScaleEnchancer[se] || 20;
                    // const currentSize = parseFloat(size); // "15px" -> 15
                    // const newScale = fontSize / currentSize;
                    // cursor.addState('-inverse'); // or just scale?
                    // The old code used gsap to scale the ball manually.
                    // MouseFollower has a setScale method or state system.
                    // Let's try to stick to the library's way if possible, or manual if needed.
                    // Old code: gsap.to(FerroMouseBall, { scale: newScale, duration: 0.3 });
                    
                    const fontSize = parseFloat(window.getComputedStyle(element).fontSize);
                    const enhancer = ScaleEnchancer[se] !== undefined ? ScaleEnchancer[se] : 20;
                    const targetSize = fontSize + enhancer;
                    const currentSizeVal = parseFloat(size) || 15;
                    const scale = targetSize / currentSizeVal;

                    if (cursor.el) {
                        gsap.to(cursor.el, { scale: scale, duration: 0.3 });
                    }
                    // Also maybe add 'pointer' state?
                    cursor.addState('-pointer');
                });
                
                element.addEventListener('mouseleave', () => {
                   if (cursor.el) {
                       gsap.to(cursor.el, { scale: 1, duration: 0.3 });
                   }
                   cursor.removeState('-pointer');
                });
            });
        });
    }

    return cursor;
  }
};

export default Ferro;
