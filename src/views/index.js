import React, { useState } from "react";
import ReactDOM from "react-dom";

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

const App = () => {
	const [data, setData] = useLocalStorage("my-data");
	return (
		<div>
			<fieldset>
				<p>
					<h2>help???</h2>
					<ol>
						<li>
							Paste your{" "}
							<a href="https://imgur.com/a/EL9eDI1">_otwarchive_session</a>
							cookie in the cookie input field right under
						</li>
						<li>Hit "load stuffs"</li>
					</ol>
				</p>
			</fieldset>
			<fieldset>
				<h2>Login</h2>
				<Retriever onNewData={setData}></Retriever>
			</fieldset>
			<fieldset>
				<h2>Manage local data</h2>
				<button
					onClick={() => {
						setData({});
					}}
				>
					Delete
				</button>
			</fieldset>

			<hr />
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
};

ReactDOM.render(<App />, document.getElementById("app"));
