import { createTrie, processCharSynonyms, trieToRegExPerfect } from '../../src';

describe('trie', () => {
	it('should thrown an error when trying to convert a trie with synonyms', () => {
		const trie = createTrie(
			['testing', 'taste', 'thirsty'],
			processCharSynonyms([['t', 'th']]),
		);
		let error: any;

		try {
			trieToRegExPerfect(trie);
		} catch (err) {
			error = err;
		}

		expect(error).toBeInstanceOf(TypeError);
	});

	it('should return false when there is no matching string', () => {
		const trie = createTrie(['testing', 'taste', 'thirsty']);
		const trieRegEx = trieToRegExPerfect(trie);

		const result = trieRegEx.test('toast');

		expect(result).toBe(false);
	});

	it('should return false when there is no matching string from the beginning of the strings', () => {
		const trie = createTrie(['testing', 'taste', 'thirsty']);
		const trieRegEx = trieToRegExPerfect(trie);

		const result = trieRegEx.test('hirsty');

		expect(result).toBe(false);
	});

	it('should return false when there is almost a partial matching string', () => {
		const trie = createTrie(['testing', 'taste', 'thirsty']);
		const trieRegEx = trieToRegExPerfect(trie);

		const result = trieRegEx.test('testa');

		expect(result).toBe(false);
	});

	it('should return false when there is a partial matching string', () => {
		const trie = createTrie(['testing', 'taste', 'thirsty']);
		const trieRegEx = trieToRegExPerfect(trie);

		const result = trieRegEx.test('test');

		expect(result).toBe(false);
	});

	it('should return true when there is a perfect matching string', () => {
		const trie = createTrie(['testing', 'taste', 'thirsty']);
		const trieRegEx = trieToRegExPerfect(trie);

		const result = trieRegEx.test('taste');

		expect(result).toBe(true);
	});
});
