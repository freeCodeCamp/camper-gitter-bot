# Stringy.js

Stringy.js will stringify your circular JS objects [without complaint](http://stackoverflow.com/questions/4816099/chrome-sendrequest-error-typeerror-converting-circular-structure-to-json/9653082#9653082). Unfortunately it currently fails if the object hierarchy exceeds 30 total items.

## Usage

```js
var b = {foo: {bar: null}}

b.foo.bar = b // it's circular!

console.log("Filtering: ", b)
console.log(stringy.stringify(b)) // works!
console.log(JSON.stringify(b)) // exception
```