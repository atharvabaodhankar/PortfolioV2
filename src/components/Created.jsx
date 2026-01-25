import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
// import Shery from 'sheryjs'; // TODO: Fix Sh ery imports
import createdImg1 from '../assets/imgs/created-img-1.jpg';
import createdImg2 from '../assets/imgs/created-img-2.png';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Created = () => {
  const createdRef = useRef(null);

  useGSAP(() => {
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
            invalidateOnRefresh: true
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
            invalidateOnRefresh: true
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
            invalidateOnRefresh: true
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
            invalidateOnRefresh: true
          },
        });
      }

    // Shery effects (TODO: Re-enable when Shery is properly imported)
    // if (window.matchMedia('(min-width: 768px)').matches) {
    //   Shery.makeMagnet('.aboutme-img', {
    //     ease: 'cubic-bezier(0.23, 1, 0.320, 1)',
    //     duration: 1,
    //   });

    //   Shery.imageEffect('.created-img', {
    //     style: 6,
    //     // preset: './presets/wigglewobble.json', // Missing file
    //   });
    // }

  }, { scope: createdRef });

  return (
    <section id="created" ref={createdRef} className="flex items-center justify-center min-h-[80vh] py-24 pb-0">
      <div className="created flex items-center justify-center text-center select-none">
        <h1 className="text-[6vw] font-normal">
          I WAS <br /> <span className="font-arsenica">CODED</span>
          <div className="created-img-1 created-img w-[250px] h-[100px] inline-block">
            <img src={createdImg1} alt="" className="w-full h-full object-cover" />
          </div>
          <br />
          <div className="created-img-2 created-img w-[250px] h-[100px] inline-block">
            <img src={createdImg2} alt="" className="w-full h-full object-cover" />
          </div>
          TO <span className="font-arsenica">DESIGN</span>
        </h1>
      </div>
    </section>
  );
};

export default Created;
