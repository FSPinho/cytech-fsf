const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");

const LOG_PATH =  path.join(path.resolve(__dirname), `../../errors/`)
const LOG_FILE = () => path.join(LOG_PATH, `screenshot-${new Date().toISOString()}`)

module.exports = {
    saveErrorLog: async (error, page) => {

        if (page) {
            mkdirp.sync(LOG_PATH);
            const _file = LOG_FILE();
            await page.screenshot({ path: `${_file}.png` });
            fs.writeFileSync(`${_file}.error`, String(error));
        }

        await fs.appendFile("errors.log", new Date().toISOString() + " - " + String(error.stack) + "\n\n", error => {
            if (error) {
                console.warn(`Can't save error log!`);
            }
        });
    }
}
