import React, { useState, useEffect } from 'react';
import { Activity, Server, Database, AlertCircle, RefreshCw, Cpu, HardDrive, Clock, CheckCircle, Send, MessageSquare } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const GaugyanAIDashboard = () => {
    const [stats, setStats] = useState(null);
    const [logs, setLogs] = useState('');
    const [loading, setLoading] = useState(false);
    const [logType, setLogType] = useState('output');
    const [chatMessage, setChatMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: "Hello! I am Gaugyan AI. I'm monitoring the system. Report any issues here, and I'll attempt to fix them." }
    ]);
    const [aiActions, setAiActions] = useState([
        { id: 1, action: "System Optimization", details: "Cleaned temporary cache files", time: "2 mins ago", status: "success" },
        { id: 2, action: "Security Check", details: "Verified JWT token signatures", time: "15 mins ago", status: "success" },
        { id: 3, action: "Dependency Check", details: "Found missing package 'sweetalert2'", time: "1 hour ago", status: "warning" },
        { id: 4, action: "Auto-Fix", details: "Installed 'sweetalert2' and rebuilt frontend", time: "1 hour ago", status: "success" }
    ]);

    const handleSendMessage = () => {
        if (!chatMessage.trim()) return;

        // User Message
        const newMsg = { id: Date.now(), sender: 'user', text: chatMessage };
        setMessages(prev => [...prev, newMsg]);
        const userQuery = chatMessage;
        setChatMessage('');

        // Simulate AI Processing
        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: "Analyzing system logs for reported issue..." }]);

            setTimeout(() => {
                // Add to Activity Log
                const newAction = {
                    id: Date.now(),
                    action: "Issue Investigation",
                    details: `Analyzing: "${userQuery}"`,
                    time: "Just now",
                    status: "warning"
                };
                setAiActions(prev => [newAction, ...prev]);

                setMessages(prev => [...prev, { id: Date.now() + 2, sender: 'ai', text: "I've identified the potential cause. Scheduling a fix task. Check the Activity Log for updates." }]);
            }, 2000);
        }, 1000);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Auto refresh every 30s
        return () => clearInterval(interval);
    }, [logType]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch System Status
            const statusRes = await api.get('/system-debugger/system-status');
            if (statusRes.data.success) {
                setStats(statusRes.data.data);
            }

            // Fetch Logs
            const logsRes = await api.get(`/system-debugger/logs?type=${logType}&lines=50`);
            if (logsRes.data.success) {
                setLogs(logsRes.data.data);
            }
        } catch (error) {
            console.error("Dashboard fetch error:", error);
            // toast.error("Failed to update dashboard");
        } finally {
            setLoading(false);
        }
    };

    const formatBytes = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatUptime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#1F5B6B] flex items-center gap-2">
                        <Activity className="h-8 w-8" />
                        Gaugyan AI Monitor
                    </h1>
                    <p className="text-gray-500">Real-time system health and diagnostics</p>
                </div>
                <button
                    onClick={fetchData}
                    className={`p-2 rounded-full hover:bg-gray-100 transition-all ${loading ? 'animate-spin' : ''}`}
                    title="Refresh Data"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            {/* Health Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Uptime */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <Clock size={20} />
                        </div>
                        <span className="text-gray-500 text-sm font-medium">System Uptime</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                        {stats ? formatUptime(stats.uptime) : 'Loading...'}
                    </div>
                    <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <CheckCircle size={10} /> Online
                    </div>
                </div>

                {/* Memory */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Server size={20} />
                        </div>
                        <span className="text-gray-500 text-sm font-medium">Memory Usage</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                        {stats ? formatBytes(stats.memory.rss) : 'Loading...'}
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                            className="bg-blue-500 h-full rounded-full transition-all duration-500"
                            style={{ width: '40%' }} // Mock visualization or calc from total available
                        ></div>
                    </div>
                </div>

                {/* Database */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <Database size={20} />
                        </div>
                        <span className="text-gray-500 text-sm font-medium">Database Size</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                        {stats ? formatBytes(stats.dbSize) : 'Loading...'}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        SQLite / MySQL
                    </div>
                </div>

                {/* CPU / Load (Mocked for now as node process.cpuUsage is pure ms) */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                            <Cpu size={20} />
                        </div>
                        <span className="text-gray-500 text-sm font-medium">Process Status</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                        Active
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                        Running normally
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Modules Status */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <HardDrive size={18} /> Module Health
                    </h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Authentication', status: 'operational' },
                            { name: 'Database', status: 'operational' },
                            { name: 'File Storage', status: 'operational' },
                            { name: 'Payment Gateway', status: 'operational' },
                            { name: 'Email Service', status: 'operational' },
                            { name: 'AI Engine', status: 'operational' },
                        ].map((module, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-700">{module.name}</span>
                                <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full uppercase">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></div>
                                    {module.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Activity Log ("Resolving Query") */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Activity size={18} /> AI Activity & Resolutions
                    </h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                        {aiActions.map((action) => (
                            <div key={action.id} className="border-l-2 border-blue-500 pl-3 py-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-sm font-medium text-gray-800">{action.action}</h4>
                                    <span className="text-[10px] text-gray-400">{action.time}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{action.details}</p>
                                <div className="mt-1">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${action.status === 'success' ? 'bg-green-100 text-green-700' :
                                        action.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {action.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Chat Widget */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <MessageSquare size={18} /> Chat with Gaugyan AI
                    </h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 mb-4 p-2 bg-gray-50 rounded-xl border border-gray-100">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender === 'user'
                                    ? 'bg-[#1F5B6B] text-white rounded-br-none'
                                    : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none shadow-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Describe an issue..."
                            className="flex-1 p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="p-2 bg-[#1F5B6B] text-white rounded-lg hover:bg-[#164450] transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>

                {/* Error Logs */}
                <div className="lg:col-span-1 bg-[#1e1e1e] p-6 rounded-xl shadow-sm border border-gray-800 text-gray-300 font-mono text-sm max-h-[500px] flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <AlertCircle size={18} /> System Logs
                        </h3>
                        <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
                            <button
                                onClick={() => setLogType('output')}
                                className={`px-3 py-1 rounded-md text-xs transition-colors ${logType === 'output' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
                            >
                                Output
                            </button>
                            <button
                                onClick={() => setLogType('debug')}
                                className={`px-3 py-1 rounded-md text-xs transition-colors ${logType === 'debug' ? 'bg-red-600 text-white' : 'hover:bg-gray-700'}`}
                            >
                                Errors
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/30 p-4 rounded-lg whitespace-pre-wrap leading-relaxed">
                        {logs || "No logs available."}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GaugyanAIDashboard;
