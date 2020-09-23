import { Header, Logo, HeaderFeatures, Container } from "Template/Layout";
import Link from "components/Link";
import { Logo as LogoSvg } from "components/Svg";
import dynamic from "next/dynamic";
import { memo } from "react";
import ModeChanger from "components/ModeChanger";
import "./styles.scss";

const Searcher = dynamic(() => import("components/Searcher"));

export default memo(({ search = false }) => {
	return (
		<Header>
			<Container>
				<Logo>
					<Link to="/">
						<LogoSvg />
					</Link>
				</Logo>

				<HeaderFeatures>
					{search && <Searcher size={"small"} />}
					<ModeChanger />
				</HeaderFeatures>
			</Container>
		</Header>
	);
});
