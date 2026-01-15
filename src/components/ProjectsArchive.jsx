import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowUp } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { throttle } from 'lodash';
import Footer from './Footer';

gsap.registerPlugin(ScrollTrigger);

const ProjectsArchive = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  
  const filters = ['All', 'Web', 'App', '3D', 'Design'];

  // --- 1. Data Fetching ---
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { supabase } = await import('../lib/supabaseClient');
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;

        setProjects(data || []);
        setFilteredProjects(data || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // --- 2. Filter Logic ---
  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredProjects(projects);
    } else {
        const lowerFilter = activeFilter.toLowerCase();
        const filtered = projects.filter(p => {
             const typeMatch = p.project_type?.toLowerCase() === lowerFilter;
             const techMatch = Array.isArray(p.technologies) && p.technologies.some(t => t.toLowerCase().includes(lowerFilter));
             return typeMatch || techMatch;
        });
        setFilteredProjects(filtered);
    }
  }, [activeFilter, projects, loading]);

  // --- 3. Scroll Progress Tracker ---
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- 4. Number Counter Animation ---
  useEffect(() => {
    if (loading) return;
    
    // Animate the display count
    const obj = { count: displayCount };
    const target = filteredProjects.length;
    
    gsap.to(obj, {
        count: target,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => {
            setDisplayCount(Math.round(obj.count));
        }
    });
    
    // Filter Animation Transition
    if (filteredProjects.length > 0) {
        // Fade out old cards logic if needed, but here we'll rely on GSAP batch refresh
        // or we could use the Flip plugin if we wanted complex reordering.
        // For now, let's just trigger a refresh of triggers.
        ScrollTrigger.refresh();
    }
  }, [filteredProjects, loading]);


  // --- 5. Enhanced GSAP Parallax & Animations ---
  useGSAP(() => {
    if (loading) return;

    // A. Hero Parallax
    if (heroRef.current) {
        gsap.to('.hero-background-layer', {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: heroRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5,
                invalidateOnRefresh: true
            }
        });
        
        gsap.to('.hero-word', {
            yPercent: -50,
            ease: 'none',
            scrollTrigger: {
                trigger: heroRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
                invalidateOnRefresh: true
            }
        });

        gsap.to('.hero-subtitle', {
            yPercent: -30,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: heroRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
                invalidateOnRefresh: true
            }
        });
    }

    // B. Hero Entry Animation (Timeline)
    const tl = gsap.timeline({ delay: 0.2 });
    tl.from('.hero-word-text', {
        y: '100%',
        opacity: 0,
        rotate: 3,
        duration: 1.4,
        stagger: 0.15,
        ease: 'power3.out'
    })
    .from('.hero-subtitle-content', {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power3.out'
    }, "-=0.8")
    .from('.scroll-indicator', {
        opacity: 0,
        y: -20,
        duration: 1,
        ease: 'power3.out'
    }, "-=0.5");


    // C. Card Parallax on Scroll
    const cards = gsap.utils.toArray('.project-card');
    cards.forEach((card, i) => {
        // Alternating parallax direction
        const direction = i % 2 === 0 ? -20 : 20;

        gsap.to(card, {
            y: direction,
            ease: 'none',
            scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5,
                invalidateOnRefresh: true
            }
        });

        // Image moves opposite direction (inner parallax)
        const img = card.querySelector('.project-img');
        if (img) {
            gsap.to(img, {
                y: -direction * 1.5,
                scale: 1.1,
                ease: 'none',
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2,
                    invalidateOnRefresh: true
                }
            });
        }
    });

    // D. Floating Elements Animation
    gsap.to('.floating-orb', {
        y: '+=50',
        x: '+=30',
        duration: 8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 2
    });

    ScrollTrigger.refresh();

  }, { scope: containerRef, dependencies: [loading, filteredProjects] });


  // --- 6. Interaction Handlers ---
  
  // Throttle mouse move for performance
  const handleMouseMove = throttle((e) => {
      // Disable on mobile/tablet for performance
      if (window.innerWidth < 768) return;

      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      
      // Calculate cursor position relative to card center
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Calculate 3D rotation values
      // Normalized coordinates (-0.5 to 0.5)
      const xNorm = (e.clientX - rect.left) / rect.width - 0.5;
      const yNorm = (e.clientY - rect.top) / rect.height - 0.5;
      
      // Magnetic pull (max 15px)
      gsap.to(card, {
          x: x * 0.1,
          y: y * 0.1,
          rotateY: xNorm * 10, // 3D Tilt
          rotateX: -yNorm * 10,
          transformPerspective: 1000,
          duration: 0.5,
          ease: 'power2.out'
      });
  }, 16); // ~60fps

  const handleMouseEnter = (e) => {
      const card = e.currentTarget;
      const img = card.querySelector('.project-img');
      const overlay = card.querySelector('.project-overlay');
      const content = card.querySelector('.overlay-content');
      const badges = card.querySelectorAll('.tech-badge');
      
      const tl = gsap.timeline();
      
      // Image scale & color
      tl.to(img, { 
          scale: 1.08, 
          filter: 'grayscale(0%)', 
          duration: 0.8, 
          ease: 'power3.out' 
      })
      // Overlay gradient
      .to(overlay, {
          background: 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.6), transparent)',
          duration: 0.5,
          opacity: 1,
          y: 0
      }, 0)
      // Content slide up
      .fromTo(content, 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 
          0.2
      )
      // Badges Stagger
      .fromTo(badges, 
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(2)' }, 
          0.3
      );
  };

  const handleMouseLeave = (e) => {
      const card = e.currentTarget;
      const img = card.querySelector('.project-img');
      const overlay = card.querySelector('.project-overlay');
      
      // Reset card position (Elastic)
      gsap.to(card, {
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.5)'
      });

      // Reset Image
      gsap.to(img, { 
          scale: 1, 
          filter: 'grayscale(100%)', 
          duration: 0.6, 
          ease: 'power2.out' 
      });

      // Reset Overlay
      gsap.to(overlay, { 
          opacity: 0, 
          y: 15, 
          duration: 0.4, 
          ease: 'power3.inOut' 
      });
  };

  const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  // --- 7. Helper: Bento Grid Classes ---
  const getBentoClasses = (index, isFeatured) => {
      // Mobile: all full width
      let classes = "col-span-12";
      
      if (typeof window !== 'undefined' && window.innerWidth >= 768) {
          // Tablet & Desktop logic
          // Use grid-cols-12 system
          
          if (isFeatured || index === 0) {
              // Large item
              classes = "col-span-12 md:col-span-8 lg:col-span-8 row-span-2";
          } else if (index % 5 === 0 && index !== 0) {
              // Wide item
              classes = "col-span-12 md:col-span-12 lg:col-span-8 row-span-1";
          } else {
              // Standard item
              classes = "col-span-12 md:col-span-6 lg:col-span-4 row-span-1";
          }
      } else {
          // Default for SSR or mobile fallback
           classes = "col-span-12"; 
      }
      return classes;
  };


  if (loading) return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center text-[#1C1917] font-mono">
       <span className="animate-pulse tracking-widest uppercase text-sm">Loading Archive...</span>
    </div>
  );

  return (
    <main ref={containerRef} className="relative min-h-screen bg-[#FAFAF9] text-[#1C1917] overflow-hidden pb-24 selection:bg-[#1C1917] selection:text-white">
      
      {/* 1. Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-[#E7E5E4] z-50">
        <div 
          className="h-full bg-[#1C1917] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40 -z-10">
        <div className="floating-orb absolute w-[500px] h-[500px] bg-gradient-to-br from-[#1C1917]/5 to-transparent rounded-full blur-3xl -top-48 -left-48" />
        <div className="floating-orb absolute w-[400px] h-[400px] bg-gradient-to-br from-[#78716C]/5 to-transparent rounded-full blur-3xl top-1/3 -right-48" />
        <div className="floating-orb absolute w-[600px] h-[600px] bg-gradient-to-br from-[#1C1917]/5 to-transparent rounded-full blur-3xl -bottom-48 left-1/3" />
      </div>

      {/* 3. Hero Section with Parallax */}
      <section ref={heroRef} className="relative min-h-[70vh] flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-32 mb-12">
        {/* Animated gradient + grid background using SVG */}
        <div className="absolute inset-0 -z-10 hero-background-layer">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FAFAF9] via-[#F5F5F4] to-[#E7E5E4]" />
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1C1917" strokeWidth="0.5" opacity="0.1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1800px] w-full mx-auto">
             <div className="hero-word overflow-hidden mb-2">
                <h1 className="hero-word-text text-[clamp(3.5rem,8vw,9rem)] font-arsenica leading-[0.9] tracking-tight text-[#1C1917]">
                   Selected
                </h1>
             </div>
             <div className="hero-word overflow-hidden">
                 <h1 className="hero-word-text text-[clamp(3.5rem,8vw,9rem)] font-arsenica leading-[0.9] tracking-tight text-[#1C1917]/90 italic font-light">
                    Work
                 </h1>
             </div>
             
             <div className="hero-subtitle mt-8 md:mt-12 flex flex-col md:flex-row gap-6 md:items-center max-w-2xl">
                <div className="hero-subtitle-content h-[1px] w-12 bg-[#1C1917]/20 hidden md:block"></div>
                <p className="hero-subtitle-content font-mono text-[#78716C] text-sm md:text-base leading-relaxed">
                   Crafting digital experiences that merge systems thinking with editorial aesthetics. 
                   A curated archive of web, mobile, and 3D experiments.
                </p>
             </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator absolute bottom-6 right-6 md:right-24 md:bottom-12 animate-bounce duration-[2000ms]">
           <ArrowUp className="rotate-180 text-[#1C1917]/40" size={24} />
        </div>
      </section>


      {/* 4. Filter System */}
      <div className="sticky top-0 z-40 bg-[#FAFAF9]/90 backdrop-blur-md border-b border-[#E7E5E4] mb-12">
         <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
             
             {/* Animated Count */}
             <div className="font-mono text-xs tracking-widest text-[#78716C] uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1C1917] animate-pulse"></span>
                [{displayCount} Projects]
             </div>

             {/* Filters */}
             <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
                {filters.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`relative px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-500 overflow-hidden group ${
                            activeFilter === filter 
                            ? 'text-[#FAFAF9]' 
                            : 'text-[#1C1917] hover:text-[#1C1917]/70'
                        }`}
                    >
                         {/* Active Background Pill */}
                         {activeFilter === filter && (
                             <span className="absolute inset-0 bg-[#1C1917] z-[-1]"></span>
                         )}
                         {/* Hover Background (Subtle) */}
                         {activeFilter !== filter && (
                            <span className="absolute inset-0 bg-[#E7E5E4] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 z-[-1] origin-left rounded-full"></span>
                         )}
                        {filter}
                    </button>
                ))}
             </div>
         </div>
      </div>


      {/* 5. Projects Grid (Bento) */}
      <div className="max-w-[1800px] mx-auto px-4 md:px-12 lg:px-24">
          <div className="grid grid-cols-12 gap-4 md:gap-6 lg:gap-8 auto-rows-[300px] md:auto-rows-[400px]">
              
              {filteredProjects.map((project, index) => {
                  const bentoClass = getBentoClasses(index, project.is_featured);

                  return (
                      <article 
                        key={project.id}
                        onMouseEnter={handleMouseEnter}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        className={`project-card group relative bg-white rounded-lg overflow-hidden cursor-pointer will-change-transform ${bentoClass}`}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                          {/* Image Container */}
                          <div className="w-full h-full overflow-hidden absolute inset-0">
                              <img 
                                loading="lazy"
                                src={project.image_url} 
                                alt={project.title}
                                className="project-img w-full h-full object-cover filter grayscale scale-100 transition-transform duration-700 ease-out"
                              />
                          </div>
                      
                          {/* Content Overlay */}
                          <div className="project-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 translate-y-4 flex flex-col justify-end p-6 md:p-10 transition-all duration-500 pointer-events-none">
                                <div className="overlay-content transform translate-y-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies?.slice(0,3).map((t, i) => (
                                                <span key={i} className="tech-badge text-[10px] font-mono uppercase tracking-wider text-white/90 bg-white/20 backdrop-blur-md px-2 py-1 rounded-sm border border-white/10 shadow-sm">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="bg-white/90 p-3 rounded-full text-black">
                                            <ArrowUpRight size={16} />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl md:text-4xl font-arsenica text-[#FAFAF9] mb-2 leading-none">
                                        {project.title}
                                    </h3>
                                    <p className="text-[#FAFAF9]/80 font-mono text-xs md:text-sm line-clamp-2 max-w-lg">
                                        {project.subtitle || project.description}
                                    </p>
                                </div>
                          </div>
                      </article>
                  );
              })}
          </div>

          {filteredProjects.length === 0 && (
              <div className="py-32 text-center border-t border-[#E7E5E4] mt-12 bg-white/50 backdrop-blur-sm rounded-lg">
                   <h3 className="text-2xl font-arsenica text-[#1C1917]/40 mb-4">Empty Archive</h3>
                   <p className="font-mono text-[#78716C]">No projects found in this category.</p>
                   <button onClick={() => setActiveFilter('All')} className="mt-8 px-8 py-3 bg-[#1C1917] text-white rounded-full text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                       Reset Filters
                   </button>
              </div>
          )}
      </div>


      {/* Back to Top */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 mix-blend-difference p-4 bg-white text-black rounded-full shadow-2xl z-50 hover:scale-110 transition-transform duration-300 hidden md:flex items-center justify-center group"
      >
          <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
      </button>

      {/* Footer */}
      <div className="mt-32">
          <Footer />
      </div>

    </main>
  );
};

export default ProjectsArchive;
