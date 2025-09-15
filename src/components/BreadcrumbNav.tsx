import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  breadcrumbs?: Breadcrumb[];
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ breadcrumbs = [] }) => {
  const location = useLocation();
  
  // Auto-generate breadcrumbs based on current path if none provided
  const autoBreadcrumbs = React.useMemo(() => {
    if (breadcrumbs.length > 0) return breadcrumbs;
    
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const auto: Breadcrumb[] = [{ label: 'Home', href: '/' }];
    
    pathSegments.forEach((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Custom labels for known routes
      if (segment === 'privacy') label = 'Privacy Beleid';
      if (segment === 'terms') label = 'Algemene Voorwaarden';
      if (segment === 'auth') label = 'Inloggen';
      
      auto.push({ label, href: path });
    });
    
    return auto;
  }, [location.pathname, breadcrumbs]);

  if (autoBreadcrumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="py-2">
      <ol className="flex items-center space-x-2 text-sm">
        {autoBreadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />
            )}
            {breadcrumb.href && index < autoBreadcrumbs.length - 1 ? (
              <Link 
                to={breadcrumb.href}
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                {index === 0 && <Home className="w-4 h-4 mr-1" />}
                {breadcrumb.label}
              </Link>
            ) : (
              <span className="flex items-center text-foreground font-medium">
                {index === 0 && <Home className="w-4 h-4 mr-1" />}
                {breadcrumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbNav;