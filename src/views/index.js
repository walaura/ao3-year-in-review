import React, { useState } from "react";
import ReactDOM from "react-dom";
import List from "./list/list";
import { Top12Panel } from "./panel/panel";
import Retriever from "./retriever/retriever";
import Styles from "./styles";
import SignIn from "./views/sign-in";
import useLocalStorage from "./helper/use-local-storage";

const AllData = ({ data, onReset }) => {
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
		.map(fic => ({ ...fic, href: fic.title, title: "a" + fic.titleWithWords }));

	return (
		<>
			<List>
				<Top12Panel
					title={"Fandoms"}
					theme="dark"
					emojos={["🔖", "🕵️‍♀️"]}
					list={topFandoms}
					info={
						"These are the most common freeform tags in the fics youve read"
					}
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

const Router = () => {
	const [data, setData] = useLocalStorage("my-data");
	if (data && data.fics) {
		return (
			<AllData
				data={data}
				onReset={() => {
					setData({});
				}}
			/>
		);
	} else {
		return (
			<SignIn>
				<fieldset>
					<h2>Login</h2>
					<Retriever onNewData={setData}></Retriever>
				</fieldset>
			</SignIn>
		);
	}
};

const App = () => {
	return (
		<>
			<Styles />
			<Router />
		</>
	);
};

ReactDOM.render(<App />, document.getElementById("app"));
