import lol from "files/lol-1.png";
import "./style.scss";

const NothingFound = ({ text }) => (
	<div className="nothing">
		<img src={lol} alt="" />
		<span>{text || "내용이 없습니다"}</span>
	</div>
);

export default NothingFound;
