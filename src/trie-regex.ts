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
	const { c: sub } = trie;
	for (const k in sub) {
		exp += exp !== '' ? `|${k}` : k;
		exp += trieToRegExRecursive(sub[k] as Trie, matchType);
	}

	return exp !== '' ? `(?:${exp}${getEnd(matchType)})` : '';
}

function getRegEx(trie: Trie<unknown>, matchType: MatchType) {
	if (trie.s) {
		throw new TypeError('TrieRegEx does not support tries with synonyms yet');
	}

	const exp = `^${trieToRegExRecursive(trie, matchType)}`;
	return new RegExp(exp);
}

export function trieToRegExPartial(trie: Trie) {
	return getRegEx(trie, MatchType.PARTIAL);
}

export function trieToRegExPerfect(trie: Trie) {
	return getRegEx(trie, MatchType.PERFECT);
}

export function trieToRegEx(trie: Trie): TrieRegExp {
	const regex = getRegEx(trie, MatchType.NONE) as TrieRegExp;

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
