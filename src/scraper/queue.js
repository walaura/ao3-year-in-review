const queuePromisesCb = (max, promises, onDone = () => {}) => {
	let ongoing = 0;
	let q = [];
	let solved = [];
	const runPromise = promise => {
		ongoing++;
		promise().then(async val => {
			ongoing--;
			solved.push(val);

			if (q.length > 0) {
				runPromise(q.shift());
			}
			if (q.length <= 0 && ongoing <= 0) {
				onDone(solved);
			}
			return val;
		});
	};
	if (promises.length <= 0) {
		onDone([]);
		return;
	}

	promises.forEach(promise => {
		if (ongoing < max) {
			runPromise(promise);
		} else {
			q.push(promise);
		}
	});
};

const queuePromises = (max, promises) =>
	new Promise(yay => {
		queuePromisesCb(max, promises, yay);
	});

module.exports = queuePromises;
