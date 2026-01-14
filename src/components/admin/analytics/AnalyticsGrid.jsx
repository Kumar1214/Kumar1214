import React from 'react';
import AnalyticsCard from './AnalyticsCard';

const AnalyticsGrid = ({ metrics }) => {
    if (!metrics || metrics.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {metrics.map((metric, index) => (
                <AnalyticsCard
                    key={index}
                    title={metric.title}
                    value={metric.value}
                    icon={metric.icon}
                    trend={metric.trend}
                    trendValue={metric.trendValue}
                    color={metric.color}
                />
            ))}
        </div>
    );
};

export default AnalyticsGrid;
