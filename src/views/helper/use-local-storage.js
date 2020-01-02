import { useState } from "react";

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

export default useLocalStorage;
