import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Education = () => {
    const containerRef = useRef(null);
    const diplomaRef = useRef(null);
    const btechRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: '+=1200',
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true
            }
        });

        // Initial setup - only diploma visible
        gsap.set(diplomaRef.current, { autoAlpha: 1, y: 0 });
        gsap.set(btechRef.current, { autoAlpha: 0, y: 50 });
        
        // Phase 1: Diploma stays visible (0% - 40%)
        tl.to(diplomaRef.current, {
            y: -10,
            duration: 2,
            ease: 'none'
        }, 0)
        
        // Phase 2: Diploma fades out (40% - 60%)
        .to(diplomaRef.current, {
            autoAlpha: 0,
            y: -30,
            duration: 1,
            ease: 'power2.in'
        }, 2)
        
        // Phase 3: B.Tech fades in (60% - 100%)
        .to(btechRef.current, {
            autoAlpha: 1,
            y: 0,
            duration: 1.5,
            ease: 'power2.out'
        }, 3)
        
        .from(btechRef.current.querySelectorAll('.stagger-el-2'), {
            y: 20,
            autoAlpha: 0,
            stagger: 0.15,
            duration: 1,
            ease: 'power2.out'
        }, 3.5);

    }, { scope: containerRef });

    return (
        <section 
            ref={containerRef} 
            className="w-full h-screen bg-white text-black px-6 md:px-12 lg:px-24 overflow-hidden relative font-sans"
        >
            <div className="max-w-[1600px] mx-auto h-full flex flex-col lg:flex-row">
                
                {/* LEFT COLUMN: Fixed Editorial Header */}
                <div className="lg:w-1/3 flex flex-col justify-center h-full relative z-10">
                    <h2 
                        className="text-6xl md:text-7xl lg:text-[7rem] font-bold tracking-tighter leading-[0.9] mb-8 font-arsenica"
                        
                    >
                        Academic<br/>Journey
                    </h2>
                    <div className="w-24 h-1 bg-black mb-8 progress-line origin-left"></div>
                    <p 
                        className="text-lg text-gray-500 font-normal leading-relaxed max-w-sm"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        Evolution of craft through disciplined study.
                    </p>
                </div>

                {/* RIGHT COLUMN: The Narrative Stage */}
                <div className="lg:w-2/3 h-full relative flex items-center lg:pl-32">
                    
                    {/* Scroll indicator */}
                    <div className="absolute bottom-8 right-8 flex flex-col items-center text-gray-400 animate-pulse">
                        <span className="text-xs font-mono mb-2 rotate-90 origin-center">scroll</span>
                        <div className="w-px h-8 bg-gray-300"></div>
                    </div>
                    
                    {/* CHAPTER 1: DIPLOMA (Absolute positioned to overlap) */}
                    <div ref={diplomaRef} className="absolute w-full max-w-2xl">
                        <div className="stagger-el mb-6">
                            <span className="text-sm font-mono uppercase tracking-[0.2em] text-gray-400">
                                Phase I — Foundation
                            </span>
                        </div>
                        <h3 
                            className="stagger-el text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-8 leading-tight"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            Diploma in<br/>Computer Technology
                        </h3>
                        
                        <div className="stagger-el flex flex-col gap-4 text-xl md:text-2xl text-gray-500 font-light border-l border-gray-200 pl-6">
                            <p>Solapur Education Society’s<br/>Polytechnic, Solapur</p>
                            <span className="font-mono text-sm tracking-widest text-gray-400 mt-2">2022 — 2025</span>
                        </div>

                        {/* The Reward */}
                        <div className="stagger-el mt-12 inline-flex items-center px-6 py-3 bg-gray-50 rounded-full">
                            <span className="text-sm font-medium tracking-wide text-gray-700">Grade Distinction: 93.20%</span>
                        </div>
                    </div>

                    {/* CHAPTER 2: BTECH (Absolute positioned, starts hidden) */}
                    <div ref={btechRef} className="absolute w-full max-w-2xl opacity-0 invisible">
                         <div className="stagger-el-2 mb-6">
                            <span className="text-sm font-mono uppercase tracking-[0.2em] text-primary">
                                Phase II — Evolution
                            </span>
                        </div>
                        <h3 
                            className="stagger-el-2 text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-8 leading-tight text-black"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            Bachelor of Technology<br/>Computer Engineering
                        </h3>
                        
                        <div className="stagger-el-2 flex flex-col gap-4 text-xl md:text-2xl text-gray-500 font-light border-l border-black pl-6">
                            <p>MIT Academy of Engineering,<br/>Alandi, Pune</p>
                            <span className="font-mono text-sm tracking-widest text-gray-400 mt-2">2025 — 2028</span>
                        </div>

                        <div className="stagger-el-2 mt-12 flex items-center opacity-60">
                            <span className="text-sm font-medium tracking-wide border-b border-black/20 pb-0.5 lowercase italic" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                                future focus: Systems & Architecture
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Education;
