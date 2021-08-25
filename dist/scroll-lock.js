"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ScrollableElement = (function () {
    function ScrollableElement(_marker, _element) {
        this.marker = _marker;
        this.element = _element;
        if (this.marker === "html") {
            var top_1 = window.scrollY || window.pageYOffset || document.body.scrollTop +
                +(document.documentElement && document.documentElement.scrollTop || 0);
            var left_1 = window.scrollX || window.pageXOffset || document.body.scrollLeft +
                +(document.documentElement && document.documentElement.scrollLeft || 0);
            this.listener = function () {
                window.scrollTo(left_1, top_1);
            };
        }
        else {
            var el_1 = this.element;
            var top_2 = el_1.scrollTop;
            var left_2 = el_1.scrollLeft;
            this.listener = function () {
                el_1.scrollTop = top_2;
                el_1.scrollLeft = left_2;
            };
        }
    }
    return ScrollableElement;
}());
var getScrollableElements = function () {
    var elementMarkers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        elementMarkers[_i] = arguments[_i];
    }
    var scrollableElements = [];
    elementMarkers.forEach(function (marker) {
        switch (marker[0]) {
            case "#":
                var element = document.getElementById(marker.slice(1));
                if (element) {
                    scrollableElements.push(new ScrollableElement(marker, element));
                }
                break;
            case ".":
                var classElements = document.getElementsByClassName(marker.slice(1));
                for (var i = 0; i < classElements.length; i++) {
                    scrollableElements.push(new ScrollableElement(marker, classElements[i]));
                }
                break;
            default:
                if (marker === "" || marker === "html") {
                    scrollableElements.push(new ScrollableElement("html", document));
                    break;
                }
                else {
                    var tagElements = document.getElementsByTagName(marker);
                    for (var i = 0; i < tagElements.length; i++) {
                        scrollableElements.push(new ScrollableElement(marker, tagElements[i]));
                    }
                }
                break;
        }
    });
    return scrollableElements;
};
var lockedScrollableElements = [];
var lock = function () {
    var elementMarkers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        elementMarkers[_i] = arguments[_i];
    }
    var markers = elementMarkers.length > 0 ? elementMarkers : ["html"];
    var scrollableElements = getScrollableElements.apply(void 0, markers);
    scrollableElements.forEach(function (se) {
        se.element.addEventListener("scroll", se.listener);
        se.element.addEventListener("wheel", se.listener);
        lockedScrollableElements.push(se);
    });
};
var unlock = function () {
    var elementMarkers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        elementMarkers[_i] = arguments[_i];
    }
    var markers = elementMarkers.length > 0 ? elementMarkers : ["html"];
    lockedScrollableElements = lockedScrollableElements.filter(function (le) {
        var isMatch = false;
        for (var i = 0; i < markers.length; i++) {
            if (le.marker == markers[i]) {
                le.element.removeEventListener("scroll", le.listener);
                le.element.removeEventListener("wheel", le.listener);
                isMatch = true;
            }
        }
        return !isMatch;
    });
};
exports.default = { lock: lock, unlock: unlock };
