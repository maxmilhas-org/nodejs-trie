import { MatchType } from './../../src/types';
import {
	createTrie,
	createTrieMap,
	getSubTrie,
	iterateTrieValues,
	matchesTrie,
	processCharSynonyms,
} from '../../src';

describe('trie', () => {
	describe(matchesTrie.name, () => {
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

		it('should match an unknown word that have char synonym match', () => {
			const trie = createTrie(
				['testing', 'taste', 'thirsty'],
				processCharSynonyms([['th', 't']]),
			);

			const result1 = matchesTrie('thaste', trie);
			const result2 = matchesTrie('tasthe', trie);
			const result3 = matchesTrie('thasthe', trie);

			expect(result1).toBe(MatchType.PERFECT);
			expect(result2).toBe(MatchType.PERFECT);
			expect(result3).toBe(MatchType.PERFECT);
		});

		it('should partial match when an unknown word that have char synonym match partially', () => {
			const trie = createTrie(
				['testing', 'taste', 'thirsty'],
				processCharSynonyms([['th', 't']]),
			);

			const result1 = matchesTrie('thast', trie);
			const result2 = matchesTrie('tasth', trie);
			const result3 = matchesTrie('thasth', trie);

			expect(result1).toBe(MatchType.PARTIAL);
			expect(result2).toBe(MatchType.PARTIAL);
			expect(result3).toBe(MatchType.PARTIAL);
		});

		it('should none when an unknown word that have char synonym match partially', () => {
			const trie = createTrie(
				['testing', 'taste', 'thirsty'],
				processCharSynonyms([['th', 't']]),
			);

			const result1 = matchesTrie('thasti', trie);
			const result2 = matchesTrie('tasthi', trie);
			const result3 = matchesTrie('thasthi', trie);

			expect(result1).toBe(MatchType.NONE);
			expect(result2).toBe(MatchType.NONE);
			expect(result3).toBe(MatchType.NONE);
		});
	});

	describe(processCharSynonyms.name, () => {
		it('should return a trie and a map pointing to the original synonyms array for each synonym', () => {
			const result = processCharSynonyms([
				['t', 'th', 'xx'],
				['jasper', 'x', 'j'],
			]);

			expect(result[0]).toEqual({
				t: {
					$word: 't',
					h: {
						$word: 'th',
					},
				},
				x: {
					$word: 'x',
					x: {
						$word: 'xx',
					},
				},
				j: {
					$word: 'j',
					a: {
						s: {
							p: {
								e: {
									r: {
										$word: 'jasper',
									},
								},
							},
						},
					},
				},
			});
			expect(result[1]).toEqual(
				new Map([
					['t', ['t', 'th', 'xx']],
					['th', ['t', 'th', 'xx']],
					['xx', ['t', 'th', 'xx']],
					['jasper', ['jasper', 'x', 'j']],
					['x', ['jasper', 'x', 'j']],
					['j', ['jasper', 'x', 'j']],
				]),
			);
		});

		it('should throw an error when repeated synonyms are informed', () => {
			let error1: any;
			let error2: any;

			try {
				processCharSynonyms([
					['t', 'th', 't'],
					['jasper', 'x'],
				]);
			} catch (err) {
				error1 = err;
			}
			try {
				processCharSynonyms([
					['t', 'th'],
					['jasper', 'x', 't'],
				]);
			} catch (err) {
				error2 = err;
			}

			expect(error1).toBeInstanceOf(Error);
			expect(error2).toBeInstanceOf(Error);
		});

		it('should throw an error when a reserved $word is informed as synonym', () => {
			let error: any;

			try {
				processCharSynonyms([
					['t', 'th'],
					['$word', 'x'],
				]);
			} catch (err) {
				error = err;
			}

			expect(error).toBeInstanceOf(Error);
		});

		it('should throw an error when a reserved $synonymTrie is informed as synonym', () => {
			let error: any;

			try {
				processCharSynonyms([
					['t', 'th'],
					['$synonymTrie', 'x'],
				]);
			} catch (err) {
				error = err;
			}

			expect(error).toBeInstanceOf(Error);
		});
	});

	describe(iterateTrieValues.name, () => {
		it('should return an empty iterable when Trie has no values', () => {
			const trie = createTrie(['testing', 'taste', 'thirsty']);

			const result = Array.from(iterateTrieValues(trie));

			expect(result).toEqual([]);
		});

		it('should return an iterable for the sub-values of the trie', () => {
			const trie = createTrieMap([
				['testing', 1],
				['taste', 2],
				['thirsty', 3],
				['tester', 4],
				['test', 5],
			]);

			const result = Array.from(
				iterateTrieValues(getSubTrie('tes', trie)!),
			).sort((a, b) => a.value - b.value);

			expect(result).toEqual([
				{ proximity: 4, word: 'testing', value: 1 },
				{ proximity: 3, word: 'tester', value: 4 },
				{ proximity: 1, word: 'test', value: 5 },
			]);
		});

		it('should return an iterable for the sub-values of the trie with repetitions even when there is multiple values for the same key', () => {
			const trie = createTrieMap([
				['testing', 1],
				['taste', 2],
				['thirsty', 3],
				['tester', 4],
				['test', 5],
				['taste', 6],
				['thirsty', 7],
				['testing', 8],
			]);

			const result = Array.from(iterateTrieValues(trie, 'tes')).sort(
				(a, b) => a.value - b.value,
			);

			expect(result).toEqual([
				{
					word: 'testing',
					proximity: 4,
					value: 1,
				},
				{ proximity: 3, word: 'tester', value: 4 },
				{ proximity: 1, word: 'test', value: 5 },
				{ proximity: 4, word: 'testing', value: 8 },
			]);
		});

		it('should return an empty iterable when prefix fails to find any node', () => {
			const trie = createTrieMap([
				['testing', 1],
				['taste', 2],
			]);

			const result = Array.from(iterateTrieValues(trie, 'tesla')).sort(
				(a, b) => a.value - b.value,
			);

			expect(result).toEqual([]);
		});
	});
});
