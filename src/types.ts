export type Letter =
	| 'a'
	| 'b'
	| 'c'
	| 'd'
	| 'e'
	| 'f'
	| 'g'
	| 'h'
	| 'i'
	| 'j'
	| 'k'
	| 'l'
	| 'm'
	| 'n'
	| 'o'
	| 'p'
	| 'q'
	| 'r'
	| 's'
	| 't'
	| 'u'
	| 'v'
	| 'w'
	| 'x'
	| 'y'
	| 'z';

export type ProcessedSynonyms = [Trie, Map<string, string[]>];

export type Trie<TValue = unknown> = {
	[k in Letter]?: Trie<TValue> | string;
} & {
	$word?: string;
	$synonymTrie?: ProcessedSynonyms;
	$values?: TValue[];
};

export interface IteratedTrieValue<TValue> {
	proximity: number;
	word: string;
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
