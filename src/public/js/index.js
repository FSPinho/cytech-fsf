(function () {

    console.log(" --- Starting...");

    function _getShipping(_item) {
        return (parseFloat((_item.shipping.cost || "0")
            .replace(/[^\d,]/g, "")
            .replace(/,/g, ".")) || 0).toFixed(2);
    }

    function _getId(_item) {
        return _item.link.replace(/[\/:.]/g, "____");
    }

    function _doUpdate() {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", "http://192.168.0.102:8080/data", false);
        xmlHttp.send(null);
        var _data = JSON.parse(xmlHttp.responseText);

        var _countElement = document.querySelector(".fsf-items-count");
        var _count = Object.keys(_data)
            .filter(function (_itemKey) {
                return !_data[_itemKey].invalid;
            }).length;
        _countElement.innerHTML = String(_count);

        var _listElement = document.querySelector(".fsf-list");

        Object.keys(_data)
            .map(function (_itemKey) {
                return _data[_itemKey];
            })
            .filter(function (_item) {
                return !_item.invalid;
            })
            .sort(function (a, b) {
                return _getShipping(a) - _getShipping(b);
            })
            .map(function (_item) {
                var _itemElement = document.querySelector("#" + _getId(_item));

                if (!_itemElement) {
                    _itemElement = document.createElement("a");
                    _itemElement.id = _getId(_item);
                    _itemElement.href = _item.link;
                    _itemElement.className = "fsf-item";
                    _listElement.appendChild(_itemElement);
                    _itemElement.innerHTML = "" +
                        "   <div class='fsf-item-image'>" +
                        "       <img src='" + _item.image + "'/>" +
                        "   </div>" +
                        "   <div class='fsf-item-content'>" +
                        "       <div class='fsf-item-title'>" + _item.origin + "</div>" +
                        "       <div class='fsf-item-title'>" + _item.title + "</div>" +
                        "       <div class='fsf-item-title'>" + _item.cost + "</div>" +
                        (_item.rating ? ("       <div class='fsf-item-text'>Rating: " + _item.rating + "</div>") : "") +
                        "       <div class='fsf-item-text'>" + _item.shipping.type + " - " + _item.shipping.delay + " - " + _item.shipping.cost + "</div>" +
                        "   </div>";
                }
            });
    }

    _doUpdate();
    setInterval(function () {
        _doUpdate();
    }, 3000);

})();
