const { memo, useEffect, useContext } = require("react");
import { Night, Day } from "components/Svg";
import { checkDay } from "functions";
import { RootStore } from "store";

export default memo(
	() => {
		const {
			store: { darkmode },
			actioner,
		} = useContext(RootStore);

		const changeMode = (mode) => {
			actioner({
				reduce: "CHANGE_MODE",
				api: false,
				data: { mode },
			});
		};

		useEffect(() => {
			if (checkDay() === "dark") {
				changeMode("dark");
			}
		}, []);

		return (
			<div
				className="shiftBtn"
				onClick={changeMode}
				style={{ display: "inline-block" }}>
				{darkmode ? <Day fill={"white"} /> : <Night fill={"white"} />}
			</div>
		);
	},
	() => true
);
