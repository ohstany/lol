import { memo, useState } from "react";
import "./style.scss";

const Tooltip = memo(({ children, data = "", style = {}, className = "" }) => {
	const [t, _t] = useState(false);

	return (
		<div
			className={"tooltip" + (t ? " visible" : "") + " " + className}
			onMouseOver={() => data && _t(true)}
			onMouseLeave={() => _t(false)}>
			<div className="tarea" style={style}>
				{data}
				<div className="arrow-down"></div>
			</div>
			{children}
		</div>
	);
});

export default Tooltip;
