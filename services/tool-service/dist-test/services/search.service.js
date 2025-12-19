"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const Tool_1 = require("../models/Tool");
class SearchService {
    /**
     * Search tools using MongoDB text search
     */
    static async searchTools(query, options = {}) {
        const { limit = 50, skip = 0 } = options;
        try {
            // Use MongoDB text search
            const tools = await Tool_1.Tool.find({
                $text: { $search: query },
                status: 'published'
            }, {
                score: { $meta: 'textScore' }
            })
                .sort({ score: { $meta: 'textScore' } })
                .limit(limit)
                .skip(skip)
                .lean();
            return tools;
        }
        catch (error) {
            console.error('[SearchService] Search error:', error);
            // Fallback to regex search if text search fails
            return this.fallbackSearch(query, options);
        }
    }
    /**
     * Fallback search using regex (less efficient but more forgiving)
     */
    static async fallbackSearch(query, options = {}) {
        const { limit = 50, skip = 0 } = options;
        try {
            const regex = new RegExp(query, 'i');
            const tools = await Tool_1.Tool.find({
                $or: [
                    { name: regex },
                    { description: regex },
                    { tagline: regex }
                ],
                status: 'published'
            })
                .limit(limit)
                .skip(skip)
                .lean();
            return tools;
        }
        catch (error) {
            console.error('[SearchService] Fallback search error:', error);
            return [];
        }
    }
    /**
     * Get autocomplete suggestions
     */
    static async getSuggestions(query, limit = 5) {
        try {
            const regex = new RegExp(`^${query}`, 'i');
            const tools = await Tool_1.Tool.find({
                name: regex,
                status: 'published'
            })
                .select('name')
                .limit(limit)
                .lean();
            return tools.map(tool => tool.name);
        }
        catch (error) {
            console.error('[SearchService] Suggestions error:', error);
            return [];
        }
    }
    /**
     * Find related tools based on categories and problems_solved
     */
    static async findRelatedTools(toolId, categories, problemsSolved, limit = 5) {
        try {
            const tools = await Tool_1.Tool.find({
                _id: { $ne: toolId },
                status: 'published',
                $or: [
                    { categories: { $in: categories } },
                    { problems_solved: { $in: problemsSolved } }
                ]
            })
                .limit(limit)
                .lean();
            return tools;
        }
        catch (error) {
            console.error('[SearchService] Related tools error:', error);
            return [];
        }
    }
}
exports.SearchService = SearchService;
