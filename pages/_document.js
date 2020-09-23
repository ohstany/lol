import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx);

		// Pass isProduction flag back through props
		return {
			...initialProps,
			url: ctx.req.url,
		};
	}

	render() {
		return (
			<Html lang="ko">
				<Head>
					<link rel="shortcut icon" href="/favicon.ico" />

					<meta name="msapplication-TileColor" content="#ffffff" />

					<meta name="theme-color" content="#ffffff" />

					<meta httpEquiv="X-UA-Compatible" content="IE=Edge" />
				</Head>

				<body className={"body"}>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
