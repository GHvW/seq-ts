# Lazer

The goal of lazer is to enable lazy evaluation for iterables.

Lazer aims to achieve its goal with three guiding principles
1. Minimal TypeScript sugar - code should be easily translatable to regular ES6 JavaScript. Ideally, simply erasing type annotations would be the ES6 you would have written without TypeScript.
2. No prototype extension - to avoid conflicts or changes to JavaScript in the future, no adding methods to `Array.prototype`, `Map.prototype`, or any other native JavaScript data structures.
3. Minimal to no data structure lock-in - many JavaScript libraries that provide extensions for native types force you to use a special syntax or data structure to enable the extensions. While there is absolutely nothing wrong with that (and is often preferred), it locks you into that library's style. Once you're locked in, it can be hard to migrate to future enhancements to core JavaScript.

Lazer uses [generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) on stand-alone functions to enable this functionality.

Traditional `Array.prototype` methods like map, filter, reduce, etc. are provided as stand-alone functions instead of methods on a stream or sequence data structure. If a function takes multiple arguments, it is explicitely curried to provide maximum flexibility.

## Examples

A traditional JavaScript `Array` method chain might look like this:
```javascript
const arr =
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        .filter(n => n % 2 === 0)
        .map(n => n * 10); // [20, 40, 60, 80, 100]
```

To create the same ending final `Array` with lazer, you would write:
```javascript
const arr = collect(map(n => n * 10)(filter(n => n % 2 === 0)([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].values())), toArray);
```

Gross, I know. If you're eyes are bleeding after looking at the exapmle, lazer provides a small `Sequence` class and `Seq` static class to facilitate a more fluent interface. Using `Seq` and `Sequence`, the lazer example can be written like this:
```javascript
const arr =
    Seq.of(1, 2, 3, 4, 5, 6, 8, 9, 10) // could also be written `Seq.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].values())
        .andThen(filter(n => n % 2 === 0))
        .andThen(map(n => n * 10))
        .collect(); // [20, 40, 60, 80, 100]
```
Use `andThen` to chain sequences together followed by a `collect` method to process the sequence. `collect` defaults to using the `toArray` function to transfrom the sequence into an array, but `collect` has the option to take a collector function to obtain different result types.

For exmaple, a `sum` function could be passed to `collect` to return the sum of all numbers in the sequence instead of an array:
```javascript
const res =
    Seq.of(1, 2, 3, 4, 5, 6, 8, 9, 10) // could also be written `Seq.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].values())
        .andThen(filter(n => n % 2 === 0))
        .andThen(map(n => n * 10))
        .collect(sum); // 300
```

Lazer is not going to be the right approach for everyone, and might not seem very Typescript-y or even JavaScript-y.

If you want a different library with similar aims, try out [Sequency](https://github.com/winterbe/streamjs) or [Streamjs](https://github.com/winterbe/streamjs). While I haven't used them personally, [Immutable js](https://immutable-js.github.io/immutable-js/), [Lodash](https://github.com/lodash/lodash) and [RxJS](https://github.com/ReactiveX/rxjs) may satisfy your needs as well.

As an alternative, if you don't want to deal with finding suite of JavaScript packages but still want a fully featured solution to many JavaScript pain points, try [ClojureScript](https://clojurescript.org/)
