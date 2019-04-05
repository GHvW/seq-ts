# Lazer

Lazer uses generators to process iterables lazily. It aims to provide a simple way to chain lazy iterables together without overriding native types and without using too much TypeScript "sugar". The TypeScript should be almost identical to the compiled JavaScript output.

I'm not a huge fan of inheritance, so Lazer aims to make little to no use of "extends" and use functions rather than interfaces where possible. This should make it easier to use with your own functions and generators without having to jump through hoops.

It's not going to be the right approach for everyone, and probably will not seem very Typescript-y or even JavaScript-y.

For a more fully featured library with similar aims, try out Sequency https://github.com/winterbe/streamjs or Streamjs https://github.com/winterbe/streamjs. While I haven't used them personally, Lodash https://github.com/lodash/lodash and RxJS https://github.com/ReactiveX/rxjs may satisfy your needs as well.
