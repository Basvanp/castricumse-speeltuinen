import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  Settings, 
  BarChart3,
  PlusCircle,
  LogOut,
  Home,
  Image,
  Upload,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
  onClose?: () => void;
}

const AdminSidebar = ({ onClose }: AdminSidebarProps) => {
  const location = useLocation();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const currentPath = location.pathname;

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      
      localStorage.clear();
      sessionStorage.clear();
      
      navigate('/auth');
      toast({
        title: "Uitgelogd",
        description: "Je bent succesvol uitgelogd.",
      });
    } catch (error: any) {
      toast({
        title: "Fout",
        description: error?.message || "Er is een fout opgetreden bij het uitloggen.",
        variant: "destructive",
      });
    }
  };

  const navigationItems = [
    { 
      title: 'Dashboard', 
      url: '/admin', 
      icon: LayoutDashboard,
      exact: true
    },
    { 
      title: 'Speeltuinen', 
      url: '/admin/speeltuinen', 
      icon: MapPin 
    },
    { 
      title: 'Toevoegen', 
      url: '/admin/toevoegen', 
      icon: PlusCircle 
    },

    { 
      title: 'Foto Import', 
      url: '/admin/import', 
      icon: Upload 
    },
    { 
      title: 'Statistieken', 
      url: '/admin/stats', 
      icon: BarChart3 
    },
    { 
      title: 'Gebruikers', 
      url: '/admin/users', 
      icon: Users 
    },
    { 
      title: 'Instellingen', 
      url: '/admin/settings', 
      icon: Settings 
    },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-screen border-r border-sidebar-border">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-sidebar-primary">
              Admin Panel
            </h2>
            <p className="text-sm text-sidebar-muted-foreground mt-1">
              Castricum Speeltuinen
            </p>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden p-1 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.url, item.exact);
            
            return (
              <NavLink
                key={item.title}
                to={item.url}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${active 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-muted hover:text-sidebar-accent-foreground'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <Separator className="mx-4" />

      {/* Footer Actions */}
      <div className="p-4 space-y-2">
        <Button 
          asChild 
          variant="outline" 
          size="sm" 
          className="w-full justify-start"
        >
          <NavLink to="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Terug naar site
          </NavLink>
        </Button>
        
        <Button 
          onClick={handleSignOut}
          variant="outline" 
          size="sm"
          className="w-full justify-start text-destructive hover:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Uitloggen
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;