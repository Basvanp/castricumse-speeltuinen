import React from 'react';
import SEOHead from '@/components/SEOHead';
import Footer from '@/components/Footer';
import { FileText, Scale, AlertTriangle, Shield, Users, Globe } from 'lucide-react';

const Terms = () => {
  return (
    <>
      <SEOHead 
        title="Algemene Voorwaarden - Castricum Speeltuinen Gids"
        description="Lees de algemene voorwaarden voor het gebruik van de Castricum Speeltuinen Gids website."
        keywords="voorwaarden, gebruiksvoorwaarden, algemene voorwaarden, Castricum speeltuinen"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Algemene Voorwaarden
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              De voorwaarden voor het gebruik van onze speeltuinen website
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Laatst bijgewerkt: 1 augustus 2025
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6 text-green-600" />
                Algemene bepalingen
              </h2>
              <div className="prose prose-lg text-gray-700 space-y-4">
                <p>
                  Welkom bij de Castricum Speeltuinen Gids! Deze algemene voorwaarden zijn van toepassing 
                  op het gebruik van onze website en diensten.
                </p>
                <p>
                  Door het gebruik van onze website gaat u akkoord met deze voorwaarden. Wij raden u aan 
                  deze zorgvuldig te lezen voordat u onze diensten gebruikt.
                </p>
              </div>
            </section>

            {/* Definitions */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Definities
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-3 text-gray-700">
                  <p><strong>"Website":</strong> De Castricum Speeltuinen Gids website en alle gerelateerde diensten</p>
                  <p><strong>"Gebruiker":</strong> Iedereen die de website bezoekt of gebruikt</p>
                  <p><strong>"Wij/Ons":</strong> De beheerders van de Castricum Speeltuinen Gids</p>
                  <p><strong>"Diensten":</strong> Alle functionaliteiten en informatie op de website</p>
                </div>
              </div>
            </section>

            {/* Use of Website */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-green-600" />
                Gebruik van de website
              </h2>
              <div className="space-y-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Toegestaan gebruik</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Speeltuinen bekijken en zoeken</li>
                    <li>• Informatie delen met andere gebruikers</li>
                    <li>• Contact opnemen via het contactformulier</li>
                    <li>• Feedback geven op speeltuinen</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Verboden gebruik</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Onjuiste of misleidende informatie plaatsen</li>
                    <li>• De website verstoren of hacken</li>
                    <li>• Spam of ongewenste berichten versturen</li>
                    <li>• Inbreuk maken op intellectuele eigendomsrechten</li>
                    <li>• Illegale activiteiten faciliteren</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Intellectuele eigendomsrechten
              </h2>
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>Eigendom:</strong> Alle content op deze website, inclusief teksten, afbeeldingen, 
                    logo's en software, is eigendom van de Castricum Speeltuinen Gids of haar licentiegevers.
                  </p>
                  <p>
                    <strong>Gebruik:</strong> U mag de content voor persoonlijk gebruik bekijken en delen, 
                    maar niet commercieel gebruiken zonder schriftelijke toestemming.
                  </p>
                  <p>
                    <strong>Foto's:</strong> Speeltuin foto's zijn eigendom van de respectievelijke eigenaren 
                    en worden gebruikt met toestemming.
                  </p>
                </div>
              </div>
            </section>

            {/* User Content */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Gebruikerscontent
              </h2>
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>Verantwoordelijkheid:</strong> U bent verantwoordelijk voor alle content die u 
                    plaatst, inclusief reacties, feedback en foto's.
                  </p>
                  <p>
                    <strong>Licentie:</strong> Door content te plaatsen geeft u ons een niet-exclusieve licentie 
                    om deze te gebruiken en te tonen op de website.
                  </p>
                  <p>
                    <strong>Verwijdering:</strong> Wij behouden het recht om ongepaste content te verwijderen 
                    zonder voorafgaande kennisgeving.
                  </p>
                </div>
              </div>
            </section>

            {/* Disclaimers */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                Vrijwaringen
              </h2>
              <div className="space-y-6">
                <div className="bg-orange-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Nauwkeurigheid van informatie</h3>
                  <p className="text-gray-700">
                    Wij streven naar nauwkeurige en actuele informatie, maar kunnen niet garanderen dat 
                    alle informatie volledig correct of up-to-date is. Controleer altijd zelf de informatie 
                    voordat u een speeltuin bezoekt.
                  </p>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Beschikbaarheid van speeltuinen</h3>
                  <p className="text-gray-700">
                    Speeltuinen kunnen tijdelijk gesloten zijn voor onderhoud, renovatie of andere redenen. 
                    Wij zijn niet verantwoordelijk voor wijzigingen in openingstijden of toegankelijkheid.
                  </p>
                </div>
                
                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Veiligheid en aansprakelijkheid</h3>
                  <p className="text-gray-700">
                    Wij zijn niet aansprakelijk voor ongelukken, verwondingen of schade die ontstaan tijdens 
                    het gebruik van de speeltuinen. Ouders/verzorgers zijn verantwoordelijk voor de veiligheid 
                    van hun kinderen.
                  </p>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Scale className="w-6 h-6 text-red-600" />
                Beperking van aansprakelijkheid
              </h2>
              <div className="bg-red-50 rounded-lg p-6">
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>Directe schade:</strong> Onze aansprakelijkheid is beperkt tot directe schade 
                    en bedraagt maximaal € 500 per incident.
                  </p>
                  <p>
                    <strong>Indirecte schade:</strong> Wij zijn niet aansprakelijk voor indirecte schade, 
                    gevolgschade, winstderving of immateriële schade.
                  </p>
                  <p>
                    <strong>Uitzonderingen:</strong> Deze beperkingen gelden niet in geval van opzet of 
                    grove schuld van onze kant.
                  </p>
                </div>
              </div>
            </section>

            {/* Privacy and Data */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                Privacy en gegevensbescherming
              </h2>
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>Privacybeleid:</strong> Het verzamelen en verwerken van persoonsgegevens 
                    geschiedt volgens ons privacybeleid.
                  </p>
                  <p>
                    <strong>Cookies:</strong> Wij gebruiken cookies om de website te verbeteren. 
                    U kunt deze instellingen aanpassen in uw browser.
                  </p>
                  <p>
                    <strong>Beveiliging:</strong> Wij nemen passende technische en organisatorische 
                    maatregelen om uw gegevens te beschermen.
                  </p>
                </div>
              </div>
            </section>

            {/* Third Party Links */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Links naar derden
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>Externe links:</strong> Onze website kan links bevatten naar externe websites. 
                    Wij zijn niet verantwoordelijk voor de content of privacybeleid van deze websites.
                  </p>
                  <p>
                    <strong>Eigen risico:</strong> Het gebruik van externe links is op eigen risico. 
                    Wij raden aan om de voorwaarden van deze websites te lezen.
                  </p>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Beëindiging van gebruik
              </h2>
              <div className="bg-yellow-50 rounded-lg p-6">
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>Onze rechten:</strong> Wij behouden het recht om uw toegang tot de website 
                    te beperken of te beëindigen bij schending van deze voorwaarden.
                  </p>
                  <p>
                    <strong>Uw rechten:</strong> U kunt op elk moment stoppen met het gebruik van onze website.
                  </p>
                  <p>
                    <strong>Blijvende bepalingen:</strong> Bepalingen over intellectuele eigendom, 
                    aansprakelijkheid en privacy blijven van kracht na beëindiging.
                  </p>
                </div>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Wijzigingen in voorwaarden
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>Wijzigingen:</strong> Wij kunnen deze voorwaarden van tijd tot tijd aanpassen. 
                    Belangrijke wijzigingen worden aangekondigd op de website.
                  </p>
                  <p>
                    <strong>Doorgaan met gebruik:</strong> Door na wijzigingen de website te blijven gebruiken, 
                    gaat u akkoord met de nieuwe voorwaarden.
                  </p>
                  <p>
                    <strong>Datum:</strong> De datum van de laatste wijziging wordt bovenaan deze pagina vermeld.
                  </p>
                </div>
              </div>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Toepasselijk recht en geschillen
              </h2>
              <div className="bg-green-50 rounded-lg p-6">
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>Nederlands recht:</strong> Deze voorwaarden vallen onder Nederlands recht.
                  </p>
                  <p>
                    <strong>Geschillen:</strong> Geschillen worden in eerste instantie opgelost door 
                    onderling overleg.
                  </p>
                  <p>
                    <strong>Rechtbank:</strong> Indien nodig zijn de Nederlandse rechtbanken bevoegd.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contact
              </h2>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  Heeft u vragen over deze algemene voorwaarden?
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>E-mail:</strong> juridisch@castricum-speeltuinen.nl</p>
                  <p><strong>Telefoon:</strong> 0251-123456</p>
                  <p><strong>Post:</strong> Gemeente Castricum, t.a.v. Juridische Zaken</p>
                </div>
              </div>
            </section>
          </div>

          {/* Back to home */}
          <div className="text-center mt-12">
            <a 
              href="/" 
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
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

export default Terms; 