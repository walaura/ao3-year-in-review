const config = require("../.fantarc");
const puppeteer = require("puppeteer");
const Bundler = require("parcel-bundler");

const outPath = config.paths.screenie;

const startServer = () =>
	new Promise(rt => {
		const bundler = new Bundler(__dirname + "/../code/index.html");
		bundler.on("buildEnd", () => {
			rt(`http://google.com`);
		});
		bundler.serve(config.ports.test);
	});

const takeScreenshot = async url => {
	console.log("started server");
	const browser = await puppeteer.launch({
		args: ["--no-sandbox"],
		ignoreHTTPSErrors: true
	});
	const page = await browser.newPage();

	return new Promise((yay, nay) => {
		page.on("console", async msg => {
			try {
				const log = JSON.parse(msg.text());
				console.log(log);
				if (!log.tweet) {
					throw new Error("invalid fanta");
				}
				await page.waitFor(1000); /* webfont */
				await page.screenshot({ path: outPath, type: "png" });
				await browser.close();
				yay(log);
			} catch (e) {
				nay([e, msg]);
			}
		});
		Promise.all([
			page.setViewport({ width: 1280, height: 720 }),
			page.goto(url)
		]);
	});
};

module.exports = () => startServer().then(url => takeScreenshot(url));
