import { Letter, Trie, MatchType, TrieRegExp } from './types';

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

function trieToRegExRecursive(trie: Trie, matchType: MatchType) {
	let exp = '';
	for (const k in trie) {
		if (k !== 'word') {
			exp += exp !== '' ? `|${k}` : k;
			exp += trieToRegExRecursive(trie[k as Letter] as Trie, matchType);
		}
	}

	return exp !== ''
		? `(?:${exp}${
				matchType === MatchType.PERFECT
					? ''
					: matchType === MatchType.PARTIAL
					? '|$'
					: '|\n'
		  })`
		: '';
}

export function trieToRegExPartial(trie: Trie) {
	const exp = `^${trieToRegExRecursive(trie, MatchType.PARTIAL)}`;
	return new RegExp(exp);
}

export function trieToRegExPerfect(trie: Trie) {
	const exp = `^${trieToRegExRecursive(trie, MatchType.PERFECT)}`;
	return new RegExp(exp);
}

export function trieToRegEx(trie: Trie): TrieRegExp {
	const exp = `^${trieToRegExRecursive(trie, MatchType.NONE)}`;
	const regex = new RegExp(exp) as TrieRegExp;

	regex.match = (text: string) => {
		const result = regex.exec(`${text}\n`);
		if (!result) {
			return MatchType.NONE;
		}
		const match = result[0];
		return match[match.length - 1] === '\n'
			? MatchType.PARTIAL
			: MatchType.PERFECT;
	};

	return regex;
}
