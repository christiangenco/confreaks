# 2015-12-11

* this build system is really neat; especially the live updating
* `npm install jquery --save-dev`, then `var $ = require('jquery')` - even on the client!
* `form^E` expands to `<form></form>`
* react can only return a single element
* holy shit build errors bubble up to Mac notification system
* use `className` instead of `class` in jsx
* `{}` variable escaping
* `{/*JSX comments*/}`
* `this.props`
* `<input defaultValue="don't use value" />`
* `<input defaultValue={this.props.foo} />`
* sometimes when you render a react component you need to give it a unique key so it knows what to change?
* `<button disabled={!isAvailable}></button>` for adding/removing attribute
* `<button onClick={this.props.removeFish.bind(null, key)}>Remove Fish</button>` if props method is passed down. Weird.
* two way data binding: `<input type="text" valueLink={linkState('fishes.'+ key +'.name')}/>`; https://facebook.github.io/react/docs/two-way-binding-helpers.html deeply nested: https://github.com/tungd/react-catalyst


host static site on https://getforge.com/ following http://blog.beach.io/blog/the-future-of-web-apps-hammer-reactjs-parse-forge
