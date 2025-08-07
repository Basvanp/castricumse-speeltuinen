import React from 'react'
import { GoogleMapsRouteButton } from '@/components/ui/google-maps-route-button'
import { generateGoogleMapsUrl } from '@/utils/googleMaps'

interface GoogleMapsRouteButtonExampleProps {
  latitude?: number
  longitude?: number
  address?: string
  speeltuinName?: string
}

const GoogleMapsRouteButtonExample: React.FC<GoogleMapsRouteButtonExampleProps> = ({
  latitude = 52.5455,
  longitude = 4.6583,
  address = "Castricum, Nederland",
  speeltuinName = "Speeltuin Castricum"
}) => {
  const mapsUrl = generateGoogleMapsUrl({
    latitude,
    longitude,
    address,
    name: speeltuinName
  })

  return (
    <div className="space-y-6 p-8 bg-gradient-to-r from-gray-100 to-white rounded-xl border">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Google Maps Route Button</h2>
        <p className="text-gray-600">Exacte styling volgens specificaties</p>
      </div>
      
      <div className="space-y-8">
        {/* Primary Route Button - Exact zoals in de afbeelding */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Primaire Route Button</h3>
          <div className="flex items-center justify-center">
            <GoogleMapsRouteButton 
              href={mapsUrl}
              variant="default"
              size="default"
            >
              Route
            </GoogleMapsRouteButton>
          </div>
          <div className="text-sm text-gray-500 text-center">
            Exacte styling: #4285f4 achtergrond, 16x16px icoon, 140px min-width, hover effect
          </div>
        </div>

        {/* Outline Variant */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Outline Variant</h3>
          <div className="flex items-center justify-center">
            <GoogleMapsRouteButton 
              href={mapsUrl}
              variant="outline"
              size="default"
            >
              Route
            </GoogleMapsRouteButton>
          </div>
        </div>

        {/* Different Sizes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Verschillende Groottes</h3>
          <div className="flex items-center justify-center gap-4">
            <GoogleMapsRouteButton 
              href={mapsUrl}
              variant="default"
              size="sm"
            >
              Route
            </GoogleMapsRouteButton>
            
            <GoogleMapsRouteButton 
              href={mapsUrl}
              variant="default"
              size="default"
            >
              Route
            </GoogleMapsRouteButton>
            
            <GoogleMapsRouteButton 
              href={mapsUrl}
              variant="default"
              size="lg"
            >
              Route
            </GoogleMapsRouteButton>
          </div>
        </div>

        {/* Custom Text */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Aangepaste Tekst</h3>
          <div className="flex items-center justify-center">
            <GoogleMapsRouteButton 
              href={mapsUrl}
              variant="default"
              size="default"
            >
              Navigeer naar {speeltuinName}
            </GoogleMapsRouteButton>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Technische Specificaties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Styling</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Display: inline-flex</li>
                <li>• Gap: 8px</li>
                <li>• Padding: 12px 20px</li>
                <li>• Min-width: 140px</li>
                <li>• Background: #4285f4</li>
                <li>• Border-radius: 8px</li>
                <li>• Font-weight: 500</li>
                <li>• Font-size: 14px</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Hover Effect</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Background: #3367d6</li>
                <li>• Transform: translateY(-1px)</li>
                <li>• Box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3)</li>
                <li>• Transition: all 0.2s ease</li>
              </ul>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">SVG Icoon</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>• Size: 16x16px</li>
              <li>• Fill: currentColor</li>
              <li>• ViewBox: 0 0 24 24</li>
              <li>• Type: Location pin</li>
            </ul>
          </div>
        </div>

        {/* Usage Example */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gebruik in Code</h3>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`import { GoogleMapsRouteButton } from '@/components/ui/google-maps-route-button';
import { generateGoogleMapsUrl } from '@/utils/googleMaps';

const mapsUrl = generateGoogleMapsUrl({
  latitude: 52.5455,
  longitude: 4.6583,
  name: "Speeltuin Castricum"
});

<GoogleMapsRouteButton 
  href={mapsUrl}
  variant="default"
  size="default"
>
  Route
</GoogleMapsRouteButton>`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default GoogleMapsRouteButtonExample 