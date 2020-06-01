const puppeteer = require("puppeteer");
const textUtils = require("../utils/text");
const data = require("../utils/data");
const log = require("../utils/log");

const CONFIGS = {
    MAGALU: require("../config/magalu"),
    AMERICANAS: require("../config/americanas"),
    SUBMARINO: require("../config/submarino"),
};
const DEF_HEADLESS = false;
const DEF_TYPING_DELAY = 40;
const DEF_WAIT_TIMEOUT = 5000;
const DEF_SHIPPING_ZIP = "63902125";
const DEF_MAX_ITEM_AGE = 24 * 3600 * 1000;
const DEF_MAX_PAGES = 1;
const DEF_TERMS = [
    "Nichos",
    "Kit Nicho",
    "Prateleira",
    "Kit Prateleira",
    // "Capsula cafe tres",
    // "Balde retrátil",
    // "Criado mudo",
    // "Bicicleta",
    // "Nicho",
    // "Notebook",
    // "TV",
    // "Smartphone",
    // "Fogão",
    // "Roteador",
    // "Abajur",
    // "Pote",
    // "Balde",
    // "Fone de ouvido sem fio",
    // "Redmi Airdots"
]

module.exports = {
    start: async () => {
        const _browser = await puppeteer.launch({
            headless: DEF_HEADLESS,
            ignoreHTTPSErrors: true,
            defaultViewport: {width: 1280, height: 1080},
        });
        const _pageMain = await _browser.newPage();

        for (let term of DEF_TERMS) {
            console.log(" ----------------------------------");
            console.log(" --- Looking for:", term);

            for (let DEF_CONFIG of [CONFIGS.SUBMARINO, CONFIGS.MAGALU, CONFIGS.AMERICANAS]) {

                console.log(" --- Search URL:", DEF_CONFIG.search.SEARCH_URL(term));

                try {
                    await _pageMain.bringToFront();
                    await _pageMain.goto(DEF_CONFIG.search.SEARCH_URL(term));
                    await _pageMain.waitFor(DEF_CONFIG.search.SEARCH_DONE_TARGET());
                } catch (error) {
                    console.error(`Can't get search!`);
                    await log.saveErrorLog(error);
                    continue;
                }

                let _itemsLinks = [];

                try {
                    _itemsLinks = [..._itemsLinks, ...(await _pageMain.$$eval(DEF_CONFIG.search.SEARCH_ITEMS_TARGET(), _items => _items.map(option => option.href)))];
                    let _pageCount = 1;

                    while (_pageCount < DEF_MAX_PAGES) {
                        try {
                            await _pageMain.click(DEF_CONFIG.search.SEARCH_PAGES_NEXT());
                            await _pageMain.waitFor(DEF_CONFIG.search.SEARCH_PAGES_NEXT_DELAY());
                            await _pageMain.waitFor(DEF_CONFIG.search.SEARCH_DONE_TARGET(), {timeout: DEF_WAIT_TIMEOUT});
                            console.log(" --- Next page");
                            _itemsLinks = [..._itemsLinks, ...(await _pageMain.$$eval(DEF_CONFIG.search.SEARCH_ITEMS_TARGET(), _items => _items.map(option => option.href)))];
                            _pageCount++;
                        } catch (error) {
                            console.log(" --- End of pages!");
                            break;
                        }
                    }
                } catch (error) {
                    console.error(`Can't get links!`);
                    await log.saveErrorLog(error);
                }

                console.log(" --- Links found:", _itemsLinks.length);

                const _pageItem = await _browser.newPage();

                for (let _itemLink_ of _itemsLinks) {
                    const _itemLink = _itemLink_.split("?")[0];
                    const _data = await data.get();

                    if (_data[_itemLink]) {
                        if (+new Date() - _data[_itemLink].timestamp < DEF_MAX_ITEM_AGE) {
                            // console.log(` --- Skipping cached item ${_data[_itemLink].title}`);
                            continue;
                        } else {
                            console.log(` --- Renewing cached item ${_data[_itemLink].title}`);
                        }
                    } else {
                        console.log(` --- Creating item for ${_itemLink}`);
                    }

                    const _itemMetadata = {
                        origin: DEF_CONFIG.KEY(),
                        keywords: term,
                        link: _itemLink,
                        timestamp: +new Date(),
                    };

                    try {

                        await _pageItem.bringToFront();
                        await _pageItem.goto(_itemLink, {timeout: DEF_WAIT_TIMEOUT});

                        const _delay = Math.random() * 1000;
                        console.log(" --- Random delay:", _delay);
                        await _pageItem.waitFor(_delay);

                        await _pageItem.waitFor(DEF_CONFIG.item.ITEM_TITLE(), {timeout: DEF_WAIT_TIMEOUT});
                        _itemMetadata.title = textUtils.clear(await _pageItem.$eval(DEF_CONFIG.item.ITEM_TITLE(), _el => _el.textContent));

                        try {
                            await _pageItem.waitFor(DEF_CONFIG.item.ITEM_COST(), {timeout: DEF_WAIT_TIMEOUT});
                            _itemMetadata.cost = textUtils.clear(await _pageItem.$eval(DEF_CONFIG.item.ITEM_COST(), _el => _el.textContent));
                        } catch (error) {
                            console.log(` --- No cost found!`);
                        }

                        try {
                            await _pageItem.waitFor(DEF_CONFIG.item.ITEM_IMAGE(), {timeout: DEF_WAIT_TIMEOUT});
                            _itemMetadata.image = await _pageItem.$eval(DEF_CONFIG.item.ITEM_IMAGE(), _el => _el.src);
                        } catch (error) {
                            console.log(` --- No image found!`);
                        }

                        try {
                            await _pageItem.waitFor(DEF_CONFIG.item.ITEM_RATING(), {timeout: DEF_WAIT_TIMEOUT / 4});
                            _itemMetadata.rating = await _pageItem.$eval(DEF_CONFIG.item.ITEM_RATING(), _el => _el.innerHTML);
                        } catch (error) {
                            console.log(` --- No rating found!`);
                        }

                        try {
                            await _pageItem.click(DEF_CONFIG.item.ITEM_VARIATION_DEFAULT_1());
                        } catch (error) {
                            console.log(` --- No default options!`);
                        }

                        try {
                            const _option = await _pageItem.$eval(DEF_CONFIG.item.ITEM_VARIATION_SELECTOR_OPTION(), _el => _el.value);
                            await _pageItem.select(DEF_CONFIG.item.ITEM_VARIATION_SELECTOR(), _option);
                        } catch (error) {
                            console.log(` --- No extra options!`);
                        }

                        try {
                            await _pageItem.waitFor(DEF_CONFIG.item.ITEM_SHIPPING_TARGET_INPUT(), {timeout: DEF_WAIT_TIMEOUT / 2});
                            await _pageItem.focus(DEF_CONFIG.item.ITEM_SHIPPING_TARGET_INPUT());
                            for (l of [...DEF_SHIPPING_ZIP.split(""), null, null])
                                await _pageItem.keyboard.press('Backspace', {delay: DEF_TYPING_DELAY});
                            await _pageItem.type(DEF_CONFIG.item.ITEM_SHIPPING_TARGET_INPUT(), DEF_SHIPPING_ZIP, {delay: DEF_TYPING_DELAY});
                            await _pageItem.click(DEF_CONFIG.item.ITEM_SHIPPING_TARGET_SUBMIT());
                        } catch (error) {
                            console.log(` --- Skipping shipping input...`);
                        }

                        await _pageItem.waitFor(DEF_CONFIG.item.ITEM_SHIPPING_RESULT_TYPE(), {timeout: DEF_WAIT_TIMEOUT});

                        _itemMetadata.shipping = {
                            type: textUtils.clear(await _pageItem.$eval(DEF_CONFIG.item.ITEM_SHIPPING_RESULT_TYPE(), _el => _el.textContent)),
                            delay: textUtils.clear(await _pageItem.$eval(DEF_CONFIG.item.ITEM_SHIPPING_RESULT_DELAY(), _el => _el.textContent)),
                            cost: textUtils.clear(await _pageItem.$eval(DEF_CONFIG.item.ITEM_SHIPPING_RESULT_COST(), _el => _el.textContent)),
                        };

                        _data[_itemLink] = _itemMetadata;
                        console.log(" --- New item:", _itemMetadata);
                        console.log(" --- Item count:", Object.keys(_data).length);
                        await data.save(_data);

                    } catch (error) {

                        _itemMetadata.invalid = true;
                        _data[_itemLink] = _itemMetadata;
                        console.log(" --- New INVALID item:", _itemMetadata);
                        console.log(" --- Item count:", Object.keys(_data).length);
                        await data.save(_data);

                        console.error(`Error on item: ${_itemLink}`);
                        await log.saveErrorLog(error);
                    }

                    try {
                        // await _pageItem.close();
                    } catch (error) {
                        console.error(`Error on close page!`);
                        await log.saveErrorLog(error);
                    }
                }
            }

        }

        await _browser.close();
    }
}
