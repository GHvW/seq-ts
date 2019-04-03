# Lazer

Lazer uses generators to process iterables lazily. It aims to provide a simple way to chain lazy iterables together without overriding native types and without using too much TypeScript "sugar". The TypeScript should be almost identical to the compiled JavaScript output.

I'm not a huge fan of inheritance, so Lazer aims to make little to no use of "extends" and use functions rather than interfaces where possible.

It's not going to be the right approach for everyone, and probably will not seem very Typescript-y or even JavaScript-y.