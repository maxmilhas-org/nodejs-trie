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
export type Trie = {
	[k in Letter]?: Trie;
} & {
	word?: boolean;
};
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
