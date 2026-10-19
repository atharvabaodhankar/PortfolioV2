import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ArrowUpRight, Copy, Check, ShieldCheck, Maximize2, X } from 'lucide-react';

import cloudPracImg from '../assets/imgs/aws-cloud-practitioner.jpg';
import aiPracImg from '../assets/imgs/aws-ai-practitioner.jpg';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const certificationsData = [
  {
    id: 'cloud-practitioner',
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
    tint: 'radial-gradient(60% 60% at 85% 20%, rgba(245,158,11,0.16), transparent 70%)',
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
    tint: 'radial-gradient(60% 60% at 85% 20%, rgba(59,130,246,0.16), transparent 70%)',
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
const monthsBetween = (a, b) =>
  (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());

const RING_R = 26;
const RING_C = 2 * Math.PI * RING_R;

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

/** Splits a word into masked characters for the kinetic headline */
const Split = ({ text }) =>
  text.split('').map((ch, i) => (
    <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]">
      <span className="cert-char inline-block will-change-transform">{ch}</span>
    </span>
  ));

/** Pulls its child toward the cursor */
const Magnetic = ({ children, strength = 0.35 }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (isStill() || !hasFinePointer()) return;
    const el = ref.current;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.5)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.5)' });
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
/* Card                                                                */
/* ------------------------------------------------------------------ */

