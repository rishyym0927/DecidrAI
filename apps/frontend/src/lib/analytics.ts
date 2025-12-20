/**
 * Analytics Utilities
 * Google Analytics event tracking and custom events
 */

// Declare gtag for TypeScript
declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        dataLayer?: any[];
    }
}

/**
 * Track a page view
 */
export function trackPageView(url: string) {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
            page_path: url,
        });
    }
}

/**
 * Track a custom event
 */
export function trackEvent(
    action: string,
    category: string,
    label?: string,
    value?: number
) {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
}

// Pre-defined analytics events for the app
export const analytics = {
    // Tool events
    toolViewed: (toolSlug: string, toolName: string) => {
        trackEvent('view_tool', 'Tools', toolName);
    },
    toolClicked: (toolSlug: string, source: string) => {
        trackEvent('click_tool', 'Tools', `${toolSlug} from ${source}`);
    },
    toolCompared: (toolSlugs: string[]) => {
        trackEvent('compare_tools', 'Comparison', toolSlugs.join(' vs '));
    },

    // Flow events
    flowStarted: (flowSlug: string) => {
        trackEvent('start_flow', 'Discovery', flowSlug);
    },
    flowCompleted: (flowSlug: string, sessionId: string) => {
        trackEvent('complete_flow', 'Discovery', flowSlug);
    },
    flowAbandoned: (flowSlug: string, questionNumber: number) => {
        trackEvent('abandon_flow', 'Discovery', `${flowSlug} at Q${questionNumber}`);
    },

    // Search events
    searchPerformed: (query: string, resultCount: number) => {
        trackEvent('search', 'Search', query, resultCount);
    },

    // Category events
    categoryViewed: (categorySlug: string) => {
        trackEvent('view_category', 'Categories', categorySlug);
    },

    // User events
    signUpClicked: (source: string) => {
        trackEvent('signup_click', 'Auth', source);
    },
    signInClicked: (source: string) => {
        trackEvent('signin_click', 'Auth', source);
    },

    // External link clicks
    externalLinkClicked: (url: string, toolName?: string) => {
        trackEvent('click_external', 'Outbound', toolName || url);
    },
};
