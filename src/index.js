const express = require("express");
const crawler = require("./utils/crawler");
const data = require("./utils/data");

(async () => {

    const app = express();
    const port = 8080;

    app.use(express.static('./src/public'));
    app.get('/data', async (req, res) => {
        const _data = await data.get();
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send(_data);
    });

    app.listen(port, () => console.log(`Listening at http://localhost:${port}`));

    await crawler.start();

})();
