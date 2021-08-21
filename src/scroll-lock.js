let lockedElements = [];

// an element scroll listener
const scrollListener = (left, top, element) => {
    // a page element
    if(element) {
        return () => {
            element.scrollLeft = left;
            element.scrollTop = top;
        }
    }
    // a root(html/document)
    else {
        return () => window.scrollTo(left, top);
    }
}

// get all listeners by markers: 
//  "#id", ".class", "tag", "html" or <empty parameters>;
const getListeners = (...elementMarkers) => {
    const listeners = [];
    const markers = elementMarkers.length > 0 ? elementMarkers : [""];
    markers.forEach(marker => {
        switch (marker[0]) {
            // identificator
            case "#":
                const element = document.getElementById(marker.slice(1));
                const listener = scrollListener(element.scrollLeft, element.scrollTop, element);
                listeners.push({marker, element, listener});
                break;
            // class
            case ".":
                const classElements = document.getElementsByClassName(marker.slice(1));
                for(let i = 0; i < classElements.length; i++) {
                    const element = classElements[i];
                    const listener = scrollListener(element.scrollLeft, element.scrollTop, element);
                    listeners.push({marker, element, listener});
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
                    const listener = scrollListener(left, top);
                    listeners.push({marker, element: document, listener});
                    break;
                }
                // or other elements
                else {
                    const tagElements = document.getElementsByTagName(marker);
                    for(let i = 0; i < tagElements.length; i++) {
                        const element = tagElements[i];
                        const listener = scrollListener(element.scrollLeft, element.scrollTop, element);
                        listeners.push({marker, element, listener});
                    }
                }
                break;
        }
    })
    return listeners;
}

// exports
export default {
    // lock scroll by markers
    lock: (...elementMarkers) => {
        const listeners = getListeners(...elementMarkers);
        listeners.forEach(({marker, element, listener}) => {
            const isUniqueMarker = lockedElements.filter(le => le.marker == marker).length == 0;    
            if(isUniqueMarker) {
                element.addEventListener("scroll", listener);
                element.addEventListener("wheel", listener);
                lockedElements.push({marker, element, listener});
            }
        });
    },
    // unlock scroll by markers
    unlock: (...elementMarkers) => {
        lockedElements = lockedElements.filter(le => {
            for(let i = 0; i < elementMarkers.length; i++) {
                if(le.marker == elementMarkers[i]) {
                    le.element.removeEventListener("scroll", le.listener);
                    le.element.removeEventListener("wheel", le.listener);
                    return false; // delete a locked element
                }
            }
            return true;  
        });
    }
}