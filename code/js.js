import { readFileSync } from "fs";

const randomArrKey = items => items[Math.floor(Math.random() * items.length)];
const wordList = JSON.parse(
	readFileSync(__dirname + "/../scrape/cache.json", "utf-8")
);

const buildUpFanta = $sw => {
	const word = randomArrKey(wordList);

	$sw.querySelector("x-txt").innerText = word;

	if (inverted) {
		document.body.dataset.inverted = "true";
	}

	const tweet = [`STAR WARS: ${word}`].join("\n");

	return { tweet };
};

const go = () => {
	const $sw = document.querySelector("body");
	const data = buildUpFanta($sw, data);

	console.log(JSON.stringify(data));
};
go();
