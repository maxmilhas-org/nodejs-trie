import { objectToStringList } from '../../src/object-to-string-list';

describe(objectToStringList.name, () => {
	it('Should process an object', () => {
		const iterable = objectToStringList(
			{
				field1: 1,
				field2: true,
				field3: 'some words',
				field4: [
					'more words',
					{
						field5: null,
						field6: 'even more',
						field7: ['********$%45', 'codE 779kk0'],
						field8: {
							field9: "That's awkward",
							field10: false,
							field11: "Isn't it? Demodé",
						},
					},
				],
				field12: {
					field13: Number.POSITIVE_INFINITY,
					field14: 'Almost done',
					field15: undefined,
				},
			},
			{
				minSize: 4,
				forbiddenWords: ['code'],
			},
		);
		const result = Array.from(iterable);

		expect(result).toEqual([
			'some',
			'words',
			'more',
			'even',
			'********$%',
			'codE',
			'779kk0',
			'That',
			'awkward',
			'Demodé',
			'Almost',
			'done',
		]);
	});

	it('Should process an object when using insensitive strings', () => {
		const iterable = objectToStringList(
			{
				field1: 1,
				field2: true,
				field3: 'some words',
				field4: [
					'more words',
					{
						field5: null,
						field6: 'even more',
						field7: ['********$%45', 'codE 779kk0'],
						field8: {
							field9: "That's awkward",
							field10: false,
							field11: "Isn't it? Demodé",
						},
					},
				],
				field12: {
					field13: Number.POSITIVE_INFINITY,
					field14: 'Almost done',
					field15: undefined,
				},
			},
			{
				minSize: 4,
				forbiddenWords: ['code'],
				onlyAlphaNumerics: true,
				caseInsensitive: true,
			},
		);
		const result = Array.from(iterable);

		expect(result).toEqual([
			'some',
			'words',
			'more',
			'even',
			'779kk0',
			'that',
			'awkward',
			'demode',
			'almost',
			'done',
		]);
	});
});
