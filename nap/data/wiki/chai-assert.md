# Chai Assert

```js
assert(val)
assert.fail(actual, expected)
assert.ok(val) // is truthy
assert.equal(actual, expected) // 'compare with =='
assert.strictEqual
assert.deepEqual

assert.isTrue
assert.isFalse

assert.isNull
assert.isNotNull
assert.isUndefined
assert.isDefined
assert.isFunction
assert.isObject
assert.isArray
assert.isString
assert.isNumber
assert.isBoolean

assert.typeOf(/tea/, 'regexp') // Object.prototype.toString()
assert.instanceOf(chai, Tea)
assert.include([ a,b,c ], a)
assert.match(val, /regexp/)
assert.property(obj, 'tea') // 'tea' in object
assert.deepProperty(obj, 'tea.green')
assert.propertyVal(person, 'name', 'John')
assert.deepPropertyVal(post, 'author.name', 'John')

assert.lengthOf(object, 3)
assert.throws(function() { ... })
assert.throws(function() { ... }, /reference error/)
assert.doesNotThrow

assert.operator(1, '<', 2)
assert.closeTo(actual, expected)
```

> * [ricostacruz CheatSheets](https://github.com/rstacruz/cheatsheets)
> * :speech_balloon: [Discuss on gitter](https://gitter.im/bothelp/testing)