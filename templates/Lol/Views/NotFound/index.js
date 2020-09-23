import { memo } from "react";
import Header from "Template/Layout/Header";
import { Container, SubPage } from "Template/Layout";
import NothingFound from "components/NothingFound";

import "./style.scss";

const Template = memo(
	() => {
		return (
			<SubPage>
				<Header search={true} />

				<div className="notfound">
					<Container>
						<NothingFound />
					</Container>
				</div>
			</SubPage>
		);
	},
	() => true
);

export default Template;
