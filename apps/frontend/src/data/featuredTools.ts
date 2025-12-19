/**
 * Featured Tools
 * Static data for featured tools section on homepage
 */

export interface FeaturedTool {
    id: number;
    name: string;
    tagline: string;
    category: string;
    pricing: string;
    rating: number;
    color: string;
    icon: string;
}

export const featuredTools: FeaturedTool[] = [
    {
        id: 1,
        name: "ChatGPT",
        tagline: "Advanced conversational AI for any task",
        category: "General",
        pricing: "Freemium",
        rating: 4.8,
        color: "#10a37f", // OpenAI green
        icon: "🤖",
    },
    {
        id: 2,
        name: "Midjourney",
        tagline: "Create stunning AI-generated artwork",
        category: "Design",
        pricing: "Paid",
        rating: 4.7,
        color: "#5865f2", // Discord blue (Midjourney's platform)
        icon: "🎨",
    },
    {
        id: 3,
        name: "Claude",
        tagline: "Thoughtful AI assistant by Anthropic",
        category: "General",
        pricing: "Freemium",
        rating: 4.9,
        color: "#d97706", // Anthropic orange
        icon: "🧠",
    },
    {
        id: 4,
        name: "GitHub Copilot",
        tagline: "AI pair programmer for developers",
        category: "Coding",
        pricing: "Paid",
        rating: 4.6,
        color: "#238636", // GitHub green
        icon: "💻",
    },
];
