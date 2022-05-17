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

You can also compile regular expressions from a Trie! There are three flavors for that:

* Partial match regular expression:
You can generate a regular expression that test returns true when there is a partial match with the Trie. This regular expression will have a performance slightly higher than the arrTrie

## RegEx conversion

```ts
const regex = trieToRegExPartial(trie);
```

* Perfect match regular expression:
You can generate a regular expression that test returns true when there is a perfect match with the Trie. This regular expression will have a performance significantly higher than the arrTrie

```ts
const regex = trieToRegExPerfect(trie);
```

* Full Trie match regular expression:
You can generate a TrieRegexp, which will have a new method, **match**, that returns **MatchType.PERFECT** for a perfect match, **MatchType.PARTIAL** for a partial match, or **MatchType.NONE** for no match! This TrieRegExp between the trie and arrTrie, but almost as good the arrTrie when no match is found, and slightly higher than the normal Trie, when a match occurs!

```ts
const regex = trieToRegEx(trie);
```

## Char Synonyms

The char synonyms feature allow you to inform an array of list of synonyms to this package, and it's used to create self referencing keys that will allow even unknown strings to match. This is useful to abstract possible user misspellings.

To use that feature, first, you need to process the char synonyms, like that:

```ts
const processedSynonyms = processCharSynonyms([
  ['x', 'ch', 'sh'],
  ['y', 'i'],
  ['s', 'ss', 'z'],
]);
```

Then, you can inform it to **createTrie** (for now, only createTrie supports char synonyms):

```ts
const trie = createTrie(['sand', 'chore', 'passport'], processedSynonyms);
```

Now, the following strings will match:

```ts
matchesTrie('shand', trie) // MatchType.PERFECT
matchesTrie('core', trie) // MatchType.PERFECT
matchesTrie('paspor', trie) // MatchType.PARTIAL
```

Tries created with synonyms, for now, can't be converted to regex.

## TrieMap

A **TrieMap** is a fast way to find multiple values using a prefix search. You can use it to organize any list of values you want, indexing them by one or many strings, and then just retrieve an iterable with all the occurrences, like that:

```ts
const trie = createTrieMap([
  ['testing', 1],
  ['taste', 2],
  ['thirsty', 3],
  ['tester', 4],
  ['test', 5],
  ['taste', 6],
  ['thirsty', 7],
  ['testing', 5],
]);

for (const item of iterateTrieValues(trie, 'tes')) {
  console.log(item);
}
/*
Result: will print in proximity order
{ proximity: 1, value: 5 },
{ proximity: 3, value: 4 },
{ proximity: 4, value: 1 },
{ proximity: 4, value: 5 },
*/
```

Notice that **IterateTrieValues** will yield even repeated values. If you want uniqueness, you can inform it:

```ts
const trie = createTrieMap([
  ['testing', 1],
  ['taste', 2],
  ['thirsty', 3],
  ['tester', 4],
  ['test', 5],
  ['taste', 6],
  ['thirsty', 7],
  ['testing', 5],
]);

for (const item of iterateTrieValues(trie, {
  prefixes: 'tes',
  uniqueness: true,
)) {
  console.log(item);
}
/*
Result: will print in proximity order
{ proximity: 1, value: 5 },
{ proximity: 3, value: 4 },
{ proximity: 4, value: 1 },
*/
```

You can also inform multiple prefixes and you'll get an iterable with only the values found for all of them.
Notice that this feature implies uniqueness, and if you try to use it with uniqueness false, you'll get an error.
Also, the proximity in the case will be the average proximity for the value with all the prefixes, and you have
no guarantees that the items will be printed in proximity order.

```ts
const trie = createTrieMap([
  ['testing', 1],
  ['taste', 2],
  ['thirsty', 3],
  ['testing', 4],
  ['test', 2],
  ['tas', 4],
  ['thirsty', 7],
  ['testing', 5],
]);

for (const item of iterateTrieValues(trie, {
  prefixes: ['tes', 'tas'],
)) {
  console.log(item);
}

/*
Result: will print in some arbitrary order
{ proximity: 1.5, value: 2 },
{ proximity: 2, value: 4 },
*/
```

## License

Licensed under [MIT](https://en.wikipedia.org/wiki/MIT_License).
