import { createContext, useContext, useState, useEffect } from 'react';
import { pluginService } from '../services/api';

const PluginContext = createContext();

export const usePlugins = () => useContext(PluginContext);

export const PluginProvider = ({ children }) => {
    const [plugins, setPlugins] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPlugins = async () => {
        try {
            const { data } = await pluginService.getAll();
            if (data.success) {
                setPlugins(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch plugins:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlugins();
    }, []);

    const isPluginActive = (slug) => {
        const plugin = plugins.find(p => p.slug === slug);
        return plugin ? plugin.active : false;
    };

    const togglePlugin = async (slug, isActive) => {
        try {
            const { data } = await pluginService.toggle(slug, isActive);
            if (data.success) {
                // Update local state immediately for UI responsiveness
                setPlugins(prev => prev.map(p =>
                    p.slug === slug ? { ...p, active: isActive } : p
                ));
                // Optional: Trigger full refresh if deep changes needed
                // fetchPlugins(); 
                return true;
            }
        } catch (error) {
            console.error('Failed to toggle plugin:', error);
            return false;
        }
    };

    const value = {
        plugins,
        loading,
        isPluginActive,
        togglePlugin,
        refreshPlugins: fetchPlugins
    };

    return (
        <PluginContext.Provider value={value}>
            {children}
        </PluginContext.Provider>
    );
};
