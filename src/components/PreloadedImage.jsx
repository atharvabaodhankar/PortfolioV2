import { useState, useEffect } from 'react';

const PreloadedImage = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = null,
  onLoad = null,
  onError = null,
  ...props 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setHasError(false);
    setImageSrc(src);
  }, [src]);

  const handleLoad = (e) => {
    setImageLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setHasError(true);
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(false);
    }
    if (onError) onError(e);
  };

  return (
    <div className="relative w-full h-full">
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading="eager"
        {...props}
      />
      
      {!imageLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-gray-500 text-xs font-mono">Loading...</div>
          </div>
        </div>
      )}
      
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
          <div className="text-red-500 text-sm font-mono">Failed to load image</div>
        </div>
      )}
    </div>
  );
};

export default PreloadedImage;