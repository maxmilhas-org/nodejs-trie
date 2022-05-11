import Benchmark = require('benchmark');
import {
	createArrTrie,
	createTrie,
	matchesArrTrie,
	matchesTrie,
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
