import { objectListToTrie } from '../../src';

describe(objectListToTrie.name, () => {
	it('Should convert an object list to a TrieMap', () => {
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
		const result = objectListToTrie([obj1, obj2, obj3, obj4]);

		expect(result).toEqual({
			s: [{ c: {} }, new Map(), undefined, 0],
			c: {
				s: {
					c: {
						o: {
							c: { m: { c: { e: { c: {}, w: 1, v: [obj2] } } } },
						},
					},
				},
				t: {
					c: {
						h: {
							c: {
								i: {
									c: {
										n: { c: { g: { c: {}, w: 1, v: [obj4] } } },
									},
								},
							},
						},
					},
				},
			},
		});
	});
});
