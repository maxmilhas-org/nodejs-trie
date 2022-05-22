import { StringifiableSet } from './../../src/stringifiable-set';
describe(StringifiableSet.name, () => {
	it('should be stringifiable to an array representation', () => {
		const target = new StringifiableSet([1, 1, 2, 3, 4, 5]);

		const result = JSON.stringify(target);

		expect(result).toEqual('[1,2,3,4,5]');
	});

	it('length should be equal to size', () => {
		const target = new StringifiableSet([1, 1, 2, 3, 4, 5]);

		expect(target.length).toEqual(5);
		expect(target.size).toEqual(5);
		target.add(5);
		expect(target.length).toEqual(5);
		expect(target.size).toEqual(5);
		target.add(10);
		expect(target.length).toEqual(6);
		expect(target.size).toEqual(6);
	});
});
