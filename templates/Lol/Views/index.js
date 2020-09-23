const Views = (component) => {
	switch (component) {
		case "landing":
			return require("./Landing").default;

		case "summoner":
			return require("./Summoner").default;

		case "notfound":
		default:
			return require("./NotFound").default;
	}
};

export default Views;
