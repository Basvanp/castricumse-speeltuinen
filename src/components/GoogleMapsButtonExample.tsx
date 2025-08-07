import React from 'react'
import { GoogleMapsButton } from '@/components/ui/google-maps-button'

interface GoogleMapsButtonExampleProps {
  latitude?: number
  longitude?: number
  address?: string
  speeltuinName?: string
}

const GoogleMapsButtonExample: React.FC<GoogleMapsButtonExampleProps> = ({
  latitude = 52.5455,
  longitude = 4.6583,
  address = "Castricum, Nederland",
  speeltuinName = "Speeltuin Castricum"
}) => {
  // Google Maps URL genereren
  const generateGoogleMapsUrl = () => {
    if (latitude && longitude) {
      return `https://www.google.com/maps?q=${latitude},${longitude}`
    }
    if (address) {
      return `https://www.google.com/maps/search/${encodeURIComponent(address)}`
    }
    return `https://www.google.com/maps/search/${encodeURIComponent(speeltuinName)}`
  }

  const mapsUrl = generateGoogleMapsUrl()

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg border">
      <h3 className="text-lg font-semibold text-gray-900">Google Maps Button Voorbeelden</h3>
      
      <div className="space-y-3">
        {/* Outline variant - default */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 w-24">Outline:</span>
          <GoogleMapsButton 
            href={mapsUrl}
            variant="outline"
            size="default"
          >
            Route
          </GoogleMapsButton>
        </div>

        {/* Filled variant */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 w-24">Filled:</span>
          <GoogleMapsButton 
            href={mapsUrl}
            variant="filled"
            size="default"
          >
            Maps
          </GoogleMapsButton>
        </div>

        {/* Small size */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 w-24">Klein:</span>
          <GoogleMapsButton 
            href={mapsUrl}
            variant="outline"
            size="sm"
          >
            Route
          </GoogleMapsButton>
        </div>

        {/* Large size */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 w-24">Groot:</span>
          <GoogleMapsButton 
            href={mapsUrl}
            variant="outline"
            size="lg"
          >
            Google Maps
          </GoogleMapsButton>
        </div>

        {/* Custom text */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 w-24">Custom:</span>
          <GoogleMapsButton 
            href={mapsUrl}
            variant="outline"
            size="default"
          >
            Navigeer naar {speeltuinName}
          </GoogleMapsButton>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Gebruik in Speeltuin Card:</h4>
        <div className="flex items-center gap-2">
          <GoogleMapsButton 
            href={mapsUrl}
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none"
          >
            Route
          </GoogleMapsButton>
          <span className="text-xs text-gray-500">
            Opent Google Maps in nieuwe tab
          </span>
        </div>
      </div>
    </div>
  )
}

export default GoogleMapsButtonExample 