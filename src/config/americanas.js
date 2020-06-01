module.exports = {

    KEY: () => `AMERICANAS`,
    ROOT_URL: () => `http://www.americanas.com.br/`,

    search: {
        SEARCH_URL: (query) => `http://www.americanas.com.br/busca/${query.split(/\s+/).join("-")}`,
        SEARCH_DONE_TARGET: () => `div.product-grid-item`,
        SEARCH_ITEMS_TARGET: () => `div.product-grid-item a`,
        SEARCH_PAGES_NEXT: () => `ul.pagination-product-grid li:not([class="disabled"]) span[aria-label="Next"]`,
        SEARCH_PAGES_NEXT_DELAY: () => 1800,
    },

    item: {
        ITEM_TITLE: () => `#product-name-default`,
        ITEM_COST: () => `span[class^="price__SalesPrice"]`,
        ITEM_IMAGE: () => `.image-gallery-image img`,
        ITEM_RATING_TARGET: () => `.summary-rating`,
        ITEM_RATING: () => `.summary-rating span[class^="Average-"]`,
        ITEM_VARIATION_DEFAULT_1: () => `span[class^="variation__OptionLabel"]`,
        ITEM_VARIATION_SELECTOR: () => null,
        ITEM_VARIATION_SELECTOR_OPTION: () => null,
        ITEM_SHIPPING_TARGET_INPUT: () => `input#freight-field`,
        ITEM_SHIPPING_TARGET_SUBMIT: () => `button#freight-field-button`,
        ITEM_SHIPPING_RESULT_TYPE: () => `div[class^="address__Container"]`,
        ITEM_SHIPPING_RESULT_DELAY: () => `div[class^="freight-options__FreightOption"] div[class^="freight-options__CellUI"]`,
        ITEM_SHIPPING_RESULT_COST: () => `div[class^="freight-options__FreightOption"] div[class^="freight-options__PriceContainer"]`,
    }

};
