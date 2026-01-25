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

      {/* Project Modal */}
      {isModalOpen && selectedProject && (
        <div 
          ref={modalRef}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4 md:p-8"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 z-20 p-3 bg-black/10 hover:bg-black/20 rounded-full transition-all duration-300 backdrop-blur-sm group hover:scale-110"
            >
              <X size={20} className="text-gray-700 group-hover:text-black transition-colors" />
            </button>

            <div className="flex flex-col lg:flex-row">
              {/* Image Section */}
              <div className="lg:w-3/5 h-80 lg:h-[600px] relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                <img 
                  src={selectedProject.image_url} 
                  alt={selectedProject.title}
                  className="w-full h-full object-contain p-8"
                />
                {/* Decorative Elements */}
                <div className="absolute top-6 left-6 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="absolute bottom-6 right-6 w-1 h-1 bg-purple-500 rounded-full"></div>
              </div>

              {/* Content Section */}
              <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-between bg-gradient-to-br from-white via-gray-50/50 to-white">
                <div className="space-y-8">
                  {/* Header */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                      <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                        {selectedProject.project_type || 'Project'}
                      </span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-arsenica text-gray-900 leading-tight mb-4">
                      {selectedProject.title}
                    </h2>
                    {selectedProject.subtitle && (
                      <p className="text-gray-600 font-mono italic text-sm leading-relaxed">
                        {stripHtml(selectedProject.subtitle)}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-0.5 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">About</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {stripHtml(selectedProject.long_description || selectedProject.description || selectedProject.subtitle) || "No description available."}
                    </p>
                  </div>

                  {/* Technologies */}
                  {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-0.5 h-4 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Tech Stack</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.technologies.slice(0, 6).map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-xs font-mono hover:from-gray-200 hover:to-gray-300 transition-all duration-200 border border-gray-200/50"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {selectedProject.features && selectedProject.features.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-0.5 h-4 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Features</h3>
                      </div>
                      <ul className="space-y-2">
                        {selectedProject.features.slice(0, 4).map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <div className="w-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200/50">
                  {selectedProject.link && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-full hover:from-black hover:to-gray-900 transition-all duration-300 font-medium text-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02] group"
                    >
                      <ExternalLink size={16} className="group-hover:rotate-12 transition-transform" />
                      View Live
                    </a>
                  )}
                  {selectedProject.github_url && (
                    <a
                      href={selectedProject.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium text-sm transform hover:scale-[1.02] group"
                    >
                      <Github size={16} className="group-hover:rotate-12 transition-transform" />
                      Code
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
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
