import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Copy } from 'lucide-react';
import { Speeltuin } from '@/types/speeltuin';
import { useToast } from '@/components/ui/use-toast';

interface SpeeltuinCardProps {
  speeltuin: Speeltuin;
}

const SpeeltuinCard: React.FC<SpeeltuinCardProps> = ({ speeltuin }) => {
  const { toast } = useToast();

  const copyToClipboard = () => {
    if (speeltuin.fixi_copy_tekst) {
      navigator.clipboard.writeText(speeltuin.fixi_copy_tekst);
      toast({
        title: "Gekopieerd!",
        description: "Meldingstekst is gekopieerd naar het klembord.",
      });
    }
  };

  const getVoorzieningen = () => {
    const voorzieningen = [];
    if (speeltuin.heeft_glijbaan) voorzieningen.push('Glijbaan');
    if (speeltuin.heeft_schommel) voorzieningen.push('Schommel');
    if (speeltuin.heeft_zandbak) voorzieningen.push('Zandbak');
    if (speeltuin.heeft_kabelbaan) voorzieningen.push('Kabelbaan');
    if (speeltuin.heeft_bankjes) voorzieningen.push('Bankjes');
    if (speeltuin.heeft_sportveld) voorzieningen.push('Sportveld');
    return voorzieningen;
  };

  const getOndergrond = () => {
    const ondergrond = [];
    if (speeltuin.ondergrond_zand) ondergrond.push('Zand');
    if (speeltuin.ondergrond_gras) ondergrond.push('Gras');
    if (speeltuin.ondergrond_rubber) ondergrond.push('Rubber');
    if (speeltuin.ondergrond_tegels) ondergrond.push('Tegels');
    return ondergrond;
  };

  const getLeeftijd = () => {
    const leeftijd = [];
    if (speeltuin.geschikt_peuters) leeftijd.push('Peuters');
    if (speeltuin.geschikt_kleuters) leeftijd.push('Kleuters');
    if (speeltuin.geschikt_kinderen) leeftijd.push('Kinderen');
    return leeftijd;
  };

  const getOverig = () => {
    const overig = [];
    if (speeltuin.is_omheind) overig.push('Omheind');
    if (speeltuin.heeft_schaduw) overig.push('Schaduw');
    if (speeltuin.is_rolstoeltoegankelijk) overig.push('Rolstoeltoegankelijk');
    return overig;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">{speeltuin.naam}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {speeltuin.afbeelding_url && (
          <img
            src={speeltuin.afbeelding_url}
            alt={speeltuin.naam}
            className="w-full h-48 object-cover rounded-md"
            loading="lazy"
          />
        )}
        
        {speeltuin.omschrijving && (
          <p className="text-muted-foreground">{speeltuin.omschrijving}</p>
        )}

        <div className="space-y-3">
          {getVoorzieningen().length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-1">Voorzieningen:</h4>
              <div className="flex flex-wrap gap-1">
                {getVoorzieningen().map((item) => (
                  <Badge key={item} variant="secondary" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {getOndergrond().length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-1">Ondergrond:</h4>
              <div className="flex flex-wrap gap-1">
                {getOndergrond().map((item) => (
                  <Badge key={item} variant="outline" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {getLeeftijd().length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-1">Geschikt voor:</h4>
              <div className="flex flex-wrap gap-1">
                {getLeeftijd().map((item) => (
                  <Badge key={item} variant="default" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {getOverig().length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-1">Overig:</h4>
              <div className="flex flex-wrap gap-1">
                {getOverig().map((item) => (
                  <Badge key={item} variant="secondary" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <Button 
            asChild 
            variant="default" 
            className="w-full"
          >
            <a 
              href="https://www.fixi.nl/#/issue/new+map" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Meld een probleem via Fixi
            </a>
          </Button>
          
          {speeltuin.fixi_copy_tekst && (
            <Button 
              variant="outline" 
              onClick={copyToClipboard}
              className="w-full flex items-center justify-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Kopieer meldingstekst
            </Button>
          )}
          
          <p className="text-xs text-muted-foreground text-center mt-2">
            💡 Geef toestemming voor je locatie in Fixi voor automatisch inzoomen
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpeeltuinCard;