export const currentDate = new Date();

export const currentYear = currentDate.getFullYear();

export const daysInAMonth = new Date(
	currentDate.getFullYear(),
	currentDate.getMonth() + 1,
	0
).getDate();

// will display array of numbers [2019,2018....1950]
// example: numberRange(currentYear, currentYear - 100, -1);
export const numberRange = (start, stop, step) =>
	Array.from(
		{ length: (stop - start) / step + 1 },
		(_, i) => start + i * step
	);

export function validateNum(value, prev, limit = 25) {
	if ((/^[0-9]+$/.test(value) && value.length <= limit) || !value) {
		return value;
	} else {
		return prev;
	}
}

const showHypen = (str, length, prev_str) => {
	return str && str.indexOf("-") >= 0 && length >= prev_str.length ? "-" : "";
};

export function addMinuses(value, previous, limit = 25, custom = false) {
	// f - first minus, s - second minus, gap - char length between 2 minuses
	const { f = 4, s = 6, gap = 2 } = custom || {};

	let date = value.replace(/-/g, "");

	if ((/^[0-9-]+$/.test(value) && value.length <= limit) || !value) {
		let n1 = date.substr(0, f);
		let n2 = date.substr(f, gap);
		let n3 = date.substr(s);

		if (date.length < f + 1) {
			date = date + showHypen(value, value.length, previous);
		} else if (date.length < s + 1) {
			date =
				n1 +
				"-" +
				n2 +
				showHypen(value.substr(f + 1), value.length, previous);
		} else {
			date = n1 + "-" + n2 + "-" + n3;
		}

		return date;
	} else {
		return previous;
	}
}
