import { Queue, ShouldYield, IdItem, getQueue } from './utils';
import { addWord, createEmptyTrie, createTrie } from './trie';
import { IteratedTrieValue, IteratingOptions, Trie } from './types';

const YIELDS_TRUE = { yields: true, id: undefined };
const ALWAYS_YIELDS = () => YIELDS_TRUE;

function pushToStack<TValue>(
	current: Trie<TValue>,
	visited: Set<Trie<TValue>>,
	stack: Queue<[Trie<TValue>, number]>,
	proximity: number,
) {
	const { c: sub } = current;
	for (const k in current.c) {
		const value = sub[k]!;
		if (typeof value !== 'string' && !visited.has(value)) {
			visited.add(current);
			stack.push([value, proximity]);
		}
	}
}

const identity = (x: unknown) => x;
function getPrefixTrie(
	prefixes: string | Iterable<string> | undefined,
	dataTrie: Trie,
): [Trie | undefined, number] {
	if (prefixes === undefined) {
		return [undefined, 0];
	}
	const trie = createEmptyTrie(dataTrie.s);
	if (typeof prefixes === 'string') {
		prefixes = [prefixes];
	}
	let count = 0;
	for (const prefix of prefixes) {
		addWord(trie, prefix);
		count++;
	}

	return [trie, count];
}

function treatOptions<TValue>(
	options: IteratingOptions<TValue>,
	trie: Trie<TValue>,
) {
	const [prefixes, count] = getPrefixTrie(options.prefixes, trie);
	let uniqueness = options.uniqueness;
	const getId = options.getId;

	if (prefixes) {
		const manyPrefixes = count > 1;
		if (uniqueness === undefined) {
			uniqueness = manyPrefixes || !getId;
		} else if (uniqueness === false && manyPrefixes) {
			throw new TypeError(
				'It is not allowed to have uniqueness false and more than one prefix',
			);
		}
	}
	return { prefixes, uniqueness, getId: getId || identity };
}

function validateIterationParameters<TValue>(
	prefixOrOptions: string | IteratingOptions<TValue> | undefined,
	trie: Trie<TValue>,
) {
	let prefixes: Trie | undefined;
	if (prefixOrOptions) {
		if (typeof prefixOrOptions === 'object') {
			return treatOptions(prefixOrOptions, trie);
		}
		prefixes = createTrie([prefixOrOptions], trie.s);
	}

	return { prefixes, uniqueness: false, getId: identity };
}

function shouldYieldFactory(
	uniqueness: boolean | undefined,
	yielded: Set<unknown>,
	getId: Function,
) {
	if (uniqueness) {
		return (value: unknown) => {
			const id = getId(value);
			if (yielded.has(id)) return { yields: false, id };
			yielded.add(id);
			return { yields: true, id };
		};
	}

	return ALWAYS_YIELDS;
}

function* yieldValues<TValue>(
	shouldYield: ShouldYield,
	values: TValue[],
	proximity: number,
) {
	const { length } = values;
	for (let i = 0; i < length; i++) {
		const value = values[i];
		const { yields, id } = shouldYield(value);
		if (yields) {
			yield { proximity, value, id, count: 1 };
		}
	}
}

function* runIteration<TValue>(
	trie: Trie<TValue>,
	uniqueness: boolean | undefined,
	getId: (x: TValue) => unknown,
): Iterable<IdItem<TValue>> {
	const visited = new Set([trie]);
	const yielded = new Set();
	const queue = getQueue<[Trie<TValue>, number]>();
	queue.push([trie, 0]);
	const shouldYield = shouldYieldFactory(uniqueness, yielded, getId);

	while (queue.hasItems()) {
		const [current, proximity] = queue.shift()!;
		const word = current.w;
		const values = current.v;
		if (word && values) {
			yield* yieldValues(shouldYield, values, proximity);
		}
		pushToStack(current, visited, queue, proximity + 1);
	}
}

function* combineIterables<TValue>(
	iterable1: Iterable<IdItem<TValue>>,
	iterable2: Iterable<IdItem<TValue>>,
) {
	const map = new Map<unknown, IdItem<TValue>>();
	for (const item of iterable1) {
		map.set(item.id, item);
	}
	for (const item2 of iterable2) {
		const item = map.get(item2.id);
		if (item) {
			item.count++;
			item.proximity += (item2.proximity - item.proximity) / item.count;
			yield item;
		}
	}
}

function getTrie<TValue>(current: Trie<TValue>, key: string) {
	const newTrie = current.c[key]!;
	if (typeof newTrie === 'string') {
		return current.c[newTrie] as Trie<TValue>;
	}
	return newTrie;
}

function* yieldSubTries<TValue>(
	keys: string[],
	trie: Trie<TValue>,
	prefixes: Trie<unknown>,
	callback: typeof getFilterSubTries,
) {
	if (keys.length === 1) {
		const [key] = keys;
		yield* callback(trie.c[key] as Trie<TValue>, getTrie(prefixes, key));
	} else if (keys.length > 1) {
		for (const key of keys) {
			yield* callback(getTrie(trie, key), prefixes.c[key] as Trie);
		}
	} else {
		yield trie;
	}
}

function* getFilterSubTries<TValue>(
	trie: Trie<TValue>,
	prefixes: Trie,
): Iterable<Trie<TValue> | undefined> {
	const keys = [];
	for (const k in prefixes.c) {
		const value = trie.c[k];
		if (!value) {
			yield undefined;
			return;
		}
		if (typeof value !== 'string') {
			keys.push(k);
		}
	}

	yield* yieldSubTries(keys, trie, prefixes, getFilterSubTries);
}

function combineIterableList<TValue>(
	iterables: Iterable<IdItem<TValue>>[],
	iterable: Iterable<IdItem<TValue>>,
) {
	for (let i = 1; i < iterables.length; i++) {
		iterable = combineIterables(iterable, iterables[i]);
	}
	return iterable;
}

export function iterateTrieValues<TValue>(
	trie: Trie<TValue>,
	options?: IteratingOptions<TValue>,
): Iterable<IteratedTrieValue<TValue>>;
export function iterateTrieValues<TValue>(
	trie: Trie<TValue>,
	prefix?: string,
): Iterable<IteratedTrieValue<TValue>>;
export function* iterateTrieValues<TValue>(
	trie: Trie<TValue>,
	prefixOrOptions?: IteratingOptions<TValue> | string,
): Iterable<IteratedTrieValue<TValue>> {
	const { prefixes, uniqueness, getId } = validateIterationParameters(
		prefixOrOptions,
		trie,
	);
	let tries: Array<Trie<TValue> | undefined> = [trie];
	if (prefixes) {
		tries = Array.from(getFilterSubTries(trie, prefixes));
		if (tries.some((x) => !x)) return;
	}

	const iterables = tries.map((current) =>
		runIteration(current!, uniqueness, getId),
	);
	for (const { proximity, value } of combineIterableList(
		iterables,
		iterables[0],
	)) {
		yield { proximity, value };
	}
}
