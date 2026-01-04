import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLoader } from '../context/LoaderContext';

const Preloader = () => {
  const { isLoaded } = useLoader();
  const loaderRef = useRef(null);
  const loadingRef = useRef(null);

  useEffect(() => {
    if (isLoaded &amp;&amp; loaderRef.current &amp;&amp; loadingRef.current) {
      // Exit animation
      const tl = gsap.timeline({
        onComplete: () => {
          if (loadingRef.current) {
            loadingRef.current.remove();
          }
          if (loaderRef.current) {
            loaderRef.current.remove();
          }
        }
      });

      tl.to(loadingRef.current, {
        yPercent: -100,
        duration: 1.25,
        ease: 'power4.inOut',
      });

      tl.to(loaderRef.current, {
        yPercent: -100,
        backgroundColor: '#EDECE7',
        duration: 1.5,
        ease: 'power4.inOut',
      }, '-=0.5');
    }
  }, [isLoaded]);

  useEffect(() => {
    // Entrance animation
    const tl = gsap.timeline();
    
    tl.from(loadingRef.current, {
      yPercent: 100,
      ease: 'power3.inOut',
      duration: 1,
    });

    tl.from('.loading-text h1 span', {
      duration: 0.6,
      delay: -0.3,
      y: 130,
      skewY: 10,
      stagger: 0.4,
      ease: 'Power3.easeOut',
    }, 'loader-same');

    tl.from('.loader-box', {
      rotate: -360,
      scale: 4,
      duration: 2,
      ease: 'ease',
    }, 'loader-same');
  }, []);

  return (
    <>
      <section id="loader" ref={loaderRef} className="fixed w-full h-full bg-white overflow-hidden z-[7]"></section>
      <div ref={loadingRef} className="loading fixed w-full h-full bg-black overflow-hidden z-[100] flex items-center justify-center">
        <div className="loading-main flex items-center justify-center flex-col">
          <div className="loader-box absolute top-1/2 left-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2 rotate-45">
            <span className="absolute block w-10 h-10 bg-[#747474] top-0 left-0 animate-loaderBlock"></span>
            <span className="absolute block w-10 h-10 bg-[#747474] top-0 right-0 animate-loaderBlockInverse"></span>
            <span className="absolute block w-10 h-10 bg-[#747474] bottom-0 left-0 animate-loaderBlockInverse"></span>
            <span className="absolute block w-10 h-10 bg-[#747474] bottom-0 right-0 animate-loaderBlock"></span>
          </div>
          <div className="loading-text text-[4rem] text-white z-[2]">
            <h1 className="inline-block overflow-hidden">
              <span className="inline-block font-[FontStyleNew]">Building &nbsp;</span>
            </h1>
            <h1 className="inline-block overflow-hidden">
              <span className="inline-block font-[FontStyleNew]">your &nbsp;</span>
            </h1>
            <h1 className="inline-block overflow-hidden">
              <span className="inline-block font-[FontStyleNew]">experience </span>
            </h1>
            <h1 className="inline-block overflow-hidden">
              <span className="inline-block font-[FontStyleNew]">...</span>
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Preloader;
