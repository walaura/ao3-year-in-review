const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { URL } = require("url");
const queuePromises = require("./queue");

require("dotenv").config();

const addOrCreate = (title = "", to, { extraFields = {}, weight = 1 } = {}) => {
	title = title.trim();
	if (!to[title]) {
		to[title] = {
			title,
			appearances: 0,
			...extraFields
		};
	}
	to[title].appearances += weight;
	return to;
};

const cookieCheerioFetch = (url, cookie) =>
	fetch(url, {
		headers: {
			cookie: [`_otwarchive_session=${cookie}`, `user_credentials=1`].join(";")
		}
	})
		.then(res => res.text())
		.then(res => cheerio.load(res));

const getWeight = (text = "") => {
	const part = text
		.trim()
		.split(")")
		.pop();

	if (part.match(/\d+/)) {
		return parseInt(part.match(/\d+/).pop());
	}
	return 1;
};

const get = async ({ username, cookie }, paginationKey) => {
	const url = `https://archiveofourown.org/users/${username}/readings?nope&${
		paginationKey ? `page=${paginationKey}` : "nu"
	}`;
	const $ = await cookieCheerioFetch(url, cookie);

	let tags = {};
	let fandoms = {};
	let slashes = {};
	let fics = {};
	let authors = {};

	$(".work").each(function() {
		const slashList = (
			$(this)
				.find(".required-tags .category")
				.attr("title") || ""
		).split(",");

		const weight = getWeight(
			$(this)
				.find(".viewed")
				.text()
		);

		const $title = $(this).find("h4.heading a:first-of-type");

		const titleWithWords = $title.text();
		const author = $(this)
			.find("h4.heading a[rel=author]")
			.first()
			.text();

		addOrCreate($title.attr("href"), fics, {
			extraFields: { titleWithWords, author },
			weight
		});
		addOrCreate(author, authors, { weight });

		slashList.map(slash => {
			slashes = addOrCreate(slash, slashes, { weight });
		});

		$(this)
			.find(".fandoms a")
			.each(function() {
				const title = $(this)
					.text()
					.trim();

				addOrCreate(title, fandoms, { weight });
			});

		$(this)
			.find(".tags a")
			.each(function() {
				const title = $(this)
					.text()
					.trim();

				const type = $(this)
					.parent()
					.attr("class");

				if (type) {
					addOrCreate(title, tags, { extraFields: { type }, weight });
				}
			});
	});

	let pageCount = -1;
	try {
		const lastPageHref = $(".pagination .next")
			.prev()
			.find("a")
			.attr("href");
		pageCount = new URL("https://example.com" + lastPageHref).searchParams.get(
			"page"
		);
		console.log(pageCount);
	} catch (e) {
		console.error(e);
	}

	return { tags, fandoms, slashes, fics, authors, pageCount };
};

const mergeStuff = (prev, next) => {
	for (const [outerKey, outerVal] of Object.entries(prev)) {
		try {
			for (const [key, val] of Object.entries(outerVal)) {
				if (next[outerKey]) {
					if (next[outerKey][key]) {
						next[outerKey][key].appearances += val.appearances;
					} else {
						next[outerKey][key] = val;
					}
				}
			}
		} catch (e) {
			console.error(e);
		}
	}
	return next;
};

const getALotOfThem = async (cookie, max, callback = () => {}) => {
	callback(0);

	/* gotta get the username first lol */
	const $ = await cookieCheerioFetch(
		"https://archiveofourown.org/menu/browse",
		cookie
	);
	const username = $(`#greeting .user a[href^="/users/"]`)
		.attr("href")
		.split("/")
		.pop();

	if (!username) {
		throw "Missing username";
	}

	callback(0.01);

	/*get page count*/
	const { pageCount, ...first } = await get({ cookie, username }, 1);
	const length = Math.min(pageCount, max);
	const indexes = Array.from({ length }, (v, k) => k + 1).splice(1);
	let solved = 0;
	const pageArray = indexes.map(page => () =>
		get({ cookie, username }, page).then(stuff => {
			solved++;
			callback(solved / length);
			return stuff;
		})
	);

	callback(0.05);

	const pages = await queuePromises(4, pageArray);

	return [first, ...pages].reduce(mergeStuff);
};

module.exports = getALotOfThem;
