import { Search, X } from "lucide-react";
import { memo } from "react";

const SearchAndFilter = memo(({ 
  searchTerm, 
  onSearchChange, 
  category, 
  onCategoryChange,
  categories = [],
  resultCount = 0,
}) => {
  return (
    <div className="space-y-4 mb-6" data-aos="fade-up">
      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects..."
          className="w-full pl-12 pr-12 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={() => onCategoryChange('All')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            category === 'All'
              ? 'bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white shadow-lg'
              : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10'
          }`}
        >
          All
        </button>
        
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              category === cat
                ? 'bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white shadow-lg'
                : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}

        {/* تعداد نتایج */}
        {(searchTerm || category !== 'All') && (
          <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            {resultCount} result{resultCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
});

export default SearchAndFilter;