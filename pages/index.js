import React from "react";
import { withRouter } from "next/router";
import { RootStore, RootProvider } from "store";
import { urlIntoTemplates } from "functions";
import Template from "Template";
import { CookiesProvider } from "react-cookie";
import api from "api";

const BaseTemplate = withRouter((props) => {
	return (
		<CookiesProvider>
			<RootProvider {...props}>
				<RootStore.Consumer>{() => <Template />}</RootStore.Consumer>
			</RootProvider>
		</CookiesProvider>
	);
});

// Perform SSR request on first page load
BaseTemplate.getInitialProps = async ({ asPath, req }) => {
	const headers = req ? req.headers : {};
	const urlTemplates = urlIntoTemplates(asPath, headers);

	// when SSR make syncronous request / otherwise skip request
	const ssrData =
		req && urlTemplates.urlTemplate[0] !== "landing"
			? (await api({
					method: "GET",
					action: urlTemplates.urlTemplate.join("/"),
			  })) || {}
			: false;

	return {
		ssrData,
		urlTemplates,
		headers,
	};
};

export default BaseTemplate;
