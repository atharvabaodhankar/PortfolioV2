import { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowUp, X, ExternalLink, Github } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { throttle } from 'lodash';
import Footer from './Footer';
import Navbar from './Navbar';

gsap.registerPlugin(ScrollTrigger);

const ProjectsArchive = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const modalRef = useRef(null);
  
  const filters = ['All', 'Web', 'App', '3D', 'Design'];

  // Helper function to strip HTML tags and decode entities
  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

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
    const tl = gsap.timeline({ delay: 0.1 }); // Reduced delay
    
    // Explicitly set initial state to avoid FOUC or stuck state
    gsap.set('.hero-word-text', { y: '100%', opacity: 0, rotate: 3 });
    gsap.set('.hero-subtitle-content', { y: 20, opacity: 0 });
    gsap.set('.scroll-indicator', { y: -20, opacity: 0 });

    tl.to('.hero-word-text', {
        y: '0%',
        opacity: 1,
        rotate: 0,
        duration: 1.4,
        stagger: 0.15,
        ease: 'power3.out'
    })
    .to('.hero-subtitle-content', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    }, "-=0.8")
    .to('.scroll-indicator', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    }, "-=0.5");


    // C. Floating Elements Animation
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

  // Modal Animation Logic
  useGSAP(() => {
    if (isModalOpen && modalRef.current) {
      const modal = modalRef.current;
      const contentElements = modal.querySelectorAll('.modal-animate');
      
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo(modal,
        { scale: 0.95, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.8 }
      );

      tl.fromTo(contentElements,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
        '-=0.4'
      );
    }
  }, { dependencies: [isModalOpen], scope: modalRef });

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
      // Only apply hover effects on desktop
      if (window.innerWidth < 768) return;
      
      const card = e.currentTarget;
      const img = card.querySelector('.project-img');
      const overlay = card.querySelector('.project-overlay');
      const content = card.querySelector('.overlay-content');
      const badges = card.querySelectorAll('.tech-badge');
      
      // Check if elements exist before animating
      if (!img || !overlay || !content) return;
      
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
      );
      
      // Badges Stagger (only if badges exist)
      if (badges.length > 0) {
        tl.fromTo(badges, 
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(2)' }, 
            0.3
        );
      }
  };

  const handleMouseLeave = (e) => {
      // Only apply hover effects on desktop
      if (window.innerWidth < 768) return;
      
      const card = e.currentTarget;
      const img = card.querySelector('.project-img');
      const overlay = card.querySelector('.project-overlay');
      
      // Check if elements exist before animating
      if (!img || !overlay) return;
      
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

      // Reset Overlay - but keep it visible on mobile
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

  // Modal functions
  const openModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
    setSelectedProject(null);
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);


  if (loading) return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center text-[#1C1917] font-mono">
       <span className="animate-pulse tracking-widest uppercase text-sm">Loading Archive...</span>
    </div>
  );

  return (
    <>
      <Navbar />
      <main id="main" ref={containerRef} className="relative min-h-screen bg-[#FAFAF9] text-[#1C1917] overflow-hidden selection:bg-[#1C1917] selection:text-white">
      
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
                   Projects built with a systems-first mindset — spanning web platforms, blockchain applications, and interactive experiences.
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


      {/* 5. Projects Grid (Pinterest-style Masonry) */}
      <div className="max-w-[1800px] mx-auto px-4 md:px-12 lg:px-24">
          <div className="columns-1 md:columns-2 gap-8 space-y-8">
              
              {filteredProjects.map((project, index) => {
                  return (
                      <article 
                        key={project.id}
                        onClick={() => openModal(project)}
                        onMouseEnter={handleMouseEnter}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        className="project-card group relative break-inside-avoid bg-white rounded-lg overflow-hidden cursor-pointer will-change-transform mb-8"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                          {/* Image Container (Aspect Ratio Helper) */}
                          <div className="w-full relative overflow-hidden">
                              {/* Maintain aspect ratio or let image dictate height */}
                              <img 
                                loading="lazy"
                                src={project.image_url} 
                                alt={project.title}
                                className="project-img w-full h-auto min-h-[300px] object-cover md:filter md:grayscale scale-100 transition-transform duration-700 ease-out"
                              />
                              
                              {/* Content Overlay - Always visible on mobile */}
                              <div className="project-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:opacity-0 md:translate-y-4 opacity-100 translate-y-0 flex flex-col justify-end p-6 md:p-10 transition-all duration-500 pointer-events-none">
                                    <div className="overlay-content md:transform md:translate-y-4 transform translate-y-0">
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
                                            {stripHtml(project.subtitle || project.description) || ""}
                                        </p>
                                    </div>
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

      {/* Enhanced Project Modal */}
      {isModalOpen && selectedProject && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-[20px] z-[100] flex items-center justify-center p-4 md:p-12 overflow-y-auto overflow-x-hidden"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div 
            ref={modalRef}
            className="bg-white rounded-[2rem] max-w-7xl w-full h-auto max-h-none lg:h-[85vh] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.1)] relative flex flex-col lg:flex-row"
          >
            {/* Close Button - Sticky/Fixed relative to modal */}
            <button
              onClick={closeModal}
              className="absolute top-8 right-8 z-[110] p-4 bg-black/5 hover:bg-black/10 rounded-full transition-all duration-300 backdrop-blur-md group hover:scale-110 active:scale-95"
            >
              <X size={24} className="text-gray-900" />
            </button>

            {/* Left: Media/Image Section (Sticky on scroll or fixed height) */}
            <div className="lg:w-[55%] h-[40vh] lg:h-full relative overflow-hidden bg-[#f9f9f9]">
              <img 
                src={selectedProject.image_url} 
                alt={selectedProject.title}
                className="w-full h-full object-cover modal-animate"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
              
              {/* Project Type Badge */}
              <div className="absolute bottom-8 left-8 modal-animate">
                <span className="px-5 py-2.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-mono text-gray-900 uppercase tracking-[0.2em] shadow-sm">
                  {selectedProject.project_type || 'Selected Experience'}
                </span>
              </div>
            </div>

            {/* Right: Detailed Content Section (Scrollable) */}
            <div className="lg:w-[45%] h-full flex flex-col bg-white overflow-hidden">
              <div className="flex-1 overflow-y-auto p-8 md:p-14 lg:p-16 space-y-12 custom-scrollbar" data-lenis-prevent>
                
                {/* Header Information */}
                <div className="space-y-6">
                  <div className="modal-animate flex items-center gap-3">
                    <span className="h-[1px] w-8 bg-black/20 text-black"></span>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.3em]">
                      Project Overview
                    </span>
                  </div>
                  
                  <h2 className="modal-animate text-[clamp(2rem,4vw,3.5rem)] font-arsenica text-gray-900 leading-[1.1]">
                    {selectedProject.title}
                  </h2>
                  
                  {selectedProject.subtitle && (
                    <p className="modal-animate text-lg font-mono italic text-gray-500 border-l-2 border-black/5 pl-6 leading-relaxed">
                      {stripHtml(selectedProject.subtitle)}
                    </p>
                  )}
                </div>

                {/* Main Description */}
                <div className="modal-animate space-y-6">
                  <h3 className="text-[11px] font-mono text-gray-900 uppercase tracking-[0.2em] opacity-40">
                    Background
                  </h3>
                  <div className="prose prose-sm lg:prose-base text-gray-600 leading-[1.8] font-sans">
                    {stripHtml(selectedProject.long_description || selectedProject.description || selectedProject.subtitle) || "This is a archived project showcasing modern web development practices and innovative design solutions."}
                  </div>
                </div>

                {/* Tech & Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Technologies */}
                  {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                    <div className="modal-animate space-y-6">
                      <h3 className="text-[11px] font-mono text-gray-900 uppercase tracking-[0.2em] opacity-40">
                        Capabilities
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-gray-50 text-[11px] font-mono text-gray-600 rounded-full border border-gray-100 hover:bg-black hover:text-white transition-all duration-300 cursor-default"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Highlights/Features */}
                  {selectedProject.features && selectedProject.features.length > 0 && (
                    <div className="modal-animate space-y-6">
                      <h3 className="text-[11px] font-mono text-gray-900 uppercase tracking-[0.2em] opacity-40">
                        Highlights
                      </h3>
                      <ul className="space-y-3">
                        {selectedProject.features.slice(0, 5).map((feature, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm text-gray-600 group">
                            <div className="w-1 h-1 bg-black/20 rounded-full mt-2 group-hover:bg-black transition-colors"></div>
                            <span className="leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Project Links / Actions */}
                <div className="modal-animate pt-8 space-y-4">
                  {selectedProject.link && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full px-8 py-5 bg-black text-white hover:bg-gray-900 transition-all duration-500 rounded-full group"
                    >
                      <span className="font-medium">Visit Live Experience</span>
                      <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  )}
                  {selectedProject.github_url && (
                    <a
                      href={selectedProject.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full px-8 py-5 border border-black/10 text-gray-900 hover:bg-gray-50 transition-all duration-500 rounded-full group"
                    >
                      <span className="font-medium">Repository Details</span>
                      <Github size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                </div>
              </div>

              {/* Footer info (Static in content column) */}
              <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between bg-gray-50/50">
                <span className="text-[10px] font-mono text-gray-400">© 2026 Atharva</span>
                <span className="text-[10px] font-mono text-gray-400">Case Study v1.0</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-32">
          <Footer />
      </div>

      </main>
    </>
  );
};

export default ProjectsArchive;
