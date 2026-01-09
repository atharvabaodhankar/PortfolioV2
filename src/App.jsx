import React, { useEffect, useRef, useState } from 'react';
import { LoaderProvider, useLoader } from './context/LoaderContext';
import { usePreloader } from './hooks/usePreloader';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import About from './components/About';
import Skills from './components/Skills';
import Created from './components/Created';
import Ferro from './components/Ferro';
import Projects from './components/Projects';
import Work from './components/Work';
import Footer from './components/Footer';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import MouseFollower from 'mouse-follower';
import 'mouse-follower/dist/mouse-follower.min.css';
// import Shery from 'sheryjs'; // TODO: Check proper import method

gsap.registerPlugin(ScrollTrigger);
MouseFollower.registerGSAP(gsap);

// Import tilt.js if needed
// import './assets/scripts/tilt.js';

function AppContent() {
  const { isLoaded, markAsLoaded } = useLoader();
  const [heroImages, setHeroImages] = useState([]);

  useEffect(() => {
    // Collect critical hero images
    const criticalImages = [
      '/src/assets/imgs/hero-img.jpg',
      '/src/assets/imgs/Web_Photo_Editor.jpg',
    ];
    setHeroImages(criticalImages);
  }, []);

  const { progress, imagesReady } = usePreloader(() => {
    markAsLoaded();
  }, heroImages);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      lerp: 0.05,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    // Initialize Mouse Follower after loading (desktop only)
    if (window.matchMedia('(min-width: 768px)').matches) {
      const cursor = new MouseFollower({
        container: document.body,
        speed: 0.3,
      });
      
      // Cleanup
      return () => {
        cursor.destroy();
      };
    }

    // ScrollTrigger refresh on window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isLoaded]);

  return (
    <>
      <Preloader />
      {isLoaded && (
        <section id="main">
          <Navbar />
          <Hero />
          <About />
          <Marquee />
          <Skills />
          <Created />
          <Ferro />
          <Projects />
          <Work />
          <Footer />
        </section>
      )}
    </>
  );
}

function App() {
  return (
    <LoaderProvider>
      <AppContent />
    </LoaderProvider>
  );
}

export default App;
