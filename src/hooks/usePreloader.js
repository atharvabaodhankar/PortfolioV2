import { useState, useEffect } from 'react';
import imagesLoaded from 'imagesloaded';

export const usePreloader = (onComplete, criticalImages = []) => {
  const [progress, setProgress] = useState(0);
  const [imagesReady, setImagesReady] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    const minPreloaderTime = 4000; // Slightly longer for better experience
    const startTime = Date.now();
    
    let allImagesLoaded = false;
    let fontsLoaded = false;
    
    // Check if everything is ready
    const checkComplete = () => {
      if (allImagesLoaded && fontsLoaded) {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minPreloaderTime - elapsedTime);

        setTimeout(() => {
          setImagesReady(true);
          onComplete?.();
        }, remainingTime);
      }
    };

    // Font loading check
    const checkFonts = async () => {
      try {
        // Check for critical fonts
        const fontChecks = [
          document.fonts.check('1em "Arsenica Trial"'),
          document.fonts.check('1em "Inter"'),
          document.fonts.check('1em system-ui')
        ];

        // Wait for fonts to be ready
        await document.fonts.ready;
        
        // Additional check for custom fonts
        const arsenicaLoaded = document.fonts.check('1em "Arsenica Trial"');
        
        if (arsenicaLoaded || Date.now() - startTime > 2000) {
          // Either font loaded or timeout after 2s
          fontsLoaded = true;
          setFontsReady(true);
          
          // Update progress to include font loading
          setProgress(prev => Math.min(prev + 30, 100));
          
          checkComplete();
        }
      } catch (error) {
        // Fallback if font API not supported
        setTimeout(() => {
          fontsLoaded = true;
          setFontsReady(true);
          checkComplete();
        }, 1000);
      }
    };

    // Image loading
    const imagesToLoad = criticalImages.length > 0 
      ? criticalImages 
      : Array.from(document.querySelectorAll('img'));

    if (imagesToLoad.length === 0) {
      allImagesLoaded = true;
      checkComplete();
    } else {
      let loadedCount = 0;
      const totalImages = imagesToLoad.length;

      const handleImageLoad = () => {
        loadedCount++;
        const imageProgress = (loadedCount / totalImages) * 70; // Images take 70% of progress
        const fontProgress = fontsReady ? 30 : 0; // Fonts take 30% of progress
        const totalProgress = imageProgress + fontProgress;
        setProgress(totalProgress);

        if (loadedCount === totalImages) {
          allImagesLoaded = true;
          checkComplete();
        }
      };

      // Use imagesLoaded library for robust loading detection
      const imgLoad = imagesLoaded(imagesToLoad);
      
      imgLoad.on('progress', () => {
        handleImageLoad();
      });

      // Start font loading check
      checkFonts();

      // Cleanup
      return () => {
        imgLoad.off('progress');
      };
    }

    // If no images, still check fonts
    if (imagesToLoad.length === 0) {
      checkFonts();
    }
  }, [onComplete, criticalImages]);

  return { progress, imagesReady, fontsReady };
};
