import React, { createContext, useContext, useState, useEffect } from 'react';

const LoaderContext = createContext();

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within LoaderProvider');
  }
  return context;
};

export const LoaderProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const markAsLoaded = () => {
    setIsLoaded(true);
  };

  const updateProgress = (progress) => {
    setLoadingProgress(progress);
  };

  return (
    <LoaderContext.Provider value={{ isLoaded, loadingProgress, markAsLoaded, updateProgress }}>
      {children}
    </LoaderContext.Provider>
  );
};
