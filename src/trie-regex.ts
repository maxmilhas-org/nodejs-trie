import { Trie, MatchType, TrieRegExp } from './types';

function getEnd(matchType: MatchType) {
	switch (matchType) {
		case MatchType.PERFECT:
			return '';
		case MatchType.PARTIAL:
			return '|$';
		default:
			return '|\n';
	}
}

function trieToRegExRecursive(trie: Trie, matchType: MatchType) {
	let exp = '';
	for (const [k, v] of trie.sub) {
		exp += exp !== '' ? `|${k}` : k;
		exp += trieToRegExRecursive(v as Trie, matchType);
	}

	return exp !== '' ? `(?:${exp}${getEnd(matchType)})` : '';
}

function validateRegEx(trie: Trie) {
	if (trie.$synonymTrie) {
		throw new TypeError('TrieRegEx does not support tries with synonyms yet');
	}
}

export function trieToRegExPartial(trie: Trie) {
	validateRegEx(trie);

	const exp = `^${trieToRegExRecursive(trie, MatchType.PARTIAL)}`;
	return new RegExp(exp);
}

export function trieToRegExPerfect(trie: Trie) {
	validateRegEx(trie);

	const exp = `^${trieToRegExRecursive(trie, MatchType.PERFECT)}`;
	return new RegExp(exp);
}

export function trieToRegEx(trie: Trie): TrieRegExp {
	validateRegEx(trie);

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
