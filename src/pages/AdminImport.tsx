import React from 'react';
import SecurityGuard from '../components/SecurityGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdminImport: React.FC = () => {
  return (
    <SecurityGuard>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Upload className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Foto Import</h1>
        </div>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            De foto import functionaliteit is tijdelijk niet beschikbaar. 
            Foto's kunnen direct worden toegevoegd via de speeltuin beheer pagina.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Foto Beheer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Gebruik de speeltuin beheer pagina om foto's toe te voegen aan specifieke speeltuinen.
            </p>
          </CardContent>
        </Card>
      </div>
    </SecurityGuard>
  );
};

export default AdminImport; 