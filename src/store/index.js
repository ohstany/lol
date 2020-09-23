import React, { createContext, useEffect, useReducer, useState } from "react";
import bpis from "api";
import { withRouter } from "next/router";
import { setCookie, getCookie, mergeDeep } from "functions";
import { root_store_reducer, root_store_initial_state } from "./reducers";
import { rootActions } from "./actions";

// device
const w = { device: "pc" };

if (typeof window !== "undefined") {
	w.device = window.innerWidth > 768 ? "pc" : "mobile";
	document.body.classList.add(w.device);
}

// common global context
const RootStore = createContext({});

const finalizeStore = async (
	{ store, actions, reducer, cookie },
	single,
	signal
) => {
	const { reduce } = single || {};

	if (!reduce) return false;

	const actionExist = {
		...(actions[reduce] || {}),
		...single,
	};

	if (!actionExist.action || actionExist.api === false) {
		return reducer(store, {
			reduce,
			data: actionExist.data || false,
			...cookie,
		});
	}

	return reducer(
		store,
		{
			reduce,
			data: await bpis(actionExist, signal),
			...cookie,
		},
		actionExist
	);
};

const setStoreReducer = (state, data) => ({
	...state,
	...data,
	update: (state.update += 1),
});

// Context container
const contextContainer = (initial_state, actions, reducer, cookie) => {
	const [store, setStore] = useReducer(setStoreReducer, initial_state);

	return {
		store,
		setStore,
		actioner: async (apiParams) => {
			const updater = { api: apiParams, toState: {}, signals: [] };
			/** ARRAY:   if type is array we are able to make several
			 *           api request, reduce them, and then assign all data at once to the state
			 *  OBJECT:  single api request, reduce and state setter
			 *  signals: API request will be terminated if user during execution exits request page
			 */
			const abc = window.AbortController; // request aborter

			if (updater.api instanceof Array) {
				updater.toState = Object.assign(
					{},
					(
						await Promise.all(
							updater.api.map(async (single, x) => {
								updater.signals[x] = abc ? new abc() : false;
								return await finalizeStore(
									{
										store,
										actions,
										reducer,
										cookie,
									},
									single,
									updater.signals[x]
								);
							})
						)
					).reduce((p, n) => Object.assign({}, p, n), {})
				);
			} else {
				updater.signals[0] = abc ? new abc() : false;
				updater.toState = await finalizeStore(
					{ store, actions, reducer, cookie },
					apiParams,
					updater.signals[0]
				);
			}

			if (updater.toState) {
				if (apiParams.set !== false) {
					setStore(updater.toState);
					return updater.toState;
				} else {
					return { data: updater.toState, set: setStore };
				}
			}

			return () => {
				updater.signals.map((s) => {
					s && s.abort();
				});
			};
		},
	};
};

// Main application context
const RootProvider = withRouter((props) => {
	const cookies = getCookie("data_types");

	const { headers, urlTemplates, children, ssrData } = props || {};

	// extract data from cookies immediately into store on each initialization
	const provider = contextContainer(
		{
			...root_store_initial_state,
			data_types: mergeDeep(
				root_store_initial_state.data_types,
				cookies || {}
			),
		},
		rootActions,
		root_store_reducer,
		{ cookies, setCookie, getCookie }
	);

	const [device, _device] = useState("pc");

	const getScreenState = (e) => {
		e.preventDefault();
		_device((s) => {
			const canSet =
				s === "mobile" && window.innerWidth > 768
					? "pc"
					: s === "pc" && window.innerWidth <= 768
					? "mobile"
					: false;

			if (canSet) {
				document.body.classList.remove(
					canSet === "mobile" ? "pc" : "mobile"
				);
				document.body.classList.add(canSet);
			}

			return canSet || s;
		});
	};

	useEffect(() => {
		if (typeof window !== "undefined") {
			const dev = window.innerWidth > 768 ? "pc" : "mobile";
			_device(dev);
			document.body.classList.add(dev);
			window.addEventListener("resize", getScreenState);
		}
	}, []);

	return (
		<RootStore.Provider
			value={{
				...provider,
				urlTemplates,
				headers,
				device,
				ssrData,
				cookies,
				setCookie,
				getCookie,
				api: bpis,
			}}>
			{children}
		</RootStore.Provider>
	);
});

export { RootProvider, RootStore };
