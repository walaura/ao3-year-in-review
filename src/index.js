const express = require("express");
const path = require("path");
const Bundler = require("parcel-bundler");

const { preflight, progress } = require("./shared/const.js");
const app = express();
const getALotOfThem = require("./scraper/scrape");
const port = process.env.PORT || 3000;
const bundler = new Bundler(path.resolve(__dirname, "views/index.html"), {});

app.get("/ao3-stream", async (req, res) => {
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.setHeader("Transfer-Encoding", "chunked");
	const { cookie } = req.query;

	const maxToFetch = 2;
	const gayShit = await getALotOfThem(cookie, maxToFetch, i => {
		console.log(`getting ${i}/${maxToFetch}`);
		res.write(JSON.stringify([progress, i / maxToFetch]));
	});
	res.write(JSON.stringify([preflight, gayShit]));
	res.end();
});

app.use(bundler.middleware());

app.listen(port, () => console.log(`Open up http://localhost:${port}/ !`));
