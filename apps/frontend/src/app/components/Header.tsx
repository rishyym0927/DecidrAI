"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const navLinks = [
  { name: 'Discover', href: '/discover' },
  { name: 'Compare', href: '/compare' },
  { name: 'Categories', href: '/categories' },
  { name: 'About', href: '/about' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--background)]/80 border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">D</span>
            </div>
            <span className="font-bold text-lg text-[var(--foreground)]">
              DecidrAI
            </span>
          </a>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton>
                <button className="hidden sm:inline-flex text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors px-3 py-2">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[var(--background)] bg-[var(--foreground)] hover:opacity-90 rounded-lg transition-all">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <button className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
