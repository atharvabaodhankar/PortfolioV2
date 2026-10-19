import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ArrowUpRight, Copy, Check, ShieldCheck, Maximize2, X } from 'lucide-react';

import cloudPracImg from '../assets/imgs/aws-cloud-practitioner.jpg';
import aiPracImg from '../assets/imgs/aws-ai-practitioner.jpg';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const certificationsData = [
  {
    id: 'cloud-practitioner',
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services (AWS)',
    issueDate: 'Sep 2026',
    expiryDate: 'Sep 2029',
    credentialId: 'c6fb527afe4f47ceb5617fda9e40f2df',
    credlyUrl: 'https://www.credly.com/badges/75af1cbd-0f22-451c-9c2b-ba7c12f70a11/linked_in_profile',
    image: cloudPracImg,
    badgeColor: 'from-amber-500/20 via-orange-500/10 to-transparent',
    accentBorder: 'hover:border-amber-500/40',
    summary:
      'Validates comprehensive fluency across core AWS services, secure multi-tenant architectures, shared responsibility security models, and cloud economics.',
    competencies: [
      'Cloud Architecture',
      'AWS Core Infrastructure',
      'Security & Compliance',
      'Cloud Economics',
      'Billing & Support Models'
    ]
  },
  {
    id: 'ai-practitioner',
    title: 'AWS Certified AI Practitioner',
    issuer: 'Amazon Web Services (AWS)',
    issueDate: 'Aug 2026',
    expiryDate: 'Aug 2029',
    credentialId: '2cd8c2becfb045fea5200e98794bca75',
    credlyUrl: 'https://www.credly.com/badges/653ef4ab-08b4-4989-bc11-86636a61288a/linked_in_profile',
    image: aiPracImg,
    badgeColor: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    accentBorder: 'hover:border-blue-500/40',
    summary:
      'Demonstrates mastery in generative AI solutions, foundation model evaluation, prompt design, responsible AI guardrails, and enterprise Amazon Bedrock & SageMaker deployments.',
    competencies: [
      'Generative AI & LLMs',
      'Foundation Models',
      'Prompt Engineering',
      'Responsible AI & Guardrails',
      'AWS Bedrock & SageMaker'
    ]
  }
];

