import React from 'react';

const AnalyticsCard = ({ title, value, icon: Icon, trend, trendValue, color = "indigo" }) => {
    const colorClasses = {
        indigo: "bg-indigo-50 text-indigo-600",
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600",
        red: "bg-red-50 text-red-600"
    };

    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-lg ${colorClasses[color] || colorClasses.indigo}`}>
                    {Icon && <Icon size={22} />}
                </div>
                {trend && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                        {trend === 'up' ? '↑' : '↓'} {trendValue}%
                    </span>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
        </div>
    );
};

export default AnalyticsCard;
