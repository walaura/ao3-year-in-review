import React from "react";
import ReactDOM from "react-dom";
import useLocalStorage from "./helper/use-local-storage";
import Retriever from "./components/retriever";
import Styles from "./styles";
import Data from "./views/data";
import SignIn from "./views/sign-in";

const Router = () => {
	const [data, setData] = useLocalStorage("my-data");
	if (data && data.fics) {
		return (
			<Data
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
