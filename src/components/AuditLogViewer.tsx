import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, Clock, User, Database } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  table_name: string;
  record_id: string;
  old_values: any;
  new_values: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

const AuditLogViewer = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      toast({
        title: "Fout",
        description: error.message || "Kon audit logs niet laden",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'role_created':
        return <Badge variant="default">Rol Toegevoegd</Badge>;
      case 'role_updated':
        return <Badge variant="secondary">Rol Bijgewerkt</Badge>;
      case 'role_deleted':
        return <Badge variant="destructive">Rol Verwijderd</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  const formatJsonDiff = (oldValue: any, newValue: any) => {
    if (!oldValue && newValue) {
      return `Nieuw: ${JSON.stringify(newValue, null, 2)}`;
    }
    if (oldValue && newValue) {
      return `Van: ${JSON.stringify(oldValue, null, 2)} Naar: ${JSON.stringify(newValue, null, 2)}`;
    }
    return 'Geen wijzigingen';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Beveiligingslog
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Logs laden...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Beveiligingslog
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Overzicht van belangrijke beveiligingsacties en rolwijzigingen
        </p>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Geen beveiligingsacties gevonden</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getActionBadge(log.action)}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {format(new Date(log.created_at), 'dd-MM-yyyy HH:mm:ss')}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    {log.user_id ? log.user_id.substring(0, 8) + '...' : 'Systeem'}
                  </div>
                </div>
                
                {log.table_name && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <Database className="h-3 w-3" />
                    Tabel: {log.table_name}
                  </div>
                )}

                {(log.old_values || log.new_values) && (
                  <div className="mt-2 p-2 bg-muted rounded text-xs">
                    <strong>Wijzigingen:</strong>
                    <pre className="mt-1 whitespace-pre-wrap">
                      {formatJsonDiff(log.old_values, log.new_values)}
                    </pre>
                  </div>
                )}

                {log.ip_address && (
                  <div className="text-xs text-muted-foreground mt-2">
                    IP: {log.ip_address}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditLogViewer;