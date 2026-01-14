import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color }) => {
    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #E5E7EB',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: 500, marginBottom: '4px' }}>{title}</div>
                    <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#111827' }}>{value}</div>
                </div>
                <div style={{
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: `${color}15`, // 15% opacity
                    color: color
                }}>
                    <Icon size={24} />
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: trend === 'up' ? '#10B981' : '#EF4444',
                    fontWeight: 600
                }}>
                    {trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    {trendValue}
                </span>
                <span style={{ color: '#9CA3AF' }}>vs last month</span>
            </div>
        </div>
    );
};

export default StatsCard;
