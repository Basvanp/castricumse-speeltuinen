import React, { useState, useEffect } from 'react';
import SEOHead from '@/components/SEOHead';
import { useAnalytics } from '@/hooks/useAnalytics';

// 404 Page Structured Data
const notFoundStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "404 Error Page",
  "description": "Page not found"
};

const NotFound = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    setIsLoaded(true);
    
    // Track 404 page view for analytics
    trackEvent('page_view', undefined, {
      error_type: '404',
      page_type: 'error_page'
    });
  }, [trackEvent]);

  return (
    <>
      <SEOHead 
        title="404 - Pagina niet gevonden | Speeltuinen Castricum"
        description="De pagina die u zoekt is niet gevonden. Ontdek onze andere content."
        keywords="404, pagina niet gevonden, speeltuinen, castricum, error"
        noindex={true}
        structuredData={notFoundStructuredData}
      />
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 playground-404">
        {/* Background Gradient */}
        <div className="absolute inset-0 playground-gradient"></div>
        
        {/* Floating Clouds */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          
          {/* 404 Error Code */}
          <div className="mb-8">
            <h1 
              className="error-code"
              style={{
                animation: isLoaded ? 'bounce 2s infinite' : 'none'
              }}
            >
              404
            </h1>
          </div>

          {/* Main Message */}
          <div className="mb-8">
            <h2 
              className="main-message"
              style={{
                animation: isLoaded ? 'pulse 2s infinite' : 'none'
              }}
            >
              Oeps! Deze speeltuin bestaat niet!
            </h2>
          </div>

          {/* Subtitle */}
          <div className="mb-12">
            <p className="subtitle">
              Het lijkt erop dat je bent verdwaald in onze digitale speeltuin! 🎪 
              Geen zorgen, gebeurt de beste van ons. Laten we je terugbrengen naar 
              de hoofdingang waar alle leuke spellen wachten!
            </p>
          </div>

          {/* CTA Button */}
          <div className="cta-container">
            {/* 404 Image - Centered above button */}
            <div className="mb-8 playground-illustration" style={{ marginLeft: '115px' }}>
              <img 
                src="/lovable-uploads/404-image.png" 
                alt="404 Speeltuin schutting met kijkgat" 
                className="playground-svg"
                style={{
                  animation: isLoaded ? 'float 4s ease-in-out infinite' : 'none',
                  maxWidth: '400px',
                  height: 'auto'
                }}
              />
            </div>
            
            <a 
              href="/" 
              className="cta-button"
              onClick={(e) => {
                // Confetti effect
                const burst = document.createElement('div');
                burst.className = 'absolute inset-0 pointer-events-none';
                burst.innerHTML = Array.from({ length: 15 }).map((_, i) => 
                  `<div class="absolute w-2 h-2 rounded-full animate-ping" style="
                    background-color: ${['#FF6B6B', '#4ECDC4', '#FFD93D', '#FFCCCB'][Math.floor(Math.random() * 4)]};
                    left: ${50 + (Math.random() - 0.5) * 100}%;
                    top: ${50 + (Math.random() - 0.5) * 100}%;
                    animation-delay: ${Math.random() * 0.5}s;
                    animation-duration: ${1 + Math.random()}s;
                  "></div>`
                ).join('');
                e.currentTarget.appendChild(burst);
                setTimeout(() => burst.remove(), 2000);
              }}
            >
              🏠 Terug naar alle speeltuinen
            </a>
          </div>

          {/* Internal Links for SEO */}
          <div className="mt-12 text-center">
            <div className="text-sm text-gray-600 mb-4">
              <p>Andere nuttige pagina's:</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="/" className="text-blue-600 hover:text-blue-800 underline">Homepage</a>
              <a href="/sitemap.xml" className="text-blue-600 hover:text-blue-800 underline">Sitemap</a>
              <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline">Privacy</a>
              <a href="/terms" className="text-blue-600 hover:text-blue-800 underline">Voorwaarden</a>
            </div>
          </div>
        </div>

        {/* Custom CSS */}
        <style>{`
          /* Import Google Fonts */
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
          
          /* Base Styles */
          .playground-404 {
            font-family: 'Nunito', sans-serif;
            background: linear-gradient(135deg, #FFE5B4 0%, #FFCCCB 25%, #E6E6FA 50%, #B0E0E6 75%, #FFE5B4 100%);
            background-size: 400% 400%;
            animation: gradientShift 8s ease infinite;
          }
          
          /* Error Code */
          .error-code {
            font-size: 8rem;
            font-weight: 800;
            color: #FF6B6B;
            text-shadow: 4px 4px 0px #FFD93D;
            margin: 0;
            line-height: 1;
          }
          
          /* Main Message */
          .main-message {
            font-size: 2.5rem;
            font-weight: 700;
            color: #4A5568;
            margin: 0;
            line-height: 1.2;
          }
          
          /* Subtitle */
          .subtitle {
            font-size: 1.2rem;
            font-weight: 400;
            color: #718096;
            line-height: 1.6;
            max-width: 600px;
            margin: 0 auto;
          }
          
          /* CTA Button */
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
            color: white;
            padding: 16px 32px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
            box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(255, 107, 107, 0.4);
            background: linear-gradient(135deg, #FF5252 0%, #26A69A 100%);
          }
          
          .cta-button:active {
            transform: translateY(-1px);
          }
          
          /* Playground SVG */
          .playground-svg {
            filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
            transition: all 0.3s ease;
          }
          
          .playground-svg:hover {
            filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.15));
            transform: scale(1.05);
          }
          
          /* Clouds */
          .cloud {
            position: absolute;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50px;
            opacity: 0.7;
          }
          
          .cloud-1 {
            width: 100px;
            height: 40px;
            top: 20%;
            left: -100px;
            animation: translate 12s linear infinite;
          }
          
          .cloud-2 {
            width: 80px;
            height: 30px;
            top: 40%;
            left: -80px;
            animation: translate 8s linear infinite;
            animation-delay: 2s;
          }
          
          .cloud-3 {
            width: 120px;
            height: 50px;
            top: 60%;
            left: -120px;
            animation: translate 15s linear infinite;
            animation-delay: 5s;
          }
          
          /* Keyframe Animations */
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-20px); }
            60% { transform: translateY(-10px); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes swing {
            0%, 100% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
          }
          
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes translate {
            from { transform: translateX(0px); }
            to { transform: translateX(calc(100vw + 100px)); }
          }
          
          @keyframes slideGlow {
            0%, 100% { filter: brightness(1); }
            50% { filter: brightness(1.2); }
          }
          
          /* Responsive Design */
          @media (max-width: 768px) {
            .error-code {
              font-size: 6rem;
            }
            
            .main-message {
              font-size: 2rem;
            }
            
            .subtitle {
              font-size: 1rem;
              padding: 0 20px;
            }
            
            .playground-svg {
              width: 300px;
              height: 225px;
            }
            
            .cta-button {
              font-size: 1rem;
              padding: 14px 28px;
            }
          }
          
          @media (max-width: 480px) {
            .error-code {
              font-size: 4rem;
            }
            
            .main-message {
              font-size: 1.5rem;
            }
            
            .playground-svg {
              width: 250px;
              height: 188px;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default NotFound;