const CertificationCard = ({ cert, mode, onInspect, registerSource }) => {
  const tiltRef = useRef(null);
  const imgBtnRef = useRef(null);
  const tilt = useRef(null);
  const [copied, setCopied] = useState(false);
  const stack = mode === 'stack';

  const monthsLeft = Math.max(0, monthsBetween(new Date(), cert.expires));
  const totalMonths = monthsBetween(cert.issued, cert.expires);
  const remaining = Math.min(1, monthsLeft / totalMonths);
  const ringOffset = RING_C * (1 - remaining);

  useEffect(() => {
    tilt.current = null;
    if (mode === 'still' || !hasFinePointer()) return;
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
    if (!tilt.current) return;
    const el = imgBtnRef.current;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    tilt.current.rx((0.5 - py) * 14);
    tilt.current.ry((px - 0.5) * 14);
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
    el.style.setProperty('--a', `${px * 360}`);
  };

  const handlePointerLeave = () => {
    if (!tilt.current) return;
    tilt.current.rx(0);
    tilt.current.ry(0);
  };

  const handleInspect = () => {
    gsap.set(tiltRef.current, { rotateX: 0, rotateY: 0 });
    onInspect(cert, imgBtnRef.current);
  };

  return (
    <article
      className={[
        'cert-card',
        stack
          ? 'absolute inset-0 flex flex-col rounded-3xl border border-gray-200 bg-white p-8 xl:p-10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)]'
          : 'relative border-t border-gray-200 pt-12 pb-8',
      ].join(' ')}
    >
      {/* Meta row: issuer + validity ring */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <span className="text-xs md:text-sm font-mono text-gray-500">{cert.issuer}</span>

        
      </div>

      <div
        className={[
          'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center',
          stack ? 'flex-1 min-h-0' : '',
        ].join(' ')}
      >
        {/* Certificate artifact */}
        <div className="lg:col-span-7 lg:order-2 relative cert-shake">
          <div ref={tiltRef} className="relative" style={{ transformStyle: 'preserve-3d' }}>
            <button
              type="button"
              ref={(el) => {
                imgBtnRef.current = el;
                registerSource(cert.id, el);
              }}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              onClick={handleInspect}
              aria-label={`Inspect ${cert.title} certificate`}
              className="group/img ferro-btn relative block w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border border-gray-200 bg-gray-100 shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              <img
                src={cert.image}
                alt={cert.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover/img:scale-[1.03]"
                loading="lazy"
              />

              {/* Holographic foil */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 group-hover/img:opacity-70 transition-opacity duration-300 mix-blend-color-dodge"
                style={{
                  background:
                    'conic-gradient(from calc(var(--a, 0) * 1deg) at var(--mx, 50%) var(--my, 50%), #ff5ea8, #ffd45e, #5effa8, #5ec8ff, #b05eff, #ff5ea8)',
                  filter: 'saturate(1.2)',
                }}
              />
              {/* Specular glare */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 group-hover/img:opacity-60 transition-opacity duration-300 mix-blend-overlay"
                style={{
                  background:
                    'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 55%)',
                }}
              />

              <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 text-black text-xs font-medium shadow-xl translate-y-2 opacity-0 group-hover/img:translate-y-0 group-hover/img:opacity-100 transition-all duration-300">
                <Maximize2 className="w-3.5 h-3.5" />
                Inspect certificate
              </span>
            </button>

            {/* Verified seal */}
            <div
              aria-hidden="true"
              className="cert-stamp pointer-events-none absolute -top-5 -right-3 md:-right-5 grid place-items-center w-24 h-24 rounded-full border-2 border-emerald-600 bg-white/95 text-emerald-700 text-center shadow-lg"
              style={{ transform: 'rotate(-9deg)' }}
            >
              <span className="absolute inset-1 rounded-full border border-dashed border-emerald-600/60" />
              <span className="flex flex-col items-center leading-tight">
                <ShieldCheck className="w-5 h-5 mb-0.5" />
                <span className="text-[11px] font-semibold">Verified</span>
                <span className="text-[9px] font-mono">on Credly</span>
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-5 lg:order-1 flex flex-col">
          <h3
            className="text-3xl xl:text-4xl font-medium tracking-tight leading-[1.1] mb-5 text-black"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {cert.title}
          </h3>

          <p className="text-sm xl:text-base text-gray-600 leading-relaxed mb-6">{cert.summary}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {cert.competencies.map((comp) => (
              <span
                key={comp}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200/80 rounded-full text-xs font-medium text-gray-700"
              >
                {comp}
              </span>
            ))}
          </div>

          <div className="pt-5 border-t border-gray-100 flex flex-col gap-4">
            <div className="flex flex-col">
              <span className="text-[11px] font-mono text-gray-400 mb-1">Credential ID</span>
              <button
                type="button"
                onClick={handleCopyId}
                className="group/copy inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-gray-700 hover:text-black transition-colors text-left"
                title="Copy credential ID"
              >
                <span
                  className="cert-id break-all border-b border-dashed border-gray-300 group-hover/copy:border-black"
                  data-value={cert.credentialId}
                >
                  {cert.credentialId}
                </span>
                {copied ? (
                  <span className="inline-flex shrink-0 items-center gap-1 text-[11px] text-emerald-600 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    Copied
                  </span>
                ) : (
                  <Copy className="w-3.5 h-3.5 shrink-0 text-gray-400 group-hover/copy:text-black transition-colors" />
                )}
              </button>
            </div>

            <div>
              <Magnetic>
                <a
                  href={cert.credlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ferro-btn inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-sm font-medium tracking-wide transition-colors duration-300 hover:bg-gray-800 active:scale-95"
                >
                  Verify on Credly
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

/* ------------------------------------------------------------------ */
/* Section                                                             */
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

  /* ---------------- Scroll choreography ---------------- */
  useGSAP(
    () => {
      if (mode === 'still') return;

      const cards = gsap.utils.toArray('.cert-card');

      // Reveal states are set up front so nothing flashes before activation
      cards.forEach((card) => {
        const arc = card.querySelector('.ring-arc');
        if (arc && arc.dataset?.c) {
          gsap.set(arc, { strokeDashoffset: Number(arc.dataset.c) });
        }
        const stamp = card.querySelector('.cert-stamp');
        if (stamp) {
          gsap.set(stamp, { opacity: 0 });
        }
      });

      // The moment a card is "stamped": ring draws, seal slams, card shakes
      const activate = (card) => {
        if (!card || card.dataset.done) return;
        card.dataset.done = '1';
        const arc = card.querySelector('.ring-arc');
        const stamp = card.querySelector('.cert-stamp');
        const shake = card.querySelector('.cert-shake');

        if (arc && arc.dataset?.offset) {
          gsap.to(arc, {
            strokeDashoffset: Number(arc.dataset.offset),
            duration: 1.6,
            ease: 'power3.out',
          });
        }
        if (stamp) {
          gsap
            .timeline({ delay: 0.7 })
            .fromTo(
              stamp,
              { scale: 2.6, rotate: -28, opacity: 0 },
              { scale: 1, rotate: -9, opacity: 1, duration: 0.38, ease: 'power4.in' }
            );
        }
        if (shake) {
          gsap.to(
            shake,
            { keyframes: { x: [0, -7, 6, -3, 0], y: [0, 4, -3, 1, 0] }, duration: 0.35, ease: 'none' }
          );
        }
      };

      // Kinetic headline: masked character reveal + scroll-velocity skew
      gsap.from('.cert-char', {
        yPercent: 115,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.035,
        scrollTrigger: { trigger: headRef.current, start: 'top 85%', once: true },
      });

      const skewTo = gsap.quickTo(headRef.current, 'skewX', { duration: 0.5, ease: 'power3' });
      const resetSkew = () => skewTo(0);
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => skewTo(gsap.utils.clamp(-10, 10, self.getVelocity() / -250)),
      });
      ScrollTrigger.addEventListener('scrollEnd', resetSkew);

      if (stack) {
        // Pinned card stack: each cert slides over the previous one
        const tints = gsap.utils.toArray('.cert-tint');
        const steps = cards.length - 1;

        gsap.set(cards, { zIndex: (i) => i + 1 });
        gsap.set(cards.slice(1), { yPercent: 112, rotate: 3 });
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
                activate(cards[i]);
              }
            },
          },
        });

        for (let i = 1; i <= steps; i++) {
          tl.to(
            cards[i - 1],
            { scale: 0.88, yPercent: -8, rotate: -3, opacity: 0.25, duration: 1 },
            i - 1
          )
            .to(cards[i], { yPercent: 0, rotate: 0, duration: 1, ease: 'power2.out' }, i - 1)
            .to(tints[i - 1], { opacity: 0, duration: 1 }, i - 1)
            .to(tints[i], { opacity: 1, duration: 1 }, i - 1);
        }
        tl.to(progressRef.current, { scaleY: 1, duration: steps }, 0);

        ScrollTrigger.create({
          trigger: pinRef.current,
          start: 'top 60%',
          once: true,
          onEnter: () => activate(cards[0]),
        });
      } else {
        cards.forEach((card) =>
          ScrollTrigger.create({
            trigger: card,
            start: 'top 75%',
            once: true,
            onEnter: () => activate(card),
          })
        );
      }

      return () => ScrollTrigger.removeEventListener('scrollEnd', resetSkew);
    },
    { scope: sectionRef, dependencies: [mode], revertOnUpdate: true }
  );

  /* ---------------- Flip lightbox ---------------- */
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

    // Morph the certificate out of its card into the lightbox
    const img = ghost.querySelector('img');
    img.style.objectFit = 'cover';
    Flip.fit(ghost, src, { scale: true });
    gsap.set(src, { visibility: 'hidden' });

    gsap
      .timeline()
      .to(backdropRef.current, { opacity: 1, duration: 0.5 }, 0)
      .to(ghost, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.95, ease: 'expo.inOut' }, 0)
      .call(() => {
        img.style.objectFit = 'contain';
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
        img.style.objectFit = 'cover';
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
  }); // re-bound each render so it always sees the current lightbox

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
        {/* Left: editorial anchor */}
        <div className="lg:w-5/12 flex flex-col justify-between">
          <div>
            <h2
              ref={headRef}
              aria-label="Verified Proofs"
              className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-8 font-arsenica hover-h1 origin-left"
            >
              <span className="block" aria-hidden="true">
                <Split text="Verified" />
              </span>
              <span className="block" aria-hidden="true">
                <Split text="Proofs" />
              </span>
            </h2>
            <div className="h-1 w-24 bg-black mb-8" />
            <p
              className="text-lg text-gray-500 leading-relaxed max-w-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Rigorous industry accreditations issued by Amazon Web Services, validating competence
              across cloud infrastructure architectures, security protocols, and generative AI
              engineering.
            </p>
          </div>

          <div className="hidden lg:flex items-end gap-5 mt-auto">
            {stack && (
              <>
                <div className="relative h-24 w-px bg-gray-200" aria-hidden="true">
                  <div
                    ref={progressRef}
                    className="absolute inset-0 bg-black origin-top scale-y-0"
                  />
                </div>
                <p className="font-mono text-sm tabular-nums text-gray-500" aria-live="polite">
                  Certificate {active + 1} of {total}
                </p>
              </>
            )}
            {!stack && (
              <p className="text-xs text-gray-400 font-mono">
                Registrar: Credly by Pearson · Official Records
              </p>
            )}
          </div>
        </div>

        {/* Right: the stack */}
        <div
          ref={stageRef}
          className={[
            'lg:w-7/12',
            stack ? 'relative h-full' : 'flex flex-col gap-12 lg:gap-16',
          ].join(' ')}
        >
          {certificationsData.map((cert) => (
            <CertificationCard
              key={cert.id}
              cert={cert}
              mode={mode}
              onInspect={openLightbox}
              registerSource={registerSource}
            />
          ))}
        </div>
      </div>

      {/* Lightbox: certificate morphs out of its card via GSAP Flip */}
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
                <h4 className="text-base sm:text-lg font-medium leading-tight truncate">
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
              className="ferro-btn shrink-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            ref={ghostRef}
            className={`relative z-10 aspect-[4/3] ${frameW} overflow-hidden rounded-2xl bg-white shadow-2xl`}
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
              className="ferro-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black text-xs font-medium hover:bg-gray-200 transition-colors"
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