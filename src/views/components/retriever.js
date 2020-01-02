import React, { useState } from "react";
import { fail, preflight, progress } from "../../shared/const";
import useLocalStorage from "../helper/use-local-storage";

let previousPartialValue = "";
const onData = async (stream, callback = () => {}) => {
	const { value, done } = await stream.read();
	const parsedValue = new TextDecoder("utf-8").decode(value);

	if (parsedValue.charAt(parsedValue.length - 1) !== "]") {
		previousPartialValue += parsedValue;
		return onData(stream, callback);
	}

	const [type, jsonValue] = JSON.parse(previousPartialValue + parsedValue);

	previousPartialValue = "";
	console.log("data");
	console.log([done, jsonValue]);

	if (type === progress) {
		callback(jsonValue);
	}
	if (type === fail) {
		throw jsonValue;
	}
	if (type === preflight) {
		return jsonValue;
	}
	if (!done) {
		return onData(stream, callback);
	}
};

const fetchData = async (cookie, callback = () => {}) => {
	const stream = await fetch(`/ao3-stream?cookie=${cookie}`).then(response =>
		response.body.getReader()
	);
	const data = await onData(stream, callback);
	stream.cancel();
	return data;
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
						console.error(err);
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

export default Retriever;
