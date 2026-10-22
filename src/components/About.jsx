import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import aboutImg from '../assets/imgs/hero-vid.gif';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const About = () => {
  const aboutRef = useRef(null);

  useGSAP(() => {
    // Set initial states for reveal animations
    gsap.set('.reveal-text', { opacity: 0, y: 40 });
    gsap.set('.tilt-card', { scale: 0.9, opacity: 0, rotationY: -15 });

    // Create main timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
        invalidateOnRefresh: true,
      },
    });

    // Animate elements in sequence with delays
    tl.to('.reveal-text', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
    }).to(
      '.tilt-card',
      {
        scale: 1,
        opacity: 1,
        rotationY: 0,
        duration: 0.8,
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      '-=0.8'
    );

    // Image hover effect
    const imageContainer = aboutRef.current?.querySelector('.image-container');
    const tiltCard = aboutRef.current?.querySelector('.tilt-card');

    if (imageContainer && tiltCard) {
      imageContainer.addEventListener('mouseenter', () => {
        gsap.to(tiltCard, {
          rotationY: -5,
          rotationX: 2,
          duration: 0.8,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        });
      });

      imageContainer.addEventListener('mouseleave', () => {
        gsap.to(tiltCard, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.8,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        });
      });
    }
  }, { scope: aboutRef });

  return (
    <section
      id="aboutme"
      ref={aboutRef}
      className="w-full px-6 md:px-12 lg:px-24 pt-32 pb-20 max-w-[1600px] mx-auto relative font-sans"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start relative">
        {/* Left Column: Image Card */}
        <div className="lg:col-span-4 lg:col-start-2 lg:mt-32 relative reveal-text image-container mb-12 lg:mb-0 non-hover">
          <div
            className="relative tilt-card group cursor-default non-hover"
            style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
          >
            {/* Background architectural shadow card */}
            <div className="absolute inset-0 bg-[#E4E4E7] rounded-sm transform translate-x-3 translate-y-3 -rotate-2 transition-transform duration-700 ease-out group-hover:translate-x-6 group-hover:translate-y-5 group-hover:-rotate-4 z-0"></div>

            {/* Main image card */}
            <div className="relative overflow-hidden rounded-sm shadow-xl bg-white p-2 transform rotate-2 transition-transform duration-700 ease-out group-hover:rotate-0 z-10 non-hover border border-[#1A1A1A]/10">
              <div className="aspect-[3/4] overflow-hidden rounded-sm relative non-hover bg-[#1A1A1A]/5">
                <img
                  alt="Atharva Baodhankar"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-out non-hover"
                  src={aboutImg}
                  width="480"
                  height="640"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-6 lg:col-start-7 lg:mt-32 flex flex-col gap-10 pl-0 lg:pl-12 reveal-text">
          <div className="space-y-8 relative">
            {/* Main Statement */}
            <h2 className="text-3xl md:text-4xl lg:text-[2.65rem] leading-[1.2] font-light tracking-tight text-[#1A1A1A]">
              I'm{' '}
              <span className="font-arsenica font-bold text-[#1A1A1A] tracking-normal inline-block text-[1.12em]">
                Atharva Baodhankar
              </span>{' '}
              — a{' '}
              <span className="font-arsenica italic font-semibold text-[#1A1A1A] relative inline-block text-[1.06em]">
                Blockchain & Cloud Engineer
                <svg
                  className="absolute w-full h-2.5 -bottom-1 left-0 text-[#1A1A1A]/20 -z-10"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 20"
                >
                  <path
                    d="M0 15 Q 50 25 100 15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="7"
                  ></path>
                </svg>
              </span>{' '}
              interested in designing scalable systems, exploring distributed architectures, and building real-world technology products.
            </h2>

            {/* Narrative Paragraphs */}
            <div className="space-y-6 text-base md:text-lg text-[#52525B] font-light leading-relaxed max-w-2xl">
              <p>
                From{' '}
                <span className="text-[#1A1A1A] font-normal underline-anim">
                  full-stack applications
                </span>{' '}
                to{' '}
                <span className="text-[#1A1A1A] font-normal underline-anim">
                  blockchain infrastructure
                </span>
                , I enjoy turning complex technical ideas into working products — with a focus on{' '}
                <span className="text-[#1A1A1A] font-medium">
                  how systems are designed, how components communicate, and how they scale
                </span>
                .
              </p>

              <p>
                I think beyond individual features — exploring{' '}
                <span
                  className="italic font-display font-medium text-lg text-[#1A1A1A]"
                  style={{ fontFamily: "'Bodoni Moda', serif" }}
                >
                  system architecture, data flow, APIs, databases, distributed systems
                </span>
                , and the engineering decisions that shape real-world software.
              </p>

              <p>
                I'm particularly interested in{' '}
                <span className="text-[#1A1A1A] font-medium underline-anim">
                  system design, cloud infrastructure, blockchain protocols, and developer tooling
                </span>{' '}
                — constantly experimenting, building projects, and understanding the trade-offs behind the technologies we use.
              </p>
            </div>
          </div>

          {/* Architectural Skill / Focus Tags */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            {[
              'Distributed Systems',
              'Cloud Infrastructure',
              'Blockchain Protocols',
              'System Design',
              'API Architecture',
              'Developer Tooling',
            ].map((skill, idx) => (
              <span
                key={skill}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#F4F4F5]/80 border border-[#1A1A1A]/10 text-xs font-mono text-[#27272A] hover:border-[#1A1A1A]/30 transition-colors"
              >
                <span className="text-[#A1A1AA] text-[10px]">0{idx + 1}</span>
                <span>{skill}</span>
              </span>
            ))}
          </div>

          {/* Location & Ethos Ledger */}
          <div className="pt-6 border-t border-[#1A1A1A]/10 flex items-center gap-4 text-[#71717A] font-mono text-xs uppercase tracking-widest">
            <div className="h-px w-12 bg-[#1A1A1A]/20"></div>
            <p>Based in India • Engineering for the Global Web</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
