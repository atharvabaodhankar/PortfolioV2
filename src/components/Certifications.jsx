import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/all';
import { ArrowUpRight, Copy, Check, ShieldCheck, Maximize2, X } from 'lucide-react';

import cloudPracImg from '../assets/imgs/aws-cloud-practitioner.jpg';
import aiPracImg from '../assets/imgs/aws-ai-practitioner.jpg';

gsap.registerPlugin(ScrollTrigger, useGSAP, Flip);

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const certificationsData = [
  {
    id: 'cloud-practitioner',
    code: 'AWS CLF-C02',
    category: 'Cloud Infrastructure & Architecture',
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services (AWS)',
    issueDate: 'Sep 2026',
    expiryDate: 'Sep 2029',
    issued: new Date(2026, 8, 1),
    expires: new Date(2029, 8, 1),
    credentialId: 'c6fb527afe4f47ceb5617fda9e40f2df',
    credlyUrl:
      'https://www.credly.com/badges/75af1cbd-0f22-451c-9c2b-ba7c12f70a11/linked_in_profile',
    image: cloudPracImg,
    tint: 'radial-gradient(60% 60% at 85% 20%, rgba(245,158,11,0.12), transparent 70%)',
    summary:
      'Validates comprehensive fluency across core AWS services, secure multi-tenant architectures, shared responsibility security models, and cloud economics.',
    competencies: [
      'Cloud Architecture',
      'AWS Core Infrastructure',
      'Security & Compliance',
      'Cloud Economics',
      'Billing & Support Models',
    ],
  },
  {
    id: 'ai-practitioner',
    code: 'AWS AIF-C01',
    category: 'Foundation Models & Enterprise AI',
    title: 'AWS Certified AI Practitioner',
    issuer: 'Amazon Web Services (AWS)',
    issueDate: 'Aug 2026',
    expiryDate: 'Aug 2029',
    issued: new Date(2026, 7, 1),
    expires: new Date(2029, 7, 1),
    credentialId: '2cd8c2becfb045fea5200e98794bca75',
    credlyUrl:
      'https://www.credly.com/badges/653ef4ab-08b4-4989-bc11-86636a61288a/linked_in_profile',
    image: aiPracImg,
    tint: 'radial-gradient(60% 60% at 85% 20%, rgba(59,130,246,0.12), transparent 70%)',
    summary:
      'Demonstrates mastery in generative AI solutions, foundation model evaluation, prompt design, responsible AI guardrails, and enterprise Amazon Bedrock & SageMaker deployments.',
    competencies: [
      'Generative AI & LLMs',
      'Foundation Models',
      'Prompt Engineering',
      'Responsible AI & Guardrails',
      'AWS Bedrock & SageMaker',
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const REDUCED = '(prefers-reduced-motion: reduce)';
const isStill = () => window.matchMedia(REDUCED).matches;
const hasFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** 'stack' = pinned desktop card stack, 'flow' = normal scroll, 'still' = reduced motion */
const readMode = () => {
  if (typeof window === 'undefined') return 'flow';
  if (isStill()) return 'still';
  return window.matchMedia('(min-width: 1024px)').matches ? 'stack' : 'flow';
};

function useMotionMode() {
  const [mode, setMode] = useState(readMode);
  useEffect(() => {
    const queries = [REDUCED, '(min-width: 1024px)'].map((q) => window.matchMedia(q));
    const onChange = () => setMode(readMode());
    queries.forEach((q) => q.addEventListener('change', onChange));
    return () => queries.forEach((q) => q.removeEventListener('change', onChange));
  }, []);
  return mode;
}

/** Pulls its child toward the cursor */
const Magnetic = ({ children, strength = 0.25 }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (isStill() || !hasFinePointer()) return;
    const el = ref.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power2.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power2.out' });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [strength]);

  return (
    <span ref={ref} className="inline-block">
      {children}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Card Component                                                      */
/* ------------------------------------------------------------------ */

const CertificationCard = ({ cert, index, mode, onInspect, registerSource }) => {
  const tiltRef = useRef(null);
  const imgBtnRef = useRef(null);
  const tilt = useRef(null);
  const [copied, setCopied] = useState(false);
  const stack = mode === 'stack';

  useEffect(() => {
    tilt.current = null;
    if (mode === 'still' || !hasFinePointer()) return;
    if (!tiltRef.current) return;

    gsap.set(tiltRef.current, { transformPerspective: 900 });
    tilt.current = {
      rx: gsap.quickTo(tiltRef.current, 'rotateX', { duration: 0.5, ease: 'power3' }),
      ry: gsap.quickTo(tiltRef.current, 'rotateY', { duration: 0.5, ease: 'power3' }),
    };
  }, [mode]);

  const handleCopyId = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(cert.credentialId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Failed to copy ID:', err);
    }
  };

  const handlePointerMove = (e) => {
    if (!tilt.current || !imgBtnRef.current) return;
    const el = imgBtnRef.current;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    tilt.current.rx((0.5 - py) * 12);
    tilt.current.ry((px - 0.5) * 12);
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
  };

  const handlePointerLeave = () => {
    if (!tilt.current) return;
    tilt.current.rx(0);
    tilt.current.ry(0);
  };

  const handleInspect = () => {
    if (tiltRef.current) {
      gsap.set(tiltRef.current, { rotateX: 0, rotateY: 0 });
    }
    onInspect(cert, imgBtnRef.current);
  };

  return (
    <article
      className={[
        'cert-card group/card',
        stack
          ? 'absolute inset-0 flex flex-col bg-white border border-[#1A1A1A]/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] overflow-hidden'
          : 'relative flex flex-col bg-white border border-[#1A1A1A]/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] overflow-hidden',
      ].join(' ')}
    >
      {/* Top Architectural Header Bar */}
      <div className="px-6 md:px-8 py-3.5 border-b border-[#1A1A1A]/10 bg-[#FAFAF9] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[#1A1A1A]">0{index + 1} // {cert.code}</span>
          <span className="text-[#A1A1AA]">•</span>
          <span className="text-[#71717A] uppercase tracking-wider hidden sm:inline">{cert.category}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[11px] font-mono uppercase tracking-wider font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Verified Credential
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="p-6 md:p-8 xl:p-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center">
        {/* Left Column: Typography & Technical Ledger */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full">
          <div>
            <h3 className="font-arsenica text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight leading-[1.04] text-[#1A1A1A] mb-3.5">
              {cert.title}
            </h3>

            <p className="text-sm md:text-[15px] text-[#52525B] leading-relaxed mb-6 font-normal max-w-xl">
              {cert.summary}
            </p>

            {/* Competency Matrix (Handcrafted Grid, Zero Pills) */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#71717A]">
                  Core Competencies Assessed
                </span>
                <span className="text-[10px] font-mono text-[#A1A1AA]">
                  {cert.competencies.length} Modules
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cert.competencies.map((comp, idx) => (
                  <div
                    key={comp}
                    className="flex items-center gap-2.5 px-3 py-2 bg-[#F4F4F5]/70 border border-[#1A1A1A]/8 hover:border-[#1A1A1A]/20 transition-colors"
                  >
                    <span className="font-mono text-[10px] text-[#71717A]">
                      0{idx + 1}
                    </span>
                    <span className="text-xs text-[#27272A] font-medium tracking-tight">
                      {comp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Credential Key & Verification Action */}
          <div className="pt-5 border-t border-[#1A1A1A]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-[#71717A] mb-1">
                Validation Key
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="group/copy inline-flex items-center gap-2 text-xs md:text-sm font-mono text-[#1A1A1A] hover:text-black transition-colors"
                title="Click to copy validation key"
              >
                <span className="border-b border-dashed border-[#1A1A1A]/30 group-hover/copy:border-black font-semibold">
                  {cert.credentialId}
                </span>
                {copied ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    Copied
                  </span>
                ) : (
                  <Copy className="w-3.5 h-3.5 text-[#71717A] group-hover/copy:text-black transition-colors" />
                )}
              </button>
            </div>

            <Magnetic strength={0.25}>
              <a
                href={cert.credlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ferro-btn inline-flex items-center justify-center gap-2.5 px-5 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-mono uppercase tracking-wider transition-colors duration-300 shadow-sm"
              >
                <span>Verify on Credly</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Right Column: Physical Credential Artifact */}
        <div className="lg:col-span-5 relative cert-shake">
          <div ref={tiltRef} className="relative" style={{ transformStyle: 'preserve-3d' }}>
            {/* Museum Artifact Framing Casing */}
            <div className="relative p-2.5 bg-[#0D0E12] border border-[#1A1A1A]/30 shadow-2xl group/artifact overflow-hidden">
              {/* Technical Corner Drafting Brackets */}
              <span className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-white/50 pointer-events-none z-20" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-white/50 pointer-events-none z-20" />
              <span className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b border-l border-white/50 pointer-events-none z-20" />
              <span className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-white/50 pointer-events-none z-20" />

              <button
                type="button"
                ref={(el) => {
                  imgBtnRef.current = el;
                  registerSource(cert.id, el);
                }}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onClick={handleInspect}
                aria-label={`Inspect ${cert.title} credential artifact`}
                className="group/img ferro-btn relative block w-full aspect-[4/3] overflow-hidden bg-black cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover/img:scale-[1.03]"
                  loading="eager"
                />

                {/* Refined Specular Glare */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 mix-blend-overlay"
                  style={{
                    background:
                      'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 65%)',
                  }}
                />

                {/* Inspect Overlay Trigger */}
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/85 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono uppercase tracking-wider opacity-0 group-hover/img:opacity-100 transition-all duration-300 translate-y-1 group-hover/img:translate-y-0">
                  <Maximize2 className="w-3 h-3" />
                  Inspect Artifact
                </span>
              </button>

              {/* Technical Sub-bar */}
              <div className="mt-2.5 pt-2 border-t border-white/10 px-1 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span>ISSUED: {cert.issueDate}</span>
                <span>•</span>
                <span>EXPIRES: {cert.expiryDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Ledger */}
      <div className="px-6 md:px-8 py-2.5 border-t border-[#1A1A1A]/10 bg-[#FAFAF9] flex items-center justify-between text-[11px] font-mono text-[#71717A]">
        <span>REGISTRAR: CREDLY / PEARSON VUE</span>
        <span>STATUS: ACTIVE & VERIFIED</span>
      </div>
    </article>
  );
};

/* ------------------------------------------------------------------ */
/* Main Certifications Section                                         */
/* ------------------------------------------------------------------ */

export default function Certifications() {
  const mode = useMotionMode();
  const stack = mode === 'stack';

  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const stageRef = useRef(null);
  const headRef = useRef(null);
  const progressRef = useRef(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  // Lightbox
  const [open, setOpen] = useState(null);
  const sources = useRef({});
  const openerRef = useRef(null);
  const ghostRef = useRef(null);
  const backdropRef = useRef(null);
  const closeBtnRef = useRef(null);
  const closing = useRef(false);

  const registerSource = (id, el) => {
    sources.current[id] = el;
  };

  /* ---------------- Scroll Choreography ---------------- */
  useGSAP(
    () => {
      if (mode === 'still') return;

      const cards = gsap.utils.toArray('.cert-card');

      // Headline Entrance (Matching Projects.jsx masked reveal)
      if (headRef.current) {
        gsap.fromTo(
          headRef.current,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: headRef.current,
              start: 'top 85%',
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );

        // Skew velocity effect on scroll
        const skewTo = gsap.quickTo(headRef.current, 'skewX', { duration: 0.5, ease: 'power3' });
        const resetSkew = () => skewTo(0);
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => skewTo(gsap.utils.clamp(-10, 10, self.getVelocity() / -250)),
        });
        ScrollTrigger.addEventListener('scrollEnd', resetSkew);
      }

      if (stack) {
        // Pinned card stack: each cert slides over the previous one with high editorial fidelity
        const tints = gsap.utils.toArray('.cert-tint');
        const steps = cards.length - 1;

        gsap.set(cards, { zIndex: (i) => i + 1 });
        gsap.set(cards.slice(1), { yPercent: 112, rotate: 2 });
        gsap.set(tints.slice(1), { opacity: 0 });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: pinRef.current,
            start: 'top top',
            end: `+=${steps * 120}%`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const i = Math.min(steps, Math.round(self.progress * steps));
              if (i !== activeRef.current) {
                activeRef.current = i;
                setActive(i);
              }
            },
          },
        });

        for (let i = 1; i <= steps; i++) {
          tl.to(
            cards[i - 1],
            { scale: 0.92, yPercent: -6, opacity: 0.35, duration: 1 },
            i - 1
          )
            .to(cards[i], { yPercent: 0, rotate: 0, duration: 1, ease: 'power2.out' }, i - 1)
            .to(tints[i - 1], { opacity: 0, duration: 1 }, i - 1)
            .to(tints[i], { opacity: 1, duration: 1 }, i - 1);
        }

        if (progressRef.current) {
          tl.to(progressRef.current, { scaleY: 1, duration: steps }, 0);
        }
      }

      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === sectionRef.current) st.kill();
        });
      };
    },
    { scope: sectionRef, dependencies: [mode], revertOnUpdate: true }
  );

  /* ---------------- Flip Lightbox ---------------- */
  const openLightbox = (cert, opener) => {
    openerRef.current = opener;
    setOpen(cert);
  };

  useLayoutEffect(() => {
    if (!open) return;
    const src = sources.current[open.id];
    const ghost = ghostRef.current;
    if (!src || !ghost) return;

    document.body.style.overflow = 'hidden';
    window.lenis?.stop?.();
    closeBtnRef.current?.focus({ preventScroll: true });

    if (isStill()) {
      gsap.set([backdropRef.current, ...gsap.utils.toArray('.lb-chrome')], { opacity: 1 });
      return;
    }

    const img = ghost.querySelector('img');
    if (img) img.style.objectFit = 'cover';
    Flip.fit(ghost, src, { scale: true });
    gsap.set(src, { visibility: 'hidden' });

    gsap
      .timeline()
      .to(backdropRef.current, { opacity: 1, duration: 0.5 }, 0)
      .to(ghost, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.95, ease: 'expo.inOut' }, 0)
      .call(() => {
        if (img) img.style.objectFit = 'contain';
      }, null, 0.4)
      .fromTo(
        '.lb-chrome',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
        0.55
      );
  }, [open]);

  const closeLightbox = () => {
    if (!open || closing.current) return;
    closing.current = true;
    const src = sources.current[open.id];
    const ghost = ghostRef.current;

    const finish = () => {
      if (src) gsap.set(src, { visibility: 'visible' });
      document.body.style.overflow = '';
      window.lenis?.start?.();
      closing.current = false;
      setOpen(null);
      openerRef.current?.focus({ preventScroll: true });
    };

    if (isStill() || !src || !ghost) return finish();

    const img = ghost.querySelector('img');
    gsap
      .timeline({ onComplete: finish })
      .to('.lb-chrome', { opacity: 0, duration: 0.25 }, 0)
      .call(() => {
        if (img) img.style.objectFit = 'cover';
      }, null, 0.3)
      .add(Flip.fit(ghost, src, { scale: true, duration: 0.8, ease: 'expo.inOut' }), 0)
      .to(backdropRef.current, { opacity: 0, duration: 0.5 }, 0.3);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(
    () => () => {
      document.body.style.overflow = '';
      window.lenis?.start?.();
    },
    []
  );

  const total = certificationsData.length;
  const frameW = 'w-[min(92vw,calc(66vh*4/3))]';

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="relative isolate w-full bg-white text-black px-6 md:px-12 lg:px-24 py-24 sm:py-32 lg:py-0 font-sans"
    >
      {/* Ambient tint that follows the active certificate */}
      {stack &&
        certificationsData.map((c) => (
          <div
            key={c.id}
            aria-hidden="true"
            className="cert-tint pointer-events-none absolute inset-0 -z-10"
            style={{ background: c.tint }}
          />
        ))}

      <div
        ref={pinRef}
        className={[
          'max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-16',
          stack ? 'h-screen pt-28 pb-14' : '',
        ].join(' ')}
      >
        {/* Left: Editorial Anchor (Matching Selected Works in Projects.jsx) */}
        <div className="lg:w-5/12 flex flex-col justify-between">
          <div>
            <div className="overflow-hidden">
              <h2
                ref={headRef}
                className="title-mask-inner text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] font-arsenica hover-h1 text-[#1A1A1A] will-change-transform"
              >
                Verified
                <br />
                Proofs
              </h2>
            </div>
            <div className="w-20 h-[2px] bg-[#1A1A1A] mt-6 mb-8 origin-left" />
            <p className="text-base md:text-lg text-[#52525B] leading-relaxed max-w-sm font-normal">
              Rigorous industry accreditations issued by Amazon Web Services, validating competence
              across cloud infrastructure architectures, security protocols, and generative AI
              engineering.
            </p>
          </div>

          <div className="hidden lg:flex items-end gap-5 mt-auto">
            {stack && (
              <>
                <div className="relative h-24 w-px bg-[#1A1A1A]/15" aria-hidden="true">
                  <div
                    ref={progressRef}
                    className="absolute inset-0 bg-[#1A1A1A] origin-top scale-y-0"
                  />
                </div>
                <p className="font-mono text-sm tabular-nums text-[#52525B]" aria-live="polite">
                  Certificate {active + 1} of {total}
                </p>
              </>
            )}
            {!stack && (
              <p className="text-xs text-[#71717A] font-mono">
                Registrar: Credly by Pearson · Official Records
              </p>
            )}
          </div>
        </div>

        {/* Right: The Handcrafted Architectural Stack */}
        <div
          ref={stageRef}
          className={[
            'lg:w-7/12',
            stack ? 'relative h-full flex items-center' : 'flex flex-col gap-12 lg:gap-16',
          ].join(' ')}
        >
          {certificationsData.map((cert, index) => (
            <CertificationCard
              key={cert.id}
              cert={cert}
              index={index}
              total={total}
              mode={mode}
              onInspect={openLightbox}
              registerSource={registerSource}
            />
          ))}
        </div>
      </div>

      {/* Lightbox: Certificate Morphs via GSAP Flip */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${open.title} certificate`}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 p-4 sm:p-8"
        >
          <div
            ref={backdropRef}
            onClick={closeLightbox}
            className="absolute inset-0 bg-black/85 backdrop-blur-md opacity-0"
          />

          <div
            className={`lb-chrome relative z-10 flex ${frameW} items-center justify-between gap-4 text-white opacity-0`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400" />
              <div className="min-w-0">
                <h4 className="font-arsenica text-base sm:text-lg font-bold leading-tight truncate">
                  {open.title}
                </h4>
                <span className="text-xs font-mono text-white/60 break-all">
                  ID: {open.credentialId}
                </span>
              </div>
            </div>
            <button
              type="button"
              ref={closeBtnRef}
              onClick={closeLightbox}
              aria-label="Close certificate"
              className="ferro-btn shrink-0 w-10 h-10 border border-white/20 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            ref={ghostRef}
            className={`relative z-10 aspect-[4/3] ${frameW} overflow-hidden bg-black border border-white/20 shadow-2xl`}
          >
            <img src={open.image} alt={open.title} className="w-full h-full object-contain" />
          </div>

          <div
            className={`lb-chrome relative z-10 flex ${frameW} flex-wrap items-center justify-between gap-3 text-xs font-mono text-white/70 opacity-0`}
          >
            <span>
              Issued {open.issueDate} · Expires {open.expiryDate}
            </span>
            <a
              href={open.credlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ferro-btn inline-flex items-center gap-1.5 px-4 py-2 bg-white text-black text-xs font-mono uppercase tracking-wider hover:bg-gray-200 transition-colors"
            >
              Verify on Credly
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}