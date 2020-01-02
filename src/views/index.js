import React, { useState } from "react";
import ReactDOM from "react-dom";

import { preflight, progress } from "../shared/const";

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
		<div style={{ display: "flex" }}>
			<input
				placeholder="your ao3 cookie"
				value={cookie.val}
				onChange={ev => setCookie({ val: ev.target.value })}
			></input>
			<button
				disabled={progress !== 1}
				onClick={async () => {
					setProgress(0);
					onNewData(await fetchData(cookie.val, setProgress));
				}}
			>
				load stuffs
			</button>
			{progress !== 1 && <div>{progress * 100}%</div>}
		</div>
	);
};

const App = () => {
	const [data, setData] = useLocalStorage("my-data");
	return (
		<div>
			<fieldset>
				<Retriever onNewData={setData}></Retriever>
			</fieldset>
			<hr />
			<fieldset>
				<button
					onClick={() => {
						setData({});
					}}
				>
					Delete
				</button>
			</fieldset>

			<hr />
			<pre>{JSON.stringify(data)}</pre>
		</div>
	);
};

ReactDOM.render(<App />, document.getElementById("app"));
