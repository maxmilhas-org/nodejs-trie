import {
	createTrie,
	createTrieMap,
	iterateTrieValues,
	processCharSynonyms,
} from '../../src';

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
			iterateTrieValues(trie, {
				prefixes: 'tes',
			}),
		).sort((a, b) => a.value - b.value);

		expect(result).toEqual([
			{ proximity: 4, value: 1 },
			{ proximity: 3, value: 4 },
			{ proximity: 1, value: 5 },
		]);
	});

	it('should return an iterable with sub-values of the trie when options is informed with prefixes and a synonym list is informed', () => {
		const trie = createTrieMap(
			[
				['testing', 1],
				['thirsty', 1],
				['tester', 4],
				['test', 5],
				['taste', 2],
			],
			processCharSynonyms([['t', 'te']]),
		);

		const result = Array.from(
			iterateTrieValues(trie, {
				prefixes: ['th', 'tes'],
			}),
		);

		expect(result).toEqual([{ proximity: 4.5, value: 1 }]);
	});

	it('should return an iterable with all values of the trie when options is informed without prefixes', () => {
		const trie = createTrieMap([
			['testing', 1],
			['taste', 2],
			['thirsty', 3],
			['tester', 4],
			['test', 5],
		]);

		const result = Array.from(iterateTrieValues(trie, {}));

		expect(result).toEqual([
			{ proximity: 4, value: 5 },
			{ proximity: 5, value: 2 },
			{ proximity: 6, value: 4 },
			{ proximity: 7, value: 1 },
			{ proximity: 7, value: 3 },
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
				proximity: 4,
				value: 1,
			},
			{ proximity: 3, value: 4 },
			{ proximity: 1, value: 5 },
			{ proximity: 4, value: 8 },
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

	it('should return an iterable for the sub-values of the trie with no repeated values when uniqueness is true', () => {
		const trie = createTrieMap([
			['testing', 1],
			['taste', 2],
			['thirsty', 3],
			['tester', 4],
			['test', 5],
			['taste', 6],
			['thirsty', 7],
			['testingzing', 1],
		]);

		const result = Array.from(
			iterateTrieValues(trie, {
				prefixes: 'tes',
				uniqueness: true,
			}),
		).sort((a, b) => a.value - b.value);

		expect(result).toEqual([
			{
				proximity: 4,
				value: 1,
			},
			{ proximity: 3, value: 4 },
			{ proximity: 1, value: 5 },
		]);
	});

	it('should return an iterable for the combined sub-values of the trie with no repetitions', () => {
		const trie = createTrieMap([
			['testing', 1],
			['taste', 2],
			['thirsty', 3],
			['tester', 4],
			['test', 5],
			['tastening', 4],
			['tastier', 5],
			['thirsty', 7],
			['testingzing', 1],
			['tastingzing', 5],
		]);

		const result = Array.from(
			iterateTrieValues(trie, {
				prefixes: ['tes', 'tas'],
			}),
		).sort((a, b) => a.value - b.value);

		expect(result).toEqual([
			{ proximity: 4.5, value: 4 },
			{ proximity: 2.5, value: 5 },
		]);
	});

	it('should return an iterable for the combined sub-values of the trie with no repetitions using the provided getId criteria', () => {
		const trie = createTrieMap([
			['testing', 3],
			['tas', 6],
			['thirsty', 9],
			['tester', 12],
			['test', 15],
			['tastening', 12],
			['tastier', 15],
			['thirsty', 21],
			['tes', 3],
			['tastingzing', 15],
		]);

		const result = Array.from(
			iterateTrieValues(trie, {
				prefixes: ['tes', 'tas'],
				getId: (a: number) => a % 2,
			}),
		).sort((a, b) => a.value - b.value);

		expect(result).toEqual([
			{ proximity: 2, value: 3 },
			{ proximity: 1.5, value: 12 },
		]);
	});

	it('should throw an error when trying to iterate with uniqueness false and more than one prefix', () => {
		const trie = createTrieMap([['testing', 3]]);
		let error: any;

		try {
			Array.from(
				iterateTrieValues(trie, {
					prefixes: ['tes', 'tas'],
					getId: (a: number) => a % 2,
					uniqueness: false,
				}),
			).sort((a, b) => a.value - b.value);
		} catch (err) {
			error = err;
		}

		expect(error).toBeInstanceOf(TypeError);
	});
});
