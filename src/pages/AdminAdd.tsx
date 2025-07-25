import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import SpeeltuinEditor from '@/components/SpeeltuinEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

const AdminAdd = () => {
  return (
    <AdminLayout 
      title="Nieuwe Speeltuin Toevoegen" 
      description="Voeg een nieuwe speeltuin toe met drag & drop foto's"
    >
      <div className="max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Speeltuin Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SpeeltuinEditor />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAdd;