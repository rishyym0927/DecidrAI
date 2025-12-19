"use client";

import { useState } from "react";
import { SearchIcon, ArrowRightIcon } from "../ui/icons";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-900 text-sm text-neutral-600 dark:text-neutral-400 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Curated AI tools, served fresh
        </div>

        {/* Main Heading - Medium style large serif */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-medium text-black dark:text-white mb-6 leading-[1.1] tracking-tight">
          Find the right AI tool.
          <br />
          <span className="text-neutral-400 dark:text-neutral-600">Not all of them.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop scrolling through endless directories. Answer a few questions and 
          get personalized recommendations in minutes.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 500+ AI tools..."
              className="w-full pl-14 pr-6 py-4 rounded-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors text-base"
            />
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-medium rounded-full hover:opacity-80 transition-opacity text-base">
            Start Discovery
            <ArrowRightIcon />
          </button>
          <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-black dark:text-white font-medium rounded-full border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-colors text-base">
            Browse Tools
          </button>
        </div>

        {/* Stats - minimalist */}
        <div className="flex flex-wrap justify-center gap-12 mt-16 pt-16 border-t border-neutral-100 dark:border-neutral-900">
          <div className="text-center">
            <div className="text-3xl font-semibold text-black dark:text-white mb-1">500+</div>
            <div className="text-sm text-neutral-500">Curated Tools</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-semibold text-black dark:text-white mb-1">50+</div>
            <div className="text-sm text-neutral-500">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-semibold text-black dark:text-white mb-1">10k+</div>
            <div className="text-sm text-neutral-500">Users</div>
          </div>
        </div>
      </div>
    </section>
  );
}
