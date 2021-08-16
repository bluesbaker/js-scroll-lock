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
let scroll = require("js-scroll-lock");

// a root scroll lock/unlock
scroll.lock();
scroll.unlock();

// a div scroll lock/unlock by id
scroll.lock("#someid-1");
scroll.unlocklock("#someid-1")

// all div scroll lock/unlock by classes
scroll.lock(".someclass");
scroll.unlocklock(".someclass")

// all elements lock/unlock by tag name
scroll.lock("div");
scroll.unlocklock("div")
```