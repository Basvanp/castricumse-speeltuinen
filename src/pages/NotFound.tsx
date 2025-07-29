import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="text-center max-w-md px-6">
        {/* Pulserende speeltuin SVG */}
        <div className="mb-8 animate-pulse">
          <svg 
            width="200" 
            height="200" 
            viewBox="0 0 200 200" 
            className="mx-auto drop-shadow-lg"
          >
            {/* Glijbaan */}
            <path 
              d="M50 80 Q80 60 110 80 L110 120 Q80 140 50 120 Z" 
              fill="#FF6B6B" 
              className="animate-pulse"
            />
            <rect x="45" y="75" width="10" height="50" fill="#E55555" />
            
            {/* Ladder */}
            <rect x="115" y="80" width="8" height="40" fill="#4ECDC4" />
            <rect x="110" y="85" width="18" height="3" fill="#4ECDC4" />
            <rect x="110" y="95" width="18" height="3" fill="#4ECDC4" />
            <rect x="110" y="105" width="18" height="3" fill="#4ECDC4" />
            <rect x="110" y="115" width="18" height="3" fill="#4ECDC4" />
            
            {/* Schommel */}
            <line x1="140" y1="60" x2="140" y2="120" stroke="#8B4513" strokeWidth="4" />
            <line x1="160" y1="60" x2="160" y2="120" stroke="#8B4513" strokeWidth="4" />
            <line x1="135" y1="60" x2="165" y2="60" stroke="#8B4513" strokeWidth="6" />
            
            {/* Schommelzitje */}
            <rect x="135" y="115" width="30" height="8" rx="4" fill="#FFD93D" />
            <line x1="140" y1="120" x2="140" y2="108" stroke="#333" strokeWidth="2" />
            <line x1="160" y1="120" x2="160" y2="108" stroke="#333" strokeWidth="2" />
            
            {/* Gras */}
            <ellipse cx="100" cy="180" rx="80" ry="15" fill="#95E1A3" />
            
            {/* Bloemetjes */}
            <circle cx="70" cy="175" r="3" fill="#FF69B4" />
            <circle cx="130" cy="175" r="3" fill="#FFD700" />
            <circle cx="85" cy="180" r="2.5" fill="#FF1493" />
            <circle cx="115" cy="180" r="2.5" fill="#00CED1" />
            
            {/* Wolkjes */}
            <ellipse cx="40" cy="30" rx="15" ry="8" fill="#FFF" opacity="0.8" />
            <ellipse cx="160" cy="25" rx="20" ry="10" fill="#FFF" opacity="0.8" />
          </svg>
        </div>
        
        <h1 className="text-6xl font-bold text-gray-800 mb-4 animate-bounce">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Oeps! Deze speeltuin bestaat niet</h2>
        <p className="text-lg text-gray-600 mb-8">
          De pagina die je zoekt is verdwenen, net als een bal die over de schutting is gevlogen!
        </p>
        
        <a 
          href="/" 
          className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          🏠 Terug naar alle speeltuinen
        </a>
      </div>
    </div>
  );

export default NotFound;
