const express = require("express");
const path = require("path");
const Bundler = require("parcel-bundler");

const { preflight, progress, fail } = require("./shared/const.js");
const app = express();
const getALotOfThem = require("./scraper/scrape");
const port = process.env.PORT || 3000;
const bundler = new Bundler(path.resolve(__dirname, "views/index.html"), {});

app.get("/ao3-stream", async (req, res) => {
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.setHeader("Transfer-Encoding", "chunked");
	const { cookie } = req.query;

	await getALotOfThem(cookie, 30, i => {
		console.log(`getting ${i * 100}%`);
		res.write(JSON.stringify([progress, i]));
	})
		.then(gayShit => {
			res.write(JSON.stringify([preflight, gayShit]));
			res.end();
		})
		.catch(err => {
			console.error(err);
			res.write(JSON.stringify([fail, err]));
			res.end();
			return;
		});
});

app.use(bundler.middleware());

app.listen(port, () => console.log(`Open up http://localhost:${port}/ !`));
