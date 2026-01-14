const fs = require('fs');
const path = require('path');
const express = require('express');

class PluginManager {
    constructor(app, sequelize) {
        this.app = app;
        this.sequelize = sequelize;
        this.pluginsPath = path.join(__dirname, '../../plugins');
        this.activePlugins = new Map();
        this.routes = express.Router();
    }

    /**
     * Initialize all plugins
     */
    async initialize() {
        console.error('[Plugins] Initializing Plugin System...');
        console.error('[Plugins] Scanning path:', this.pluginsPath);

        if (!fs.existsSync(this.pluginsPath)) {
            console.error('[Plugins] No plugins directory found, creating...');
            fs.mkdirSync(this.pluginsPath, { recursive: true });
        }

        const pluginFolders = fs.readdirSync(this.pluginsPath);
        console.error('[Plugins] Found folders:', pluginFolders);

        for (const folder of pluginFolders) {
            await this.loadPlugin(folder);
        }

        console.error(`[Plugins] Initialization complete. Loaded ${this.activePlugins.size} plugins.`);
        return this.routes;
    }

    /**
     * Load a single plugin
     */
    async loadPlugin(folderName) {
        const pluginPath = path.join(this.pluginsPath, folderName);
        const manifestPath = path.join(pluginPath, 'manifest.json');

        if (!fs.existsSync(manifestPath)) {
            console.warn(`[Plugins] Skipped ${folderName}: No manifest.json found.`);
            return;
        }

        try {
            const manifest = require(manifestPath);

            if (!manifest.active) {
                console.error(`[Plugins] Skipped ${manifest.name}: Inactive.`);
                return;
            }

            console.error(`[Plugins] Loading ${manifest.name} v${manifest.version}...`);

            // 1. Load Models (if any)
            // Implementation note: Models might need dynamic registration with Sequelize
            // For MVP, we presume models are loaded via standard require if needed, 
            // or we add a 'models' folder scan here later.

            // 2. Load Routes
            const routesPath = path.join(pluginPath, 'routes.js');
            if (fs.existsSync(routesPath)) {
                const pluginRoutes = require(routesPath);
                // Mount routes under /api/plugins/{plugin-slug} or custom path
                const mountPath = manifest.mountPath || `/plugins/${manifest.slug}`;
                this.routes.use(mountPath, pluginRoutes);
                // console.log changes might not show in log file, but let's try
                // The issue might be that this.routes is not returning anything
                console.error(`[Plugins] Mounted ${manifest.name} at ${mountPath}`);
            }

            // 3. Run Init Script
            const initPath = path.join(pluginPath, 'init.js');
            if (fs.existsSync(initPath)) {
                const initPlugin = require(initPath);
                if (typeof initPlugin === 'function') {
                    await initPlugin(this.app, this.sequelize);
                    console.error(`  > Init script executed.`);
                }
            }

            this.activePlugins.set(manifest.slug, manifest);
            console.error(`[Plugins] ${manifest.name} loaded successfully.`);

        } catch (error) {
            console.error(`[Plugins] Failed to load ${folderName}:`, error);
        }
    }

    /**
     * Get list of active plugins for config/frontend
     */
    getActivePlugins() {
        return Array.from(this.activePlugins.values()).map(p => ({
            name: p.name,
            slug: p.slug,
            version: p.version,
            description: p.description,
            mountPath: p.mountPath,
            author: p.author || 'Unknown',
            active: p.active
        }));
    }

    /**
     * Get all detected plugins (active and inactive)
     */
    getAllPlugins() {
        const plugins = [];
        const pluginFolders = fs.readdirSync(this.pluginsPath);

        for (const folder of pluginFolders) {
            try {
                const manifestPath = path.join(this.pluginsPath, folder, 'manifest.json');
                if (fs.existsSync(manifestPath)) {
                    // Use standard require but clear cache to ensure fresh read if toggled
                    delete require.cache[require.resolve(manifestPath)];
                    const manifest = require(manifestPath);
                    plugins.push({
                        ...manifest,
                        folderName: folder
                    });
                }
            } catch (err) {
                console.error(`[Plugins] Error reading ${folder}:`, err.message);
            }
        }
        return plugins;
    }

    /**
     * Toggle plugin status
     */
    async togglePlugin(slug, isActive) {
        console.error(`[Plugins] Toggling ${slug} to ${isActive}`);

        // Find plugin folder
        const allPlugins = this.getAllPlugins();
        const plugin = allPlugins.find(p => p.slug === slug);

        if (!plugin) {
            throw new Error('Plugin not found');
        }

        const manifestPath = path.join(this.pluginsPath, plugin.folderName, 'manifest.json');

        // Update manifest
        const manifest = require(manifestPath);
        manifest.active = isActive;

        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

        // Update memory status (simple version: just reboot required for full effect, 
        // but let's update memory so UI reflects it immediately)
        if (isActive) {
            this.activePlugins.set(slug, manifest);
        } else {
            this.activePlugins.delete(slug);
        }

        return manifest;
    }
}

module.exports = PluginManager;
