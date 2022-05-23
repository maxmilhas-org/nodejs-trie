export class StringifiableSet<T> extends Set<T> {
	toJSON() {
		return Array.from(this);
	}
	get length() {
		return this.size;
	}
}
