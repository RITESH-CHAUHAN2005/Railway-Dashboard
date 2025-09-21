import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const getBreadcrumbItems = (pathname: string): BreadcrumbItem[] => {
  const pathSegments = pathname.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [
    { label: 'Control Center', path: '/', icon: Home }
  ];

  if (pathSegments.length === 0) {
    return items; // Don't add duplicate item for root path
  }

  pathSegments.forEach((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    
    switch (segment.toLowerCase()) {
      case 'settings':
        items.push({ label: 'System Settings', path });
        break;
      case 'analytics':
        items.push({ label: 'Analytics Dashboard', path });
        break;
      case 'tracking':
        items.push({ label: 'Train Tracking', path });
        break;
      case 'alerts':
        items.push({ label: 'Alert Center', path });
        break;
      default:
        items.push({ 
          label: segment.charAt(0).toUpperCase() + segment.slice(1), 
          path 
        });
    }
  });

  return items;
};

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const items = getBreadcrumbItems(location.pathname);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <React.Fragment key={`${item.path}-${index}`}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          )}
          
          {index === items.length - 1 ? (
            <span className="flex items-center gap-1.5 text-foreground font-medium">
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.label}
            </span>
          ) : (
            <Link
              to={item.path}
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;