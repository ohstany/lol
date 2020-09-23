var toStr = Object.prototype.toString;

const isArray =
	Array.isArray ||
	function (obj) {
		return toStr.call(obj) === "[object Array]";
	};

const isBoolean = (obj) =>
	typeof obj === "boolean" || toString(obj) === "[object Boolean]";

// export const isObject = (obj) =>
// 	typeof obj === "object" && toString(obj) === "[object Object]";

export const isObject = (item) => {
	return item && typeof item === "object" && !Array.isArray(item);
};

const toString = (type) => toStr.call(type);

const getKey = (key) => {
	const intKey = parseInt(key);
	if (intKey.toString() === key) {
		return intKey;
	}
	return key;
};

const hasOwnProperty = (obj, prop) => {
	if (obj == null) {
		return false;
	}
	return Object.prototype.hasOwnProperty.call(obj, prop);
};

const hasShallowProperty = (obj, prop) =>
	(typeof prop === "number" && Array.isArray(obj)) ||
	hasOwnProperty(obj, prop);

const getShallowProperty = (obj, prop) => {
	if (hasShallowProperty(obj, prop)) {
		return obj[prop];
	}
};

const isEmpty = (value) => {
	if (!value) return true;

	if (isArray(value) && value.length === 0) {
		return true;
	} else if (typeof value !== "string") {
		for (var i in value) {
			if (hasOwnProperty(value, i)) {
				return false;
			}
		}
		return true;
	}
	return false;
};

export const emptyObjectPath = (obj, path) => {
	if (isEmpty(path)) {
		return void 0;
	}
	if (obj == null) {
		return void 0;
	}

	var value, i;

	if (!(value = objectPath.get(obj, path))) {
		return void 0;
	}

	if (typeof value === "string") {
		return setObjectPath(obj, path, "");
	} else if (isBoolean(value)) {
		return setObjectPath(obj, path, false);
	} else if (typeof value === "number") {
		return setObjectPath(obj, path, 0);
	} else if (isArray(value)) {
		value.length = 0;
	} else if (isObject(value)) {
		for (i in value) {
			if (hasShallowProperty(value, i)) {
				delete value[i];
			}
		}
	} else {
		return setObjectPath(obj, path, null);
	}
};

export const insertObjectPath = (obj, path, value, at) => {
	var arr = objectValue(obj, path);
	at = ~~at;
	if (!isArray(arr)) {
		arr = [];
		setObjectPath(obj, path, arr);
	}
	arr.splice(at, 0, value);
};

export const delObjectPath = (obj, path) => {
	if (typeof path === "number") {
		path = [path];
	}

	if (obj == null) {
		return obj;
	}

	if (isEmpty(path)) {
		return obj;
	}
	if (typeof path === "string") {
		return delObjectPath(obj, path.split("."));
	}

	const currentPath = getKey(path[0]);
	if (!hasShallowProperty(obj, currentPath)) {
		return obj;
	}

	if (path.length === 1) {
		if (isArray(obj)) {
			obj.splice(currentPath, 1);
		} else {
			delete obj[currentPath];
		}
	} else {
		return delObjectPath(obj[currentPath], path.slice(1));
	}

	return obj;
};

export const setObjectPath = (obj, path, value, doNotReplace) => {
	if (typeof path === "number") {
		path = [path];
	}

	if (!path || path.length === 0) {
		return obj;
	}

	if (typeof path === "string") {
		return setObjectPath(
			obj,
			path.split(".").map(getKey),
			value,
			doNotReplace
		);
	}

	const currentPath = path[0];
	const currentValue = getShallowProperty(obj, currentPath);

	if (path.length === 1) {
		if (currentValue === void 0 || !doNotReplace) {
			obj[currentPath] = value;
		}
		return currentValue;
	}

	if (currentValue === void 0) {
		if (typeof path[1] === "number") {
			obj[currentPath] = [];
		} else {
			obj[currentPath] = {};
		}
	}

	return setObjectPath(obj[currentPath], path.slice(1), value, doNotReplace);
};

export const objectValue = (obj, path) => {
	const parts = path.split(".");
	if (!obj) return;
	if (parts.length == 1) return obj[parts[0]];
	return objectValue(obj[parts[0]], parts.slice(1).join("."));
};

export const mergeDeep = (target, source) => {
	let output = Object.assign({}, target);
	if (isObject(target) && isObject(source)) {
		Object.keys(source).forEach((key) => {
			if (isObject(source[key])) {
				if (!(key in target))
					Object.assign(output, { [key]: source[key] });
				else output[key] = mergeDeep(target[key], source[key]);
			} else {
				Object.assign(output, { [key]: source[key] });
			}
		});
	}
	return output;
};

const arrayMoveMutate = (array, from, to) => {
	array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
};

export const arrayMove = (array, from, to) => {
	array = array.slice();
	arrayMoveMutate(array, from, to);
	return array;
};

export const make2sideFilter = (inpObj) => {
	if (!inpObj || !(inpObj instanceof Array)) return { o: {}, f: {} };

	const f = [];
	const o = inpObj.reduce((p, c) => {
		f.push({
			value: "" + c.ID,
			text: c.title,
		});

		return Object.assign({}, p, { ["" + c.ID]: c.title });
	}, {});

	return { o, f };
};

export const replaceKeyValue = (uFields, field, key, value) => {
	uFields.map((s1, x1) => {
		s1.items.map((s2, x2) => {
			if (s2.ID === field) {
				uFields[x1].items[x2][key] = value;
			}
		});
	});
};

// packs keys:values as object
// must pass keys as array like ["one", "two", "three"]
// output will be: {one: "value1", two: "value2", three: "value3"}
export const keysFromState = (keys, state) => {
	return keys instanceof Array
		? keys.reduce((p, n) => {
				return {
					...(typeof p === "object" ? p : {}),
					[n]: state[n],
				};
		  }, {})
		: {};
};

export const addKeys = (data, reverse = false, start = 0) => {
	return data instanceof Array && data !== undefined
		? data.map((row, key) => {
				row.key = reverse ? data.length - 1 - key : start + key;
				return row;
		  })
		: [];
};

export const keyByValue = (value, ct) => {
	const keys = Object.keys(ct);
	return keys[keys.findIndex((i) => ct[i] === value)];
};

export const removeFromArray = (arr, value) => {
	return arr.filter(function (ele) {
		return ele != value;
	});
};

export const swapKeyValue = (data) => {
	return Object.keys(data).reduce(
		(obj, key) => Object.assign({}, obj, { [data[key]]: key }),
		{}
	);
};
