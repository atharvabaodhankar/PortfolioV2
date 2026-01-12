import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoaderProvider, useLoader } from './context/LoaderContext';
import { usePreloader } from './hooks/usePreloader';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import About from './components/About';
import Skills from './components/Skills';
import Education from './components/Education';
import Created from './components/Created';
import Ferro from './components/Ferro';
import Projects from './components/Projects';
import Work from './components/Work';
import Footer from './components/Footer';

// Admin components
import Login from './components/admin/Login';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import ProjectManager from './components/admin/ProjectManager';
import SkillsManager from './components/admin/SkillsManager';
import WorkManager from './components/admin/WorkManager';
import ProtectedRoute from './components/admin/ProtectedRoute';

import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import FerroLib from './lib/ferro';

gsap.registerPlugin(ScrollTrigger);

function PortfolioPage() {
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
      // Small delay to ensure all DOM elements are rendered
      const timer = setTimeout(() => {
        // Ferro.mouseFollower(speed, size, blendMode, selectors, scaleEnhancer)
        const cursor = FerroLib.mouseFollower(1, "15px", true, ["h1", ".nav-btn" , ".hero-hover" , ".ferro-c1 p",".ferro-btn"], 3);
        
        // Store cursor instance for cleanup
        window.ferroCursor = cursor;
      }, 100);
      
      // Cleanup
      return () => {
        clearTimeout(timer);
        if (window.ferroCursor) {
          window.ferroCursor.destroy();
          window.ferroCursor = null;
        }
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
          <Education />
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

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Main Portfolio Route */}
        <Route path="/" element={<PortfolioPage />} />
        
        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<ProjectManager />} />
          <Route path="skills" element={<SkillsManager />} />
          <Route path="work" element={<WorkManager />} />
        </Route>
      </Routes>
    </Router>
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
