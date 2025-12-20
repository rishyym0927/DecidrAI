/**
 * Breadcrumbs Component
 * Reusable navigation breadcrumbs
 */

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[var(--muted)]">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && <span>/</span>}
          {item.href ? (
            <Link 
              href={item.href} 
              className="hover:text-[var(--foreground)] hover:underline transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--foreground)] font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
