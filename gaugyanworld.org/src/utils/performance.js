import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';
import api from './api';

/**
 * Web Vitals tracking and reporting
 */

// Store metrics
const metrics = {
    CLS: null, // Cumulative Layout Shift
    FID: null, // First Input Delay
    FCP: null, // First Contentful Paint
    LCP: null, // Largest Contentful Paint
    TTFB: null, // Time to First Byte
};

/**
 * Report metric to analytics service
 * @param {Object} metric - Web Vitals metric object
 */
const reportMetric = (metric) => {
    metrics[metric.name] = metric.value;

    console.log(`📊 ${metric.name}:`, metric.value, metric.rating);

    // Send to analytics service (Google Analytics, custom backend, etc.)
    if (window.gtag) {
        window.gtag('event', metric.name, {
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            event_category: 'Web Vitals',
            event_label: metric.id,
            non_interaction: true,
        });
    }

    // Send to custom backend
    api.post('/analytics/web-vitals', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        timestamp: Date.now(),
        url: window.location.href,
    }).catch((error) => console.error('Failed to send web vitals:', error));
};

/**
 * Initialize Web Vitals tracking
 */
export const initPerformanceMonitoring = () => {
    onCLS(reportMetric);
    onFID(reportMetric);
    onFCP(reportMetric);
    onLCP(reportMetric);
    onTTFB(reportMetric);
};

/**
 * Get current metrics
 * @returns {Object} - Current Web Vitals metrics
 */
export const getMetrics = () => metrics;

/**
 * Custom performance mark
 * @param {string} name - Mark name
 */
export const performanceMark = (name) => {
    if (performance.mark) {
        performance.mark(name);
    }
};

/**
 * Measure performance between two marks
 * @param {string} name - Measure name
 * @param {string} startMark - Start mark name
 * @param {string} endMark - End mark name
 * @returns {number} - Duration in milliseconds
 */
export const performanceMeasure = (name, startMark, endMark) => {
    if (performance.measure) {
        try {
            performance.measure(name, startMark, endMark);
            const measure = performance.getEntriesByName(name)[0];
            console.log(`⏱️ ${name}:`, measure.duration.toFixed(2), 'ms');
            return measure.duration;
        } catch (error) {
            console.error('Performance measure error:', error);
            return 0;
        }
    }
    return 0;
};

/**
 * Log page load performance
 */
export const logPageLoadPerformance = () => {
    if (performance.timing) {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
        const renderTime = timing.domComplete - timing.domLoading;

        console.log('📈 Page Load Performance:');
        console.log(`  Total Load Time: ${loadTime}ms`);
        console.log(`  DOM Ready Time: ${domReadyTime}ms`);
        console.log(`  Render Time: ${renderTime}ms`);
    }
};

/**
 * Performance budget checker
 */
export const PERFORMANCE_BUDGETS = {
    LCP: 2500, // 2.5 seconds
    FID: 100, // 100 milliseconds
    CLS: 0.1, // 0.1
    FCP: 1800, // 1.8 seconds
    TTFB: 600, // 600 milliseconds
};

/**
 * Check if metrics meet performance budgets
 * @returns {Object} - Budget compliance report
 */
export const checkPerformanceBudgets = () => {
    const report = {};

    Object.keys(PERFORMANCE_BUDGETS).forEach((metric) => {
        const value = metrics[metric];
        const budget = PERFORMANCE_BUDGETS[metric];

        if (value !== null) {
            const withinBudget = value <= budget;
            report[metric] = {
                value,
                budget,
                withinBudget,
                percentage: ((value / budget) * 100).toFixed(1),
            };
        }
    });

    return report;
};
