/**
 * Dynamic Sitemap Generator
 * Auto-generates URLs for all static and dynamic pages
 */

import { MetadataRoute } from 'next';

const SITE_URL = 'https://decidrai-frontend.onrender.com';

// Static pages with their priorities and change frequencies
const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/tools', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/discover', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/compare', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/categories', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/search', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.5, changeFrequency: 'monthly' as const },
];

/**
 * Fetch all published tools from the API
 */
async function getTools(): Promise<{ slug: string; updatedAt?: string }[]> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
        const response = await fetch(`${apiUrl}/tools?limit=1000&status=published`, {
            next: { revalidate: 3600 }, // Revalidate every hour
        });

        if (!response.ok) return [];

        const data = await response.json();
        const tools = data?.data?.tools || [];

        return tools.map((tool: { slug: string; updatedAt?: string }) => ({
            slug: tool.slug,
            updatedAt: tool.updatedAt,
        }));
    } catch (error) {
        console.error('Sitemap: Failed to fetch tools:', error);
        return [];
    }
}

/**
 * Fetch all published flows from the API
 */
async function getFlows(): Promise<{ slug: string; updatedAt?: string }[]> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
        const response = await fetch(`${apiUrl}/flows?limit=1000&status=published`, {
            next: { revalidate: 3600 }, // Revalidate every hour
        });

        if (!response.ok) return [];

        const data = await response.json();
        const flows = data?.data?.flows || [];

        return flows.map((flow: { slug: string; updatedAt?: string }) => ({
            slug: flow.slug,
            updatedAt: flow.updatedAt,
        }));
    } catch (error) {
        console.error('Sitemap: Failed to fetch flows:', error);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const currentDate = new Date();

    // Static pages
    const staticUrls: MetadataRoute.Sitemap = staticPages.map((page) => ({
        url: `${SITE_URL}${page.path}`,
        lastModified: currentDate,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
    }));

    // Dynamic tool pages
    const tools = await getTools();
    const toolUrls: MetadataRoute.Sitemap = tools.map((tool) => ({
        url: `${SITE_URL}/tools/${tool.slug}`,
        lastModified: tool.updatedAt ? new Date(tool.updatedAt) : currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Dynamic flow pages
    const flows = await getFlows();
    const flowUrls: MetadataRoute.Sitemap = flows.map((flow) => ({
        url: `${SITE_URL}/discover/${flow.slug}`,
        lastModified: flow.updatedAt ? new Date(flow.updatedAt) : currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...staticUrls, ...toolUrls, ...flowUrls];
}
