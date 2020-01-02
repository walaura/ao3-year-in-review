const fetch = require("node-fetch");
const cheerio = require("cheerio");
const path = require("path");
const { URL } = require("url");

require("dotenv").config();

const addOrCreate = (title, to, { extraFields = {}, weight = 1 } = {}) => {
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

const get = async ({ username, cookie }, paginationKey) => {
	const url = `https://archiveofourown.org/users/${username}/readings?nope&${
		paginationKey ? `page=${paginationKey}` : "nu"
	}`;
	const $ = await cookieCheerioFetch(url, cookie);

	let tags = {};
	let fandoms = {};
	let slashes = {};

	$(".work").each(function() {
		const slashList = (
			$(this)
				.find(".required-tags .category")
				.attr("title") || ""
		).split(",");

		slashList.map(slash => {
			slashes = addOrCreate(slash, slashes);
		});

		$(this)
			.find(".fandoms a")
			.each(function() {
				const title = $(this)
					.text()
					.trim();

				addOrCreate(title, fandoms);
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
					addOrCreate(title, tags, { extraFields: { type } });
				}
			});
	});

	let next;
	const nextLink = $(".next a").attr("href");
	if (nextLink) {
		next = new URL("https://example.com" + nextLink).searchParams.get("page");
	}

	return { tags, fandoms, slashes, next };
};

const mergeStuff = (prev, next) => {
	for (const [outerKey, outerVal] of Object.entries(prev)) {
		for (const [key, val] of Object.entries(outerVal)) {
			if (next[outerKey][key]) {
				next[outerKey][key].appearances += val.appearances;
			} else {
				next[outerKey][key] = val;
			}
		}
	}
	return next;
};

const getALotOfThem = async (cookie, maxToFetch, callback = () => {}) => {
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

	let i = 0;
	const savageGet = async paginationKey => {
		i++;
		callback(i);
		const { next, ...stuff } = await get({ cookie, username }, paginationKey);
		if (next && i < maxToFetch) {
			const nextStuff = await savageGet(next);
			return {
				...mergeStuff(stuff, nextStuff),
				...stuff
			};
		}

		return { ...stuff, next };
	};

	return await savageGet();
};

module.exports = getALotOfThem;
