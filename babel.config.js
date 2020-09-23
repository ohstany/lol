// Templating system implementation
const template = process.env.TEMPLATE || "regular";
const templatePath = template.replace(/^./, template[0].toUpperCase());

const presets = [
	[
		"next/babel",
		{
			"preset-env": {
				modules: "commonjs",
				targets: {
					browsers: ["last 2 versions", "ie >= 11"],
				},
			},
		},
	],
];

const plugins = [
	[
		"module-resolver",
		{
			root: ["./src"],
			alias: {
				Template: `./templates/${templatePath}`,
			},
		},
	],
];

module.exports = (api) => {
	api.cache(true);

	return {
		presets,
		plugins,
	};
};
