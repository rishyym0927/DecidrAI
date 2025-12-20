/**
 * Robots.txt Generator
 * Controls which routes search engines can crawl
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const siteUrl = 'https://decidrai-frontend.onrender.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',      // Admin routes
                    '/admin',
                    '/api/',        // API routes
                    '/profile/',    // User profile (requires auth)
                    '/profile',
                    '/_next/',      // Next.js internals
                    '/private/',    // Any private routes
                ],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
