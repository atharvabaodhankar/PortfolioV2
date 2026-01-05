import React, { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
// import Shery from 'sheryjs'; // TODO: Fix Sh ery imports

gsap.registerPlugin(ScrollTrigger);

const Created = () => {
  const createdRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia('(min-width: 768px)').matches) {
        gsap.from('.created-img', {
          opacity: 0,
          xPercent: -150,
          skewY: 10,
          duration: 2,
          ease: 'ease',
          scrollTrigger: {
            trigger: '#created',
            start: '30% 50%',
            end: '55% 50%',
            scrub: 2,
          },
        });

        gsap.from('.created h1', {
          opacity: 0,
          xPercent: -100,
          skewY: 10,
          delay: 1,
          duration: 2,
          ease: 'ease',
          scrollTrigger: {
            trigger: '#created',
            start: '30% 50%',
            end: '55% 50%',
            scrub: 2,
          },
        });
      } else {
        gsap.from('.created-img', {
          opacity: 0,
          skewY: 10,
          ease: 'ease',
          scrollTrigger: {
            trigger: '#created',
            start: '30% 50%',
            end: '55% 50%',
            scrub: 2,
          },
        });

        gsap.from('.created h1', {
          opacity: 0,
          y: 100,
          skewY: 10,
          ease: 'ease',
          scrollTrigger: {
            trigger: '#created',
            start: '30% 50%',
            end: '55% 50%',
            scrub: 2,
          },
        });
      }
    }, createdRef);

    // Shery effects
    if (window.matchMedia('(min-width: 768px)').matches) {
      Shery.makeMagnet('.aboutme-img', {
        ease: 'cubic-bezier(0.23, 1, 0.320, 1)',
        duration: 1,
      });

      Shery.imageEffect('.created-img', {
        style: 6,
        // preset: './presets/wigglewobble.json', // Missing file
      });
    }

    return () => ctx.revert();
  }, []);

  return (
    <section id="created" ref={createdRef} className="flex items-center justify-center min-h-[80vh] py-24 pb-0">
      <div className="created flex items-center justify-center text-center select-none">
        <h1 className="text-[6vw] font-normal">
          I WAS <br /> <span className="font-[ArsenicaDemibold]">CODED</span>
          <div className="created-img-1 created-img w-[250px] h-[100px] inline-block">
            <img src="/src/assets/imgs/created-img-1.jpg" alt="" className="w-full h-full object-cover" />
          </div>
          <br />
          <div className="created-img-2 created-img w-[250px] h-[100px] inline-block">
            <img src="/src/assets/imgs/created-img-2.png" alt="" className="w-full h-full object-cover" />
          </div>
          TO <span className="font-[ArsenicaDemibold]">DESIGN</span>
        </h1>
      </div>
    </section>
  );
};

export default Created;
