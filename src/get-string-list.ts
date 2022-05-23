const regex = /[ -/:-@\[-`\{-~]/;

export function* getStringList(
	strings: Iterable<string>,
	transform: (s: string) => string,
) {
	for (const str of strings) {
		let start = 0;
		let last = 1;
		while (last < str.length) {
			const state = regex.test(str[start]);
			while (last < str.length && regex.test(str[last]) === state) {
				last++;
			}
			let value = str.substring(start, last).trim();
			start = last;
			if (value) {
				value = transform(value);
			}
			if (value) yield value;
		}
	}
}
