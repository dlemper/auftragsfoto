const path = require('path');
const fs = require('fs').promises;
const { app } = require('electron');

module.exports = {
    async getPath() {
        try {
            const configPath = path.join(app.getPath("userData"), 'config.json');
            const configData = await fs.readFile(configPath);
            const config = JSON.parse(configData);

            return config.uploadDir;
        } catch (e) {
            return app.getPath('documents');
        }
    }
}