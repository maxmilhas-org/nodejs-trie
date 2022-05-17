import { IteratedTrieValue } from './types';

export type IdItem<TValue> = IteratedTrieValue<TValue> & {
	id: unknown;
	count: number;
};

export type QueueNode<T> =
	| {
			value: T;
			next?: QueueNode<T>;
	  }
	| undefined;

export type Queue<T> = {
	push(item: T): void;
	shift(): T | undefined;
	hasItems(): unknown;
};

export type ShouldYield = (v: unknown) => {
	yields: boolean;
	id: unknown;
};

export function getQueue<T>(): Queue<T> {
	let first: QueueNode<T> | undefined;
	let last: QueueNode<T> | undefined;
	return {
		hasItems() {
			return first;
		},
		shift() {
			if (first) {
				const { value } = first;
				first = first.next;
				if (!first) {
					last = first;
				}
				return value;
			}
		},
		push(value: T) {
			const node = { value };
			if (!last) {
				first = last = node;
			} else {
				last = last.next = node;
			}
		},
	};
}
