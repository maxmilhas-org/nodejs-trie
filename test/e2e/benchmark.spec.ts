import Benchmark = require('benchmark');
import {
	createArrTrie,
	createTrie,
	matchesArrTrie,
	matchesTrie,
	trieToRegEx,
	trieToRegExPartial,
	trieToRegExPerfect,
} from '../../src';

const suite = new Benchmark.Suite();
const wordList = [
	'carriage',
	'sink',
	'coffee',
	'gravel',
	'cat',
	'eagle',
	'intervention',
	'tropical',
	'cater',
	'clue',
	'past',
	'innovation',
	'display',
	'reptile',
	'suntan',
	'exaggerate',
	'glare',
	'account',
	'watch',
	'union',
	'warm',
	'highlight',
	'stubborn',
	'pause',
	'shave',
	'carrot',
	'effort',
	'association',
	'camera',
	'waterfall',
	'care',
	'reactor',
	'miscarriage',
	'discover',
	'positive',
	'X-ray',
	'clock',
	'bear',
	'repetition',
	'safety',
	'chorus',
	'rush',
	'possible',
	'reverse',
	'ear',
	'electronics',
	'borrow',
	'advertise',
	'fabricate',
	'creep',
];

it('benchmark results', () => {
	const trie = createTrie(wordList);
	const arrTrie = createArrTrie(wordList);
	const regExTrie = trieToRegEx(trie);
	const regExTriePartial = trieToRegExPartial(trie);
	const regExTriePerfect = trieToRegExPerfect(trie);
	const last = wordList[wordList.length - 1];
	const notFound = 'creed';
	let log = '';

	suite
		.add('array search (not found)', () => {
			wordList.find((x) => x.startsWith(notFound));
		})
		.add('array regex (not found)', () => {
			const regex = new RegExp(`\\b${notFound}`);
			wordList.find((x) => regex.test(x));
		})
		.add('trie search (not found)', () => {
			matchesTrie(notFound, trie);
		})
		.add('arrTrie search (not found)', () => {
			matchesArrTrie(notFound, arrTrie);
		})
		.add('regExTrie search (not found)', () => {
			regExTrie.match(notFound);
		})
		.add('regExTriePartial search (not found)', () => {
			regExTriePartial.test(notFound);
		})
		.add('regExTriePerfect search (not found)', () => {
			regExTriePerfect.test(notFound);
		})
		.add('array search (found)', () => {
			wordList.find((x) => x.startsWith(last));
		})
		.add('array regex (found)', () => {
			const regex = new RegExp(`\\b${last}`);
			wordList.find((x) => regex.test(x));
		})
		.add('trie search (found)', () => {
			matchesTrie(last, trie);
		})
		.add('arrTrie search (found)', () => {
			matchesArrTrie(last, arrTrie);
		})
		.add('regExTrie search (found)', () => {
			regExTrie.match(last);
		})
		.add('regExTriePartial search (found)', () => {
			regExTriePartial.test(last);
		})
		.add('regExTriePerfect search (found)', () => {
			regExTriePerfect.test(last);
		})
		.on('cycle', function (event: any) {
			log += `${event.target}\n`;
		})
		.on('complete', () => {
			console.log(log);
		})
		.on('error', (err: any) => {
			console.log(err);
		})
		.run();
});
