import React from 'react';
import { usePlugins } from '../../context/PluginContext';
import { FiPackage, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function PluginsSettings() {
    const { plugins, loading, togglePlugin } = usePlugins();

    const handleToggle = async (slug, currentStatus) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? 'disable' : 'enable'} this plugin?`)) return;
        await togglePlugin(slug, !currentStatus);
    };

    if (loading) {
        return <div className="p-6">Loading plugins...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Addons & Plugins</h1>
                <p className="text-gray-600">Manage installed modules and extensions.</p>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="col-span-full">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                        <FiAlertCircle className="text-amber-500 mt-0.5" size={20} />
                        <div>
                            <h4 className="font-bold text-amber-800 text-sm">Server Restart Required</h4>
                            <p className="text-xs text-amber-700 mt-1">
                                Toggling plugins on/off requires a manual server restart to take effect.
                                Changes will be saved to the manifest, but routes need a reboot to reload.
                            </p>
                        </div>
                    </div>
                </div>
                {plugins.map((plugin) => (
                    <div key={plugin.slug} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <FiPackage size={24} className="text-gray-400" />
                                <button
                                    onClick={() => handleToggle(plugin.slug, plugin.active)}
                                    className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 transition-colors ${plugin.active
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        }`}
                                >
                                    {plugin.active ? (
                                        <><FiCheckCircle size={12} /> Active</>
                                    ) : (
                                        <><FiAlertCircle size={12} /> Inactive</>
                                    )}
                                </button>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{plugin.name}</h3>
                            <p className="text-sm text-gray-500 mb-1">v{plugin.version}</p>
                            {plugin.author && (
                                <p className="text-xs text-gray-400 mb-4 font-medium uppercase tracking-wider">{plugin.author}</p>
                            )}
                            <p className="text-gray-600 text-sm">{plugin.description}</p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <div className="text-xs text-mono bg-gray-50 p-2 rounded text-gray-500">
                                Mount: {plugin.mountPath}
                            </div>
                        </div>
                    </div>
                ))}

                {plugins.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                        <FiAlertCircle className="mx-auto text-gray-400 mb-3" size={32} />
                        <p className="text-gray-500">No active plugins found.</p>
                    </div>
                )}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h4 className="font-bold text-blue-800 text-sm mb-1">Architecture Note</h4>
                <p className="text-xs text-blue-600">
                    Plugins are loaded dynamically from the backend. To install a new plugin, upload it to the server's <code>backend/src/plugins</code> directory and restart.
                </p>
            </div>
        </div>
    );
}
