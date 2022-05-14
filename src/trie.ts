import { Trie, MatchType, ProcessedSynonyms } from './types';

function getLastPerfectMatch(
	processedSynonyms: ProcessedSynonyms | undefined,
	word: string,
	context: { i: number; char: string },
) {
	if (processedSynonyms) {
		const [trie] = processedSynonyms;
		let current = trie;
		let lastIndex = context.i;
		const { length } = word;

		for (let i = context.i; i < length; i++) {
			current = current.c[word[i]] as Trie;
			if (!current) {
				break;
			} else if (current.w) {
				lastIndex = i + 1;
			}
		}

		if (context.i !== lastIndex) {
			context.char = word.substring(context.i, lastIndex);
			context.i += context.char.length - 1;
		}
	}
}

function selfReferenceSynonyms(
	synonymTrie: ProcessedSynonyms | undefined,
	char: string,
	current: Trie,
) {
	if (synonymTrie) {
		const synonyms = synonymTrie[1].get(char);
		if (synonyms) {
			synonyms.forEach((synonym) => {
				if (synonym !== char) {
					current.c[synonym] = char;
				}
			});
		}
	}
}

export function addWord(trie: Trie, word: string, value?: unknown) {
	let current = trie;
	const context = { i: 0, char: '' };
	const synonymTrie = trie.s;

	while (context.i < word.length) {
		context.char = word[context.i];
		getLastPerfectMatch(synonymTrie, word, context);
		const { char } = context;
		const { c: sub } = current;
		let node = sub[char];
		if (!node) {
			node = { c: {} };
			sub[char] = node;
			selfReferenceSynonyms(synonymTrie, char, current);
		} else if (typeof node === 'string') {
			node = sub[node] as Trie;
		}
		current = node;
		context.i++;
	}
	current.w = 1;
	if (value !== undefined) {
		if (!current.v) {
			current.v = [];
		}
		current.v.push(value);
	}
}

export function createEmptyTrie<TValue = never>(
	synonymTrie?: [Trie, Map<string, string[]>],
): Trie<TValue> {
	return { s: synonymTrie, c: {} };
}

export function createTrie(
	list: Iterable<string>,
	synonymTrie?: [Trie, Map<string, string[]>],
) {
	const trie = createEmptyTrie(synonymTrie);

	for (const item of list) {
		addWord(trie, item);
	}

	return trie;
}

export function createTrieMap<TValue>(
	list: Iterable<[string, TValue]>,
	synonymTrie?: [Trie, Map<string, string[]>],
) {
	const trie = createEmptyTrie<TValue>(synonymTrie);

	for (const [item, value] of list) {
		addWord(trie, item, value);
	}

	return trie;
}

export function getSubTrie<TValue>(word: string, trie: Trie<TValue>) {
	let current = trie;
	const { length } = word;
	const context = { i: 0, char: '' };
	const synonymTrie = trie.s;

	while (context.i < length) {
		context.char = word[context.i];
		getLastPerfectMatch(synonymTrie, word, context);

		const nextNode = current.c[context.char];
		if (!nextNode) return undefined;

		current =
			typeof nextNode === 'string'
				? (current.c[nextNode] as Trie<TValue>)
				: nextNode;
		context.i++;
	}

	return current;
}

export function processCharSynonyms(
	synonymChars: string[][],
): ProcessedSynonyms {
	const set = new Set<string>();
	const trie = createEmptyTrie();
	const synonymMap = new Map<string, string[]>();

	for (const synonyms of synonymChars) {
		for (const synonym of synonyms) {
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

export function matchesTrie<TValue>(word: string, trie: Trie<TValue>) {
	const result = getSubTrie(word, trie);
	if (!result) return MatchType.NONE;

	return result.w ? MatchType.PERFECT : MatchType.PARTIAL;
}
