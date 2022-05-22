import { TrieOptions } from './types';
import { createEmptyTrie, processCharSynonyms } from './trie';
import { addObject } from './add-object';

export function objectListToTrie<TValue extends object>(
	list: Iterable<TValue>,
	synonyms?: string[][],
	options: TrieOptions = {},
) {
	if (options.caseInsensitive === undefined) {
		options.caseInsensitive = true;
	}
	if (options.onlyAlphaNumerics === undefined) {
		options.onlyAlphaNumerics = true;
	}
	const parameters = processCharSynonyms(synonyms || [], options);
	const trie = createEmptyTrie(parameters);

	for (const item of list) {
		addObject(trie, item);
	}

	return trie;
}
