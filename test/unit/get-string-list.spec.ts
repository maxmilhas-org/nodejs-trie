import { getStringList } from '../../src/get-string-list';

describe(getStringList.name, () => {
	it('should split the given string by each word, ignoring any string that transformed into an empty one', () => {
		const transform = (x: string) => (x === 'is' ? '' : `[${x}]`);

		const iterable = getStringList(
			['what a mess!!That string is', "totally*screwed!That's for sure:("],
			transform,
		);
		const result = Array.from(iterable);

		expect(result).toEqual([
			'[what]',
			'[a]',
			'[mess]',
			'[!!]',
			'[That]',
			'[string]',
			'[totally]',
			'[*]',
			'[screwed]',
			'[!]',
			'[That]',
			"[']",
			'[s]',
			'[for]',
			'[sure]',
			'[:(]',
		]);
	});
});
