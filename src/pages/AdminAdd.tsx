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
      <div className="w-full max-w-4xl mx-auto">
        <Card className="border-0 lg:border lg:border-border">
          <CardHeader className="px-4 lg:px-6">
            <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
              <Plus className="h-5 w-5" />
              Speeltuin Details
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 lg:px-6">
            <SpeeltuinEditor />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAdd;