import { mergeDeep, setObjectPath, objectValue } from "functions";

/**
 * APPLICATION REDUCER (Routes, navigation, layouts etc.)
 */

const beforeSaveCookie = (obj) => ({
	summoner: {
		...obj,
		search: [],
		single: {},
	},
});

export const root_store_reducer = (s, a, params) => {
	const { data = [], reduce } = a || {};

	switch (reduce) {
		case "GET_MATCH_DETAIL": {
			const { data_types } = s;
			const [type, evalue, setting, game] = params.action.split("/");

			const value = decodeURIComponent(evalue);

			const { teams } = data || {};

			if (
				!objectValue(data_types, `${type}.single.${value}.${setting}`)
			) {
				setObjectPath(
					data_types,
					`${type}.single.${value}.${setting}`,
					{}
				);
			}

			setObjectPath(
				data_types,
				`${type}.single.${value}.${setting}.${game}`,
				{ teams }
			);

			return {
				data_types,
			};
		}

		case "GET_BASE_SUMMONER": {
			const { data_types } = s;
			const [type, evalue] = params.action.split("/");

			const value = decodeURIComponent(evalue);

			data_types[type].single[value] = mergeDeep(
				data_types[type].single[value] || {},
				data.summoner || {}
			);

			return {
				data_types,
			};
		}

		case "GET_SUMMONER_MOSTINFO": {
			const { data_types } = s;

			const [type, evalue] = params.action.split("/");

			const value = decodeURIComponent(evalue);

			data_types[type].single[value] = mergeDeep(
				data_types[type].single[value] || {},
				{ mostInfo: data }
			);

			return {
				data_types,
			};
		}

		case "GET_SUMMONER_MATCHES": {
			const { data_types } = s;

			const [type, evalue] = params.action.split("/");

			const value = decodeURIComponent(evalue);

			data_types[type].single[value] = mergeDeep(
				data_types[type].single[value] || {},
				{ matches: data }
			);

			return {
				data_types,
			};
		}

		case "SEARCH_SUMMONER": {
			const { data_types } = s;
			const { action } = params || {};
			const { setCookie } = a;

			if (!data) {
				data_types.summoner.search = [];

				return {
					data_types,
				};
			}

			const { summoner = false } = data || {};

			if (summoner && summoner.name) {
				const index = data_types[action].recent.findIndex(
					(i) => i.name === summoner.name
				);

				if (index >= 0) {
					const temp = data_types[action].recent[index];
					data_types[action].recent.splice(index, 1);
					data_types[action].recent.unshift(temp);
				} else {
					data_types[action].recent.unshift(summoner);
				}

				data_types[action].search = [summoner];

				setCookie("data_types", beforeSaveCookie(data_types[action]));
			}

			return {
				data_types,
			};
		}

		case "ADD_FAVOURITES": {
			const { data_types } = s;
			const { setCookie } = a;

			const {
				summoner: { recent, favourite },
			} = data_types;

			const { name } = data || {};

			const index = recent.findIndex((i) => i.name === name);

			if (
				index >= 0 &&
				favourite.findIndex((i) => i.name === name) === -1
			) {
				data_types.summoner.favourite.unshift(recent[index]);

				setCookie("data_types", beforeSaveCookie(data_types.summoner));
			}

			return {
				data_types,
			};
		}

		case "REMOVE_FAVOURITES": {
			const { data_types } = s;
			const { setCookie } = a;

			const {
				summoner: { favourite },
			} = data_types;

			const { name } = data || {};

			const index = favourite.findIndex((i) => i.name === name);

			if (index >= 0) {
				favourite.splice(index, 1);
				data_types.summoner.favourite = favourite;

				setCookie("data_types", beforeSaveCookie(data_types.summoner));
			}

			return {
				data_types,
			};
		}

		case "REMOVE_RECENT": {
			const { data_types } = s;
			const { setCookie } = a;

			const {
				summoner: { recent },
			} = data_types;

			const { name } = data || {};

			const index = recent.findIndex((i) => i.name === name);

			if (index >= 0) {
				recent.splice(index, 1);
				data_types.summoner.recent = recent;

				setCookie("data_types", beforeSaveCookie(data_types.summoner));
			}

			return {
				data_types,
			};
		}

		case "CHANGE_MODE": {
			const { darkmode } = s;
			const { mode } = data || "";

			if (darkmode && mode === "dark") return {};

			if (!darkmode) {
				document.body.classList.add("darkmode");
			} else {
				document.body.classList.remove("darkmode");
			}

			return {
				darkmode: !darkmode,
			};
		}

		default: {
			return {};
		}
	}
};

/**
 * INITIAL default values of application setting state
 */
export const root_store_initial_state = {
	loginStatus: false,
	search: {},
	itemData: {},
	data_types: {
		summoner: {
			recent: [],
			favourite: [],
			search: [],
			single: {},
		},
	},
	update: 0,
	darkmode: false,
};
