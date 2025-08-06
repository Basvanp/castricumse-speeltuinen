import React from 'react';
import { usePublicSiteSettings } from '@/hooks/useSiteSettings';
import { Settings, Clock, Mail } from 'lucide-react';

const MaintenanceMode: React.FC = () => {
  const { data: settings } = usePublicSiteSettings();

  // Only show if maintenance mode is enabled
  if (!settings?.maintenance_mode) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Settings className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Website in Onderhoud
          </h1>
          <div className="flex items-center justify-center text-blue-600 mb-4">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Tijdelijk niet beschikbaar</span>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            {settings?.maintenance_message || 
             'De website is tijdelijk niet beschikbaar wegens onderhoud. We zijn zo snel mogelijk weer online!'
            }
          </p>

          {settings?.contact_email && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-center text-gray-700">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">Voor vragen:</span>
              </div>
              <a 
                href={`mailto:${settings.contact_email}`}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                {settings.contact_email}
              </a>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} {settings?.site_name || 'Speeltuinen Castricum'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode;