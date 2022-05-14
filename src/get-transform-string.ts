import { TrieOptions } from './types';

const removeSpecialCharactersAndAccents = /([\u0300-\u036f]|[^0-9A-Za-z])/g;

export function getTransformString(
	options: TrieOptions = {},
): (s: string) => string {
	const forbiddenWords = new Set(options.forbiddenWords || []);
	const visited = new Set<string>();
	const minSize = options.minSize || 0;

	return (s: string) => {
		s = s.toLowerCase();
		s = s
			.toLowerCase()
			.normalize('NFD')
			.replace(removeSpecialCharactersAndAccents, '');

		if (forbiddenWords.has(s) || visited.has(s) || s.length < minSize) {
			return '';
		}
		visited.add(s);
		return s;
	};
}
