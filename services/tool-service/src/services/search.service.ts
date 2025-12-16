import { Tool, ITool } from '../models/Tool';
import mongoose from 'mongoose';

/**
 * Search Service
 * Handles full-text search and related operations
 */

// Type for lean query results - plain objects without Mongoose document methods
type LeanToolDocument = Omit<ITool, keyof mongoose.Document> & {
    _id: mongoose.Types.ObjectId;
};

export interface SearchOptions {
    limit?: number;
    skip?: number;
}

export class SearchService {
    /**
     * Search tools using MongoDB text search
     */
    static async searchTools(
        query: string,
        options: SearchOptions = {}
    ): Promise<LeanToolDocument[]> {
        const { limit = 50, skip = 0 } = options;

        try {
            // Use MongoDB text search
            const tools = await Tool.find(
                {
                    $text: { $search: query },
                    status: 'published'
                },
                {
                    score: { $meta: 'textScore' }
                }
            )
                .sort({ score: { $meta: 'textScore' } })
                .limit(limit)
                .skip(skip)
                .lean();

            return tools;
        } catch (error) {
            console.error('[SearchService] Search error:', error);

            // Fallback to regex search if text search fails
            return this.fallbackSearch(query, options);
        }
    }

    /**
     * Fallback search using regex (less efficient but more forgiving)
     */
    private static async fallbackSearch(
        query: string,
        options: SearchOptions = {}
    ): Promise<LeanToolDocument[]> {
        const { limit = 50, skip = 0 } = options;

        try {
            const regex = new RegExp(query, 'i');

            const tools = await Tool.find({
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
        } catch (error) {
            console.error('[SearchService] Fallback search error:', error);
            return [];
        }
    }

    /**
     * Get autocomplete suggestions
     */
    static async getSuggestions(query: string, limit: number = 5): Promise<string[]> {
        try {
            const regex = new RegExp(`^${query}`, 'i');

            const tools = await Tool.find({
                name: regex,
                status: 'published'
            })
                .select('name')
                .limit(limit)
                .lean();

            return tools.map(tool => tool.name);
        } catch (error) {
            console.error('[SearchService] Suggestions error:', error);
            return [];
        }
    }

    /**
     * Find related tools based on categories and problems_solved
     */
    static async findRelatedTools(
        toolId: string,
        categories: string[],
        problemsSolved: string[],
        limit: number = 5
    ): Promise<LeanToolDocument[]> {
        try {
            const tools = await Tool.find({
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
        } catch (error) {
            console.error('[SearchService] Related tools error:', error);
            return [];
        }
    }
}
