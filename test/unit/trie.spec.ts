import { StringifiableSet } from './../../src/stringifiable-set';
import { MatchType } from './../../src/types';
import {
	addWord,
	createTrie,
	createTrieMap,
	matchesTrie,
	processCharSynonyms,
} from '../../src';

describe('trie', () => {
	it('simple Trie should be stringifiable', () => {
		const trie = createTrie(['testing', 'taste', 'thirsty']);

		const result = JSON.stringify(trie);

		expect(result).toBe(
			'{"c":{"t":{"c":{"e":{"c":{"s":{"c":{"t":{"c":{"i":{"c":{"n":{"c":{"g":{"c":{},"w":1}}}}}}}}}}},"a":{"c":{"s":{"c":{"t":{"c":{"e":{"c":{},"w":1}}}}}}},"h":{"c":{"i":{"c":{"r":{"c":{"s":{"c":{"t":{"c":{"y":{"c":{},"w":1}}}}}}}}}}}}}}}',
		);
	});

	it('simple Trie should be restorable from a stringified value', () => {
		const trie = createTrie(['testing', 'taste', 'thirsty']);
		const stringified = JSON.stringify(trie);

		const result = JSON.parse(stringified);

		expect(result).toEqual(trie);
	});

	it('TrieMap should be stringifiable', () => {
		const trie = createTrieMap([['test', 1]]);

		const result = JSON.stringify(trie);

		expect(result).toBe(
			'{"c":{"t":{"c":{"e":{"c":{"s":{"c":{"t":{"c":{},"w":1,"v":[1]}}}}}}}}}',
		);
	});

	it('TrieMap should be restorable from a stringified value', () => {
		const trie = createTrieMap([['test', 1]]);
		const stringified = JSON.stringify(trie);

		const result = JSON.parse(stringified);

		expect(result).toEqual({
			c: {
				t: { c: { e: { c: { s: { c: { t: { c: {}, w: 1, v: [1] } } } } } } },
			},
		});
	});

	it('TrieMap should be functional after restored from a stringified value', () => {
		const trie = createTrieMap([['test', 1]]);
		const stringified = JSON.stringify(trie);
		const restoredTrie = JSON.parse(stringified);

		const result = addWord(restoredTrie, 'test', 2);

		expect(restoredTrie).toEqual({
			c: {
				t: {
					c: {
						e: {
							c: {
								s: {
									c: { t: { c: {}, w: 1, v: new StringifiableSet([1, 2]) } },
								},
							},
						},
					},
				},
			},
		});
		expect(result).toBeUndefined();
	});

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
				s: undefined,
				c: {
					t: {
						w: 1,
						c: {
							h: {
								w: 1,
								c: {},
							},
						},
					},
					x: {
						w: 1,
						c: {
							x: {
								w: 1,
								c: {},
							},
						},
					},
					j: {
						w: 1,
						c: {
							a: {
								c: {
									s: {
										c: {
											p: {
												c: {
													e: {
														c: {
															r: {
																w: 1,
																c: {},
															},
														},
													},
												},
											},
										},
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
	});
});
