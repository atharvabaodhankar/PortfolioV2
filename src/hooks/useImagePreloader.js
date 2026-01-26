import { useState, useEffect, useRef } from 'react';

const useImagePreloader = (imageUrls) => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [allLoaded, setAllLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const imageCache = useRef(new Map());

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      setAllLoaded(true);
      return;
    }

    let loadedCount = 0;
    const totalImages = imageUrls.length;

    const preloadImage = (url) => {
      return new Promise((resolve, reject) => {
        // Check if image is already cached
        if (imageCache.current.has(url)) {
          resolve(url);
          return;
        }

        const img = new Image();
        
        img.onload = () => {
          imageCache.current.set(url, img);
          loadedCount++;
          setLoadedImages(prev => new Set([...prev, url]));
          setLoadingProgress((loadedCount / totalImages) * 100);
          
          if (loadedCount === totalImages) {
            setAllLoaded(true);
          }
          resolve(url);
        };

        img.onerror = (error) => {
          console.warn(`Failed to preload image: ${url}`, error);
          loadedCount++;
          setLoadingProgress((loadedCount / totalImages) * 100);
          
          if (loadedCount === totalImages) {
            setAllLoaded(true);
          }
          reject(error);
        };

        // Set crossOrigin for external images
        if (url.startsWith('http')) {
          img.crossOrigin = 'anonymous';
        }
        
        img.src = url;
      });
    };

    // Preload all images
    Promise.allSettled(imageUrls.map(preloadImage))
      .then(() => {
        setAllLoaded(true);
      })
      .catch((error) => {
        console.warn('Some images failed to preload:', error);
        setAllLoaded(true);
      });

  }, [imageUrls]);

  const isImageLoaded = (url) => loadedImages.has(url);
  const getCachedImage = (url) => imageCache.current.get(url);

  return {
    allLoaded,
    loadingProgress,
    isImageLoaded,
    getCachedImage,
    loadedImages
  };
};

export default useImagePreloader;