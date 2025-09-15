import React from 'react';
import SEOHead from '@/components/SEOHead';
import Footer from '@/components/Footer';
import { Shield, Eye, Lock, Database, Mail, Phone, MapPin } from 'lucide-react';

const Privacy = () => {
  return (
    <>
      <SEOHead 
        title="Privacybeleid - Castricum Speeltuinen Gids"
        description="Lees hoe wij uw privacy beschermen en welke gegevens wij verzamelen op de Castricum Speeltuinen Gids website."
        keywords="privacy, AVG, GDPR, persoonsgegevens, Castricum speeltuinen"
      />
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img 
          src="/lovable-uploads/heroimage.jpg" 
          alt="Privacy - Castricum Speeltuinen" 
          className="absolute inset-0 w-full h-full object-cover -z-10"
          loading="eager"
        />
        
        {/* Background Image with Overlay (CSS fallback) */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
          backgroundImage: `url('/lovable-uploads/heroimage.jpg')`
        }}>
          {/* Gradient Overlay */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.7) 0%, rgba(147, 51, 234, 0.6) 100%)'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-20 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-bold mb-4" style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            lineHeight: '1.1'
          }}>
            Privacybeleid
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto" style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)'
          }}>
            Wij beschermen uw privacy en zijn transparant over hoe wij uw gegevens gebruiken
          </p>
        </div>
      </section>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          
          {/* Last Updated */}
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500">
              Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-blue-600" />
                Over dit privacybeleid
              </h2>
              <div className="prose prose-lg text-gray-700 space-y-4">
                <p>
                  Welkom bij de Castricum Speeltuinen Gids! Wij hechten grote waarde aan uw privacy en 
                  zijn verplicht om uw persoonsgegevens te beschermen volgens de Algemene Verordening 
                  Gegevensbescherming (AVG).
                </p>
                <p>
                  Dit privacybeleid legt uit welke gegevens wij verzamelen, hoe wij deze gebruiken en 
                  welke rechten u heeft. Wij raden u aan dit beleid zorgvuldig te lezen.
                </p>
              </div>
            </section>

            {/* Data Controller */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-600" />
                Wie zijn wij?
              </h2>
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Gegevensverwerkingsverantwoordelijke</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Website:</strong> Castricum Speeltuinen Gids</p>
                  <p><strong>Contact:</strong> info@castricum-speeltuinen.nl</p>
                </div>
              </div>
            </section>

            {/* Data Collection */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Database className="w-6 h-6 text-blue-600" />
                Welke gegevens verzamelen wij?
              </h2>
              <div className="space-y-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Gegevens die u zelf verstrekt</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Contactgegevens (naam, e-mail) bij het contactformulier</li>
                    <li>• Reacties en feedback op speeltuinen</li>
                    <li>• Accountgegevens (indien u zich registreert)</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Automatisch verzamelde gegevens</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• IP-adres en browsergegevens</li>
                    <li>• Bezoekstatistieken en gebruikspatronen</li>
                    <li>• Cookie-gegevens (met uw toestemming)</li>
                    <li>• Locatiegegevens (alleen voor kaartfunctionaliteit)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Purpose */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-blue-600" />
                Waarom verzamelen wij deze gegevens?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Website functionaliteit</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Speeltuinen tonen op de kaart</li>
                    <li>• Zoek- en filterfuncties</li>
                    <li>• Contactformulier verwerking</li>
                    <li>• Website beveiliging</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Verbetering van de dienst</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Website gebruikerservaring</li>
                    <li>• Technische problemen oplossen</li>
                    <li>• Nieuwe functies ontwikkelen</li>
                    <li>• Statistieken en analyses</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Legal Basis */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Juridische grondslag
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>Toestemming:</strong> Voor cookies en marketingcommunicatie vragen wij uw 
                    uitdrukkelijke toestemming.
                  </p>
                  <p>
                    <strong>Uitvoering van overeenkomst:</strong> Voor het verwerken van contactformulieren 
                    en het leveren van onze diensten.
                  </p>
                  <p>
                    <strong>Gerechtvaardigd belang:</strong> Voor website beveiliging, fraudebestrijding 
                    en het verbeteren van onze diensten.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Delen wij uw gegevens?
              </h2>
              <div className="bg-red-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  <strong>Nee, wij verkopen of verhuren uw gegevens niet aan derden.</strong>
                </p>
                <p className="text-gray-700">
                  Wij delen uw gegevens alleen in de volgende gevallen:
                </p>
                <ul className="mt-3 space-y-2 text-gray-700">
                  <li>• Met uw uitdrukkelijke toestemming</li>
                  <li>• Met serviceproviders die ons helpen (zoals hosting)</li>
                  <li>• Wanneer dit wettelijk verplicht is</li>
                  <li>• Voor de bescherming van onze rechten en veiligheid</li>
                </ul>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Hoe lang bewaren wij uw gegevens?
              </h2>
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="space-y-3 text-gray-700">
                  <p><strong>Contactformulier gegevens:</strong> Maximaal 2 jaar</p>
                  <p><strong>Account gegevens:</strong> Tot u uw account verwijdert</p>
                  <p><strong>Cookie gegevens:</strong> Volgens cookie-instellingen</p>
                  <p><strong>Logbestanden:</strong> Maximaal 1 jaar</p>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Uw rechten
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <strong>Inzage:</strong> U kunt uw gegevens opvragen
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <strong>Rectificatie:</strong> U kunt uw gegevens corrigeren
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <strong>Verwijdering:</strong> U kunt uw gegevens laten verwijderen
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <strong>Beperking:</strong> U kunt verwerking beperken
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <strong>Portabiliteit:</strong> U kunt uw gegevens exporteren
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <strong>Bezwaar:</strong> U kunt bezwaar maken tegen verwerking
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6 text-blue-600" />
                Contact over privacy
              </h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  Heeft u vragen over dit privacybeleid of wilt u uw rechten uitoefenen?
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>E-mail:</strong> privacy@castricum-speeltuinen.nl</p>
                </div>
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Klacht?</strong> U heeft het recht om een klacht in te dienen bij de 
                    Autoriteit Persoonsgegevens (AP).
                  </p>
                </div>
              </div>
            </section>

            {/* Changes */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Wijzigingen in dit privacybeleid
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700">
                  Wij kunnen dit privacybeleid van tijd tot tijd aanpassen. Belangrijke wijzigingen 
                  zullen wij aan u bekendmaken via de website of per e-mail. Wij raden u aan deze 
                  pagina regelmatig te bekijken voor de meest recente versie.
                </p>
              </div>
            </section>
          </div>

          {/* Back to home */}
          <div className="text-center mt-12">
            <a 
              href="/" 
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              ← Terug naar de speeltuinen
            </a>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer lastUpdated={Date.now()} />
    </>
  );
};

export default Privacy; 