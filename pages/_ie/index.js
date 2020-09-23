import React from "react";
import "./style.css";

export default function() {
	return (
		<div className="ieblock">
			<div className="browserblock">
				<p className="brp">
					<img src="/static/img/chrome.png" alt="" />
					<br />
					<span>
						현재 <b>크롬브라우저</b>에 최적화 되어 있습니다.
					</span>
					<br />
					<span>
						<b>크롬브라우저</b>를 이용해 주시길 권장합니다.
					</span>
				</p>
			</div>
			<img className="pagesample" src="/static/img/sample.png" alt="" />
		</div>
	);
}
