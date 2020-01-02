import React, { useState } from "react";
import ReactDOM from "react-dom";
import Panel, { Top12Panel } from "./panel/panel";
import List from "./list/list";
import Styles from "./styles";
import { preflight, progress, error } from "../shared/const";

const useLocalStorage = key => {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : {};
		} catch (error) {
			return {};
		}
	});

	return [
		storedValue,
		value => {
			window.localStorage.setItem(key, JSON.stringify(value));
			setStoredValue(value);
		}
	];
};

const onData = async (stream, callback = () => {}) => {
	const { value, done } = await stream.read();
	const [type, jsonValue] = JSON.parse(new TextDecoder("utf-8").decode(value));
	console.log("data");
	console.log([done, jsonValue]);
	if (type === progress) {
		callback(jsonValue);
	}

	if (type === error) {
		throw jsonValue;
	}
	if (type === preflight) {
		return jsonValue;
	} else if (!done) {
		return onData(stream, callback);
	}
};

const fetchData = async (cookie, callback = () => {}) => {
	const stream = await fetch(`/ao3-stream?cookie=${cookie}`).then(response =>
		response.body.getReader()
	);
	return onData(stream, callback);
};

const Retriever = ({ onNewData }) => {
	const [progress, setProgress] = useState(1);
	const [cookie, setCookie] = useLocalStorage("ao3-cookie");
	return (
		<form
			onSubmit={ev => {
				ev.preventDefault();
				setProgress(0);
				fetchData(cookie.val, setProgress)
					.then(onNewData)
					.catch(err => {
						alert(err);
						setProgress(1);
					});
			}}
			style={{ display: "flex" }}
		>
			<input
				style={{ flex: "1 1 0" }}
				placeholder="your ao3 cookie"
				value={cookie.val}
				onChange={ev => setCookie({ val: ev.target.value })}
			></input>
			<button type="submit" disabled={progress !== 1}>
				load stuffs
			</button>
			{progress !== 1 && <div>{progress * 100}%</div>}
		</form>
	);
};

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

	return (
		<>
			<List>
				<Top12Panel
					title={"Top tags"}
					emojos={["🔖", "🕵️‍♀️"]}
					list={topTags}
					info={
						"These are the most common freeform tags in the fics youve read"
					}
				/>
				<Top12Panel
					title={"Slash ships"}
					emojos={["🔖", "🕵️‍♀️"]}
					list={topShips}
					info={"When they do the kissy kissy"}
				/>
				<Top12Panel
					title={"Platonic ships"}
					emojos={["🔖", "🕵️‍♀️"]}
					list={topPlatonicShips}
					info={"When they dont do it"}
				/>
			</List>
			<fieldset>
				<h2>Manage local data</h2>
				<button onClick={onReset}>Delete</button>
			</fieldset>
			<fieldset>
				<pre>{JSON.stringify(data, null, 2)}</pre>{" "}
			</fieldset>
		</>
	);
};

const App = () => {
	const [data, setData] = useLocalStorage("my-data");

	if (data && data.fics) {
		return (
			<>
				<Styles />
				<AllData
					data={data}
					onReset={() => {
						setData({});
					}}
				/>
			</>
		);
	}

	return (
		<div>
			<fieldset>
				<h2>help???</h2>
				<ol>
					<li>
						Paste your{" "}
						<a href="https://imgur.com/a/EL9eDI1">_otwarchive_session</a> cookie
						in the cookie input field right under
					</li>
					<li>Hit "load stuffs"</li>
				</ol>
			</fieldset>
			<fieldset>
				<h2>Login</h2>
				<Retriever onNewData={setData}></Retriever>
			</fieldset>
		</div>
	);
};

ReactDOM.render(<App />, document.getElementById("app"));
