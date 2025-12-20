import Link from 'next/link';

const footerLinks = [
  { label: 'Discover', href: '/discover' },
  { label: 'Compare', href: '/compare' },
  { label: 'Categories', href: '/categories' },
  { label: 'About', href: '/about' },
];

export default function Footer() {
  return (
    <footer className="py-16 px-6 lg:px-8 border-t border-neutral-100 dark:border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center">
              <span className="text-white dark:text-black text-sm font-bold">D</span>
            </div>
            <span className="font-semibold text-lg text-black dark:text-white tracking-tight">
              DecidrAI
            </span>
          </Link>
          
          <nav className="flex flex-wrap justify-center gap-8 text-sm">
            {footerLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} DecidrAI
          </p>
        </div>
      </div>
    </footer>
  );
}
