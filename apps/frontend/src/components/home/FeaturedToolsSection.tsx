import { featuredTools } from "@/data/featuredTools";
import { ArrowRightIcon, StarIcon } from "../ui/icons";

export default function FeaturedToolsSection() {
  return (
    <section className="py-20 px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div>
            <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest mb-3">
              Popular
            </p>
            <h2 className="text-3xl font-serif font-medium text-black dark:text-white">
              Featured tools
            </h2>
          </div>
          <button className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white font-medium flex items-center gap-2 transition-colors group">
            See all tools
            <span className="group-hover:translate-x-1 transition-transform">
              <ArrowRightIcon />
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTools.map((tool) => (
            <article
              key={tool.id}
              className="group bg-white dark:bg-black rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-all cursor-pointer"
            >
              {/* Tool Avatar with brand color */}
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-2xl"
                style={{ backgroundColor: tool.color + '15' }}
              >
                {tool.icon}
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300">
                  {tool.category}
                </span>
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-500">
                  {tool.pricing}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-black dark:text-white mb-2 group-hover:underline underline-offset-4">
                {tool.name}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-5 leading-relaxed">
                {tool.tagline}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1.5 text-neutral-900 dark:text-neutral-100">
                <StarIcon />
                <span className="text-sm font-medium">
                  {tool.rating}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
