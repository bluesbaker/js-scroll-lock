let lockedElements = [];

// an element scroll watcher
const scrollListener = (top, element) => () => {
    // a page element
    if(element != undefined) {
        element.scrollTop = top;
    }
    // a root(html/document)
    else {
        window.scrollTo(0, top);
    }
}

// get all listeners by marker: 
// "#id", ".class", "tag" or root container;
const getListeners = (marker) => {
    const listeners = [];
    switch (marker[0]) {
        // identificator
        case "#":
            const element = document.getElementById(marker.slice(1));
            const listener = scrollListener(element.scrollTop, element);
            listeners.push({element, listener});
            break;
        // class
        case ".":
            const classElements = document.getElementsByClassName(marker.slice(1));
            classElements.forEach(element => {
                const listener = scrollListener(element.scrollTop, element);
                listeners.push({element, listener});
            });
            break;
        // element
        default:
            // root element
            if(marker === "" || marker === "html") {
                const element = document;
                const top = window.scrollY || window.pageYOffset || document.body.scrollTop
                            + (document.documentElement && document.documentElement.scrollTop || 0);
                const listener = scrollListener(top);
                listeners.push({element, listener});
                break;
            }
            console.log("element");
            // or other elements
            const tagElements = document.getElementsByTagName(marker);
            tagElements.forEach(element => {
                const listener = scrollListener(element.scrollTop, element);
                listeners.push({element, listener});
            });
            break;
    }
    return listeners;
}

// exports
export default {
    lock: (elementMarker) => {
        const elements = getListeners(elementMarker);
        elements.forEach(({element, listener}) => {
            element.addEventListener("scroll", listener);
            element.addEventListener("wheel", listener);
            lockedElements.push({marker: elementMarker, element, listener});
        });
    },
    unlock: (elementMarker) => {
        lockedElements.forEach(({element, marker, listener}) => {
            if(marker == elementMarker) {
                element.removeEventListener("scroll", listener);
                element.removeEventListener("wheel", listener);
            }
        });
        lockedElements = lockedElements.filter(le => le.marker !== elementMarker);
    }
}