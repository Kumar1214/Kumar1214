import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LineChart,
    Line
} from 'recharts';

const TrendingChart = ({ data, type = 'bar', dataKey = 'views', nameKey = 'title', color = '#4f46e5' }) => {
    if (!data || data.length === 0) return (
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg text-gray-400">
            No trending data available
        </div>
    );

    const ChartComponent = type === 'line' ? LineChart : BarChart;

    return (
        <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <ChartComponent data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis
                        dataKey={nameKey}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            fontSize: '12px'
                        }}
                    />
                    {type === 'line' ? (
                        <Line
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={3}
                            dot={{ fill: color, strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    ) : (
                        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} barSize={40}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={color} fillOpacity={1 - (index * 0.08)} />
                            ))}
                        </Bar>
                    )}
                </ChartComponent>
            </ResponsiveContainer>
        </div>
    );
};

export default TrendingChart;
