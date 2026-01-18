import React from 'react';
import { AlertCircle, TrendingUp, Clock, Truck } from 'lucide-react';

const AlertSection = ({ alerts = [] }) => {
    if (!alerts.length) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'urgent': return <AlertCircle className="text-red-500" size={18} />;
            case 'trend': return <TrendingUp className="text-emerald-500" size={18} />;
            case 'shipping': return <Truck className="text-blue-500" size={18} />;
            case 'time': return <Clock className="text-amber-500" size={18} />;
            default: return <AlertCircle className="text-gray-500" size={18} />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'urgent': return 'bg-red-500/10 border-red-500/20';
            case 'trend': return 'bg-emerald-500/10 border-emerald-500/20';
            case 'shipping': return 'bg-blue-500/10 border-blue-500/20';
            case 'time': return 'bg-amber-500/10 border-amber-500/20';
            default: return 'bg-gray-800 border-gray-700';
        }
    };

    return (
        <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Action Required
            </h3>
            <div className="grid gap-3">
                {alerts.map((alert, index) => (
                    <div
                        key={`${alert.title}-${index}`}
                        className={`flex items-start gap-4 p-4 rounded-xl border transition-all hover:translate-x-1 ${getBgColor(alert.type)}`}
                    >
                        <div className="mt-0.5 bg-gray-900/50 p-2 rounded-full">
                            {getIcon(alert.type)}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-white mb-1">{alert.title}</h4>
                            <p className="text-xs text-gray-400">{alert.message}</p>
                            {alert.action && (
                                <button className="mt-2 text-xs font-semibold text-white bg-gray-900/50 px-3 py-1.5 rounded hover:bg-gray-900 transition-colors">
                                    {alert.action}
                                </button>
                            )}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                            {alert.time}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlertSection;
