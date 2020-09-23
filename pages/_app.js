import "core-js";

if (typeof window !== "undefined") {
	const ua = window.navigator.userAgent;
	if (
		ua.indexOf("MSIE") > 0 ||
		ua.indexOf("Edge") > 0 ||
		ua.indexOf("Trident") > 0
	) {
		require("promise-polyfill/src/polyfill");
		require("abortcontroller-polyfill/dist/polyfill-patch-fetch");
	}
} else {
	require("promise-polyfill");
	require("abortcontroller-polyfill");
}

import React from "react";
import App from "next/app";

export default class MyApp extends App {
	static async getInitialProps({ Component, ctx }) {
		return {
			isProduction: process.env.NODE_ENV === "production",
			pageProps: Component.getInitialProps
				? await Component.getInitialProps(ctx)
				: {},
		};
	}

	render() {
		const { Component, pageProps } = this.props;

		return <Component {...pageProps} />;
	}
}
