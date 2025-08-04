import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
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
        
        {/* Voorzieningen */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <h3 className="font-medium">Voorzieningen</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasGlijbaan"
                checked={filters.hasGlijbaan || false}
                onCheckedChange={(checked) => updateFilter('hasGlijbaan', checked as boolean)}
              />
              <Label htmlFor="hasGlijbaan" className="flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                  <path d="M4 8 L20 8 L16 16 L8 16 Z" fill="#4ECDC4"/>
                  <rect x="6" y="16" width="12" height="2" fill="#8B4513"/>
                </svg>
                Glijbaan
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasSchommel"
                checked={filters.hasSchommel || false}
                onCheckedChange={(checked) => updateFilter('hasSchommel', checked as boolean)}
              />
              <Label htmlFor="hasSchommel" className="flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                  <rect x="11" y="4" width="2" height="12" fill="#8B4513"/>
                  <rect x="6" y="8" width="12" height="2" rx="1" fill="#FFD93D"/>
                  <circle cx="8" cy="7" r="1.5" fill="#FF6B6B"/>
                  <circle cx="16" cy="11" r="1.5" fill="#4ECDC4"/>
                </svg>
                Schommel
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasZandbak"
                checked={filters.hasZandbak || false}
                onCheckedChange={(checked) => updateFilter('hasZandbak', checked as boolean)}
              />
              <Label htmlFor="hasZandbak" className="flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                  <rect x="6" y="12" width="12" height="8" fill="#F4D03F"/>
                  <circle cx="8" cy="14" r="1" fill="#DAA520"/>
                  <circle cx="12" cy="16" r="1" fill="#DAA520"/>
                  <circle cx="16" cy="14" r="1" fill="#DAA520"/>
                </svg>
                Zandbak
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasKlimtoestel"
                checked={filters.hasKlimtoestel || false}
                onCheckedChange={(checked) => updateFilter('hasKlimtoestel', checked as boolean)}
              />
              <Label htmlFor="hasKlimtoestel" className="flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                  <rect x="6" y="4" width="2" height="16" fill="#FF6B6B"/>
                  <rect x="16" y="4" width="2" height="16" fill="#FF6B6B"/>
                  <rect x="6" y="8" width="12" height="2" fill="#4ECDC4"/>
                  <rect x="6" y="12" width="12" height="2" fill="#4ECDC4"/>
                  <rect x="6" y="16" width="12" height="2" fill="#4ECDC4"/>
                </svg>
                Klimtoestel
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasKabelbaan"
                checked={filters.hasKabelbaan || false}
                onCheckedChange={(checked) => updateFilter('hasKabelbaan', checked as boolean)}
              />
              <Label htmlFor="hasKabelbaan" className="flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                  <path d="M2 8 L22 12" stroke="#333" strokeWidth="2"/>
                  <rect x="10" y="10" width="4" height="3" fill="#FFD93D"/>
                  <path d="M10 10 L8 8" stroke="#333" strokeWidth="1"/>
                  <path d="M14 10 L16 8" stroke="#333" strokeWidth="1"/>
                </svg>
                Kabelbaan
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasWaterPomp"
                checked={filters.hasWaterPomp || false}
                onCheckedChange={(checked) => updateFilter('hasWaterPomp', checked as boolean)}
              />
              <Label htmlFor="hasWaterPomp" className="flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                  <rect x="10" y="8" width="4" height="12" fill="#4ECDC4"/>
                  <circle cx="12" cy="6" r="2" fill="#2E86AB"/>
                  <path d="M12 2 L12 6" stroke="#2E86AB" strokeWidth="2"/>
                </svg>
                Waterpomp
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
          <CollapsibleContent className="mt-2 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="typeNatuurspeeltuin"
                checked={filters.isTypeNatuurspeeltuin || false}
                onCheckedChange={(checked) => updateFilter('isTypeNatuurspeeltuin', checked as boolean)}
              />
              <Label htmlFor="typeNatuurspeeltuin" className="flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                  <path d="M12 2 L15 8 L22 9 L17 14 L18 21 L12 18 L6 21 L7 14 L2 9 L9 8 Z" fill="#32CD32"/>
                </svg>
                Natuurspeeltuin
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="typeBuurtspeeltuin"
                checked={filters.isTypeBuurtspeeltuin || false}
                onCheckedChange={(checked) => updateFilter('isTypeBuurtspeeltuin', checked as boolean)}
              />
              <Label htmlFor="typeBuurtspeeltuin" className="flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                  <rect x="4" y="8" width="16" height="12" fill="#87CEEB"/>
                  <rect x="6" y="10" width="4" height="8" fill="#FFF"/>
                  <rect x="14" y="10" width="4" height="8" fill="#FFF"/>
                </svg>
                Buurtspeeltuin
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="typeSchoolplein"
                checked={filters.isTypeSchoolplein || false}
                onCheckedChange={(checked) => updateFilter('isTypeSchoolplein', checked as boolean)}
              />
              <Label htmlFor="typeSchoolplein" className="flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                  <rect x="4" y="4" width="16" height="16" fill="#FFD93D"/>
                  <rect x="6" y="6" width="12" height="2" fill="#333"/>
                  <rect x="6" y="10" width="12" height="2" fill="#333"/>
                  <rect x="6" y="14" width="12" height="2" fill="#333"/>
                </svg>
                Schoolplein
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="typeSpeelbos"
                checked={filters.isTypeSpeelbos || false}
                onCheckedChange={(checked) => updateFilter('isTypeSpeelbos', checked as boolean)}
              />
              <Label htmlFor="typeSpeelbos" className="flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                  <circle cx="8" cy="8" r="3" fill="#228B22"/>
                  <circle cx="16" cy="6" r="2" fill="#228B22"/>
                  <circle cx="12" cy="12" r="2.5" fill="#228B22"/>
                  <rect x="6" y="16" width="12" height="6" fill="#8B4513"/>
                </svg>
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
          <CollapsibleContent className="mt-2 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isRolstoeltoegankelijk"
                checked={filters.isRolstoeltoegankelijk || false}
                onCheckedChange={(checked) => updateFilter('isRolstoeltoegankelijk', checked as boolean)}
              />
              <Label htmlFor="isRolstoeltoegankelijk" className="flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                  <circle cx="8" cy="16" r="3" fill="#333"/>
                  <circle cx="16" cy="16" r="3" fill="#333"/>
                  <rect x="6" y="8" width="12" height="8" fill="#87CEEB"/>
                  <circle cx="12" cy="12" r="2" fill="#FFF"/>
                </svg>
                Rolstoeltoegankelijk
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasSchaduw"
                checked={filters.hasSchaduw || false}
                onCheckedChange={(checked) => updateFilter('hasSchaduw', checked as boolean)}
              />
              <Label htmlFor="hasSchaduw" className="flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                  <circle cx="12" cy="6" r="4" fill="#FFD93D"/>
                  <path d="M4 16 Q12 8 20 16" fill="#87CEEB"/>
                </svg>
                Schaduw
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasParkeerplaats"
                checked={filters.hasParkeerplaats || false}
                onCheckedChange={(checked) => updateFilter('hasParkeerplaats', checked as boolean)}
              />
              <Label htmlFor="hasParkeerplaats" className="flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                  <rect x="4" y="6" width="16" height="12" fill="#666"/>
                  <rect x="6" y="8" width="4" height="8" fill="#FFF"/>
                  <rect x="14" y="8" width="4" height="8" fill="#FFF"/>
                </svg>
                Parkeerplaats
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasToilet"
                checked={filters.hasToilet || false}
                onCheckedChange={(checked) => updateFilter('hasToilet', checked as boolean)}
              />
              <Label htmlFor="hasToilet" className="flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                  <rect x="6" y="4" width="12" height="16" fill="#FFF"/>
                  <rect x="8" y="6" width="8" height="2" fill="#333"/>
                  <rect x="8" y="10" width="8" height="2" fill="#333"/>
                  <rect x="8" y="14" width="8" height="2" fill="#333"/>
                </svg>
                Toilet
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Grootte */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <h3 className="font-medium">Grootte</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="grootte-klein"
                checked={filters.grootte === 'klein'}
                onCheckedChange={(checked) => updateFilter('grootte', checked ? 'klein' : '')}
              />
              <Label htmlFor="grootte-klein">Klein</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="grootte-middel"
                checked={filters.grootte === 'middel'}
                onCheckedChange={(checked) => updateFilter('grootte', checked ? 'middel' : '')}
              />
              <Label htmlFor="grootte-middel">Middel</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="grootte-groot"
                checked={filters.grootte === 'groot'}
                onCheckedChange={(checked) => updateFilter('grootte', checked ? 'groot' : '')}
              />
              <Label htmlFor="grootte-groot">Groot</Label>
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