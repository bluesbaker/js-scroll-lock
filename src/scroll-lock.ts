type ScrollListener = () => void;

class ScrollableElement {
    marker: string;
    element: Element | Document;
    listener: ScrollListener; 
    constructor(_marker: string, _element: Element | Document, _listener: ScrollListener) {
        this.marker = _marker;
        this.element = _element;
        this.listener = _listener;
    }
}

let lockedScrollableElements: ScrollableElement[] = [];

const getScrollListener = (left: number, top: number, element?: Element): ScrollListener => {
    if(element !== undefined) {
        return () => {
            element.scrollLeft = left;
            element.scrollTop = top;
        }
    }
    else {
        return () => {
            window.scrollTo(left, top);
        }
    }
}

// get all ScrollableElement by markers: 
//  "#id", ".class", "tag", "html" or <empty parameters>;
const getScrollableElements = (...elementMarkers: string[]): ScrollableElement[] => {
    const scrollableElements: ScrollableElement[] = [];   
    elementMarkers.forEach(marker => {
        switch(marker[0]) {
            // identificator
            case "#":
                const element = document.getElementById(marker.slice(1));
                if(element) {
                    const listener = getScrollListener(element.scrollLeft, element.scrollTop, element);
                    const scrollableElement = new ScrollableElement(marker, element, listener);
                    scrollableElements.push(scrollableElement);
                }        
                break;
            // class
            case ".":
                const classElements = document.getElementsByClassName(marker.slice(1));
                for(let i = 0; i < classElements.length; i++) {
                    const element = classElements[i];
                    if(element) {
                        const listener = getScrollListener(element.scrollLeft, element.scrollTop, element);
                        const scrollableElement = new ScrollableElement(marker, element, listener);
                        scrollableElements.push(scrollableElement);
                    }                
                }
                break;
            // element
            default:
                // root element
                if(marker === "" || marker === "html") {
                    const top = window.scrollY || window.pageYOffset || document.body.scrollTop +
                                + (document.documentElement && document.documentElement.scrollTop || 0);
                    const left = window.scrollX || window.pageXOffset || document.body.scrollLeft +
                                + (document.documentElement && document.documentElement.scrollLeft || 0);
                    const listener = getScrollListener(left, top);
                    const scrollableElement = new ScrollableElement("html", document, listener);
                    scrollableElements.push(scrollableElement);
                    break;
                }
                // or other elements
                else {
                    const tagElements = document.getElementsByTagName(marker);
                    for(let i = 0; i < tagElements.length; i++) {
                        const element = tagElements[i];
                        if(element) {
                            const listener = getScrollListener(element.scrollLeft, element.scrollTop, element);
                            const scrollableElement = new ScrollableElement(marker, element, listener);
                            scrollableElements.push(scrollableElement);
                        }
                    }
                }
                break;
        }
    });
    return scrollableElements;
}

// lock scroll by markers
const lock = (...elementMarkers: string[]) => {
    const markers = elementMarkers.length > 0 ? elementMarkers : ["html"];
    const scrollableElements = getScrollableElements(...markers);
    scrollableElements.forEach(se => {
        se.element.addEventListener("scroll", se.listener);
        se.element.addEventListener("wheel", se.listener);
        lockedScrollableElements.push(se);
    });
}

// unlock scroll by markers
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