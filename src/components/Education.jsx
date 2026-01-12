import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Education = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        // Sticky Header Parallax
        gsap.to('.edu-header-content', {
            y: -15, 
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true
            }
        });

        // Sticky Status Rotator
        gsap.to('.edu-status-icon', {
            rotate: 360,
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1
            }
        });

        // Entries Reveal Sequence
        const entries = gsap.utils.toArray('.edu-entry');
        entries.forEach((entry, i) => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: entry,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });

            tl.from(entry.querySelector('.edu-year'), {
                y: 20,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            })
            .from(entry.querySelector('.edu-title'), {
                y: 20,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            }, '-=0.8')
            .from(entry.querySelector('.edu-meta'), {
                y: 20,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            }, '-=0.8');
        });

    }, { scope: containerRef });

    return (
        <section 
            ref={containerRef} 
            className="w-full min-h-screen bg-white text-black px-6 md:px-12 lg:px-24 py-32 relative z-10 font-sans"
        >
            <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-32">
                
                {/* LEFT COLUMN - STICKY */}
                <div className="lg:w-1/3 flex flex-col justify-between lg:h-[calc(100vh-200px)] lg:sticky lg:top-32 edu-header-content">
                    <div>
                        <h2 
                            className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-8"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            Academic<br/>Journey
                        </h2>
                        <div className="h-1 w-24 bg-black mb-8 origin-left hover:scale-x-150 transition-transform duration-700 ease-out"></div>
                        <p 
                            className="text-lg text-gray-500 font-normal leading-relaxed max-w-sm"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            A timeline of technical discipline, foundational theory, and continuous growth.
                        </p>
                    </div>

                    <div className="hidden lg:flex items-center gap-3 opacity-60 mt-auto">
                         <span className="material-symbols-outlined edu-status-icon text-2xl">history_edu</span>
                         <span className="text-xs font-mono uppercase tracking-widest">Education History</span>
                    </div>
                </div>

                {/* RIGHT COLUMN - SCROLLABLE ENTRIES */}
                <div className="lg:w-2/3 flex flex-col gap-32 pt-10 lg:pt-20 pb-20">
                    
                    {/* Entry 1 */}
                    <article className="edu-entry group relative pl-8 md:pl-0 border-l md:border-l-0 border-gray-200 md:border-none">
                         <div className="edu-year mb-4">
                            <span className="text-sm font-mono uppercase tracking-widest text-gray-400 border border-gray-200 px-3 py-1 rounded-full">
                                2025 — 2028
                            </span>
                         </div>
                         <h3 
                            className="edu-title text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight mb-4 group-hover:text-primary transition-colors duration-500"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            Bachelor of Technology —<br/>Computer Engineering
                         </h3>
                         <div className="edu-meta space-y-2 text-lg md:text-xl text-gray-500 font-light">
                            <p>MIT Academy of Engineering, Alandi, Pune</p>
                            <div className="w-12 h-[1px] bg-gray-200 my-4 origin-left group-hover:scale-x-150 transition-transform duration-500"></div>
                         </div>
                    </article>

                    {/* Entry 2 */}
                    <article className="edu-entry group relative pl-8 md:pl-0 border-l md:border-l-0 border-gray-200 md:border-none">
                         <div className="edu-year mb-4">
                            <span className="text-sm font-mono uppercase tracking-widest text-gray-400 border border-gray-200 px-3 py-1 rounded-full">
                                2022 — 2025
                            </span>
                         </div>
                         <h3 
                            className="edu-title text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight mb-4 group-hover:text-primary transition-colors duration-500"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            Diploma —<br/>Computer Technology
                         </h3>
                         <div className="edu-meta space-y-2 text-lg md:text-xl text-gray-500 font-light">
                            <p>Solapur Education Society’s Polytechnic, Solapur</p>
                            <p className="text-primary font-medium">Grade: 93.20%</p>
                            <div className="w-12 h-[1px] bg-gray-200 my-4 origin-left group-hover:scale-x-150 transition-transform duration-500"></div>
                         </div>
                    </article>

                </div>
            </div>
        </section>
    );
};

export default Education;
