import { useState, useEffect } from 'react';
import imagesLoaded from 'imagesloaded';

export const usePreloader = (onComplete, criticalImages = []) => {
  const [progress, setProgress] = useState(0);
  const [imagesReady, setImagesReady] = useState(false);

  useEffect(() => {
    const minPreloaderTime = 2000;
    const startTime = Date.now();
    
    // Get all images or use critical images list
    const imagesToLoad = criticalImages.length > 0 
      ? criticalImages 
      : Array.from(document.querySelectorAll('img'));

    if (imagesToLoad.length === 0) {
      // No images to load, complete immediately after min time
      setTimeout(() => {
        setImagesReady(true);
        onComplete?.();
      }, minPreloaderTime);
      return;
    }

    let loadedCount = 0;
    const totalImages = imagesToLoad.length;

    const handleImageLoad = () => {
      loadedCount++;
      const currentProgress = (loadedCount / totalImages) * 100;
      setProgress(currentProgress);

      if (loadedCount === totalImages) {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minPreloaderTime - elapsedTime);

        setTimeout(() => {
          setImagesReady(true);
          onComplete?.();
        }, remainingTime);
      }
    };

    // Use imagesLoaded library for robust loading detection
    const imgLoad = imagesLoaded(imagesToLoad);
    
    imgLoad.on('progress', () => {
      handleImageLoad();
    });

    // Cleanup
    return () => {
      imgLoad.off('progress');
    };
  }, [onComplete, criticalImages]);

  return { progress, imagesReady };
};
