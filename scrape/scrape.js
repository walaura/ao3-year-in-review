const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { writeFileSync } = require("fs");
const path = require("path");

const get = async paginationKey => {
	const url = `https://m.imdb.com/title/tt2527338/reviews/_ajax?sort=submissionDate&dir=desc${
		paginationKey ? `&paginationKey=${paginationKey}` : "&dsfdsf"
	}`;
	const $ = await fetch(url)
		.then(res => res.text())
		.then(res => cheerio.load(res));
	const more = $(".load-more-data").data("key");
	const headings = [];

	$("a.title").each(function() {
		headings.push(
			$(this)
				.text()
				.trim()
		);
	});

	return { headings, more };
};

const getALotOfThem = async () => {
	const topFetch = 20;
	let i = 0;
	const savageGet = async paginationKey => {
		i++;
		const { headings, more } = await get(paginationKey);
		if (more && i < topFetch) {
			const moreData = await savageGet(more);
			return {
				headings: [...headings, ...moreData.headings],
				more: moreData.more
			};
		}
		return { headings, more };
	};

	return (await savageGet()).headings;
};

const main = async () => {
	let currentHeadings = [];
	try {
		currentHeadings = require("./cache.json");
	} catch {}
	const newHeadings = await getALotOfThem();
	writeFileSync(
		path.resolve(__dirname, "cache.json"),
		JSON.stringify([...new Set([...currentHeadings, ...newHeadings])])
	);
};

main();
