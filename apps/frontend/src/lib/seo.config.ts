/**
 * SEO Configuration
 * Centralized SEO constants and helpers for generating metadata
 */

import { Metadata } from 'next';

// ============================================
// Site Constants
// ============================================

export const SITE_CONFIG = {
    name: 'DecidrAI',
    url: 'https://decidrai-frontend.onrender.com',
    description: 'The Google for AI Decisions — an intelligent, curated discovery platform that helps you choose the right AI tools quickly and confidently.',
    shortDescription: 'Discover the right AI tools for your needs with personalized recommendations.',
    keywords: [
        'AI tools',
        'AI discovery',
        'AI recommendations',
        'AI comparison',
        'productivity tools',
        'automation',
        'machine learning tools',
        'best AI tools',
        'AI tool finder',
    ],
    author: 'DecidrAI',
    twitterHandle: '@decidrai',
    locale: 'en_US',
};

// ============================================
// Default OG Image
// ============================================

export const DEFAULT_OG_IMAGE = {
    url: `${SITE_CONFIG.url}/og-image.png`,
    width: 1200,
    height: 630,
    alt: 'DecidrAI - Discover the Right AI Tools',
    type: 'image/png',
};

// ============================================
// Metadata Helpers
// ============================================

interface PageMetadataOptions {
    title: string;
    description: string;
    path?: string;
    ogImage?: string;
    noIndex?: boolean;
    keywords?: string[];
}

/**
 * Generate metadata for a page
 */
export function generatePageMetadata({
    title,
    description,
    path = '',
    ogImage,
    noIndex = false,
    keywords = [],
}: PageMetadataOptions): Metadata {
    const url = `${SITE_CONFIG.url}${path}`;
    const image = ogImage || DEFAULT_OG_IMAGE.url;

    return {
        title,
        description,
        keywords: [...SITE_CONFIG.keywords, ...keywords],
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: SITE_CONFIG.name,
            locale: SITE_CONFIG.locale,
            type: 'website',
            images: [
                {
                    url: image,
                    width: DEFAULT_OG_IMAGE.width,
                    height: DEFAULT_OG_IMAGE.height,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
            creator: SITE_CONFIG.twitterHandle,
        },
        ...(noIndex && {
            robots: {
                index: false,
                follow: false,
            },
        }),
    };
}

/**
 * Generate metadata for a tool page
 */
export function generateToolMetadata(tool: {
    name: string;
    tagline?: string;
    description?: string;
    slug: string;
    logo_url?: string;
    categories?: string[];
}): Metadata {
    const title = `${tool.name} - AI Tool Review & Alternatives`;
    const description =
        tool.tagline ||
        tool.description?.slice(0, 155) ||
        `Discover ${tool.name}, compare features, pricing, and find the best alternatives.`;

    return generatePageMetadata({
        title,
        description,
        path: `/tools/${tool.slug}`,
        keywords: [tool.name, ...(tool.categories || [])],
    });
}

/**
 * Generate metadata for a flow page
 */
export function generateFlowMetadata(flow: {
    title: string;
    description?: string;
    slug: string;
    category?: string;
}): Metadata {
    const title = `${flow.title} - AI Tool Discovery Flow`;
    const description =
        flow.description?.slice(0, 155) ||
        `Find the perfect AI tools for ${flow.title.toLowerCase()} with our guided discovery flow.`;

    return generatePageMetadata({
        title,
        description,
        path: `/discover/${flow.slug}`,
        keywords: [flow.title, flow.category || ''].filter(Boolean),
    });
}

// ============================================
// JSON-LD Structured Data Generators
// ============================================

/**
 * Generate Organization schema for the site
 */
export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        logo: `${SITE_CONFIG.url}/icon-512.png`,
        description: SITE_CONFIG.description,
        sameAs: [
            `https://twitter.com/${SITE_CONFIG.twitterHandle.replace('@', '')}`,
        ],
    };
}

/**
 * Generate WebSite schema with search action
 */
export function generateWebSiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        description: SITE_CONFIG.description,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };
}

/**
 * Generate SoftwareApplication schema for a tool
 */
export function generateToolSchema(tool: {
    name: string;
    description?: string;
    slug: string;
    logo_url?: string;
    website_url?: string;
    pricing?: {
        model: string;
        starting_price?: number;
    };
    categories?: string[];
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: tool.description,
        url: tool.website_url,
        image: tool.logo_url,
        applicationCategory: tool.categories?.[0] || 'Productivity',
        offers: tool.pricing
            ? {
                '@type': 'Offer',
                price: tool.pricing.starting_price || 0,
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
            }
            : undefined,
    };
}
