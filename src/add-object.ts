import { objectToStringList } from './object-to-string-list';
import { addWord } from './trie';
import { Trie } from './types';

const FORBIDDEN_WORDS = 2;

export function addObject<TValue extends object>(
	trie: Trie<TValue>,
	value: TValue,
) {
	const stringList = objectToStringList(value, trie.s?.[FORBIDDEN_WORDS]);

	for (const str of stringList) {
		addWord(trie, str, value);
	}
}
