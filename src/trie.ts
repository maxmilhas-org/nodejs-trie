import {
	Letter,
	Trie,
	MatchType,
	TrieRegExp,
	ProcessedSynonyms,
	IteratedTrieValue,
} from './types';

const RESERVED_WORDS = new Set(['$word', '$synonymTrie', '$value']);

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
			current = current[word[i] as Letter] as Trie;
			if (!current) {
				break;
			} else if (current.$word) {
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
					current[synonym as Letter] = char;
				}
			});
		}
	}
}

export function addWord(trie: Trie, word: string, value?: unknown) {
	let current = trie;
	const context = { i: 0, char: '' };
	const synonymTrie = trie.$synonymTrie;

	while (context.i < word.length) {
		context.char = word[context.i];
		getLastPerfectMatch(synonymTrie, word, context);
		const { char } = context;
		let node = current[char as Letter];
		if (!node) {
			node = current[char as Letter] = {};
			selfReferenceSynonyms(synonymTrie, char, current);
		} else if (typeof node === 'string') {
			node = current[node as Letter] as Trie;
		}
		current = node;
		context.i++;
	}
	current.$word = word;
	if (value !== undefined) {
		if (!current.$values) {
			current.$values = [];
		}
		current.$values.push(value);
	}
}

export function createEmptyTrie<TValue = never>(
	synonymTrie?: [Trie, Map<string, string[]>],
): Trie<TValue> {
	return { $synonymTrie: synonymTrie };
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

function pushToStack<TValue>(
	current: Trie<TValue>,
	visited: Set<Trie<TValue>>,
	stack: [Trie<TValue>, number][],
	proximity: number,
) {
	for (const k in current) {
		if (!RESERVED_WORDS.has(k)) {
			const value = current[k as Letter]!;
			if (typeof value !== 'string' && !visited.has(value)) {
				visited.add(current);
				stack.push([value, proximity]);
			}
		}
	}
}

export function getSubTrie<TValue>(word: string, trie: Trie<TValue>) {
	let current = trie;
	const { length } = word;
	const context = { i: 0, char: '' };
	const synonymTrie = trie.$synonymTrie;

	while (context.i < length) {
		context.char = word[context.i];
		getLastPerfectMatch(synonymTrie, word, context);

		const nextNode = current[context.char as Letter];
		if (!nextNode) return undefined;

		current =
			typeof nextNode === 'string'
				? (current[nextNode as Letter] as Trie<TValue>)
				: nextNode;
		context.i++;
	}

	return current;
}

export function* iterateTrieValues<TValue>(
	trie: Trie<TValue>,
	prefix?: string,
): Iterable<IteratedTrieValue<TValue>> {
	if (prefix) {
		trie = getSubTrie(prefix, trie)!;
		if (!trie) return;
	}
	const visited = new Set([trie]);
	const stack: [Trie<TValue>, number][] = [[trie, 0]];

	while (stack.length > 0) {
		const [current, proximity] = stack.pop()!;
		const word = current.$word;
		const values = current.$values;
		if (word && values) {
			const { length } = values;
			for (let i = 0; i < length; i++) {
				const value = values[i];
				yield { proximity, word, value };
			}
		}
		pushToStack(current, visited, stack, proximity + 1);
	}
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

export function matchesTrie<TValue>(word: string, trie: Trie<TValue>) {
	const result = getSubTrie(word, trie);
	if (!result) return MatchType.NONE;

	return result.$word ? MatchType.PERFECT : MatchType.PARTIAL;
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
