import React, { useEffect, useRef, useState } from "react";
import { FaConnectdevelop, FaFingerprint, FaGamepad, FaLeaf } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { SiLogitech, SiReact } from "react-icons/si";
import { GiTreeGrowth } from "react-icons/gi";

// Demo images - event themed for ticket booking website
const conf1 = "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=600&fit=crop"; // concert crowd
const conf2 = "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?w=800&h=600&fit=crop"; // live band performance
const conf3 = "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?w=800&h=600&fit=crop"; // outdoor music festival crowd


export default function PartnersAndResources() {
  const [sponsorVisible, setSponsorVisible] = useState(false);
  const [resourcesVisible, setResourcesVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const sponsorRef = useRef(null);
  const resourcesRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: "0px"
    };

    const sponsorObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !sponsorVisible) {
          setSponsorVisible(true);
        }
      });
    }, observerOptions);

    const resourcesObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !resourcesVisible) {
          setResourcesVisible(true);
        }
      });
    }, observerOptions);

    if (sponsorRef.current) sponsorObserver.observe(sponsorRef.current);
    if (resourcesRef.current) resourcesObserver.observe(resourcesRef.current);

    return () => {
      if (sponsorRef.current) sponsorObserver.unobserve(sponsorRef.current);
      if (resourcesRef.current) resourcesObserver.unobserve(resourcesRef.current);
    };
  }, [sponsorVisible, resourcesVisible]);

  const sponsors = [
    { icon: FaConnectdevelop, position: 'top-left' },
    { icon: FaFingerprint, position: 'top-right' },
    { icon: MdSecurity, position: 'bottom-left' },
    { icon: SiReact, position: 'bottom-right' }
  ];

  const diamondSponsors = [
    { icon: FaGamepad, position: 'top-left' },
    { icon: GiTreeGrowth, position: 'top-right' },
    { icon: SiLogitech, position: 'bottom-left' },
    { icon: FaLeaf, position: 'bottom-right' }
  ];

  const images = [conf1, conf2, conf3];

  return (
    <>
      <style>{`
        /* Sponsor Logo Spread Animation */
        .sponsor-card {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 96px;
          border-radius: 0.5rem;
          background: black;
          border: 1px solid #1f2937;
          overflow: hidden;
        }
        
        .sponsor-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.8);
        }
        
        /* Spread animations to corners - only trigger on scroll */
        .sponsor-icon.visible.top-left {
          animation: spreadTopLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .sponsor-icon.visible.top-right {
          animation: spreadTopRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .sponsor-icon.visible.bottom-left {
          animation: spreadBottomLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .sponsor-icon.visible.bottom-right {
          animation: spreadBottomRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* Continuous floating animation after spread */
        .sponsor-icon.visible {
          animation-fill-mode: forwards;
        }

        .sponsor-icon.visible.top-left {
          animation: spreadTopLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
                     floatTopLeft 3s ease-in-out 0.8s infinite;
        }
        
        .sponsor-icon.visible.top-right {
          animation: spreadTopRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
                     floatTopRight 3s ease-in-out 0.8s infinite;
        }
        
        .sponsor-icon.visible.bottom-left {
          animation: spreadBottomLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
                     floatBottomLeft 3s ease-in-out 0.8s infinite;
        }
        
        .sponsor-icon.visible.bottom-right {
          animation: spreadBottomRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
                     floatBottomRight 3s ease-in-out 0.8s infinite;
        }
        
        /* Stagger the spread effect */
        .sponsor-icon:nth-child(1).visible { animation-delay: 0.1s; }
        .sponsor-icon:nth-child(2).visible { animation-delay: 0.2s; }
        .sponsor-icon:nth-child(3).visible { animation-delay: 0.3s; }
        .sponsor-icon:nth-child(4).visible { animation-delay: 0.4s; }

        @keyframes spreadTopLeft {
          from {
            top: 50%;
            left: 50%;
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            top: 35%;
            left: 35%;
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes spreadTopRight {
          from {
            top: 50%;
            left: 50%;
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            top: 35%;
            left: 65%;
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes spreadBottomLeft {
          from {
            top: 50%;
            left: 50%;
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            top: 65%;
            left: 35%;
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes spreadBottomRight {
          from {
            top: 50%;
            left: 50%;
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            top: 65%;
            left: 65%;
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        /* Continuous floating animations */
        @keyframes floatTopLeft {
          0%, 100% {
            top: 35%;
            left: 35%;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            top: 32%;
            left: 33%;
            transform: translate(-50%, -50%) scale(1.05);
          }
        }
        
        @keyframes floatTopRight {
          0%, 100% {
            top: 35%;
            left: 65%;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            top: 32%;
            left: 67%;
            transform: translate(-50%, -50%) scale(1.05);
          }
        }
        
        @keyframes floatBottomLeft {
          0%, 100% {
            top: 65%;
            left: 35%;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            top: 68%;
            left: 33%;
            transform: translate(-50%, -50%) scale(1.05);
          }
        }
        
        @keyframes floatBottomRight {
          0%, 100% {
            top: 65%;
            left: 65%;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            top: 68%;
            left: 67%;
            transform: translate(-50%, -50%) scale(1.05);
          }
        }

        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .sponsor-section-title {
          opacity: 0;
        }
        
        .sponsor-section-title.visible {
          animation: fadeSlideUp 0.6s ease-out forwards;
        }

        /* Resources Section Animations */
        .resources-heading {
          opacity: 0;
        }
        
        .resources-heading.visible {
          animation: fadeSlideUp 0.6s ease-out forwards;
        }

        /* Horizontal scrollable gallery with fisheye effect */
        .horizontal-scroll {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: #FFE302 rgba(255, 255, 255, 0.1);
          padding: 1rem 0;
        }
        
        .horizontal-scroll::-webkit-scrollbar {
          height: 8px;
        }
        
        .horizontal-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        .horizontal-scroll::-webkit-scrollbar-thumb {
          background: #FFE302;
          border-radius: 4px;
        }

        /* Resource card with fisheye/accordion effect */
        .resource-card {
          flex-shrink: 0;
          height: 400px;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          width: 350px;
          opacity: 0;
          transform: scaleY(0.85);
        }
        
        /* Viewport triggered scaling */
        .resource-card.visible {
          opacity: 1;
          transform: scaleY(1);
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        /* Stagger the initial appearance */
        .resource-card:nth-child(1).visible { 
          animation: scaleIn 0.6s ease-out 0.1s forwards;
        }
        .resource-card:nth-child(2).visible { 
          animation: scaleIn 0.6s ease-out 0.25s forwards;
        }
        .resource-card:nth-child(3).visible { 
          animation: scaleIn 0.6s ease-out 0.4s forwards;
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scaleY(0.85);
          }
          to {
            opacity: 1;
            transform: scaleY(1);
          }
        }
        
        /* Fisheye expansion on hover */
        .resource-card.expanded {
          width: 500px !important;
          z-index: 10;
          transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .resource-card.contracted {
          width: 380px !important;
          transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .resource-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .resource-card.expanded img {
          transform: scale(1.05);
        }
      `}</style>

      {/* We Are Partners In Innovation */}
      <section className="bg-black text-white py-20" ref={sponsorRef}>
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-12">
            <div className={`sponsor-section-title ${sponsorVisible ? 'visible' : ''}`}>
              <h2 className="text-5xl font-black mb-3">We Are Partners</h2>
              <div className="text-3xl font-light opacity-90 mb-6">In Innovation</div>
            </div>
            <div className={`sponsor-section-title ${sponsorVisible ? 'visible' : ''}`} style={{animationDelay: '0.1s'}}>
              <p className="opacity-90 font-light max-w-md text-sm" style={{marginLeft:"auto"}}>
                Meet the organizations fueling our event. Our sponsors are leaders in tech, helping us create an extraordinary experience.
              </p>
            </div>
          </div>
          
          {/* Sponsors Grid */}
          <div className="flex flex-col md:flex-row gap-12">
            {/* Platinum Sponsor */}
            <div className="flex-1">
              <div className={`text-xl font-bold mb-4 border-l-4 border-gray-700 pl-3 sponsor-section-title ${sponsorVisible ? 'visible' : ''}`} style={{animationDelay: '0.2s'}}>
                Platinum Sponsor
              </div>
              <div className="grid grid-cols-2 gap-6 bg-transparent p-2 border border-gray-800 rounded-xl">
                {sponsors.map((sponsor, idx) => (
                  <div key={idx} className="sponsor-card">
                    <sponsor.icon 
                      className={`sponsor-icon ${sponsorVisible ? `visible ${sponsor.position}` : ''} w-12 h-12 text-gray-400`}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Diamond Sponsor */}
            <div className="flex-1">
              <div className={`text-xl font-bold mb-4 border-l-4 border-blue-400 pl-3 sponsor-section-title ${sponsorVisible ? 'visible' : ''}`} style={{animationDelay: '0.25s'}}>
                Diamond Sponsor
              </div>
              <div className="grid grid-cols-2 gap-6 bg-transparent p-2 border border-gray-800 rounded-xl">
                {diamondSponsors.map((sponsor, idx) => (
                  <div key={idx} className="sponsor-card">
                    <sponsor.icon 
                      className={`sponsor-icon ${sponsorVisible ? `visible ${sponsor.position}` : ''} w-12 h-12 text-gray-400`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources From Past Conferences */}
      <section style={{ background: "#6F2CFD" }} ref={resourcesRef}>
        <div className="container mx-auto px-8 py-20">
          <div className={`text-center mb-10 resources-heading ${resourcesVisible ? 'visible' : ''}`}>
            <h2 className="text-4xl md:text-5xl font-black mb-2" style={{ color: '#FFE302' }}>
  Top Events & Exclusive Offers
</h2>
<p className="text-md md:text-lg opacity-90" style={{ color: 'white' }}>
  Discover trending concerts, sports matches, and live shows near you. Book tickets easily and never miss out on your favorite events!
</p>

          </div>
          
          {/* Horizontal scrollable gallery with fisheye effect */}
          <div className="horizontal-scroll">
            {images.map((img, idx) => (
              <div 
                key={idx}
                className={`resource-card ${resourcesVisible ? 'visible' : ''} ${
                  hoveredIndex === idx ? 'expanded' : hoveredIndex !== null ? 'contracted' : ''
                }`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <img src={img} alt={`Past conference ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}