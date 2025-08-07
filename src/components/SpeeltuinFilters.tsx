import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Baby, User, Users } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { SpeeltuinFilters as FiltersType } from '@/types/speeltuin';

interface SpeeltuinFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
  onApplyFilters?: () => void;
  onClearFilters?: () => void;
}

const SpeeltuinFilters: React.FC<SpeeltuinFiltersProps> = ({ 
  filters = {}, 
  onFiltersChange, 
  onApplyFilters, 
  onClearFilters 
}) => {
  const { trackEvent } = useAnalytics();

  const updateFilter = (key: string, value: boolean | string) => {
    const newFilters = {
      ...filters,
      [key]: value,
    };
    onFiltersChange(newFilters);
    
    // Track filter usage
    if (value) {
      trackEvent('filter_used', undefined, { filter_key: key });
    }
  };

  const clearAllFilters = () => {
    onFiltersChange({});
    onClearFilters?.();
  };

  const hasActiveFilters = Object.values(filters).some(value => value === true);

  return (
    <Card className="w-full max-h-[80vh] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto overscroll-contain touch-pan-y flex-1 min-h-0">
        
        {/* Geschikt voor leeftijd */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <h3 className="font-medium">Geschikt voor leeftijd</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="peuters"
                checked={filters.peuters || false}
                onCheckedChange={(checked) => updateFilter('peuters', checked as boolean)}
              />
              <Label htmlFor="peuters" className="flex items-center cursor-pointer">
                <Baby className="w-4 h-4 mr-3 text-yellow-500" />
                Peuters (0-2 jaar)
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="kleuters"
                checked={filters.kleuters || false}
                onCheckedChange={(checked) => updateFilter('kleuters', checked as boolean)}
              />
              <Label htmlFor="kleuters" className="flex items-center cursor-pointer">
                <User className="w-4 h-4 mr-3 text-green-500" />
                Kleuters (3-5 jaar)
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="kinderen"
                checked={filters.kinderen || false}
                onCheckedChange={(checked) => updateFilter('kinderen', checked as boolean)}
              />
              <Label htmlFor="kinderen" className="flex items-center cursor-pointer">
                <Users className="w-4 h-4 mr-3 text-blue-500" />
                Kinderen (6+ jaar)
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Voorzieningen */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <h3 className="font-medium">Voorzieningen</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="hasGlijbaan"
                checked={filters.hasGlijbaan || false}
                onCheckedChange={(checked) => updateFilter('hasGlijbaan', checked as boolean)}
              />
              <Label htmlFor="hasGlijbaan" className="flex items-center cursor-pointer">
                <div className="w-4 h-4 mr-3 bg-orange-400 rounded-sm flex items-center justify-center">
                  <div className="w-2 h-1 bg-white rounded-full"></div>
                </div>
                Glijbaan
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="hasSchommel"
                checked={filters.hasSchommel || false}
                onCheckedChange={(checked) => updateFilter('hasSchommel', checked as boolean)}
              />
              <Label htmlFor="hasSchommel" className="flex items-center cursor-pointer">
                <div className="w-4 h-4 mr-3 bg-yellow-500 rounded-sm flex items-center justify-center">
                  <div className="w-1 h-2 bg-white rounded"></div>
                </div>
                Schommel
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="hasZandbak"
                checked={filters.hasZandbak || false}
                onCheckedChange={(checked) => updateFilter('hasZandbak', checked as boolean)}
              />
              <Label htmlFor="hasZandbak" className="flex items-center cursor-pointer">
                <div className="w-4 h-4 mr-3 bg-yellow-600 rounded-sm"></div>
                Zandbak
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="hasKlimtoestel"
                checked={filters.hasKlimtoestel || false}
                onCheckedChange={(checked) => updateFilter('hasKlimtoestel', checked as boolean)}
              />
              <Label htmlFor="hasKlimtoestel" className="flex items-center cursor-pointer">
                <div className="w-4 h-4 mr-3 bg-green-500 rounded-sm flex items-center justify-center">
                  <div className="w-2 h-3 border border-white rounded-sm"></div>
                </div>
                Klimtoestel
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="hasKabelbaan"
                checked={filters.hasKabelbaan || false}
                onCheckedChange={(checked) => updateFilter('hasKabelbaan', checked as boolean)}
              />
              <Label htmlFor="hasKabelbaan" className="flex items-center cursor-pointer">
                <div className="w-4 h-4 mr-3 bg-gray-600 rounded-sm flex items-center justify-center">
                  <div className="w-3 h-0.5 bg-white rounded"></div>
                </div>
                Kabelbaan
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="hasWaterPomp"
                checked={filters.hasWaterPomp || false}
                onCheckedChange={(checked) => updateFilter('hasWaterPomp', checked as boolean)}
              />
              <Label htmlFor="hasWaterPomp" className="flex items-center cursor-pointer">
                <div className="w-4 h-4 mr-3 bg-blue-400 rounded-sm flex items-center justify-center">
                  <div className="w-1 h-2 bg-white rounded-full"></div>
                </div>
                Water / pomp
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Type Speeltuin */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <h3 className="font-medium">Type Speeltuin</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="typeNatuurspeeltuin"
                checked={filters.isTypeNatuurspeeltuin || false}
                onCheckedChange={(checked) => updateFilter('isTypeNatuurspeeltuin', checked as boolean)}
              />
              <Label htmlFor="typeNatuurspeeltuin" className="flex items-center cursor-pointer">
                <div className="w-4 h-4 mr-3 bg-green-600 rounded-sm"></div>
                Natuurspeeltuin
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="typeBuurtspeeltuin"
                checked={filters.isTypeBuurtspeeltuin || false}
                onCheckedChange={(checked) => updateFilter('isTypeBuurtspeeltuin', checked as boolean)}
              />
              <Label htmlFor="typeBuurtspeeltuin" className="flex items-center cursor-pointer">
                <div className="w-4 h-4 mr-3 bg-blue-600 rounded-sm"></div>
                Buurtspeeltuin
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="typeSchoolplein"
                checked={filters.isTypeSchoolplein || false}
                onCheckedChange={(checked) => updateFilter('isTypeSchoolplein', checked as boolean)}
              />
              <Label htmlFor="typeSchoolplein" className="flex items-center cursor-pointer">
                <div className="w-4 h-4 mr-3 bg-yellow-600 rounded-sm"></div>
                Schoolplein
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="typeSpeelbos"
                checked={filters.isTypeSpeelbos || false}
                onCheckedChange={(checked) => updateFilter('isTypeSpeelbos', checked as boolean)}
              />
              <Label htmlFor="typeSpeelbos" className="flex items-center cursor-pointer">
                <div className="w-4 h-4 mr-3 bg-green-700 rounded-sm"></div>
                Speelbos
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Praktische Zaken */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <h3 className="font-medium">Praktische Zaken</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="isRolstoeltoegankelijk"
                checked={filters.isRolstoeltoegankelijk || false}
                onCheckedChange={(checked) => updateFilter('isRolstoeltoegankelijk', checked as boolean)}
              />
              <Label htmlFor="isRolstoeltoegankelijk" className="flex items-center cursor-pointer">
                <div className="w-4 h-4 mr-3 bg-purple-500 rounded-sm"></div>
                Rolstoeltoegankelijk
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="hasSchaduw"
                checked={filters.hasSchaduw || false}
                onCheckedChange={(checked) => updateFilter('hasSchaduw', checked as boolean)}
              />
              <Label htmlFor="hasSchaduw" className="flex items-center cursor-pointer">
                <div className="w-4 h-4 mr-3 bg-green-400 rounded-sm"></div>
                Schaduw
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="hasParkeerplaats"
                checked={filters.hasParkeerplaats || false}
                onCheckedChange={(checked) => updateFilter('hasParkeerplaats', checked as boolean)}
              />
              <Label htmlFor="hasParkeerplaats" className="flex items-center cursor-pointer">
                <div className="w-4 h-4 mr-3 bg-gray-500 rounded-sm"></div>
                Parkeerplaats
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="hasToilet"
                checked={filters.hasToilet || false}
                onCheckedChange={(checked) => updateFilter('hasToilet', checked as boolean)}
              />
              <Label htmlFor="hasToilet" className="flex items-center cursor-pointer">
                <div className="w-4 h-4 mr-3 bg-indigo-500 rounded-sm"></div>
                Toilet
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-4 border-t">
          {hasActiveFilters && (
            <Button 
              onClick={clearAllFilters}
              variant="outline"
              className="w-full"
            >
              Alle filters wissen
            </Button>
          )}
          
          {onApplyFilters && (
            <Button 
              onClick={onApplyFilters}
              className="w-full"
            >
              Filters toepassen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpeeltuinFilters;