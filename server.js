const express = require("express");
const next = require("next");
const port = parseInt(process.env.PORT, 10) || 3000;
const type = process.env.NODE_ENV;
const dev = type !== "production";
const robots = process.env.ROBOTS && process.env.ROBOTS === "allow";
const app = next({ dev });
const handle = app.getRequestHandler();
const UAParser = require("ua-parser-js");
const parser = new UAParser();

app.prepare().then(() => {
	const server = express();

	server.use(express.static("public"));

	// robots.txt handler
	server.get("/robots.txt", (req, res) => {
		res.setHeader("Content-Type", "text/plain");
		res.send(robots ? "User-agent: *" : "User-agent: *\nDisallow: /");
	});

	// catch up all routes dynamically
	server.get("/*", (req, res) => {
		parser.setUA(req.headers["user-agent"]);
		const ie = parser.getBrowser();
		return app.render(
			req,
			res,
			["IE"].includes(ie.name) && parseInt(ie.major) < 11
				? "/_ie"
				: "/index"
		);
	});

	server.get("*", (req, res) => {
		return handle(req, res);
	});

	server.listen(port, (err) => {
		if (err) throw err;
		console.log(`> Ready on http://localhost:${port} [${type}]`);
	});
});
