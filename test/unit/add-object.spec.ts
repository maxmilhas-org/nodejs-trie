import { createEmptyTrie, processCharSynonyms } from '../../src';
import { addObject } from '../../src/add-object';

describe(addObject.name, () => {
	it('Should add the given object to the Trie', () => {
		const obj1 = {
			field1: 'some',
		};
		const trie = createEmptyTrie();

		const result = addObject(trie, obj1);

		expect(result).toBeUndefined();
		expect(trie).toEqual({
			c: {
				s: {
					c: {
						o: {
							c: { m: { c: { e: { c: {}, w: 1, v: [obj1] } } } },
						},
					},
				},
			},
		});
	});

	it('Should add the given object to the Trie, when using reserved words', () => {
		const obj1 = {
			field1: 'some',
			field2: 'thing',
		};
		const trie = createEmptyTrie(
			processCharSynonyms([], {
				forbiddenWords: ['some'],
			}),
		);

		const result = addObject(trie, obj1);

		expect(result).toBeUndefined();
		expect(trie).toEqual({
			s: [
				{ c: {} },
				new Map(),
				{
					forbiddenWords: ['some'],
				},
				0,
			],
			c: {
				t: {
					c: {
						h: {
							c: { i: { c: { n: { c: { g: { c: {}, w: 1, v: [obj1] } } } } } },
						},
					},
				},
			},
		});
	});
});
