import { TrieOptions } from './types';

const removeSpecialCharactersAndAccents = /([\u0300-\u036f]|[^0-9A-Za-z])/g;

function totalInsensitive(str: string) {
	return str
		.toLowerCase()
		.normalize('NFD')
		.replace(removeSpecialCharactersAndAccents, '');
}

function onlyAlphaNumerics(str: string) {
	return str.normalize('NFD').replace(removeSpecialCharactersAndAccents, '');
}

function identity(str: string) {
	return str;
}

const toLowerCase = String.prototype.toLowerCase.call.bind(
	String.prototype.toLowerCase,
) as (str: string) => string;

export function transformStringFactory(
	trie: TrieOptions,
): (str: string) => string {
	if (trie.caseInsensitive && trie.onlyAlphaNumerics) return totalInsensitive;
	else if (trie.caseInsensitive) return toLowerCase;
	else if (trie.onlyAlphaNumerics) return onlyAlphaNumerics;

	return identity;
}

export function transformUniqueStringFactory(
	options: TrieOptions = {},
): (s: string) => string {
	const forbiddenWords = new Set(options.forbiddenWords || []);
	const visited = new Set<string>();
	const minSize = options.minSize || 0;
	const transform = transformStringFactory(options);

	return (s: string) => {
		s = transform(s);

		if (forbiddenWords.has(s) || visited.has(s) || s.length < minSize) {
			return '';
		}
		visited.add(s);
		return s;
	};
}
