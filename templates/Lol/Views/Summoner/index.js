import {
	memo,
	useContext,
	useEffect,
	useMemo,
	useState,
	useCallback,
} from "react";
import { RootStore } from "store";
import { useRouter } from "next/router";
import Header from "Template/Layout/Header";
import { HeadingSkeleton } from "components/Skeleton";
import { numComma } from "functions";
import levelImg from "files/bg-levelbox.png";
import { Container, SubPage, Heading } from "Template/Layout";
import RightBar from "./RightBar";
import LeftBar from "./LeftBar";

import "./style.scss";

const SummonerHeading = (props) => {
	const {
		name,
		profileBorderImageUrl,
		profileImageUrl,
		level,
		previousTiers,
		ladderRank: { rank = 0, rankPercentOfTop = 0 } = {},
	} = props;

	return (
		<Heading>
			<div className="sheading gridStyle">
				{name ? (
					<>
						{previousTiers.length && (
							<div className="leagues">
								{previousTiers.map(
									({ shortString, tier }, ix) => (
										<span className="lDetail" key={ix}>
											<b>{shortString}</b> {tier}
										</span>
									)
								)}
							</div>
						)}

						<div className="summonerDetails">
							<div
								className="imageFrame"
								style={{
									backgroundImage: `url(${profileBorderImageUrl})`,
								}}>
								<div
									className="simage"
									style={{
										backgroundImage: `url(${profileImageUrl})`,
									}}
								/>
								<span
									className="level"
									style={{
										backgroundImage: `url(${levelImg})`,
									}}>
									{level}
								</span>
							</div>
							<div className="nameFrame">
								<h1>{name}</h1>
								<span>
									레더 랭킹 <b>{numComma(rank)}</b>위 (상위{" "}
									{rankPercentOfTop}%)
								</span>
							</div>
						</div>
					</>
				) : (
					<HeadingSkeleton />
				)}
			</div>
		</Heading>
	);
};

const Template = memo(
	() => {
		const store = useContext(RootStore);
		const [loaded, _loaded] = useState(false);

		const {
			actioner,
			store: {
				data_types: {
					summoner: { single },
				},
			},
			urlTemplates: {
				urlTemplate: [type, value],
			},
		} = store;

		// decode utf URL component
		const decodedValue = decodeURIComponent(value);

		const summoner = useMemo(() => single[decodedValue], [loaded]);

		const router = useRouter();

		const redirecTo = useCallback((summoner) => {
			router.push(`/`, `${type}/${decodeURIComponent(summoner)}`);
		}, []);

		useEffect(() => {
			if (summoner && summoner.matches) {
				const multipleLoader = [];

				summoner.matches.games.map(({ gameId }) => {
					multipleLoader.push({
						reduce: "GET_MATCH_DETAIL",
						action: `${type}/${decodedValue}/matchDetail/${gameId}`,
					});
				});

				if (multipleLoader.length > 0) {
					_loaded(false);
					actioner(multipleLoader).then(() => _loaded(true));
				}
			}
		}, [summoner && summoner.matches]);

		// console.log("store", store, type, value, single, summoner);

		useEffect(() => {
			const multipleLoader = [];

			const { name = false, mostInfo = false, matches } =
				single[value] || {};

			if (!name)
				multipleLoader.push({
					reduce: "GET_BASE_SUMMONER",
					action: `${type}/${decodedValue}`,
				});

			if (!mostInfo)
				multipleLoader.push({
					reduce: "GET_SUMMONER_MOSTINFO",
					action: `${type}/${decodedValue}/mostInfo`,
				});

			if (!matches)
				multipleLoader.push({
					reduce: "GET_SUMMONER_MATCHES",
					action: `${type}/${decodedValue}/matches`,
				});

			if (multipleLoader.length > 0) {
				_loaded(false);
				actioner(multipleLoader).then(() =>
					setTimeout(() => {
						_loaded(true);
					}, 500)
				);
			} else {
				_loaded(true);
			}
		}, [value]);

		return (
			<SubPage>
				<Header search={true} />

				<Container>
					<SummonerHeading {...summoner} />

					<LeftBar {...summoner} redirecTo={redirecTo} />

					<RightBar {...summoner} redirecTo={redirecTo} />
				</Container>
			</SubPage>
		);
	},
	() => true
);

export default Template;
