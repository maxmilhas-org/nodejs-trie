import { TrieOptions } from './types';
import { createEmptyTrie, processCharSynonyms } from './trie';
import { addObject } from './add-object';

export function streamToTrie<TValue extends object>(
	list: AsyncIterable<TValue>,
	synonyms?: string[][],
	reservedWords?: TrieOptions,
) {
	const parameters = processCharSynonyms(synonyms || [], reservedWords);
	const trie = createEmptyTrie(parameters);

	process.nextTick(async () => {
		for await (const item of list) {
			addObject(trie, item);
		}
	});

	return trie;
}
