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
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import SitemapGenerator from "./components/SitemapGenerator";
import CookieConsent from "./components/CookieConsent";
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/toevoegen" element={<AdminAdd />} />
        <Route path="/admin/speeltuinen" element={<AdminSpeeltuinen />} />
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
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;