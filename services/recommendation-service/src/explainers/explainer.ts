import { GoogleGenerativeAI } from '@google/generative-ai';
import { Tool, ScoredTool } from '../matchers/tagMatcher';

// Initialize Gemini (only if API key is available)
const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

/**
 * Explanation structure for a recommendation
 */
export interface Explanation {
    whyRecommended: string;
    bestFor: string;
    whenNotToUse: string;
}

/**
 * Generate template-based explanation (fallback when no AI)
 */
export function generateTemplateExplanation(
    tool: Tool,
    userTags: string[],
    matchedTags: string[],
    score: number
): Explanation {
    const matchedCategories = matchedTags.slice(0, 3).join(', ');
    const pricingText = tool.pricing.model === 'free'
        ? 'completely free'
        : tool.pricing.model === 'freemium'
            ? 'free to start with premium options'
            : `starting at $${tool.pricing.starting_price || 0}/month`;

    const whyRecommended = `${tool.name} matches your needs in ${matchedCategories}. It's ${pricingText} and has a ${tool.learning_curve} learning curve.`;

    const bestFor = tool.best_for?.[0]
        ? `This tool is particularly great for ${tool.best_for.slice(0, 2).join(' and ')}.`
        : `This tool is well-suited for users looking for ${matchedCategories}.`;

    const whenNotToUse = tool.not_good_for?.[0]
        ? `Consider alternatives if you ${tool.not_good_for[0].toLowerCase()}.`
        : tool.learning_curve === 'high'
            ? 'May not be ideal if you prefer simple, no-learning-curve solutions.'
            : 'Works well for most use cases.';

    return { whyRecommended, bestFor, whenNotToUse };
}

/**
 * Generate AI-powered explanation using Google Gemini
 */
export async function generateAIExplanation(
    tool: Tool,
    userTags: string[],
    matchedTags: string[],
    score: number
): Promise<Explanation> {
    // Fallback to template if no API key
    if (!genAI) {
        console.log('[Explainer] No Gemini API key, using template explanation');
        return generateTemplateExplanation(tool, userTags, matchedTags, score);
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are an AI tool recommendation expert. Generate a brief, personalized explanation for why a user should consider this tool.

USER'S NEEDS (extracted from their answers): ${userTags.join(', ')}

TOOL INFORMATION:
- Name: ${tool.name}
- Description: ${tool.description}
- Categories: ${tool.categories.join(', ')}
- Pricing: ${tool.pricing.model}${tool.pricing.starting_price ? ` ($${tool.pricing.starting_price}/mo)` : ''}
- Learning Curve: ${tool.learning_curve}
- Best For: ${tool.best_for?.join(', ') || 'General use'}
- Not Good For: ${tool.not_good_for?.join(', ') || 'N/A'}
- Match Score: ${score}/100
- Matched Tags: ${matchedTags.join(', ')}

Generate a JSON response with exactly these three fields:
1. whyRecommended: 1-2 sentences explaining why this tool matches their specific needs (personalized)
2. bestFor: 1 sentence about when/who this tool works best for
3. whenNotToUse: 1 sentence about when to consider alternatives

Keep each response concise and actionable. Respond ONLY with valid JSON, no markdown.`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Parse the JSON response
        const cleanedResponse = response
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        const parsed = JSON.parse(cleanedResponse);

        return {
            whyRecommended: parsed.whyRecommended || 'This tool matches your requirements.',
            bestFor: parsed.bestFor || 'Works well for your use case.',
            whenNotToUse: parsed.whenNotToUse || 'Generally applicable.'
        };
    } catch (error) {
        console.error('[Explainer] Gemini API error, falling back to template:', error);
        return generateTemplateExplanation(tool, userTags, matchedTags, score);
    }
}

/**
 * Generate explanations for multiple tools
 */
export async function generateExplanations(
    scoredTools: ScoredTool[],
    userTags: string[],
    useAI: boolean = true
): Promise<Map<string, Explanation>> {
    const explanations = new Map<string, Explanation>();

    // Generate explanations concurrently for better performance
    const promises = scoredTools.map(async ({ tool, score, matchedTags }) => {
        const explanation = useAI && genAI
            ? await generateAIExplanation(tool, userTags, matchedTags, score)
            : generateTemplateExplanation(tool, userTags, matchedTags, score);

        explanations.set(tool._id, explanation);
    });

    await Promise.all(promises);
    return explanations;
}
