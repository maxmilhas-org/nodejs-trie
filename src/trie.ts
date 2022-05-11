import { Letter, Trie, MatchType } from './types';

export function createTrie(list: string[]) {
	const trie: Trie = {};

	for (const item of list) {
		let current = trie;
		for (const char of item) {
			let node = current[char as Letter];
			if (!node) {
				node = current[char as Letter] = {};
			}
			current = node;
		}
		current.word = true;
	}

	return trie;
}

export function matchesTrie(word: string, trie: Trie) {
	let current = trie;
	const { length } = word;
	for (let i = 0; i < length; i++) {
		current = current[word[i] as Letter] as Trie;
		if (!current) {
			return MatchType.NONE;
		}
	}
	return current.word ? MatchType.PERFECT : MatchType.PARTIAL;
}
