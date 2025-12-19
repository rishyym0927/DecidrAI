/**
 * How It Works Section
 * Explains the 3-step process
 */

export default function HowItWorksSection() {
  const steps = [
    {
      number: '1',
      icon: '💬',
      title: 'Answer Questions',
      description: 'Tell us about your needs through our intelligent discovery flows',
    },
    {
      number: '2',
      icon: '🤖',
      title: 'Get AI Recommendations',
      description: 'Our AI analyzes your answers and matches you with perfect tools',
    },
    {
      number: '3',
      icon: '✅',
      title: 'Make Confident Decisions',
      description: 'Compare options side-by-side and choose with confidence',
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-[var(--surface)]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
              Finding the right AI tool has never been easier
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                {/* Icon */}
                <div className="text-6xl mb-6">{step.icon}</div>

                {/* Step Number */}
                <div className="inline-block px-4 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-full font-bold mb-4">
                  Step {step.number}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>

                {/* Description */}
                <p className="text-[var(--muted)] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
