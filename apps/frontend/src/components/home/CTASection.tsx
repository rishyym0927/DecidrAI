import { ArrowRightIcon } from "../ui/icons";

export default function CTASection() {
  return (
    <section className="py-20 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-white dark:bg-black rounded-3xl p-12 sm:p-16 border border-neutral-200 dark:border-neutral-800">
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-black dark:text-white mb-4">
            Ready to find your AI stack?
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
            Get personalized recommendations in under 3 minutes.
          </p>
          <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-medium rounded-full hover:opacity-80 transition-opacity text-base">
            Start Free Discovery
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </section>
  );
}
