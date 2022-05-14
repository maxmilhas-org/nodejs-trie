import { getTransformString } from '../../src/get-transform-string';

describe(getTransformString.name, () => {
	it('should return a function that removes special character from a given string', () => {
		const callback = getTransformString();

		const result = callback('ma*-$#est r@$%(){}+o');

		expect(result).toBe('maestro');
	});

	it('should return a function that puts a given string in lower case', () => {
		const callback = getTransformString();

		const result = callback('GiVeNsTrInG123');

		expect(result).toBe('givenstring123');
	});

	it('should return a function that removes accents from a given string', () => {
		const callback = getTransformString();

		const result = callback('áéíóúâêîôûàèìòùÇç');

		expect(result).toBe('aeiouaeiouaeioucc');
	});

	it('should return a function that returns an empty string for the second repetition of some call', () => {
		const callback = getTransformString();

		const result1 = callback('resume');
		const result2 = callback('resumé');

		expect(result1).toBe('resume');
		expect(result2).toBe('');
	});

	it('should return a function that returns an empty for forbidden words', () => {
		const callback = getTransformString({
			forbiddenWords: ['denied'],
		});

		const result1 = callback('de$%niéd');
		const result2 = callback('allow%%$ed');

		expect(result1).toBe('');
		expect(result2).toBe('allowed');
	});

	it('should return a function that returns an empty for words with less characters than the minimum allowed', () => {
		const callback = getTransformString({
			minSize: 4,
		});

		const result1 = callback('S$o%n');
		const result2 = callback('daughter');

		expect(result1).toBe('');
		expect(result2).toBe('daughter');
	});
});
