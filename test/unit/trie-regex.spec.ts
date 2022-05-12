import { MatchType } from './../../src/types';
import { createTrie, trieToRegEx } from '../../src';

describe('trie', () => {
	it('should return MatchType.NONE when there is no matching string', () => {
		const trie = createTrie(['testing', 'taste', 'thirsty']);
		const trieRegEx = trieToRegEx(trie);

		const result = trieRegEx.match('toast');

		expect(result).toBe(MatchType.NONE);
	});

	it('should return MatchType.NONE when there is no matching string from the beginning of the strings', () => {
		const trie = createTrie(['testing', 'taste', 'thirsty']);
		const trieRegEx = trieToRegEx(trie);

		const result = trieRegEx.match('hirsty');

		expect(result).toBe(MatchType.NONE);
	});

	it('should return MatchType.NONE when there is almost a partial matching string', () => {
		const trie = createTrie(['testing', 'taste', 'thirsty']);
		const trieRegEx = trieToRegEx(trie);

		const result = trieRegEx.match('testa');

		expect(result).toBe(MatchType.NONE);
	});

	it('should return MatchType.PARTIAL when there is a partial matching string', () => {
		const trie = createTrie(['testing', 'taste', 'thirsty']);
		const trieRegEx = trieToRegEx(trie);

		const result = trieRegEx.match('test');

		expect(result).toBe(MatchType.PARTIAL);
	});

	it('should return MatchType.PERFECT when there is a perfect matching string', () => {
		const trie = createTrie(['testing', 'taste', 'thirsty']);
		const trieRegEx = trieToRegEx(trie);

		const result = trieRegEx.match('taste');

		expect(result).toBe(MatchType.PERFECT);
	});
});
