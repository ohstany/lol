import { memo, useContext } from "react";
import views from "Template/Views";
import { RootStore } from "store";
import "./template.scss"; // global scss

const Template = memo(
	() => {
		const {
			urlTemplates: {
				urlTemplate: [data_type],
			},
		} = useContext(RootStore);

		// get template dynamically accorging to URL type
		const View = views(data_type || "landing");

		return <View />;
	},
	() => true
);

export default Template;
