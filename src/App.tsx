import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import AdminAdd from "./pages/AdminAdd";
import AdminSpeeltuinen from "./pages/AdminSpeeltuinen";
import AdminStats from "./pages/AdminStats";
import AdminUsers from "./pages/AdminUsers";
import AdminSettings from "./pages/AdminSettings";
import AdminFotos from "./pages/AdminFotos";
import AdminImport from "./pages/AdminImport";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import SitemapGenerator from "./components/SitemapGenerator";
import CookieConsent from "./components/CookieConsent";
import MaintenanceMode from "./components/MaintenanceMode";
import SEOProvider from "./components/SEOProvider";
import { Toaster } from "@/components/ui/toaster";
import { useTheme } from "@/hooks/useTheme";
import { usePublicSiteSettings } from "@/hooks/useSiteSettings";

const queryClient = new QueryClient();

// Theme Provider Component
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { mounted } = useTheme();
  
  // Prevent hydration mismatch
  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }
  
  return <>{children}</>;
};

// App Content Component with maintenance mode check
const AppContent = () => {
  const { data: settings } = usePublicSiteSettings();
  
  // Show maintenance mode if enabled (unless on admin routes)
  const isAdminRoute = window.location.pathname.startsWith('/admin');
  if (settings?.maintenance_mode && !isAdminRoute) {
    return <MaintenanceMode />;
  }
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/toevoegen" element={<AdminAdd />} />
        <Route path="/admin/speeltuinen" element={<AdminSpeeltuinen />} />
        <Route path="/admin/fotos" element={<AdminFotos />} />
        <Route path="/admin/import" element={<AdminImport />} />
        <Route path="/admin/stats" element={<AdminStats />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/sitemap.xml" element={<SitemapGenerator />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CookieConsent />
      <Toaster />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SEOProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </SEOProvider>
  </QueryClientProvider>
);

export default App;