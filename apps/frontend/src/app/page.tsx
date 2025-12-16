"use client";

import { useState, useEffect } from "react";

// Sample AI Tool Categories
const categories = [
  { name: "Writing", icon: "✍️", count: 45 },
  { name: "Design", icon: "🎨", count: 32 },
  { name: "Coding", icon: "💻", count: 28 },
  { name: "Research", icon: "🔬", count: 19 },
  { name: "Productivity", icon: "⚡", count: 37 },
  { name: "Marketing", icon: "📈", count: 24 },
];

// Sample Discovery Flows
const discoveryFlows = [
  {
    id: 1,
    title: "Content Creation",
    description: "Find the perfect AI for writing, editing, and content strategy",
    icon: "📝",
    questions: 5,
    timeEstimate: "2 min",
  },
  {
    id: 2,
    title: "Design & Visual",
    description: "Discover AI tools for image generation, editing, and design",
    icon: "🎨",
    questions: 4,
    timeEstimate: "2 min",
  },
  {
    id: 3,
    title: "Code & Development",
    description: "Find AI assistants for coding, debugging, and automation",
    icon: "🚀",
    questions: 5,
    timeEstimate: "3 min",
  },
  {
    id: 4,
    title: "Research & Analysis",
    description: "Get recommendations for data analysis and research tools",
    icon: "📊",
    questions: 4,
    timeEstimate: "2 min",
  },
];

// Sample Featured Tools
const featuredTools = [
  {
    id: 1,
    name: "ChatGPT",
    tagline: "Advanced conversational AI for any task",
    category: "General",
    pricing: "Freemium",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Midjourney",
    tagline: "Create stunning AI-generated artwork",
    category: "Design",
    pricing: "Paid",
    rating: 4.7,
  },
  {
    id: 3,
    name: "Claude",
    tagline: "Thoughtful AI assistant by Anthropic",
    category: "General",
    pricing: "Freemium",
    rating: 4.9,
  },
  {
    id: 4,
    name: "GitHub Copilot",
    tagline: "AI pair programmer for developers",
    category: "Coding",
    pricing: "Paid",
    rating: 4.6,
  },
];

// Icons
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true);
    }
  }, []);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 dark:bg-violet-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-fuchsia-500/20 dark:bg-fuchsia-500/10 rounded-full blur-3xl animate-float delay-500" />
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-[var(--surface)] hover:bg-[var(--border)] border border-[var(--border)] transition-all"
            aria-label="Toggle dark mode"
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="animate-fade-in-up opacity-0 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 text-sm font-medium mb-8 border border-violet-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              The Google for AI Decisions
            </div>

            {/* Main Heading */}
            <h1 className="animate-fade-in-up opacity-0 delay-100 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--foreground)] mb-6 leading-[1.1]">
              Find the perfect{" "}
              <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                AI tools
              </span>{" "}
              for your workflow
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-in-up opacity-0 delay-200 text-lg text-[var(--muted)] max-w-xl mx-auto mb-10">
              Stop wasting time comparing tools. Get personalized recommendations 
              in minutes through our guided discovery flows.
            </p>

            {/* Search Bar */}
            <div className="animate-fade-in-up opacity-0 delay-300 max-w-xl mx-auto mb-8">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 500+ AI tools..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
                />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="animate-fade-in-up opacity-0 delay-400 flex flex-col sm:flex-row gap-3 justify-center">
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--foreground)] hover:opacity-90 text-[var(--background)] font-semibold rounded-xl transition-all">
                Start Discovery
                <ArrowRightIcon />
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-transparent hover:bg-[var(--surface)] text-[var(--foreground)] font-semibold rounded-xl border border-[var(--border)] transition-all">
                Browse Tools
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="animate-fade-in-up opacity-0 delay-500 flex flex-wrap justify-center gap-6 mt-14 text-sm text-[var(--muted)]">
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold text-[var(--foreground)]">500+</span>
                <span>Curated Tools</span>
              </div>
              <div className="w-px h-5 bg-[var(--border)]" />
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold text-[var(--foreground)]">50+</span>
                <span>Categories</span>
              </div>
              <div className="w-px h-5 bg-[var(--border)]" />
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold text-[var(--foreground)]">10k+</span>
                <span>Users</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discovery Flows Section */}
      <section className="py-24 bg-[var(--surface)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-medium text-violet-500 dark:text-violet-400 mb-3 uppercase tracking-wider">
              Guided Discovery
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">
              Find your perfect match
            </h2>
            <p className="text-[var(--muted)] max-w-lg mx-auto">
              Answer a few questions to get AI-powered recommendations tailored to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {discoveryFlows.map((flow) => (
              <div
                key={flow.id}
                className="group relative bg-[var(--surface-elevated)] rounded-2xl p-6 border border-[var(--border)] hover:border-violet-500/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-violet-500/5"
              >
                <div className="text-4xl mb-4">{flow.icon}</div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
                  {flow.title}
                </h3>
                <p className="text-sm text-[var(--muted)] mb-4 leading-relaxed">
                  {flow.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                  <span>{flow.questions} questions</span>
                  <span>•</span>
                  <span>{flow.timeEstimate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <p className="text-sm font-medium text-violet-500 dark:text-violet-400 mb-2 uppercase tracking-wider">
                Categories
              </p>
              <h2 className="text-3xl font-bold text-[var(--foreground)]">
                Browse by use case
              </h2>
            </div>
            <button className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] font-medium flex items-center gap-2 transition-colors">
              View all
              <ArrowRightIcon />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((category) => (
              <div
                key={category.name}
                className="group bg-[var(--surface)] hover:bg-[var(--surface-elevated)] rounded-xl p-5 border border-transparent hover:border-[var(--border)] transition-all duration-200 cursor-pointer"
              >
                <div className="text-center">
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h3 className="font-medium text-[var(--foreground)] mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-[var(--muted)]">
                    {category.count} tools
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-24 bg-[var(--surface)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <p className="text-sm font-medium text-violet-500 dark:text-violet-400 mb-2 uppercase tracking-wider">
                Popular
              </p>
              <h2 className="text-3xl font-bold text-[var(--foreground)]">
                Featured tools
              </h2>
            </div>
            <button className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] font-medium flex items-center gap-2 transition-colors">
              See all tools
              <ArrowRightIcon />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredTools.map((tool) => (
              <div
                key={tool.id}
                className="group bg-[var(--surface-elevated)] rounded-2xl p-6 border border-[var(--border)] hover:border-violet-500/30 transition-all duration-200 cursor-pointer"
              >
                {/* Tool Avatar */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-4 text-white font-bold text-lg">
                  {tool.name.charAt(0)}
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400">
                    {tool.category}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-[var(--surface)] text-[var(--muted)]">
                    {tool.pricing}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-[var(--muted)] mb-4 leading-relaxed">
                  {tool.tagline}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  <StarIcon />
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {tool.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl p-12 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
            
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to find your AI stack?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-md mx-auto">
                Get personalized recommendations in under 3 minutes.
              </p>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold rounded-xl transition-all">
                Start Free Discovery
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">D</span>
              </div>
              <span className="font-bold text-lg text-[var(--foreground)]">
                DecidrAI
              </span>
            </div>
            
            <nav className="flex flex-wrap justify-center gap-8 text-sm">
              {["Discover", "Compare", "Categories", "About", "Blog"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>

            <p className="text-sm text-[var(--muted)]">
              © 2024 DecidrAI
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
