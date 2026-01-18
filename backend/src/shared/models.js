const fs = require('fs');
const path = require('path');
const { sequelize } = require('./config/database');

module.exports = function () {
    console.log('[Models] Loading models...');
    const modulesPath = path.join(__dirname, '../../modules');
    const models = {};

    // Helper to recursively find files
    function findModels(dir) {
        if (!fs.existsSync(dir)) return;

        const files = fs.readdirSync(dir);

        for (const file of files) {
            const fullPath = path.join(dir, file);
            // console.log(`[Models] Visiting: ${fullPath}`);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                findModels(fullPath);
            } else {
                if (file.includes('VendorProfile')) {
                    console.log(`[Models] Found VendorProfile candidate: ${fullPath}`);
                    console.log(`[Models] Checks: .js=${file.endsWith('.js')}, !routes=${!file.includes('.routes.js')}, !controller=${!file.includes('.controller.js')}, !index=${!file.includes('index.js')}, Upper=${file[0] === file[0].toUpperCase()}`);
                }
                if (file.endsWith('.js') &&
                    !file.includes('.routes.js') &&
                    !file.includes('.controller.js') &&
                    !file.includes('index.js') &&
                    !file.includes('Service.js') &&
                    file[0] === file[0].toUpperCase()) { // Heuristic: Models start with Uppercase

                    try {
                        // console.log(`[Models] Requiring: ${file}`);
                        const model = require(fullPath);
                        // Just requiring the file is often enough if it uses sequelize.define
                    } catch (e) {
                        console.error(`[Models] Failed to load ${file}:`, e.message);
                    }
                } else if (file.endsWith('.js')) {
                    // console.log(`[Models] Skipping non-model file: ${file}`);
                }
            }
        }
    }

    findModels(modulesPath);

    // Explicitly load VendorProfile if missed
    try {
        const vpPath = path.join(modulesPath, 'marketplace/VendorProfile.js');
        if (fs.existsSync(vpPath)) require(vpPath);
    } catch (e) { console.error('Failed manual VP load', e); }

    console.log(`[Models] Models registered in Sequelize: ${Object.keys(sequelize.models).join(', ')}`);

    // Setup associations if any
    Object.keys(sequelize.models).forEach(modelName => {
        if (sequelize.models[modelName].associate) {
            sequelize.models[modelName].associate(sequelize.models);
        }
    });

    console.log(`[Models] Loaded ${Object.keys(sequelize.models).length} models.`);
    return sequelize.models; // Return the models
};
