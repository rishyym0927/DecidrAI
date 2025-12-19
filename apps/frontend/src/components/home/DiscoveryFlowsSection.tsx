import { discoveryFlows } from "@/data/discoveryFlows";

export default function DiscoveryFlowsSection() {
  return (
    <section className="py-20 px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest mb-3">
            Guided Discovery
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-black dark:text-white mb-4">
            Find your perfect match
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            Answer a few questions to get AI-powered recommendations tailored to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {discoveryFlows.map((flow) => (
            <article
              key={flow.id}
              className="group bg-white dark:bg-black rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-all cursor-pointer"
            >
              <div className="text-4xl mb-5">{flow.icon}</div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2 group-hover:underline underline-offset-4">
                {flow.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-5 leading-relaxed">
                {flow.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span>{flow.questions} questions</span>
                <span>·</span>
                <span>{flow.timeEstimate}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
