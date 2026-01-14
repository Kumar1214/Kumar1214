const fs = require('fs');
const path = require('path');

const loadModels = () => {
    const modulesPath = path.join(__dirname, '../../modules');

    // Helper to recursively find and require model files
    // Heuristic: Files starting with Capital letter in modules subfolders, excluding routes/controllers
    const walkSync = (dir, filelist = []) => {
        const files = fs.readdirSync(dir);
        files.forEach((file) => {
            const filepath = path.join(dir, file);
            if (fs.statSync(filepath).isDirectory()) {
                filelist = walkSync(filepath, filelist);
            } else {
                // Check if file is a potential model (Capitalized .js file, not a route/controller)
                if (file.endsWith('.js') &&
                    /^[A-Z]/.test(file) &&
                    !file.includes('.routes') &&
                    !file.includes('.controller')) {
                    filelist.push(filepath);
                }
            }
        });
        return filelist;
    };

    const modelFiles = walkSync(modulesPath);

    console.log(`[Models] Loading ${modelFiles.length} models...`);

    modelFiles.forEach(file => {
        try {
            require(file);
            // console.log(`[Models] Loaded: ${path.basename(file)}`);
        } catch (error) {
            console.error(`[Models] Failed to load ${path.basename(file)}:`, error.message);
        }
    });

    console.log('[Models] All models registered.');
};

module.exports = loadModels;
