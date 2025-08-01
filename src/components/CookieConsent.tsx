import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      // Show consent banner after a short delay
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowConsent(false);
  };

  if (!showConsent) {
    return null;
  }

  return (
    <>
      {/* Cookie Consent Banner */}
      <div className="cookie-consent-banner">
        <div className="cookie-content">
          <div className="cookie-icon">🍪</div>
          <div className="cookie-text">
            <h3>🍪 Lekkere koekjes!</h3>
            <p>
              Wij gebruiken koekjes om je ervaring op onze speeltuin website nog leuker te maken! 
              Deze helpen ons om de website te verbeteren en te onthouden wat je leuk vindt. 
              Geen zorgen, het zijn alleen digitale koekjes! 😊
            </p>
          </div>
          <div className="cookie-buttons">
            <button 
              onClick={acceptCookies}
              className="cookie-accept"
            >
              🎉 Ja, dat is prima!
            </button>
            <button 
              onClick={declineCookies}
              className="cookie-decline"
            >
              🚫 Nee, liever niet
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        .cookie-consent-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #FFE5B4 0%, #FFCCCB 50%, #E6E6FA 100%);
          border-top: 3px solid #4ECDC4;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
          z-index: 1000;
          animation: slideUp 0.5s ease-out;
        }

        .cookie-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .cookie-icon {
          font-size: 2.5rem;
          animation: bounce 2s infinite;
        }

        .cookie-text {
          flex: 1;
          min-width: 300px;
        }

        .cookie-text h3 {
          margin: 0 0 8px 0;
          color: #4ECDC4;
          font-size: 1.3rem;
          font-weight: 700;
        }

        .cookie-text p {
          margin: 0;
          color: #666;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .cookie-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .cookie-accept {
          background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
        }

        .cookie-accept:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(78, 205, 196, 0.4);
        }

        .cookie-decline {
          background: linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }

        .cookie-decline:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .cookie-content {
            padding: 15px;
            gap: 15px;
          }

          .cookie-text {
            min-width: 250px;
          }

          .cookie-text h3 {
            font-size: 1.1rem;
          }

          .cookie-text p {
            font-size: 0.9rem;
          }

          .cookie-buttons {
            width: 100%;
            justify-content: center;
          }

          .cookie-accept,
          .cookie-decline {
            padding: 10px 16px;
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .cookie-content {
            flex-direction: column;
            text-align: center;
          }

          .cookie-text {
            min-width: auto;
          }

          .cookie-buttons {
            flex-direction: column;
            width: 100%;
          }

          .cookie-accept,
          .cookie-decline {
            width: 100%;
            padding: 12px 20px;
          }
        }
      `}</style>
    </>
  );
};

export default CookieConsent; 