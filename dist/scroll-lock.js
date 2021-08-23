"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ScrollableElement = (function () {
    function ScrollableElement(_marker, _element, _listener) {
        this.marker = _marker;
        this.element = _element;
        this.listener = _listener;
    }
    return ScrollableElement;
}());
var lockedScrollableElements = [];
var getScrollListener = function (left, top, element) {
    if (element !== undefined) {
        return function () {
            element.scrollLeft = left;
            element.scrollTop = top;
        };
    }
    else {
        return function () {
            window.scrollTo(left, top);
        };
    }
};
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
                    var listener = getScrollListener(element.scrollLeft, element.scrollTop, element);
                    var scrollableElement = new ScrollableElement(marker, element, listener);
                    scrollableElements.push(scrollableElement);
                }
                break;
            case ".":
                var classElements = document.getElementsByClassName(marker.slice(1));
                for (var i = 0; i < classElements.length; i++) {
                    var element_1 = classElements[i];
                    if (element_1) {
                        var listener = getScrollListener(element_1.scrollLeft, element_1.scrollTop, element_1);
                        var scrollableElement = new ScrollableElement(marker, element_1, listener);
                        scrollableElements.push(scrollableElement);
                    }
                }
                break;
            default:
                if (marker === "" || marker === "html") {
                    var top_1 = window.scrollY || window.pageYOffset || document.body.scrollTop +
                        +(document.documentElement && document.documentElement.scrollTop || 0);
                    var left = window.scrollX || window.pageXOffset || document.body.scrollLeft +
                        +(document.documentElement && document.documentElement.scrollLeft || 0);
                    var listener = getScrollListener(left, top_1);
                    var scrollableElement = new ScrollableElement("html", document, listener);
                    scrollableElements.push(scrollableElement);
                    break;
                }
                else {
                    var tagElements = document.getElementsByTagName(marker);
                    for (var i = 0; i < tagElements.length; i++) {
                        var element_2 = tagElements[i];
                        if (element_2) {
                            var listener = getScrollListener(element_2.scrollLeft, element_2.scrollTop, element_2);
                            var scrollableElement = new ScrollableElement(marker, element_2, listener);
                            scrollableElements.push(scrollableElement);
                        }
                    }
                }
                break;
        }
    });
    return scrollableElements;
};
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
