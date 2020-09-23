import getConfig from "next/config";

const { API_HOST, API_PREFIX, TEMPLATE } = getConfig().publicRuntimeConfig;

// use environmental API path or custom if not empty
export default {
	apipath: "" || API_HOST,
	apiver: "" || API_PREFIX,
	template: "" || TEMPLATE,
};
