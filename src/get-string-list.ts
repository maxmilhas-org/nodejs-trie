export function* getStringList(
	strings: Iterable<string>,
	transform: (s: string) => string,
) {
	for (const str of strings) {
		const split = str.split(/[ -/:-@\[-`\{-~]+/);
		const { length } = split;

		for (let i = 0; i < length; i++) {
			let value = split[i];
			if (value) {
				value = transform(value);
			}
			if (value) yield value;
		}
	}
}
