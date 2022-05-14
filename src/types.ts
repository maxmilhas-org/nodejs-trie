export type ProcessedSynonyms = [Trie, Map<string, string[]>];

export interface Trie<TValue = unknown> {
	sub: Map<string, Trie<TValue> | string>;
	$word?: string;
	$synonymTrie?: ProcessedSynonyms;
	$values?: TValue[];
}

export interface IteratingOptions<TValue> {
	prefixes?: string | Iterable<string>;
	uniqueness?: boolean;
	getId?: (a: TValue) => unknown;
}

export interface IteratedTrieValue<TValue> {
	proximity: number;
	value: TValue;
}

export interface ArrayTrie extends Array<ArrayTrie | undefined> {
	word?: boolean;
}

export enum MatchType {
	NONE = 0,
	PARTIAL = 1,
	PERFECT = 2,
}

export type TrieRegExp = RegExp & {
	match(text: string): MatchType;
};
