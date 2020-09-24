import moment from "moment-timezone";

export const colors = {
	3: "#2daf7f",
	4: "#1f8ecd",
	5: "#e19205",
	r: "#c6443e",
	n: "#e6e6e6",
};

export const calcKda = ({ kills, assists, deaths, games }) =>
	((kills + assists / deaths) / games).toFixed(1);

export const timeLength = (gameLength) =>
	moment
		.utc(gameLength * 1000)
		.format("HH:mm:ss")
		.split(":")
		.map((i, ix) => {
			const p = parseInt(i);
			return p > 0 ? p + (ix === 0 ? "시" : ix === 1 ? "분" : "초") : "";
		})
		.join(" ");

export const dateFromNow = (date) => moment.unix(date).lang("ko").fromNow();

export const dateToFormat = (date, format) =>
	moment.unix(date).lang("ko").format(format);

export const copyToClipboard = (str) => {
	const el = document.createElement("textarea");
	el.value = str;
	document.body.appendChild(el);
	el.select();
	document.execCommand("copy");
	document.body.removeChild(el);
	message.success("복사했습니다");
};

export const checkDay = () => {
	const hour = moment().hour();

	return hour > 19 || hour <= 5 ? "dark" : "light";
};

export const debounce = (func, wait, immediate) => {
	var timeout;
	return function () {
		var context = this,
			args = arguments;
		var later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

export const reducer = (state, a) => {
	// auto state update via KEYS
	a &&
		Object.keys(a).map((k) => {
			state[k] = a[k];
			return false;
		});
	return { ...state };
};

export const numComma = (x) => {
	return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

export const setCookie = (cname, cvalue, exdays = 7) => {
	if (typeof document === "undefined") return {};

	const encoded =
		typeof cvalue === "object" ? JSON.stringify(cvalue) : cvalue;

	localStorage.setItem(cname, encoded);
};

export const getCookie = (cname) => {
	if (typeof document === "undefined") return false;

	const item = localStorage.getItem(cname);

	return item && ["{", "["].indexOf(item[0]) >= 0
		? JSON.parse(item)
		: item || false;
};

// export const setCookie = (cname, cvalue, exdays = 7) => {
// 	if (typeof document === "undefined") return "";
// 	var d = new Date();
// 	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
// 	var expires = "expires=" + d.toUTCString();
// 	const encoded = Buffer.from(
// 		typeof cvalue === "object" ? JSON.stringify(cvalue) : cvalue
// 	).toString("base64");
// 	console.log("encoded", encoded);
// 	document.cookie = cname + "=" + encoded + ";" + expires + ";path=/";
// };

// export const getCookie = (cname) => {
// 	if (typeof document === "undefined") return "";
// 	var name = cname + "=";
// 	var ca = document.cookie.split(";");
// 	for (var i = 0; i < ca.length; i++) {
// 		var c = ca[i];
// 		while (c.charAt(0) == " ") {
// 			c = c.substring(1);
// 		}
// 		if (c.indexOf(name) == 0) {
// 			const final = decodeURIComponent(
// 				escape(
// 					new Buffer(
// 						c.substring(name.length, c.length),
// 						"base64"
// 					).toString("binary")
// 				)
// 			);
// 			return ["{", "["].indexOf(final[0]) >= 0
// 				? JSON.parse(final)
// 				: final;
// 		}
// 	}
// 	return "";
// };
