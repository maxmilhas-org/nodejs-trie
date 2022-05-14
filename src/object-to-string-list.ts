import { getTransformString } from './get-transform-string';
import { getStringList } from './get-string-list';
import { TrieOptions } from './types';

function* resolveValue<TValue>(
	value: TValue,
	transform: (s: string) => string,
	callback: typeof iterate,
): Iterable<string> {
	const type = typeof value;
	if (type === 'string') {
		yield* getStringList([value as unknown as string], transform);
	} else if (Array.isArray(value)) {
		for (const item of value) {
			yield* resolveValue(item, transform, callback);
		}
	} else if (type === 'object' && value) {
		yield* callback(value as unknown as object, transform);
	}
}

function* iterate<TValue extends object>(
	object: TValue,
	transform: (s: string) => string,
): Iterable<string> {
	for (const k in object) {
		if (object.hasOwnProperty(k)) {
			const value = object[k];
			yield* resolveValue(value, transform, iterate);
		}
	}
}

export function* objectToStringList<TValue extends object>(
	object: TValue,
	options?: TrieOptions,
) {
	if (!options) {
		options = {};
	}
	const transform = getTransformString(options);

	yield* iterate(object, transform);
}
