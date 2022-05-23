import { StringifiableSet } from './../../src/stringifiable-set';
import { iterateTrieValues, objectListToTrie } from '../../src';

describe(objectListToTrie.name, () => {
	const obj1 = {
		field1: 1,
	};
	const obj2 = {
		field1: 'some',
	};
	const obj3 = {
		field1: true,
	};
	const obj4 = {
		field1: 'thing',
	};
	function getLeaf(obj: any) {
		return { c: {}, w: 1, v: new StringifiableSet([obj]) };
	}
	const firstSubTrie = {
		c: {
			o: {
				c: { m: { c: { e: getLeaf(obj2) } } },
			},
		},
	};
	const secondSubTrie = {
		c: {
			h: {
				c: {
					i: {
						c: {
							n: { c: { g: getLeaf(obj4) } },
						},
					},
				},
			},
		},
	};

	it('Should convert an object list to a total insensitive TrieMap, when no options is informed', () => {
		const result = objectListToTrie([obj1, obj2, obj3, obj4]);

		expect(result).toEqual({
			s: [
				{ c: {} },
				new Map(),
				{
					caseInsensitive: true,
					onlyAlphaNumerics: true,
				},
			],
			c: {
				s: firstSubTrie,
				t: secondSubTrie,
			},
		});
	});

	it('Should convert an object list to a TrieMap with the specified word restrictions, when caseInsensitive and onlyAlphaNumerics are informed', () => {
		const result = objectListToTrie([obj1, obj2, obj3, obj4], undefined, {
			caseInsensitive: false,
			onlyAlphaNumerics: false,
		});

		expect(result).toEqual({
			s: [
				{ c: {} },
				new Map(),
				{
					caseInsensitive: false,
					onlyAlphaNumerics: false,
				},
			],
			c: {
				s: firstSubTrie,
				t: secondSubTrie,
			},
		});
	});

	it('Should iterate using case insensitivity over a Trie created with objetListToTrie', () => {
		const trie = objectListToTrie([obj1, obj2, obj3, obj4], []);
		const iterable = iterateTrieValues(trie, 'Thíng');
		const result = Array.from(iterable);

		expect(result).toEqual([
			{
				proximity: 0,
				value: obj4,
			},
		]);
	});
});
