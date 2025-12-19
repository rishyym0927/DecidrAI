import { categories } from "@/data/categories";
import { ArrowRightIcon } from "../ui/icons";

export default function CategoriesSection() {
  return (
    <section className="py-20 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div>
            <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest mb-3">
              Categories
            </p>
            <h2 className="text-3xl font-serif font-medium text-black dark:text-white">
              Browse by use case
            </h2>
          </div>
          <button className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white font-medium flex items-center gap-2 transition-colors group">
            View all
            <span className="group-hover:translate-x-1 transition-transform">
              <ArrowRightIcon />
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group bg-white dark:bg-black rounded-xl p-6 border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-all cursor-pointer text-center"
            >
              <div className="text-3xl mb-3">{category.icon}</div>
              <h3 className="font-medium text-black dark:text-white mb-1 text-sm">
                {category.name}
              </h3>
              <p className="text-xs text-neutral-500">
                {category.count} tools
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
