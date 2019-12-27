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
	const titles = [];

	$("a.title").each(function() {
		titles.push(
			$(this)
				.text()
				.trim()
		);
	});

	const maxTitleLength = Math.max(...titles.map(h => h.length)) * 1.5;

	let sentences = [];
	$("div.text").each(function() {
		sentences = [
			...sentences,
			...$(this)
				.text()
				.split(".")
				.map(s => s.trim())
				.filter(s => s.length <= maxTitleLength)
				.filter(Boolean)
		];
	});

	const headings = [...titles, ...sentences];

	console.log(`+${headings.length} soundbites`);

	return { headings, more };
};

const getALotOfThem = async () => {
	const topFetch = 20;
	let i = 0;
	const savageGet = async paginationKey => {
		i++;
		console.log(`getting ${i}/${topFetch}`);
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

const cacheJsonAt = path.resolve(__dirname, "..", "dest", "cache.json");

const main = async () => {
	let currentHeadings = [];
	try {
		currentHeadings = require(cacheJsonAt);
	} catch {}
	const newHeadings = await getALotOfThem();
	writeFileSync(
		cacheJsonAt,
		JSON.stringify([...new Set([...currentHeadings, ...newHeadings])])
	);
};

main();
