import React from 'react';
import SecurityGuard from '../components/SecurityGuard';
import AdminPhotoImporter from '../components/AdminPhotoImporter';

const AdminImport: React.FC = () => {
  return (
    <SecurityGuard requireAdmin={true}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Foto Import Tool</h1>
          <p className="text-muted-foreground mt-2">
            Importeer foto's uit de Supabase bucket en maak er speeltuin records van met GPS-data
          </p>
        </div>
        
        <AdminPhotoImporter />
      </div>
    </SecurityGuard>
  );
};

export default AdminImport; 