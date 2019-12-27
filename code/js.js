import { readFileSync } from "fs";

const randomArrKey = items => items[Math.floor(Math.random() * items.length)];
const wordList = JSON.parse(
	readFileSync(__dirname + "/../dest/cache.json", "utf-8")
);

const buildUpFanta = $sw => {
	const word = randomArrKey(wordList);
	const hue = Math.random() * 360;
	if (Math.random() > 0.8) {
		$sw.style.setProperty("--fill", "white");
	}
	$sw.style.setProperty("--hue", hue);
	$sw.querySelector("x-txt").innerText = word;
	const tweet = `STAR WARS: ${word}`;

	return { tweet };
};

const go = () => {
	const $sw = document.querySelector("body");
	const data = buildUpFanta($sw);

	console.log(JSON.stringify(data));
};
go();
