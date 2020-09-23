// define all environments you expect here

module.exports = {
	serverRuntimeConfig: {},
	publicRuntimeConfig: {
		API_HOST: process.env.API_HOST || "",
		API_PREFIX: process.env.API_PREFIX || "",
		TEMPLATE: process.env.TEMPLATE || "",
	},
};
