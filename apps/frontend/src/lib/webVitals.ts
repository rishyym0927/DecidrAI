/**
 * Web Vitals Instrumentation
 * Reports Core Web Vitals metrics
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

type MetricHandler = (metric: { name: string; value: number; id: string }) => void;

const reportMetric: MetricHandler = (metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Web Vitals] ${metric.name}:`, metric.value.toFixed(2));
    }

    // You can extend this to send to analytics service
    // Example: Send to Google Analytics
    // gtag('event', metric.name, {
    //   event_category: 'Web Vitals',
    //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    //   event_label: metric.id,
    //   non_interaction: true,
    // });
};

export function reportWebVitals() {
    onCLS(reportMetric);  // Cumulative Layout Shift
    onFCP(reportMetric);  // First Contentful Paint
    onINP(reportMetric);  // Interaction to Next Paint (replaced FID)
    onLCP(reportMetric);  // Largest Contentful Paint
    onTTFB(reportMetric); // Time to First Byte
}
