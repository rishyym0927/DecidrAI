/**
 * Homepage
 * Main landing page with hero, features, and CTA
 */

'use client';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold text-center mb-6">
          Find the Perfect AI Tool
        </h1>
        <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-8">
          Answer a few questions, get personalized recommendations
        </p>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        {/* Add features */}
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Ready to Discover?
        </h2>
        {/* Add CTA buttons */}
      </section>
    </div>
  );
}
