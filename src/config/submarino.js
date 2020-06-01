module.exports = {

    KEY: () => `SUBMARINO`,
    ROOT_URL: () => `http://www.submarino.com.br/`,

    search: {
        SEARCH_URL: (query) => `https://www.submarino.com.br/busca/${query.split(/\s+/).join("-")}`,
        SEARCH_DONE_TARGET: () => `div.product-grid-item`,
        SEARCH_ITEMS_TARGET: () => `div.product-grid-item a`,
        SEARCH_PAGES_NEXT: () => `ul.pagination-product-grid li:not([class="disabled"]) span[aria-label="Next"]`,
        SEARCH_PAGES_NEXT_DELAY: () => 1800,
    },

    item: {
        ITEM_TITLE: () => `#product-name-default`,
        ITEM_COST: () => `.main-price .sales-price`,
        ITEM_IMAGE: () => `.image-gallery img`,
        ITEM_RATING_TARGET: () => `.summary-rating`,
        ITEM_RATING: () => `.summary-rating span[class^="Average-"]`,
        ITEM_VARIATION_DEFAULT_1: () => `span[class^="variation__OptionLabel"]`,
        ITEM_VARIATION_SELECTOR: () => null,
        ITEM_VARIATION_SELECTOR_OPTION: () => null,
        ITEM_SHIPPING_TARGET_INPUT: () => `input#input-freight-product`,
        ITEM_SHIPPING_TARGET_SUBMIT: () => `button#bt-freight-product`,
        ITEM_SHIPPING_RESULT_TYPE: () => `#card-freight table tbody tr:first-child td:nth-child(1)`,
        ITEM_SHIPPING_RESULT_DELAY: () => `#card-freight table tbody tr:first-child td:nth-child(3)`,
        ITEM_SHIPPING_RESULT_COST: () => `#card-freight table tbody tr:first-child td:nth-child(2)`,
    }

};
