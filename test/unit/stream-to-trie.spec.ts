import { streamToTrie, StringifiableSet } from '../../src';
import { EventEmitter } from 'events';
import { fluentEmit } from '@codibre/fluent-iterable';
import { promisify } from 'util';

const delay = promisify(setTimeout);

describe(streamToTrie.name, () => {
	it('Should return a Trie linked with the given stream', async () => {
		const emitter = new EventEmitter();
		const stream = fluentEmit(emitter);
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

		const result = streamToTrie(stream);

		expect(result).toEqual({
			s: [{ c: {} }, new Map(), undefined],
			c: {},
		});
		emitter.emit('data', obj1);
		await delay(1);
		expect(result).toEqual({
			s: [{ c: {} }, new Map(), undefined],
			c: {},
		});
		emitter.emit('data', obj2);
		await delay(1);
		expect(result).toEqual({
			s: [{ c: {} }, new Map(), undefined],
			c: {
				s: {
					c: {
						o: {
							c: {
								m: {
									c: { e: { c: {}, w: 1, v: new StringifiableSet([obj2]) } },
								},
							},
						},
					},
				},
			},
		});
		emitter.emit('data', obj3);
		await delay(1);
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
		expect(result).toEqual({
			s: [{ c: {} }, new Map(), undefined],
			c: {
				s: firstSubTrie,
			},
		});
		emitter.emit('data', obj4);
		await delay(1);
		expect(result).toEqual({
			s: [{ c: {} }, new Map(), undefined],
			c: {
				s: firstSubTrie,
				t: {
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
				},
			},
		});
		emitter.emit('end');
	});
});
