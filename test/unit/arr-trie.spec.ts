import { MatchType } from '../../src/types';
import { createArrTrie, matchesArrTrie } from '../../src';

describe('trie', () => {
	it('should return MatchType.NONE when there is no matching string', () => {
		const trie = createArrTrie(['testing', 'taste', 'thirsty']);

		const result = matchesArrTrie('toast', trie);

		expect(result).toBe(MatchType.NONE);
	});

	it('should return MatchType.NONE when there is no matching string from the beginning of the strings', () => {
		const trie = createArrTrie(['testing', 'taste', 'thirsty']);

		const result = matchesArrTrie('hirsty', trie);

		expect(result).toBe(MatchType.NONE);
	});

	it('should return MatchType.PARTIAL when there is a partial matching string', () => {
		const trie = createArrTrie(['testing', 'taste', 'thirsty']);

		const result = matchesArrTrie('test', trie);

		expect(result).toBe(MatchType.PARTIAL);
	});

	it('should return MatchType.PERFECT when there is a perfect matching string', () => {
		const trie = createArrTrie(['testing', 'taste', 'thirsty']);

		const result = matchesArrTrie('taste', trie);

		expect(result).toBe(MatchType.PERFECT);
	});
});
