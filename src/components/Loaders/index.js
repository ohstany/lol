import React, { memo } from "react";
import "./styles.scss";

// animate: flicker / rotate
export const ImageLoader = memo(({ image, animate = "flicker" }) => {
	return (
		<div className={"loading " + animate}>
			<img src={image} alt="" />
		</div>
	);
});

export const Spinner = memo(({ show }) =>
	show ? <div className="spinner"></div> : ""
);
