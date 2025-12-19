/**
 * AI Tool Categories
 * Static data for homepage category display
 */

export interface Category {
    name: string;
    icon: string;
    count: number;
}

export const categories: Category[] = [
    { name: "Writing", icon: "✍️", count: 45 },
    { name: "Design", icon: "🎨", count: 32 },
    { name: "Coding", icon: "💻", count: 28 },
    { name: "Research", icon: "🔬", count: 19 },
    { name: "Productivity", icon: "⚡", count: 37 },
    { name: "Marketing", icon: "📈", count: 24 },
];
