import { TrieOptions } from './types';
import { createEmptyTrie, processCharSynonyms } from './trie';
import { addObject } from './add-object';

export function objectListToTrie<TValue extends object>(
	list: Iterable<TValue>,
	synonyms?: string[][],
	reservedWords?: TrieOptions,
) {
	const parameters = processCharSynonyms(synonyms || [], reservedWords);
	const trie = createEmptyTrie(parameters);
	trie.s![3] = 1;

	for (const item of list) {
		addObject(trie, item);
	}

	return trie;
}
