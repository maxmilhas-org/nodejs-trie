import {
	Letter,
	Trie,
	MatchType,
	TrieRegExp,
	ProcessedSynonyms,
} from './types';

const RESERVED_WORDS = new Set(['$word', '$synonymTrie']);

function getLastPerfectMatch(trie: Trie, word: string, startIndex: number) {
	let current = trie;
	let lastIndex = startIndex;
	const { length } = word;

	for (let i = startIndex; i < length; i++) {
		current = current[word[i] as Letter] as Trie;
		if (!current) {
			break;
		} else if (current.$word) {
			lastIndex = i + 1;
		}
	}

	if (startIndex !== lastIndex) {
		return word.substring(startIndex, lastIndex);
	}
}

export function addWord(trie: Trie, word: string) {
	let current = trie;
	const synonymTrie = trie.$synonymTrie;

	for (let i = 0; i < word.length; i++) {
		let char = word[i];
		if (synonymTrie) {
			const perfectMatch = getLastPerfectMatch(synonymTrie[0], word, i);
			if (perfectMatch) {
				i += perfectMatch.length - 1;
				char = perfectMatch;
			}
		}
		let node = current[char as Letter];
		if (!node) {
			if (!node) {
				node = current[char as Letter] = {};
				if (synonymTrie) {
					const synonyms = synonymTrie[1].get(char);
					if (synonyms) {
						synonyms.forEach((synonym) => {
							if (synonym !== char) {
								current[synonym as Letter] = char;
							}
						});
					}
				}
			}
		} else if (typeof node === 'string') {
			node = current[node as Letter] as Trie;
		}
		current = node as Trie;
	}
	current.$word = true;
}

export function createEmptyTrie(
	synonymTrie?: [Trie, Map<string, string[]>],
): Trie {
	return { $synonymTrie: synonymTrie };
}

export function createTrie(
	list: Iterable<string>,
	synonymTrie?: [Trie, Map<string, string[]>],
) {
	const trie: Trie = createEmptyTrie(synonymTrie);

	for (const item of list) {
		addWord(trie, item);
	}

	return trie;
}

export function processCharSynonyms(
	synonymChars: string[][],
): ProcessedSynonyms {
	const set = new Set<string>();
	const trie: Trie = {};
	const synonymMap = new Map<string, string[]>();

	for (const synonyms of synonymChars) {
		for (const synonym of synonyms) {
			if (RESERVED_WORDS.has(synonym)) {
				throw new Error(`The word ${synonym} is reserved!`);
			}
			if (set.has(synonym)) {
				throw new Error(`Synonym ${synonym} informed more than once!`);
			}
			set.add(synonym);
			addWord(trie, synonym);
			synonymMap.set(synonym, synonyms);
		}
	}

	return [trie, synonymMap];
}

export function matchesTrie(word: string, trie: Trie) {
	let current = trie;
	const { length } = word;
	const synonymTrie = trie.$synonymTrie;

	for (let i = 0; i < length; i++) {
		let char = word[i];
		if (synonymTrie) {
			const perfectMatch = getLastPerfectMatch(synonymTrie[0], word, i);
			if (perfectMatch) {
				i += perfectMatch.length - 1;
				char = perfectMatch;
			}
		}
		const nextNode = current[char as Letter];
		if (nextNode) {
			current =
				typeof nextNode === 'string'
					? (current[nextNode as Letter] as Trie)
					: nextNode;
		} else {
			return MatchType.NONE;
		}
	}
	return current.$word ? MatchType.PERFECT : MatchType.PARTIAL;
}

function trieToRegExRecursive(trie: Trie, matchType: MatchType) {
	let exp = '';
	for (const k in trie) {
		if (!RESERVED_WORDS.has(k)) {
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
