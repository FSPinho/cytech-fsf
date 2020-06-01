const fs = require("fs");

module.exports = {
    saveErrorLog: async (error) => {
        await fs.appendFile("errors.log", new Date().toISOString() + " - " + String(error.stack) + "\n\n", error => {
            if (error) {
                console.warn(`Can't save error log!`);
            }
        });
    }
}
