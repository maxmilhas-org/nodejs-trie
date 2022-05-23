import { StringifiableSet } from './stringifiable-set';

export interface TrieOptions {
	forbiddenWords?: string[];
	minSize?: number;
	caseInsensitive?: boolean;
	onlyAlphaNumerics?: boolean;
}

export type TrieParameters = [
	Trie,
	Map<string, string[]>,
	TrieOptions | undefined,
];

export interface Trie<TValue = unknown> {
	c: Record<string, Trie<TValue> | string | undefined>;
	w?: 1;
	s?: TrieParameters;
	v?: TValue[] | StringifiableSet<TValue>;
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
