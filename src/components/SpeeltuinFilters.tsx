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
        
        {/* Voorzieningen */}
        <div className="voorzieningen-filter-section">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between section-header">
              <h3 className="font-medium">Voorzieningen</h3>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3 filter-items">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="hasGlijbaan"
                  checked={filters.hasGlijbaan || false}
                  onCheckedChange={(checked) => updateFilter('hasGlijbaan', checked as boolean)}
                  className="checkbox-with-emoji"
                />
                <Label htmlFor="hasGlijbaan" className="flex items-center cursor-pointer">
                  🛝 Glijbaan
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="hasSchommel"
                  checked={filters.hasSchommel || false}
                  onCheckedChange={(checked) => updateFilter('hasSchommel', checked as boolean)}
                  className="checkbox-with-emoji"
                />
                <Label htmlFor="hasSchommel" className="flex items-center cursor-pointer">
                  ⚡ Schommel
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="hasZandbak"
                  checked={filters.hasZandbak || false}
                  onCheckedChange={(checked) => updateFilter('hasZandbak', checked as boolean)}
                  className="checkbox-with-emoji"
                />
                <Label htmlFor="hasZandbak" className="flex items-center cursor-pointer">
                  🏖️ Zandbak
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="hasKlimtoestel"
                  checked={filters.hasKlimtoestel || false}
                  onCheckedChange={(checked) => updateFilter('hasKlimtoestel', checked as boolean)}
                  className="checkbox-with-emoji"
                />
                <Label htmlFor="hasKlimtoestel" className="flex items-center cursor-pointer">
                  🏗️ Klimtoestel
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="hasKabelbaan"
                  checked={filters.hasKabelbaan || false}
                  onCheckedChange={(checked) => updateFilter('hasKabelbaan', checked as boolean)}
                  className="checkbox-with-emoji"
                />
                <Label htmlFor="hasKabelbaan" className="flex items-center cursor-pointer">
                  🚡 Kabelbaan
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="hasWaterPomp"
                  checked={filters.hasWaterPomp || false}
                  onCheckedChange={(checked) => updateFilter('hasWaterPomp', checked as boolean)}
                  className="checkbox-with-emoji"
                />
                <Label htmlFor="hasWaterPomp" className="flex items-center cursor-pointer">
                  💧 Waterpomp
                </Label>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Type Speeltuin */}
        <div className="type-speeltuin-filter-section">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between section-header">
              <h3 className="font-medium">Type Speeltuin</h3>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3 filter-items">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="typeNatuurspeeltuin"
                  checked={filters.isTypeNatuurspeeltuin || false}
                  onCheckedChange={(checked) => updateFilter('isTypeNatuurspeeltuin', checked as boolean)}
                  className="checkbox-with-emoji"
                />
                <Label htmlFor="typeNatuurspeeltuin" className="flex items-center cursor-pointer">
                  🌳 Natuurspeeltuin
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="typeBuurtspeeltuin"
                  checked={filters.isTypeBuurtspeeltuin || false}
                  onCheckedChange={(checked) => updateFilter('isTypeBuurtspeeltuin', checked as boolean)}
                  className="checkbox-with-emoji"
                />
                <Label htmlFor="typeBuurtspeeltuin" className="flex items-center cursor-pointer">
                  🏘️ Buurtspeeltuin
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="typeSchoolplein"
                  checked={filters.isTypeSchoolplein || false}
                  onCheckedChange={(checked) => updateFilter('isTypeSchoolplein', checked as boolean)}
                  className="checkbox-with-emoji"
                />
                <Label htmlFor="typeSchoolplein" className="flex items-center cursor-pointer">
                  🎓 Schoolplein
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="typeSpeelbos"
                  checked={filters.isTypeSpeelbos || false}
                  onCheckedChange={(checked) => updateFilter('isTypeSpeelbos', checked as boolean)}
                  className="checkbox-with-emoji"
                />
                <Label htmlFor="typeSpeelbos" className="flex items-center cursor-pointer">
                  🌲 Speelbos
                </Label>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Praktische Zaken */}
        <div className="praktische-zaken-filter-section">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between section-header">
              <h3 className="font-medium">Praktische Zaken</h3>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3 filter-items">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="isRolstoeltoegankelijk"
                  checked={filters.isRolstoeltoegankelijk || false}
                  onCheckedChange={(checked) => updateFilter('isRolstoeltoegankelijk', checked as boolean)}
                  className="checkbox-with-emoji"
                />
                <Label htmlFor="isRolstoeltoegankelijk" className="flex items-center cursor-pointer">
                  ♿ Rolstoeltoegankelijk
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="hasSchaduw"
                  checked={filters.hasSchaduw || false}
                  onCheckedChange={(checked) => updateFilter('hasSchaduw', checked as boolean)}
                  className="checkbox-with-emoji"
                />
                <Label htmlFor="hasSchaduw" className="flex items-center cursor-pointer">
                  🌳 Schaduw
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="hasParkeerplaats"
                  checked={filters.hasParkeerplaats || false}
                  onCheckedChange={(checked) => updateFilter('hasParkeerplaats', checked as boolean)}
                  className="checkbox-with-emoji"
                />
                <Label htmlFor="hasParkeerplaats" className="flex items-center cursor-pointer">
                  🚗 Parkeerplaats
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="hasToilet"
                  checked={filters.hasToilet || false}
                  onCheckedChange={(checked) => updateFilter('hasToilet', checked as boolean)}
                  className="checkbox-with-emoji"
                />
                <Label htmlFor="hasToilet" className="flex items-center cursor-pointer">
                  🚻 Toilet
                </Label>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Grootte */}
        <div className="grootte-filter-section">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between section-header">
              <h3 className="font-medium">Grootte</h3>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3 filter-items">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="grootteKlein"
                  checked={filters.grootte === 'klein'}
                  onCheckedChange={(checked) => updateFilter('grootte', checked ? 'klein' : undefined)}
                  className="checkbox-with-emoji"
                />
                <Label htmlFor="grootteKlein" className="flex items-center cursor-pointer">
                  🔸 Klein
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="grootteMiddel"
                  checked={filters.grootte === 'middel'}
                  onCheckedChange={(checked) => updateFilter('grootte', checked ? 'middel' : undefined)}
                  className="checkbox-with-emoji"
                />
                <Label htmlFor="grootteMiddel" className="flex items-center cursor-pointer">
                  🔶 Middel
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="grootteGroot"
                  checked={filters.grootte === 'groot'}
                  onCheckedChange={(checked) => updateFilter('grootte', checked ? 'groot' : undefined)}
                  className="checkbox-with-emoji"
                />
                <Label htmlFor="grootteGroot" className="flex items-center cursor-pointer">
                  🔵 Groot
                </Label>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Filter Footer */}
        <div className="filter-footer">
          <div className="active-filters-counter">
            Actieve filters: <span className="count">{Object.values(filters).filter(v => v === true || (typeof v === 'string' && v)).length}</span>
          </div>
        </div>

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