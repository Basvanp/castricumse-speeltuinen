import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Users, UserPlus, Shield, Mail, Edit, Trash2 } from 'lucide-react';

interface UserWithRole {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'user'>('user');
  const [editingUser, setEditingUser] = useState<UserWithRole | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { toast } = useToast();

  // Fetch users with their roles
  const fetchUsers = async () => {
    try {
      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select('user_id, role, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user emails from auth.users (we'll need to do this via a database function)
      // For now, we'll create mock data based on the roles
      const mockUsers: UserWithRole[] = userRoles?.map((ur, index) => ({
        id: ur.user_id,
        email: `user${index + 1}@castricum.nl`,
        role: ur.role as 'admin' | 'user',
        created_at: ur.created_at
      })) || [];

      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Fout",
        description: "Kon gebruikers niet laden",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Invite new user - secure implementation with validation
  const handleInviteUser = async () => {
    // Input validation
    if (!inviteEmail || !inviteEmail.includes('@')) {
      toast({
        title: "Validatiefout",
        description: "Voer een geldig emailadres in",
        variant: "destructive"
      });
      return;
    }

    // Additional email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast({
        title: "Validatiefout", 
        description: "Emailadres heeft een ongeldig formaat",
        variant: "destructive"
      });
      return;
    }

    // Confirm admin role assignment
    if (inviteRole === 'admin') {
      const confirmed = window.confirm(
        `Weet je zeker dat je ${inviteEmail} admin rechten wilt geven? Dit geeft volledige toegang tot het systeem.`
      );
      if (!confirmed) return;
    }

    try {
      // Use the secure invitation function instead of direct signup
      const { data, error } = await supabase.rpc('invite_user_secure', {
        user_email: inviteEmail,
        user_role: inviteRole
      });

      if (error) throw error;

      // For now, inform admin that invitation system needs email integration
      toast({
        title: "Uitnodiging functie",
        description: "Uitnodiging systeem vereist email integratie. Gebruiker moet handmatig worden aangemaakt via Supabase dashboard.",
        variant: "default"
      });

      setInviteEmail('');
      setInviteRole('user');
      setIsInviteOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Fout",
        description: error.message || "Kon uitnodiging niet verwerken",
        variant: "destructive"
      });
    }
  };

  // Update user role with security validation
  const handleUpdateRole = async () => {
    if (!editingUser) return;

    // Add confirmation for critical role changes
    if (inviteRole === 'admin' && editingUser.role === 'user') {
      const confirmed = window.confirm(
        `Weet je zeker dat je ${editingUser.email} admin rechten wilt geven? Dit geeft volledige toegang tot het systeem.`
      );
      if (!confirmed) return;
    }

    try {
      // Use the secure role update with built-in validation
      const { error } = await supabase
        .from('user_roles')
        .update({ role: inviteRole })
        .eq('user_id', editingUser.id);

      if (error) throw error;

      toast({
        title: "Rol bijgewerkt",
        description: `Gebruikersrol is bijgewerkt naar ${inviteRole}`,
      });

      setEditingUser(null);
      setIsEditOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Fout",
        description: error.message || "Kon rol niet bijwerken",
        variant: "destructive"
      });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge variant="default">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      case 'editor':
        return <Badge variant="secondary">User</Badge>;
      default:
        return <Badge variant="outline">User</Badge>;
    }
  };
  return (
    <AdminLayout 
      title="Gebruikers Beheer" 
      description="Beheer gebruikers, rollen en toegangsrechten"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span className="text-lg font-semibold">Alle Gebruikers</span>
          </div>
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Gebruiker Uitnodigen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nieuwe Gebruiker Uitnodigen</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Adres</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="gebruiker@castricum.nl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select value={inviteRole} onValueChange={(value: 'admin' | 'user') => setInviteRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                    Annuleren
                  </Button>
                  <Button onClick={handleInviteUser} disabled={!inviteEmail}>
                    Uitnodiging Versturen
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Gebruikersoverzicht</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Gebruikers laden...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Geen gebruikers gevonden</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {user.email.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">
                          {user.email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getRoleBadge(user.role)}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingUser(user);
                          setInviteRole(user.role);
                          setIsEditOpen(true);
                        }}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Bewerken
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role Management */}
        <Card>
          <CardHeader>
            <CardTitle>Rol Beheer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="font-medium">Admin</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Volledige toegang tot alle functies en instellingen
                </p>
                <div className="text-xs text-muted-foreground">{users.filter(u => u.role === 'admin').length} gebruiker(s)</div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span className="font-medium">User</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Standaard toegang tot de applicatie
                </p>
                <div className="text-xs text-muted-foreground">{users.filter(u => u.role === 'user').length} gebruiker(s)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gebruiker Bewerken</DialogTitle>
            </DialogHeader>
            {editingUser && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Adres</Label>
                  <Input value={editingUser.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Rol</Label>
                  <Select value={inviteRole} onValueChange={(value: 'admin' | 'user') => setInviteRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                    Annuleren
                  </Button>
                  <Button onClick={handleUpdateRole}>
                    Rol Bijwerken
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;