# js-scroll-lock
Provides the scroll lock/unlock function for the DOM elements

## Install
```
npm install js-scroll-lock
```

## How to use
```html
...
<div class="someclass" id="someid-1">The something div#1</div>
<div class="someclass" id="someid-2">The something div#2</div>
...
```
```js
// import js-scroll-lock
import scroll from "js-scroll-lock"
// or
const scroll = require("js-scroll-lock");

// root scroll lock/unlock
scroll.lock();
scroll.unlock();
// or
scroll.lock("html");
scroll.unlock("html");

// element scroll lock/unlock by id
scroll.lock("#someid-1");
scroll.unlock("#someid-1");

// all elements scroll lock/unlock by class name
scroll.lock(".someclass");
scroll.unlock(".someclass");

// all elements scroll lock/unlock by tag name
scroll.lock("div");
scroll.unlock("div");

// use more than one marker to lock/unlock scrollable elements
scroll.lock("#someid-1", ".someclass", "div"...);
scroll.unlock("#someid-1", ".someclass", "div"...);
```