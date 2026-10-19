import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ArrowUpRight, AlertCircle, RefreshCw } from 'lucide-react';
import TransitionLink from './TransitionLink';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ------------------------------------------------------------------ */
/* Helper Functions                                                   */
/* ------------------------------------------------------------------ */

const getSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

export default function Projects() {
  const containerRef = useRef(null);
  const previewRef = useRef(null);
  const previewInnerRef = useRef(null);
  const imgRefs = useRef([]);

  const lastMousePos = useRef({ x: 0, y: 0, initialized: false });
  const rotDecayRef = useRef(null);
  const activeIndexRef = useRef(-1);

  const xToRef = useRef(null);
  const yToRef = useRef(null);
  const rotateToRef = useRef(null);
  const imgYToRef = useRef(null);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------- Fetch featured projects from Supabase ---------------- */
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const { supabase } = await import('../lib/supabaseClient');
      const { data, error: err } = await supabase
        .from('projects')
        .select('*')
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .limit(4);

      if (err) throw err;

      if (data && data.length > 0) {
        setProjects(data);
        // Prefetch preview images via new Image() once data arrives
        data.forEach((p) => {
          if (p.image_url) {
            const img = new Image();
            img.src = p.image_url;
          }
        });
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error('Failed to fetch projects from Supabase:', err);
      setError(err?.message || "Couldn't load projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  /* ---------------- Preview Reveal & Wipe Logic ---------------- */
  const showPreviewForIndex = (index) => {
    if (!previewRef.current || index < 0 || !projects[index]) return;
    const prevIdx = activeIndexRef.current;

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReduced) {
      imgRefs.current.forEach((img, idx) => {
        if (!img) return;
        gsap.set(img, {
          opacity: idx === index ? 1 : 0,
          clipPath: 'none',
          zIndex: idx === index ? 2 : 1,
        });
      });
      gsap.to(previewRef.current, {
        opacity: 1,
        scale: 1,
        clipPath: 'none',
        duration: 0.2,
        overwrite: 'auto',
      });
      activeIndexRef.current = index;
      return;
    }

    if (prevIdx === -1) {
      // First open: bring selected image to top and wipe preview shell in
      imgRefs.current.forEach((img, idx) => {
        if (!img) return;
        if (idx === index) {
          gsap.set(img, { zIndex: 2, clipPath: 'inset(0% 0% 0% 0%)' });
        } else {
          gsap.set(img, { zIndex: 1, clipPath: 'inset(100% 0% 0% 0%)' });
        }
      });

      gsap.to(previewRef.current, {
        clipPath: 'inset(0% 0% 0% 0%)',
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    } else if (prevIdx !== index) {
      // Row change: wipe incoming image over outgoing image via clip-path inset (no fade)
      const outgoing = imgRefs.current[prevIdx];
      const incoming = imgRefs.current[index];

      if (outgoing) gsap.set(outgoing, { zIndex: 1 });
      if (incoming) {
        gsap.fromTo(
          incoming,
          { clipPath: 'inset(100% 0% 0% 0%)', zIndex: 2 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.42,
            ease: 'power3.out',
            overwrite: 'auto',
            onComplete: () => {
              if (outgoing) gsap.set(outgoing, { clipPath: 'inset(100% 0% 0% 0%)' });
            },
          }
        );
      }
    }

    activeIndexRef.current = index;
  };

  const hidePreview = () => {
    if (!previewRef.current) return;

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      gsap.to(previewRef.current, {
        opacity: 0,
        duration: 0.2,
        overwrite: 'auto',
        onComplete: () => {
          activeIndexRef.current = -1;
        },
      });
      return;
    }

    gsap.to(previewRef.current, {
      clipPath: 'inset(0% 0% 100% 0%)',
      opacity: 0,
      scale: 0.96,
      duration: 0.3,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        activeIndexRef.current = -1;
      },
    });
  };

  const handleRowEnter = (index) => {
    showPreviewForIndex(index);
  };

  const handleRowFocus = (index, targetEl) => {
    if (!targetEl || !previewRef.current) return;

    const rect = targetEl.getBoundingClientRect();
    const previewWidth = 440;
    const previewHeight = 280;
    const pad = 20;

    let targetX = rect.right - previewWidth - 40;
    let targetY = rect.top + (rect.height - previewHeight) / 2;

    targetX = Math.max(pad, Math.min(window.innerWidth - previewWidth - pad, targetX));
    targetY = Math.max(pad, Math.min(window.innerHeight - previewHeight - pad, targetY));

    if (xToRef.current && yToRef.current) {
      xToRef.current(targetX);
      yToRef.current(targetY);
    } else {
      gsap.set(previewRef.current, { x: targetX, y: targetY });
    }

    if (rotateToRef.current) {
      rotateToRef.current(0);
    } else {
      gsap.set(previewRef.current, { rotate: 0 });
    }

    showPreviewForIndex(index);
  };

  const handleRowBlur = () => {
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        hidePreview();
      }
    }, 15);
  };

  /* ---------------- Orchestrated Animations (gsap.matchMedia) ---------------- */
  useGSAP(
    () => {
      if (loading || projects.length === 0) return;

      const mm = gsap.matchMedia();

      // 1. Reduced Motion: Everything visible, static, simple opacity preview
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.project-hairline', { scaleX: 1, transformOrigin: 'left center' });
        gsap.set('.section-header-reveal .title-mask-inner', { yPercent: 0 });
        gsap.set('.title-mask-entrance', { yPercent: 0 });
        gsap.set('.meta-reveal', { opacity: 1, y: 0 });
        gsap.set('.mobile-project-img', { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 });
      });

      // 2. Desktop pointer tracking (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)
      mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        if (!previewRef.current) return;

        const xTo = gsap.quickTo(previewRef.current, 'x', { duration: 0.35, ease: 'power3.out' });
        const yTo = gsap.quickTo(previewRef.current, 'y', { duration: 0.35, ease: 'power3.out' });
        const rotateTo = gsap.quickTo(previewRef.current, 'rotate', { duration: 0.45, ease: 'power2.out' });
        const imgYTo = previewInnerRef.current
          ? gsap.quickTo(previewInnerRef.current, 'y', { duration: 0.45, ease: 'power2.out' })
          : () => {};

        xToRef.current = xTo;
        yToRef.current = yTo;
        rotateToRef.current = rotateTo;
        imgYToRef.current = imgYTo;

        const onMouseMove = (e) => {
          // Initialize last mouse on first frame to prevent jolting
          if (!lastMousePos.current.initialized) {
            lastMousePos.current = { x: e.clientX, y: e.clientY, initialized: true };
            return;
          }

          const dx = e.clientX - lastMousePos.current.x;
          const dy = e.clientY - lastMousePos.current.y;
          lastMousePos.current.x = e.clientX;
          lastMousePos.current.y = e.clientY;

          const pad = 20;
          const previewWidth = 440;
          const previewHeight = 280;
          let targetX = e.clientX + 28;
          let targetY = e.clientY - previewHeight / 2;

          // Flip preview to the left of the cursor near right viewport edge
          if (targetX + previewWidth > window.innerWidth - pad) {
            targetX = e.clientX - previewWidth - 28;
          }

          // Clamp to viewport bounds
          targetX = Math.max(pad, Math.min(window.innerWidth - previewWidth - pad, targetX));
          targetY = Math.max(pad, Math.min(window.innerHeight - previewHeight - pad, targetY));

          xTo(targetX);
          yTo(targetY);

          // Dynamic velocity skew
          const clampedRot = gsap.utils.clamp(-6, 6, dx * 0.08);
          rotateTo(clampedRot);

          // Decay rotation back to 0 when mouse stops moving
          if (rotDecayRef.current) rotDecayRef.current.kill();
          rotDecayRef.current = gsap.to(previewRef.current, {
            rotate: 0,
            duration: 0.45,
            ease: 'power2.out',
            delay: 0.05,
            overwrite: 'auto',
          });

          // Inner parallax counter-shift
          const clampedImgY = gsap.utils.clamp(-12, 12, -dy * 0.2);
          imgYTo(clampedImgY);
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        return () => {
          window.removeEventListener('mousemove', onMouseMove);
          if (rotDecayRef.current) rotDecayRef.current.kill();
        };
      });

      // 3. Shared Entrance Animations (prefers-reduced-motion: no-preference)
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Dividing Hairlines drawing in from left on scroll
        const dividers = gsap.utils.toArray('.project-hairline');
        dividers.forEach((divider) => {
          gsap.fromTo(
            divider,
            { scaleX: 0, transformOrigin: 'left center' },
            {
              scaleX: 1,
              duration: 1.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: divider,
                start: 'top 92%',
                once: true,
                invalidateOnRefresh: true,
              },
            }
          );
        });

        // Section Header Reveal: Masked reveal matching titles
        gsap.fromTo(
          '.section-header-reveal .title-mask-inner',
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 82%',
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );

        // Typographic Title Mask Entrance for each project row
        const rows = gsap.utils.toArray('.project-index-row');
        rows.forEach((row) => {
          const titleMaskEntrance = row.querySelector('.title-mask-entrance');
          const metaEls = row.querySelectorAll('.meta-reveal');

          const rowTl = gsap.timeline({
            scrollTrigger: {
              trigger: row,
              start: 'top 88%',
              once: true,
              invalidateOnRefresh: true,
            },
          });

          if (titleMaskEntrance) {
            rowTl.fromTo(
              titleMaskEntrance,
              { yPercent: 110 },
              {
                yPercent: 0,
                duration: 1.1,
                ease: 'expo.out',
              }
            );
          }

          if (metaEls.length > 0) {
            rowTl.fromTo(
              metaEls,
              { opacity: 0, y: 14 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.08,
                ease: 'power2.out',
              },
              '-=0.7'
            );
          }
        });

        // Archive CTA Decorative Marquee Loop & Hover Acceleration
        const marqueeTrack = containerRef.current?.querySelector('.archive-marquee-track');
        const ctaLink = containerRef.current?.querySelector('.archive-cta-link');
        if (marqueeTrack) {
          const marqueeTween = gsap.to(marqueeTrack, {
            xPercent: -50,
            repeat: -1,
            duration: 20,
            ease: 'none',
          });

          if (ctaLink) {
            const handleMouseEnter = () => gsap.to(marqueeTween, { timeScale: 2.2, duration: 0.4 });
            const handleMouseLeave = () => gsap.to(marqueeTween, { timeScale: 1, duration: 0.4 });

            ctaLink.addEventListener('mouseenter', handleMouseEnter);
            ctaLink.addEventListener('mouseleave', handleMouseLeave);

            return () => {
              ctaLink.removeEventListener('mouseenter', handleMouseEnter);
              ctaLink.removeEventListener('mouseleave', handleMouseLeave);
              marqueeTween.kill();
            };
          }
        }
      });

      // 4. Mobile / Touch Scroll-triggered Clip-Path Wipe & Parallax
      mm.add('((hover: none) or (pointer: coarse)) and (prefers-reduced-motion: no-preference)', () => {
        const mobileImages = gsap.utils.toArray('.mobile-project-img');
        mobileImages.forEach((img) => {
          gsap.fromTo(
            img,
            { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.08 },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              scale: 1,
              duration: 1.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: img,
                start: 'top 85%',
                once: true,
              },
            }
          );
        });
      });

      return () => mm.revert();
    },
    { dependencies: [loading, projects], scope: containerRef, revertOnUpdate: true }
  );

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative w-full bg-white text-[#1A1A1A] py-28 md:py-36 selection:bg-[#1A1A1A] selection:text-white font-sans overflow-hidden"
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Editorial Section Header with Masked Line Reveal */}
        <div className="section-header-reveal flex flex-col md:flex-row md:items-baseline justify-between mb-16 md:mb-24 gap-6">
          <div>
            <div className="overflow-hidden">
              <h2 className="title-mask-inner text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] font-arsenica hover-h1 text-[#1A1A1A] will-change-transform">
                Selected
                <br />
                Works
              </h2>
            </div>
            <div className="project-hairline w-20 h-[2px] bg-[#1A1A1A] mt-6 origin-left"></div>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <p className="text-[14px] md:text-[15px] text-[#52525B] max-w-sm text-left md:text-right font-normal leading-relaxed">
              Engineered web systems, decentralized protocols, and experimental interfaces built for clarity and scale.
            </p>
          </div>
        </div>

        {/* Loading State: Typographic Skeleton Rows */}
        {loading && (
          <div className="flex flex-col divide-y divide-[#1A1A1A]/15 border-t border-b border-[#1A1A1A]/15">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="py-12 md:py-16 flex flex-col md:flex-row items-baseline justify-between gap-6 animate-pulse"
              >
                <div className="flex items-baseline gap-8 md:gap-16 w-full md:w-3/5">
                  <span className="text-sm font-mono text-[#52525B]/40">0{n}</span>
                  <div className="h-14 md:h-20 bg-[#1A1A1A]/5 w-3/4 rounded-none"></div>
                </div>
                <div className="h-4 bg-[#1A1A1A]/5 w-1/4 rounded-none self-end md:self-auto"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State: Sentence-case with Retry */}
        {!loading && error && (
          <div className="py-20 border-t border-b border-[#1A1A1A]/15 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-8 h-8 text-[#1A1A1A] mb-4 stroke-1" />
            <h3 className="text-2xl font-arsenica text-[#1A1A1A] mb-2">Couldn't load projects</h3>
            <p className="text-[14px] md:text-[15px] text-[#52525B] max-w-md mb-6">{error}</p>
            <button
              type="button"
              onClick={fetchProjects}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1A1A1A] text-white text-sm font-normal ferro-btn hover:bg-black transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Empty State: Sentence-case */}
        {!loading && !error && projects.length === 0 && (
          <div className="py-24 border-t border-b border-[#1A1A1A]/15 text-center">
            <p className="text-[14px] md:text-[15px] text-[#52525B]">No featured projects found.</p>
          </div>
        )}

        {/* Main Typographic Project Index */}
        {!loading && !error && projects.length > 0 && (
          <div
            className="projects-list flex flex-col relative"
            onMouseLeave={hidePreview}
          >
            {/* Top Border */}
            <div className="project-hairline w-full h-[1px] bg-[#1A1A1A]/15"></div>

            {projects.map((project, index) => {
              const slug = getSlug(project.title);

              return (
                <div key={project.id} className="relative">
                  <TransitionLink
                    to={`/projects/${slug}`}
                    aria-labelledby={`project-title-${project.id}`}
                    aria-describedby={`project-desc-${project.id}`}
                    className="project-index-row project-card group relative block py-10 md:py-16 transition-opacity duration-300 ease-out outline-none focus-visible:ring-1 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-4"
                    onMouseEnter={() => handleRowEnter(index)}
                    onFocus={(e) => handleRowFocus(index, e.currentTarget)}
                    onBlur={handleRowBlur}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-baseline justify-between gap-6 md:gap-10">
                      {/* Left: Index + Typographic Title with Masked Char Rollover */}
                      <div className="flex items-baseline gap-6 md:gap-12 lg:gap-16">
                        <span className="meta-reveal text-sm md:text-base font-mono text-[#52525B] select-none">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <div className="overflow-hidden">
                          <div className="title-mask-entrance will-change-transform">
                            <h3
                              id={`project-title-${project.id}`}
                              aria-label={project.title}
                              className="project-h1 text-[clamp(2.75rem,6.5vw,7.5rem)] font-arsenica leading-[0.92] tracking-tight text-[#1A1A1A]"
                            >
                              <span aria-hidden="true" className="inline-flex flex-wrap">
                                {project.title.split('').map((char, charIdx) => (
                                  <span
                                    key={charIdx}
                                    className="relative inline-block overflow-hidden leading-[0.92]"
                                  >
                                    <span
                                      style={{ transitionDelay: `${charIdx * 15}ms` }}
                                      className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:-translate-y-full group-focus-visible:-translate-y-full"
                                    >
                                      {char === ' ' ? '\u00A0' : char}
                                    </span>
                                    <span
                                      style={{ transitionDelay: `${charIdx * 15}ms` }}
                                      className="absolute left-0 top-full inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:-translate-y-full group-focus-visible:-translate-y-full"
                                    >
                                      {char === ' ' ? '\u00A0' : char}
                                    </span>
                                  </span>
                                ))}
                              </span>
                            </h3>
                          </div>
                        </div>
                      </div>

                      {/* Right: Technologies Text List + Bare Arrow */}
                      <div className="meta-reveal flex items-center justify-between lg:justify-end gap-6 text-right">
                        <span className="text-[14px] md:text-[15px] text-[#52525B] font-normal leading-relaxed tracking-normal max-w-md">
                          {project.technologies && Array.isArray(project.technologies)
                            ? project.technologies.slice(0, 4).join(', ')
                            : 'Architecture, Systems'}
                        </span>

                        <ArrowUpRight className="w-5 h-5 stroke-[1.5] text-[#1A1A1A] transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 group-focus-visible:translate-x-1 group-focus-visible:-translate-y-1" />
                      </div>
                    </div>

                    {/* Subtitle Line */}
                    <div className="meta-reveal mt-4 md:mt-6 pl-10 md:pl-20 max-w-2xl">
                      <p
                        id={`project-desc-${project.id}`}
                        className="text-[14px] md:text-[15px] text-[#52525B] font-normal leading-relaxed"
                      >
                        {project.subtitle}
                      </p>
                    </div>

                    {/* Inline Media (Touch & non-fine pointer only) */}
                    <div className="project-inline-media mt-8 overflow-hidden bg-[#1A1A1A]/5 aspect-[16/9] w-full">
                      <img
                        src={project.image_url}
                        alt=""
                        width="800"
                        height="450"
                        loading="lazy"
                        decoding="async"
                        className="mobile-project-img w-full h-full object-cover object-center"
                      />
                    </div>
                  </TransitionLink>

                  {/* 1px Hairline divider drawing on scroll */}
                  <div className="project-hairline w-full h-[1px] bg-[#1A1A1A]/15"></div>
                </div>
              );
            })}
          </div>
        )}

        {/* The Archive Link CTA */}
        <div className="pt-24 md:pt-36 relative">
          <TransitionLink
            to="/projects"
            className="archive-cta-link group relative block w-full py-12 md:py-16 border-t border-b border-[#1A1A1A]/15 overflow-hidden ferro-btn outline-none focus-visible:ring-1 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-4"
          >
            {/* Decorative Background Marquee Loop (Accelerates on hover via GSAP) */}
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity duration-500 ease-out select-none whitespace-nowrap overflow-hidden"
            >
              <div className="archive-marquee-track flex whitespace-nowrap will-change-transform">
                <span className="text-[12vw] font-bold font-arsenica tracking-tighter uppercase inline-block pr-8 text-[#1A1A1A]">
                  Archive &bull; Archive &bull; Archive &bull; Archive &bull;&nbsp;
                </span>
                <span className="text-[12vw] font-bold font-arsenica tracking-tighter uppercase inline-block pr-8 text-[#1A1A1A]">
                  Archive &bull; Archive &bull; Archive &bull; Archive &bull;&nbsp;
                </span>
              </div>
            </div>

            {/* Foreground Main Link Row */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-baseline gap-6 md:gap-12">
                <h3 className="project-h1 text-[clamp(3.5rem,8.5vw,8.5rem)] font-arsenica leading-[0.9] text-[#1A1A1A] tracking-tight group-hover:translate-x-2 group-focus-visible:translate-x-2 transition-transform duration-500 ease-out">
                  The Archive
                </h3>
              </div>

              <div className="flex items-center gap-4 self-end md:self-auto">
                <span className="text-[14px] md:text-[15px] text-[#52525B] font-normal tracking-normal">
                  View all projects
                </span>
                <ArrowUpRight className="w-6 h-6 stroke-[1.5] text-[#1A1A1A] transition-transform duration-500 ease-out group-hover:translate-x-1.5 group-hover:-translate-y-1.5 group-focus-visible:translate-x-1.5 group-focus-visible:-translate-y-1.5" />
              </div>
            </div>
          </TransitionLink>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Desktop Floating Image Preview (Always Mounted, Zero Flash Portal) */}
      {/* ------------------------------------------------------------------ */}
      {typeof document !== 'undefined' &&
        projects.length > 0 &&
        createPortal(
          <div
            ref={previewRef}
            aria-hidden="true"
            className="fixed top-0 left-0 w-[380px] h-[250px] md:w-[440px] md:h-[280px] pointer-events-none z-[80] overflow-hidden bg-[#1A1A1A] border border-[#1A1A1A]/15 opacity-0 will-change-transform"
            style={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          >
            <div
              ref={previewInnerRef}
              className="relative w-full h-full will-change-transform scale-[1.08]"
            >
              {projects.map((project, index) => (
                <img
                  key={project.id}
                  ref={(el) => {
                    imgRefs.current[index] = el;
                  }}
                  src={project.image_url}
                  alt=""
                  width="440"
                  height="280"
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center will-change-transform"
                  style={{
                    clipPath: 'inset(100% 0% 0% 0%)',
                    zIndex: 1,
                  }}
                />
              ))}
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
