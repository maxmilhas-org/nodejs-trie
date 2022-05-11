import { MatchType } from './../../src/types';
import { createTrie, matchesTrie } from '../../src';

describe('trie', () => {
	it('should return MatchType.NONE when there is no matching string', () => {
		const trie = createTrie(['testing', 'taste', 'thirsty']);

		const result = matchesTrie('toast', trie);

		expect(result).toBe(MatchType.NONE);
	});

	it('should return MatchType.NONE when there is no matching string from the beginning of the strings', () => {
		const trie = createTrie(['testing', 'taste', 'thirsty']);

		const result = matchesTrie('hirsty', trie);

		expect(result).toBe(MatchType.NONE);
	});

	it('should return MatchType.PARTIAL when there is a partial matching string', () => {
		const trie = createTrie(['testing', 'taste', 'thirsty']);

		const result = matchesTrie('test', trie);

		expect(result).toBe(MatchType.PARTIAL);
	});

	it('should return MatchType.PERFECT when there is a perfect matching string', () => {
		const trie = createTrie(['testing', 'taste', 'thirsty']);

		const result = matchesTrie('taste', trie);

		expect(result).toBe(MatchType.PERFECT);
	});
});
