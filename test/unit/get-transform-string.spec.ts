import { transformUniqueStringFactory } from '../../src/get-transform-string';

describe(transformUniqueStringFactory.name, () => {
	it('should preserve word when caseInsensitive and onlyAlphaNumerics is falsy', () => {
		const callback = transformUniqueStringFactory();

		const result = callback('Ma*-$#ést r@$%(){}+o');

		expect(result).toBe('Ma*-$#ést r@$%(){}+o');
	});

	it('should return a function that removes special character from a given string when onlyAlphaNumerics is true', () => {
		const callback = transformUniqueStringFactory({
			onlyAlphaNumerics: true,
		});

		const result = callback('ma*-$#est r@$%(){}+o');

		expect(result).toBe('maestro');
	});

	it('should return a function that puts a given string in lower case when caseInsensitive is true', () => {
		const callback = transformUniqueStringFactory({
			caseInsensitive: true,
		});

		const result = callback('GiVéNsTrInG123');

		expect(result).toBe('givénstring123');
	});

	it('should return a function that removes accents and special characters from a given string when onlyAlphaNumeric is true', () => {
		const callback = transformUniqueStringFactory({
			onlyAlphaNumerics: true,
		});

		const result = callback('áéíóúâ%êîÔûàÈìòùÇç$$');

		expect(result).toBe('aeiouaeiOuaEiouCc');
	});

	it('should return a function that returns an empty string for the second repetition of some call', () => {
		const callback = transformUniqueStringFactory({
			caseInsensitive: true,
			onlyAlphaNumerics: true,
		});

		const result1 = callback('resume');
		const result2 = callback('resumé');

		expect(result1).toBe('resume');
		expect(result2).toBe('');
	});

	it('should return a function that returns an empty for forbidden words', () => {
		const callback = transformUniqueStringFactory({
			forbiddenWords: ['denied'],
			caseInsensitive: true,
			onlyAlphaNumerics: true,
		});

		const result1 = callback('de$%niéd');
		const result2 = callback('allow%%$ed');

		expect(result1).toBe('');
		expect(result2).toBe('allowed');
	});

	it('should return a function that returns an empty for words with less characters than the minimum allowed', () => {
		const callback = transformUniqueStringFactory({
			minSize: 4,
			caseInsensitive: true,
			onlyAlphaNumerics: true,
		});

		const result1 = callback('S$o%n');
		const result2 = callback('daughter');

		expect(result1).toBe('');
		expect(result2).toBe('daughter');
	});
});
