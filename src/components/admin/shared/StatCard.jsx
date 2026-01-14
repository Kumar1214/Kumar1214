import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'indigo', trend }) => {
    const colorClasses = {
        indigo: 'bg-indigo-50 text-indigo-600',
        green: 'bg-green-50 text-green-600',
        blue: 'bg-blue-50 text-blue-600',
        orange: 'bg-orange-50 text-orange-600',
        purple: 'bg-purple-50 text-purple-600',
        red: 'bg-red-50 text-red-600',
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-800 font-poppins">{value}</h3>
                    {trend && (
                        <p className={`text-xs font-medium mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
                            <span>{trend > 0 ? '+' : ''}{trend}%</span>
                            <span className="text-gray-400 font-normal">from last month</span>
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
