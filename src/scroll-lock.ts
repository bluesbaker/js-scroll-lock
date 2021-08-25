// *********************************************
// Description:
// The 'js-scroll-lock' is the simple tool,
// for the locking/unlocking a scrollbar of DOM.
// Version: 0.3.2
// Author: Konstantin <github.com/bluesbaker>
// *********************************************

class ScrollableElement {
    marker: string;
    element: Element | Document;
    listener: () => void;
    constructor(_marker: string, _element: Element | Document) {
        this.marker = _marker;
        this.element = _element;
        // - listener of the root container
        if(this.marker === "html") {
            const top = window.scrollY || window.pageYOffset || document.body.scrollTop +
                        + (document.documentElement && document.documentElement.scrollTop || 0);
            const left = window.scrollX || window.pageXOffset || document.body.scrollLeft +
                        + (document.documentElement && document.documentElement.scrollLeft || 0);
            this.listener = () => {
                window.scrollTo(left, top);
            }
        }
        // - listener of a scrollable element
        else {
            const el = this.element as Element;
            const top = el.scrollTop;
            const left = el.scrollLeft;
            this.listener = () => {
                el.scrollTop = top;
                el.scrollLeft = left;
            }
        }
    }
}

const getScrollableElements = (...elementMarkers: string[]): ScrollableElement[] => {
    const scrollableElements: ScrollableElement[] = [];   
    elementMarkers.forEach(marker => {
        switch(marker[0]) {
            // identificator
            case "#":
                const element = document.getElementById(marker.slice(1));
                if(element) {
                    scrollableElements.push(new ScrollableElement(marker, element));
                }        
                break;
            // class
            case ".":
                const classElements = document.getElementsByClassName(marker.slice(1));
                for(let i = 0; i < classElements.length; i++) {
                    scrollableElements.push(new ScrollableElement(marker, classElements[i]));               
                }
                break;
            // element
            default:
                // root element
                if(marker === "" || marker === "html") {
                    scrollableElements.push(new ScrollableElement("html", document));
                    break;
                }
                // or other elements
                else {
                    const tagElements = document.getElementsByTagName(marker);
                    for(let i = 0; i < tagElements.length; i++) {
                        scrollableElements.push(new ScrollableElement(marker, tagElements[i]));
                    }
                }
                break; 
        }
    });
    return scrollableElements;
}

let lockedScrollableElements: ScrollableElement[] = [];

/**
 * Locking the scrollbar of DOM elements by markers
 * @param elementMarkers - ".class", "#id", "tag", "html" or empty parameters
 */
const lock = (...elementMarkers: string[]) => {
    const markers = elementMarkers.length > 0 ? elementMarkers : ["html"];
    const scrollableElements = getScrollableElements(...markers);
    scrollableElements.forEach(se => {
        se.element.addEventListener("scroll", se.listener);
        se.element.addEventListener("wheel", se.listener);
        lockedScrollableElements.push(se);
    });
}

/**
 * Unlocking the scrollbar of DOM elements by markers
 * @param elementMarkers - ".class", "#id", "tag", "html" or empty parameters
 */
const unlock = (...elementMarkers: string[]) => {
    const markers = elementMarkers.length > 0 ? elementMarkers : ["html"];
    lockedScrollableElements = lockedScrollableElements.filter(le => {
        let isMatch = false;
        for(let i = 0; i < markers.length; i++) {
            if(le.marker == markers[i]) {
                le.element.removeEventListener("scroll", le.listener);
                le.element.removeEventListener("wheel", le.listener);
                isMatch = true; // delete a locked element
            }
        }
        return !isMatch;
    });
}

// exports
export default { lock, unlock }