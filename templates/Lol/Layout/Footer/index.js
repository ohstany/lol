import { Container, Footer } from "Template/Layout";
import "./styles.scss";

export default () => (
	<Footer>
		<Container>
			<ul>
				<li>
					<a href="#">About OP.GG</a>
				</li>
				<li>
					<a href="#">Logo History</a>
				</li>
				<li>
					<a href="#">Privacy Policy</a>
				</li>
				<li>
					<a href="#">Help</a>
				</li>
				<li>
					<a href="#">Business</a>
				</li>
				<li>
					<a href="#">Advertise</a>
				</li>
				<li>
					<a href="#">Feedback</a>
				</li>
			</ul>

			<div className="copyright">
				© 2012-2020 OP.GG. OP.GG isn’t endorsed by Riot Games and
				doesn’t reflect the views or opinions of Riot Games or anyone
				officially involved in producing or managing League of Legends.
				League of Legends and Riot Games are trademarks or registered
				trademarks of Riot Games, Inc. League of Legends © Riot Games,
				Inc.
			</div>
		</Container>
	</Footer>
);
