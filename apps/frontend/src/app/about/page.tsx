/**
 * About Page
 * Information about DecidrAI
 */

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-5xl font-bold mb-6">About DecidrAI</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          The Google for AI Decisions - helping you discover the perfect AI tools
          for your needs.
        </p>

        {/* Mission */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg">
            We believe finding the right AI tool shouldn't be overwhelming. 
            Instead of endless directories, we use intelligent questionnaires 
            to understand your needs and recommend the perfect tools.
          </p>
        </section>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl mb-2">1️⃣</div>
              <h3 className="font-bold mb-2">Answer Questions</h3>
              <p>Tell us about your needs through our discovery flows</p>
            </div>
            <div>
              <div className="text-4xl mb-2">2️⃣</div>
              <h3 className="font-bold mb-2">Get Recommendations</h3>
              <p>Receive personalized AI tool suggestions</p>
            </div>
            <div>
              <div className="text-4xl mb-2">3️⃣</div>
              <h3 className="font-bold mb-2">Make Decisions</h3>
              <p>Compare options and choose confidently</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Features</h2>
          <ul className="space-y-2">
            <li>✅ Intent-based discovery flows</li>
            <li>✅ AI-powered recommendations</li>
            <li>✅ Side-by-side tool comparisons</li>
            <li>✅ Curated tool directory</li>
            <li>✅ Regular updates with new tools</li>
          </ul>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p>
            Have questions or suggestions? We'd love to hear from you.
          </p>
          {/* Add contact form or email */}
        </section>
      </div>
    </div>
  );
}
