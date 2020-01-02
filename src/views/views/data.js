import React from "react";
import List from "../components/list";
import { Top12Panel } from "../components/panel";

const Data = ({ data, onReset }) => {
	const topTags = Object.values(data.tags)
		.filter(({ type }) => type === "freeforms")
		.sort((a, b) => b.appearances - a.appearances);

	const topShips = Object.values(data.tags)
		.filter(({ type }) => type === "relationships")
		.filter(({ title }) => title.includes("/"))
		.sort((a, b) => b.appearances - a.appearances);

	const topPlatonicShips = Object.values(data.tags)
		.filter(({ type }) => type === "relationships")
		.filter(({ title }) => !title.includes("/"))
		.sort((a, b) => b.appearances - a.appearances);

	const topFandoms = Object.values(data.fandoms).sort(
		(a, b) => b.appearances - a.appearances
	);

	const topFics = Object.values(data.fics)
		.sort((a, b) => b.appearances - a.appearances)
		.map(fic => ({ ...fic, href: fic.title, title: fic.titleWithWords }));

	return (
		<>
			<List>
				<Top12Panel
					title={"Fandoms"}
					theme="dark"
					emojos={["🔖", "🕵️‍♀️"]}
					list={topFandoms}
				/>
				<Top12Panel
					title={"Tags"}
					emojos={["🔖", "🕵️‍♀️"]}
					list={topTags}
					info={
						"These are the most common freeform tags in the fics youve read"
					}
				/>
				<Top12Panel
					title={"Ships (slash)"}
					emojos={["🔖", "🕵️‍♀️"]}
					list={topShips}
					theme="red"
					info={"When they do the kissy kissy"}
				/>
				<Top12Panel
					title={"Ships (platonic)"}
					emojos={["🔖", "🕵️‍♀️"]}
					list={topPlatonicShips}
					theme="red"
					info={"When they dont do it"}
				/>
				<Top12Panel
					title={"Fics you kept coming back to"}
					emojos={["🔖", "🕵️‍♀️"]}
					showCount={c => `${c} times`}
					list={topFics}
				/>
			</List>
			<details>
				<summary>Hacker mode</summary>{" "}
				<fieldset>
					<h2>Manage local data</h2>
					<button onClick={onReset}>Delete</button>
				</fieldset>
				<fieldset>
					<pre>{JSON.stringify(data, null, 2)}</pre>{" "}
				</fieldset>
			</details>
		</>
	);
};

export default Data;
