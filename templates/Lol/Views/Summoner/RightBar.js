import { useMemo, useState } from "react";
import Chart from "components/Chart";
import { Skeleton } from "components/Skeleton";
import Tooltip from "components/Tooltip";
import wardblue from "files/ward-blue.png";
import wardred from "files/ward-red.png";
import buildblue from "files/buildblue.png";
import buildred from "files/buildred.png";
import nouser from "files/nou.png";
import down from "files/down.png";
import mid from "files/mid.png";
import top from "files/top.png";
import itemsJson from "./items.json";
import {
	colors,
	calcKda,
	timeLength,
	dateFromNow,
	dateToFormat,
} from "functions";

const tabs = [
	{
		value: "전체",
		filter: false,
	},
	{
		value: "솔로게임",
		filter: "솔랭",
	},
	{
		value: "자유랭크",
		filter: "자유 5:5 랭크",
	},
];

const RightBar = (props) => {
	const {
		matches: { games = [], champions = [], positions = [] } = {},
		redirecTo,
		matchDetail,
	} = props;

	const [tab, _tab] = useState(0);

	const {
		gamesList,
		stat: { perc, killsAvg, kda, deathsAvg, assistsAvg, wins, losses } = {},
	} = useMemo(() => {
		const gamesList = games
			? tab === 0
				? games
				: games.filter((i) => i.gameType == tabs[tab].filter)
			: [];

		const stat = gamesList.reduce(
			(
				p,
				{ isWin, stats: { general: { assist, death, kill } = {} } = {} }
			) => {
				return {
					wins: (p.wins || 0) + (isWin ? 1 : 0),
					losses: (p.losses || 0) + (isWin ? 0 : 1),
					games: (p.games || 0) + 1,
					assists: (p.assists || 0) + assist,
					deaths: (p.deaths || 0) + death,
					kills: (p.kills || 0) + kill,
				};
			},
			{}
		);

		stat.kda = calcKda(stat);
		stat.killsAvg = (stat.kills / stat.games).toFixed(1);
		stat.deathsAvg = (stat.deaths / stat.games).toFixed(1);
		stat.assistsAvg = (stat.assists / stat.games).toFixed(1);
		stat.perc = ((stat.wins * 100) / (stat.wins + stat.losses)).toFixed(0);

		return {
			gamesList,
			stat,
		};
	}, [tab, games.length]);

	// console.log("props", props, gamesList, matchDetail);

	return (
		<div className="rightBar">
			<div className="filter gridStyle" style={{ padding: 0 }}>
				<div className="tabs">
					{tabs.map((i, ix) => {
						return (
							<span
								className={ix === tab ? "current" : ""}
								onClick={() => _tab(ix)}
								key={ix}>
								{i.value}
							</span>
						);
					})}
				</div>
				<div className="summary">
					{wins === undefined ? (
						<Skeleton row={2} />
					) : (
						<ul>
							<li>
								<span>
									{wins + losses}전 {wins}승 {losses}패
								</span>
								<div className="chart">
									<Chart
										percent={perc}
										bg1="rgb(238, 90, 82)"
										bg2={"rgb(31, 142, 205)"}
									/>
								</div>
								<div className="stats">
									<span>
										{killsAvg} /{" "}
										<strong style={{ color: colors.r }}>
											{assistsAvg}
										</strong>{" "}
										/ {deathsAvg}
									</span>
									<span style={{ color: colors.r }}>
										<strong
											style={{
												color:
													colors[
														parseInt(kda) >= 5
															? 5
															: parseInt(kda)
													] || "inherit",
											}}>
											{kda}:1
										</strong>
										({" " + perc}%)
									</span>
								</div>
							</li>

							<li>
								{champions.map(
									(
										{
											imageUrl,
											losses,
											name,
											wins,
											kills,
											games,
											deaths,
											assists,
										},
										ix
									) => {
										const kda = calcKda({
											kills,
											games,
											deaths,
											assists,
										});

										const perc = (
											(wins * 100) /
											(wins + losses)
										).toFixed(0);

										return (
											<div className="mate" key={ix}>
												<span>
													<img src={imageUrl} />
												</span>
												<span>
													<span className="name">
														{name}
													</span>
													<strong
														style={
															perc >= 60
																? {
																		color:
																			colors.r,
																  }
																: {}
														}>
														{perc}%
													</strong>{" "}
													({wins}승 {losses}패){" | "}
													<strong
														style={{
															color:
																colors[
																	parseInt(
																		kda
																	) >= 5
																		? 5
																		: parseInt(
																				kda
																		  )
																] || "inherit",
														}}>
														{kda}
													</strong>{" "}
													평점
												</span>
											</div>
										);
									}
								)}
								{champions.length < 3 && (
									<div className="mate">
										<span>
											<img src={nouser} alt="" />
										</span>
										<span>챔피언 정보가 없습니다.</span>
									</div>
								)}
							</li>

							<li>
								<span>선호 포지션 (랭크)</span>
								{positions.map(({ losses, wins }, ix) => {
									return (
										<span key={ix}>
											<img
												src={ix === 0 ? mid : top}
												alt=""
											/>
											<span>
												{ix === 0 ? "탑" : "정글"}
											</span>
											<span>
												{(
													(wins * 100) /
													(wins + losses)
												).toFixed(0)}
												% 승률 | 47%
											</span>
										</span>
									);
								})}
							</li>
						</ul>
					)}
				</div>
			</div>

			{gamesList.map(
				(
					{
						gameType,
						createDate,
						gameId,
						gameLength,
						isWin,
						needRenew,
						items,
						stats: {
							general: {
								kill,
								assist,
								death,
								kdaString,
								cs,
								csPerMin,
								largestMultiKillString,
								contributionForKillRate,
								opScoreBadge,
							} = {},
							ward: { visionWardsBought },
						} = {},
						spells,
						summonerName,
						champion: { imageUrl, level } = {},
					},
					ix
				) => {
					const status = needRenew ? "n" : isWin ? "4" : "r";

					return (
						<div
							className={`filter game gridStyle c${status}`}
							style={{ padding: 0 }}
							key={ix}>
							<ul>
								<li>
									<span>{gameType}</span>
									<span>
										<Tooltip
											data={dateToFormat(
												createDate,
												"TTTT"
											)}>
											{dateFromNow(createDate)}
										</Tooltip>
									</span>
									<span className="sep" />
									<span
										style={{
											color: colors[status],
										}}>
										{needRenew
											? "다시하기"
											: isWin
											? "승리"
											: "패배"}
									</span>
									<span>{timeLength(gameLength)}</span>
								</li>
								<li>
									<span>
										<img src={imageUrl} alt="" />
										<div className="spells">
											{spells.map(({ imageUrl }, ix) => (
												<Tooltip data={""} key={ix}>
													<img
														className="spell"
														src={imageUrl}
														alt=""
														key={ix}
													/>
												</Tooltip>
											))}
										</div>
									</span>
									<span className="name">{summonerName}</span>
								</li>
								<li>
									<span>
										{kill} /{" "}
										<strong style={{ color: colors.r }}>
											{assist}
										</strong>{" "}
										/ {death}
									</span>
									<span>
										<strong style={{ fontWeight: "bold" }}>
											{kdaString}
										</strong>{" "}
										평점
									</span>
									<span>
										{largestMultiKillString && (
											<b className="sp1">
												{largestMultiKillString}
											</b>
										)}
										{opScoreBadge && (
											<b className="sp2">
												{opScoreBadge}
											</b>
										)}
									</span>
								</li>
								<li>
									<span>레벨{level}</span>
									<span>
										{cs} ({csPerMin}) CS
									</span>
									<span
										style={{
											color: colors.r,
											fontWeight: "bold",
										}}>
										<Tooltip data="킬관여율">
											킬관여 {contributionForKillRate}
										</Tooltip>
									</span>
								</li>
								<li>
									<span>
										{[
											...items,
											...Array.from({
												length: 7 - items.length,
											}),
										].map(({ imageUrl } = {}, ix) => {
											const index = imageUrl
												? imageUrl
														.split("/")
														.reverse()[0]
														.split(".")[0] || ""
												: "";

											const { description } =
												itemsJson.data[index] || {};

											return imageUrl ? (
												<Tooltip
													className="wide"
													data={
														<div
															dangerouslySetInnerHTML={{
																__html: description,
															}}
														/>
													}
													key={ix}>
													<img
														src={imageUrl}
														alt=""
														key={ix}
													/>
												</Tooltip>
											) : (
												<i key={ix} />
											);
										})}

										<Tooltip data={"빌드"} key={ix}>
											<img
												src={
													isWin ? buildblue : buildred
												}
												alt=""
											/>
										</Tooltip>
									</span>
									<span>
										<img
											className="ward"
											src={isWin ? wardblue : wardred}
											alt=""
										/>{" "}
										제어 와드 {visionWardsBought}
									</span>
								</li>
								<li>
									{matchDetail &&
										matchDetail[gameId] &&
										matchDetail[gameId].teams.map(
											({ players }, ix) => (
												<ul className="team" key={ix}>
													{players.map(
														(
															{
																summonerName,
																champion: {
																	imageUrl,
																} = {},
															},
															sx
														) => (
															<li
																onClick={() =>
																	redirecTo(
																		summonerName
																	)
																}
																key={sx}>
																<img
																	src={
																		imageUrl
																	}
																	alt=""
																/>
																{summonerName}
															</li>
														)
													)}
												</ul>
											)
										)}
								</li>
								<li className="opener">
									<img src={down} alt="" />
								</li>
							</ul>
						</div>
					);
				}
			)}
		</div>
	);
};

export default RightBar;
