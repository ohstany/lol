import React, { useState, useEffect } from "react";
import "./style.scss";

export default (props) => {
	const {
		percent,
		bg1 = "#3cb95e",
		bg2 = "rgb(238, 90, 82)",
		symbol = "%",
	} = props;

	const [perc, sperc] = useState(percent ? percent : 0);

	useEffect(() => {
		sperc(percent);
	}, [percent]);

	const degs = (360 * parseInt(perc)) / 100;

	return (
		<div className={"progress-pie-chart" + (perc <= 50 ? " halfed" : "")}>
			<div className="ppc-progress">
				<div
					className="ppc-progress-fill"
					style={{
						background: bg2,
						transform:
							"rotate(" + (degs >= 180 ? 180 : degs) + "deg)",
					}}
				/>
				<div
					className="ppc-progress-fill"
					style={{
						background: bg2,
						transform:
							"rotate(" +
							(degs > 180 ? (degs <= 360 ? degs : 360) : 0) +
							"deg)",
					}}
				/>
			</div>
			<div
				className="ppc-percents"
				style={bg1 ? { borderColor: bg1 } : {}}
			/>
			<div className="pcc-percents-wrapper">
				<span>
					{perc}
					{symbol}
				</span>
			</div>
		</div>
	);
};
