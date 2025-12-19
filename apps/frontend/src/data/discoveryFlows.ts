/**
 * Discovery Flows
 * Static data for guided discovery flow cards on homepage
 */

export interface DiscoveryFlow {
    id: number;
    title: string;
    description: string;
    icon: string;
    questions: number;
    timeEstimate: string;
}

export const discoveryFlows: DiscoveryFlow[] = [
    {
        id: 1,
        title: "Content Creation",
        description: "Find the perfect AI for writing, editing, and content strategy",
        icon: "📝",
        questions: 5,
        timeEstimate: "2 min",
    },
    {
        id: 2,
        title: "Design & Visual",
        description: "Discover AI tools for image generation, editing, and design",
        icon: "🎨",
        questions: 4,
        timeEstimate: "2 min",
    },
    {
        id: 3,
        title: "Code & Development",
        description: "Find AI assistants for coding, debugging, and automation",
        icon: "🚀",
        questions: 5,
        timeEstimate: "3 min",
    },
    {
        id: 4,
        title: "Research & Analysis",
        description: "Get recommendations for data analysis and research tools",
        icon: "📊",
        questions: 4,
        timeEstimate: "2 min",
    },
];
