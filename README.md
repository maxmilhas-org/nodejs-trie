[![Actions Status](https://github.com/maxmilhas-org/nodejs-trie/workflows/build/badge.svg)](https://github.com/maxmilhas-org/nodejs-trie/actions)
[![Actions Status](https://github.com/maxmilhas-org/nodejs-trie/workflows/test/badge.svg)](https://github.com/maxmilhas-org/nodejs-trie/actions)
[![Actions Status](https://github.com/maxmilhas-org/nodejs-trie/workflows/lint/badge.svg)](https://github.com/maxmilhas-org/nodejs-trie/actions)
[![Test Coverage](https://api.codeclimate.com/v1/badges/65e41e3018643f28168e/test_coverage)](https://codeclimate.com/github/maxmilhas-org/nodejs-trie/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/65e41e3018643f28168e/maintainability)](https://codeclimate.com/github/maxmilhas-org/nodejs-trie/maintainability)
[![Packages](https://david-dm.org/maxmilhas-org/nodejs-trie.svg)](https://david-dm.org/maxmilhas-org/nodejs-trie)
[![npm version](https://badge.fury.io/js/%40maxmilhas-org%2Fnodejs-trie.svg)](https://badge.fury.io/js/%40maxmilhas-org%2Fnodejs-trie)

This library implements a lightweight and faster trie structure, for fast string lookups

## How to Install

```
npm i @maxmilhas/trie
```

## How to use

The Trie structure comes in two flavors:
Implemented with objects:
```ts
const trie = createTrie(['test', 'testing', 'teasing']);
```
And implemented with arrays:
```ts
const trie = createArrTrie(['test', 'testing', 'teasing']);
```
Which one you should use? That's depends on your case.
According to ours benchmarks, the array implementation is 2x faster than the object one, but it uses up to 26 times more memory.
Also, the array implementation is quite simple and only supports characters between a-z, so, no accents, no special characters, no numbers, only lower case.
So, as you can see, this choice really must be done case by case.

To check for the existence of the string in the object implementation:
```ts
matchesTrie('myString');
```
To check in the array one:
```ts
matchesArrTrie('myString');
```

The possible results are:
```ts
MatchType.NONE // No match
MatchType.PARTIAL // Partial match
MatchType.COMPLETE // Complete match
```

That's it! Simple enough, isn't it?


## License

Licensed under [MIT](https://en.wikipedia.org/wiki/MIT_License).