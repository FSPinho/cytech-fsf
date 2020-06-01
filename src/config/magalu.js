module.exports = {

    KEY: () => `MAGALU`,
    ROOT_URL: () => `http://www.magazineluiza.com.br/`,

    search: {
        SEARCH_URL: (query) => `http://busca.magazineluiza.com.br/busca?q=${query}`,
        SEARCH_DONE_TARGET: () => `div.nm-product-img-link`,
        SEARCH_ITEMS_TARGET: () => `ul li.nm-product-item > a`,
        SEARCH_PAGES_NEXT: () => `ul.neemu-pagination li.neemu-pagination-next a`,
        SEARCH_PAGES_NEXT_DELAY: () => 0,
    },

    item: {
        ITEM_TITLE: () => `.header-product__title`,
        ITEM_COST: () => `.price-template-price-block`,
        ITEM_IMAGE: () => `.showcase-product__container-img img`,
        ITEM_RATING_TARGET: () => `.interaction-client__rating-info`,
        ITEM_RATING: () => `.interaction-client__rating-info .js-rating-value`,
        ITEM_VARIATION_DEFAULT_1: () => null,
        ITEM_VARIATION_SELECTOR: () => `.information-values__variation select`,
        ITEM_VARIATION_SELECTOR_OPTION: () => `.information-values__variation select option:last-child`,
        ITEM_SHIPPING_TARGET_INPUT: () => `input.input__zipcode`,
        ITEM_SHIPPING_TARGET_SUBMIT: () => `button.input__zipcode-button`,
        ITEM_SHIPPING_RESULT_TYPE: () => `.freight-product__box-item-delivery-type-text`,
        ITEM_SHIPPING_RESULT_DELAY: () => `.freight-product__box-item-delivery-days-text`,
        ITEM_SHIPPING_RESULT_COST: () => `.freight-product__freight-price`,
    }

};
