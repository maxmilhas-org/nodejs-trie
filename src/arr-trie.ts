import { MatchType, ArrayTrie } from './types';

const TOTAL_LETTERS = 26;
const BASE_LETTER = 97;
function getIndex(char: string) {
	return char.charCodeAt(0) - BASE_LETTER;
}
// array version

export function createArrTrie(list: string[]) {
	const trie: ArrayTrie = Array(TOTAL_LETTERS);

	for (const item of list) {
		let current = trie;
		for (const char of item) {
			let node = current[getIndex(char)];
			if (!node) {
				node = current[char.charCodeAt(0) - BASE_LETTER] = Array(
					TOTAL_LETTERS,
				) as ArrayTrie;
			}
			current = node;
		}
		current.word = true;
	}

	return trie;
}

export function matchesArrTrie(word: string, trie: ArrayTrie) {
	let current: ArrayTrie | undefined = trie;
	const { length } = word;
	for (let i = 0; i < length; i++) {
		current = current[word[i].charCodeAt(0) - BASE_LETTER];
		if (!current) {
			return MatchType.NONE;
		}
	}
	return current.word ? MatchType.PERFECT : MatchType.PARTIAL;
}