const CertificationCard = ({ cert, onInspect }) => {
  const cardRef = useRef(null);
  const imageCardRef = useRef(null);
  const glareRef = useRef(null);
  const [copied, setCopied] = useState(false);

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

  const handleMouseMove = (e) => {
    if (!imageCardRef.current || window.innerWidth < 1024) return;
    const rect = imageCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    gsap.to(imageCardRef.current, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 1000
    });

    if (glareRef.current) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      gsap.to(glareRef.current, {
        opacity: 0.45,
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 65%)`,
        duration: 0.2
      });
    }
  };

  const handleMouseLeave = () => {
    if (!imageCardRef.current) return;
    gsap.to(imageCardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: 'power3.out'
    });

    if (glareRef.current) {
      gsap.to(glareRef.current, {
        opacity: 0,
        duration: 0.5
      });
    }
  };

  return (
    <article
      ref={cardRef}
      className="cert-item group relative pt-12 pb-16 transition-colors"
    >
      {/* Editorial top divider line */}
      <div className="cert-border absolute top-0 left-0 w-full h-[1px] bg-gray-200"></div>

      {/* Meta header row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          
          <span className="text-xs md:text-sm font-mono uppercase tracking-widest text-gray-500">
            {cert.issuer}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs md:text-sm font-mono text-gray-500">
          <span>{cert.issueDate} — {cert.expiryDate}</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        </div>
      </div>

      {/* Grid: Details Left, 3D Certificate Artifact Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Info Column */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <h3
              className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.1] mb-6 text-black"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {cert.title}
            </h3>

            <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed mb-8 max-w-xl">
              {cert.summary}
            </p>

            {/* Competency tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {cert.competencies.map((comp) => (
                <span
                  key={comp}
                  className="px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200/80 rounded-full text-xs sm:text-sm font-medium text-gray-700 transition-colors duration-200"
                >
                  {comp}
                </span>
              ))}
            </div>
          </div>

          {/* Verification Bar & Actions */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Monospace Credential ID with Copy Action */}
            <div className="flex flex-col">
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                Credential ID
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="group/copy inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-gray-700 hover:text-black transition-colors"
                title="Click to copy credential ID"
              >
                <span className="truncate max-w-[200px] sm:max-w-[240px] border-b border-dashed border-gray-300 group-hover/copy:border-black">
                  {cert.credentialId}
                </span>
                {copied ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </span>
                ) : (
                  <Copy className="w-3.5 h-3.5 text-gray-400 group-hover/copy:text-black transition-colors" />
                )}
              </button>
            </div>

            {/* Credly Outbound Link */}
            <a
              href={cert.credlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 hover:bg-gray-800 hover:shadow-lg active:scale-95 ferro-btn"
            >
              <span>Verify on Credly</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* 3D Certificate Card Artifact */}
        <div className="lg:col-span-6 relative">
          <div
            ref={imageCardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => onInspect(cert)}
            className="group/img relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500 border border-gray-200/90 bg-gray-100 will-change-transform"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Certificate Graphic */}
            <img
              src={cert.image}
              alt={cert.title}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover/img:scale-[1.03]"
              loading="lazy"
            />

            {/* Dynamic Glare Refraction */}
            <div
              ref={glareRef}
              className="absolute inset-0 pointer-events-none opacity-0 mix-blend-overlay transition-opacity duration-300"
            ></div>

            {/* Hover Inspect Pill */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/95 text-black rounded-full text-xs sm:text-sm font-medium shadow-xl tracking-wide transform translate-y-2 group-hover/img:translate-y-0 transition-transform duration-300">
                <Maximize2 className="w-3.5 h-3.5" />
                Inspect Certificate
              </span>
            </div>

            {/* Ambient Corner Stamp */}
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/40 shadow-sm text-[11px] font-mono text-gray-800 pointer-events-none">
              Official PDF · AWS
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default function Certifications() {
  const containerRef = useRef(null);
  const [selectedCert, setSelectedCert] = useState(null);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedCert(null);
    };
    if (selectedCert) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedCert]);

  useGSAP(() => {
    // Left column entrance
    gsap.from('.cert-left-inv', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
        invalidateOnRefresh: true
      },
      y: 30,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // Staggered reveal for each cert item
    const items = gsap.utils.toArray('.cert-item');
    items.forEach((item) => {
      const border = item.querySelector('.cert-border');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true
        }
      });

      tl.fromTo(
        border,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.9, ease: 'power3.out' }
      ).from(
        item.children,
        {
          y: 24,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out'
        },
        '-=0.5'
      );
    });
  }, { scope: containerRef });

  return (
    <section
      id="certifications"
      ref={containerRef}
      className="w-full min-h-screen bg-white text-black px-6 md:px-12 lg:px-24 py-24 sm:py-32 relative z-10 font-sans"
    >
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-32">
        {/* LEFT COLUMN: Sticky Editorial Anchor */}
        <div className="lg:w-1/3 flex flex-col justify-between lg:h-[calc(100vh-180px)] lg:sticky lg:top-32">
          <div className="cert-left-inv">
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-8 font-arsenica hover-h1">
              Verified<br />Proofs
            </h2>
            <div className="h-1 w-24 bg-black mb-8"></div>
            <p
              className="text-lg text-gray-500 font-normal leading-relaxed max-w-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Rigorous industry accreditations issued by Amazon Web Services, validating competence across cloud infrastructure architectures, security protocols, and generative AI engineering.
            </p>
          </div>

          <div className="cert-left-inv hidden lg:flex flex-col gap-3 mt-auto">
           
            <p className="text-xs text-gray-400 font-mono">
              Registrar: Credly by Pearson · Official Records
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: The Accreditations Gallery */}
        <div className="lg:w-2/3 flex flex-col gap-12 lg:gap-16 pt-6 lg:pt-0">
          {certificationsData.map((cert) => (
            <CertificationCard
              key={cert.id}
              cert={cert}
              onInspect={(c) => setSelectedCert(c)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox / High-Res Certificate Inspection Modal */}
      {selectedCert && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="text-base sm:text-lg font-medium text-black leading-tight">
                    {selectedCert.title}
                  </h4>
                  <span className="text-xs font-mono text-gray-500">
                    ID: {selectedCert.credentialId}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={selectedCert.credlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 bg-black text-white rounded-full text-xs font-medium hover:bg-gray-800 transition-colors"
                >
                  <span>Verify on Credly</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Certificate Image Preview */}
            <div className="overflow-auto p-4 sm:p-8 flex items-center justify-center bg-gray-900/5">
              <img
                src={selectedCert.image}
                alt={selectedCert.title}
                className="max-h-[70vh] w-auto max-w-full rounded-lg shadow-md object-contain"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-white border-t border-gray-100 flex flex-wrap items-center justify-between text-xs font-mono text-gray-500 gap-2">
              <span>Issued: {selectedCert.issueDate} · Expires: {selectedCert.expiryDate}</span>
              <a
                href={selectedCert.credlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sm:hidden text-black underline font-medium"
              >
                Verify on Credly →
              </a>
              <span>Amazon Web Services Training & Certification</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
