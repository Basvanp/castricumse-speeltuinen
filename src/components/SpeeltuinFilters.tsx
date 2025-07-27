import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { SpeeltuinFilters as FiltersType } from '@/types/speeltuin';

interface SpeeltuinFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
}

const SpeeltuinFilters: React.FC<SpeeltuinFiltersProps> = ({ filters, onFiltersChange }) => {
  const { trackEvent } = useAnalytics();

  const updateFilter = (
    category: keyof FiltersType,
    key: string,
    value: boolean
  ) => {
    onFiltersChange({
      ...filters,
      [category]: {
        ...filters[category],
        [key]: value,
      },
    });
    
    // Track filter usage
    if (value) {
      trackEvent('filter_used', undefined, { filter_category: category, filter_key: key });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Type Speeltuin */}
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <h3 className="font-medium">Type speeltuin</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {Object.entries(filters.typeSpeeltuin).map(([key, value]) => {
              const labels = {
                natuurspeeltuin: 'Natuurspeeltuin',
                buurtspeeltuin: 'Buurtspeeltuin',
                schoolplein: 'Schoolplein',
                speelbos: 'Speelbos',
              };
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      updateFilter('typeSpeeltuin', key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`type-${key}`}>
                    {labels[key as keyof typeof labels] || key}
                  </Label>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Leeftijdsgroep Specifiek */}
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <h3 className="font-medium">Leeftijdsgroep</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {Object.entries(filters.leeftijdSpecifiek).map(([key, value]) => {
              const labels = {
                '0_2_jaar': '0–2 jaar',
                '2_6_jaar': '2–6 jaar',
                '6_12_jaar': '6–12 jaar',
                '12_plus_jaar': '12+ jaar',
              };
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`leeftijd-specifiek-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      updateFilter('leeftijdSpecifiek', key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`leeftijd-specifiek-${key}`}>
                    {labels[key as keyof typeof labels] || key}
                  </Label>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Voorzieningen / speeltoestellen */}
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <h3 className="font-medium">Voorzieningen / speeltoestellen</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {Object.entries(filters.voorzieningen).map(([key, value]) => {
              const labels = {
                glijbaan: 'Glijbaan',
                schommel: 'Schommel',
                zandbak: 'Zandbak',
                kabelbaan: 'Kabelbaan',
                bankjes: 'Bankjes',
                sportveld: 'Sportveld',
                klimtoestel: 'Klimtoestel',
                water_pomp: 'Water / pomp',
                trapveld: 'Trapveld',
                skatebaan: 'Skatebaan',
              };
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`voorzieningen-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      updateFilter('voorzieningen', key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`voorzieningen-${key}`}>
                    {labels[key as keyof typeof labels] || key}
                  </Label>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Toegankelijkheid */}
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <h3 className="font-medium">Toegankelijkheid</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {Object.entries(filters.toegankelijkheid).map(([key, value]) => {
              const labels = {
                rolstoeltoegankelijk: 'Rolstoeltoegankelijk',
                zichtbaar_omheind: 'Zichtbaar omheind',
                zonder_drempel: 'Toegang zonder drempel',
                speeltoestellen_beperking: 'Speeltoestellen voor beperking',
              };
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`toegankelijkheid-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      updateFilter('toegankelijkheid', key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`toegankelijkheid-${key}`}>
                    {labels[key as keyof typeof labels] || key}
                  </Label>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Veiligheid & toezicht */}
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <h3 className="font-medium">Veiligheid & toezicht</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {Object.entries(filters.veiligheid).map(([key, value]) => {
              const labels = {
                omheind: 'Omheind',
                in_zicht_huizen: 'In zicht vanaf huizen',
                rustige_ligging: 'Rustige ligging',
                verkeersluw: 'Verkeersluw',
              };
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`veiligheid-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      updateFilter('veiligheid', key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`veiligheid-${key}`}>
                    {labels[key as keyof typeof labels] || key}
                  </Label>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Voorzieningen voor ouders / begeleiders */}
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <h3 className="font-medium">Voorzieningen voor ouders</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {Object.entries(filters.voorzieningen_ouders).map(([key, value]) => {
              const labels = {
                bankjes: 'Bankjes',
                schaduw: 'Schaduw / bomen',
                picknicktafels: 'Picknicktafels',
                horeca_buurt: 'Horeca in de buurt',
                wc_buurt: 'Openbare wc in de buurt',
              };
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`ouders-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      updateFilter('voorzieningen_ouders', key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`ouders-${key}`}>
                    {labels[key as keyof typeof labels] || key}
                  </Label>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Ligging / omgeving */}
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <h3 className="font-medium">Ligging / omgeving</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {Object.entries(filters.ligging).map(([key, value]) => {
              const labels = {
                woonwijk: 'In woonwijk',
                bos_natuur: 'In bos / natuur',
                bij_school: 'Bij school',
                fietspad: 'Aan fietspad',
                parkeerplaats: 'Nabij parkeerplaats',
              };
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`ligging-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      updateFilter('ligging', key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`ligging-${key}`}>
                    {labels[key as keyof typeof labels] || key}
                  </Label>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Extra's */}
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <h3 className="font-medium">Extra's</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {Object.entries(filters.extras).map(([key, value]) => {
              const labels = {
                waterpomp: 'Waterpomp',
                educatief: 'Educatief element',
                kunstwerk_thema: 'Kunstwerk of thema',
                buurtinitiatief: 'Buurtinitiatief',
              };
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`extras-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      updateFilter('extras', key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`extras-${key}`}>
                    {labels[key as keyof typeof labels] || key}
                  </Label>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Ondergrond */}
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <h3 className="font-medium">Ondergrond</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {Object.entries(filters.ondergrond).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={`ondergrond-${key}`}
                  checked={value}
                  onCheckedChange={(checked) =>
                    updateFilter('ondergrond', key, checked as boolean)
                  }
                />
                <Label htmlFor={`ondergrond-${key}`} className="capitalize">
                  {key}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Grootte */}
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <h3 className="font-medium">Grootte</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {Object.entries(filters.grootte).map(([key, value]) => {
              const labels: { [key: string]: string } = {
                klein: 'Klein (buurt speeltuintje)',
                middel: 'Middel',
                groot: 'Groot (speelpark)',
              };
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`grootte-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      updateFilter('grootte', key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`grootte-${key}`}>
                    {labels[key] || key}
                  </Label>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default SpeeltuinFilters;