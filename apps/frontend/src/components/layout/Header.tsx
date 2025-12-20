"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { useTheme } from '@/contexts/ThemeContext';

const navLinks = [
  { name: 'Discover', href: '/discover' },
  { name: 'Compare', href: '/compare' },
  { name: 'Categories', href: '/categories' },
  { name: 'About', href: '/about' },
];

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-neutral-100 dark:border-neutral-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center">
                <span className="text-white dark:text-black text-sm font-bold">D</span>
              </div>
              <span className="font-bold text-lg text-black dark:text-white">
                DecidrAI
              </span>
            </Link>

            {/* Center Navigation - Desktop */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? "☀️" : "🌙"}
              </button>

              <SignedOut>
                <SignInButton>
                  <button className="hidden sm:inline-flex text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors px-3 py-2">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white dark:text-black bg-black dark:bg-white hover:opacity-90 rounded-lg transition-all">
                    Get Started
                  </button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <button className="hidden sm:block p-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors">
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

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed top-16 right-0 z-50 w-64 h-[calc(100vh-4rem)] bg-[var(--background)] border-l border-[var(--border)] transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col p-6 gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors py-2"
            >
              {link.name}
            </Link>
          ))}
          
          <hr className="border-[var(--border)] my-2" />
          
          <SignedOut>
            <SignInButton>
              <button className="text-lg font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors py-2 text-left">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="mt-2 w-full px-4 py-3 text-sm font-medium text-white dark:text-black bg-black dark:bg-white hover:opacity-90 rounded-lg transition-all">
                Get Started
              </button>
            </SignUpButton>
          </SignedOut>
        </nav>
      </div>
    </>
  );
}
