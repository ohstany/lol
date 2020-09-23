import settings from "./config";
import fetch from "isomorphic-unfetch";

const api = async (_params, _signal = false, methods = false) => {
	const pass = {
		method: _params.method ? _params.method : "POST",
		// credentials: "include",
		credentials: "same-origin",
	};

	if (pass.method !== "GET" && pass.method !== "HEAD") {
		if (_params.upload) {
			const formData = new FormData();
			formData.append("data", JSON.stringify(_params));
			if (_params.upload !== undefined)
				formData.append("upload", _params.upload);
			pass.body = formData;
		} else {
			pass.body = JSON.stringify(_params ? _params : {});
		}
	}

	// do request
	try {
		if (_params.action) {
			const fetchPath =
				settings.apipath +
				settings.apiver +
				_params.action +
				(_params.params || "");

			// console.log("API", fetchPath);

			return await fetch(
				fetchPath,
				_signal ? { ...pass, signal: _signal.signal } : pass
			)
				.then((d) => d.json())
				.then((d) => d);
		}
	} catch (e) {
		// cancel api call if something goes wrong
		console.log("Request Aborted..", e);
	}
	return false;
};

export default api;
