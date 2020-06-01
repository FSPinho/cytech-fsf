const fs = require("fs");

module.exports = {
    get: async () => {
        if (!fs.existsSync("data.json")) {
            fs.writeFileSync("data.json", "{}");
        }
        return JSON.parse(String(fs.readFileSync("data.json", {encoding: "UTF-8"})));
    },
    save: async (data) => {
        return fs.writeFileSync("data.json", JSON.stringify(data, null, 4), {encoding: "UTF-8"});
    }
}
