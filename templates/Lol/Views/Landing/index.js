import { memo, useContext } from "react";
import Searcher from "components/Searcher";
import Header from "Template/Layout/Header";
import lol from "files/lol-bg.jpeg";
import LogoParalax from "./LogoParalax";
import { Container, Landing } from "Template/Layout";
import "./styles.scss";
import { RootStore } from "store";

export default memo(() => {
	const {
		store: { darkmode },
	} = useContext(RootStore);

	return (
		<Landing
			background={darkmode ? "" : lol}
			style={darkmode ? { background: "#14191e" } : {}}>
			<Header />

			<LogoParalax />

			<Container>
				<Searcher />
			</Container>
		</Landing>
	);
});
