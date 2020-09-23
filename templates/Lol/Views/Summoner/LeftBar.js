import { useState } from "react";
import { Skeleton } from "components/Skeleton";
import unranked from "files/unranked.png";
import { colors, calcKda } from "functions";

const Champions = ({ data }) => {
	return (
		<>
			{data
				.sort((a, b) => (a.games > b.games ? -1 : 1))
				.map(
					(
						{
							assists,
							cs,
							deaths,
							games,
							imageUrl,
							name,
							kills,
							losses,
							wins,
						},
						ix
					) => {
						const kda = calcKda({ kills, assists, deaths, games });

						const percentage = (
							(wins * 100) /
							(wins + losses)
						).toFixed(0);

						return (
							<div className="champData" key={ix}>
								<span className="imgs">
									<img src={imageUrl} alt="" />
								</span>
								<ul>
									<li>
										<span className="name">{name}</span>
										<span>
											CS {(cs / games).toFixed(1)} (2.4)
										</span>
									</li>
									<li>
										<span
											style={{
												color:
													colors[
														parseInt(kda) >= 5
															? 5
															: parseInt(kda)
													] || "inherit",
											}}>
											{kda}:1 평점
										</span>
										<span>
											{`${(kills / games).toFixed(
												1
											)} / ${(assists / games).toFixed(
												1
											)} / ${(deaths / games).toFixed(
												1
											)}`}
										</span>
									</li>
									<li>
										<span
											style={{
												color:
													percentage >= 60
														? colors.r
														: "inherit",
											}}>
											{percentage}%
										</span>
										<span>{games} 게임</span>
									</li>
								</ul>
							</div>
						);
					}
				)}
		</>
	);
};

const ChampionsLatest = ({ data }) => {
	return (
		<>
			{data.map(({ imageUrl, losses, name, wins }, ix) => {
				const s = ((wins * 100) / (wins + losses)).toFixed(0);
				return (
					<div className="champData" key={ix}>
						<span className="imgs">
							<img src={imageUrl} alt="" />
						</span>
						<ul
							style={{
								marginTop: 11,
							}}>
							<li>
								<span className="name">{name}</span>
							</li>
							<li>
								<span>{s}%</span>
							</li>
							<li style={{ width: "70%" }}>
								<span className="wrange">
									<span
										style={{
											width: `${s}%`,
											background: "#28a6ee",
										}}
									/>
									<b>{wins}승</b>
									<b>{losses}패</b>
								</span>
							</li>
						</ul>
					</div>
				);
			})}
		</>
	);
};

const LeftBar = ({ leagues, mostInfo }) => {
	const [tab, _tab] = useState(0);

	return (
		<div className="leftBar">
			{leagues
				? leagues.map(
						(
							{
								losses,
								wins,
								hasResults,
								tierRank: {
									imageUrl,
									lp,
									name,
									tier,
									tierRankPoint,
								} = {},
							},
							ix
						) => (
							<div className={`gridStyle rank rn${ix}`} key={ix}>
								<div className="imgside">
									<img
										src={hasResults ? imageUrl : unranked}
										alt=""
									/>
								</div>

								<div className="rdetails">
									<span className="type">{name}</span>
									{hasResults ? (
										<>
											<span className="status">{`${tier} ${tierRankPoint}`}</span>
											<span>
												<b>{lp} LP</b> / {wins}승{" "}
												{losses}패
											</span>
											<span>
												승률{" "}
												{(
													(wins * 100) /
													(wins + losses)
												).toFixed(1)}
												%
											</span>
										</>
									) : (
										<span className="unranked">
											Unranked
										</span>
									)}
								</div>
							</div>
						)
				  )
				: Array.from({ length: 2 }).map((i, ix) => (
						<div className="gridStyle" key={ix}>
							<Skeleton row={2} />
						</div>
				  ))}

			<div className="gridStyle champions" style={{ padding: 0 }}>
				<div className="tabs">
					{["챔피언 승률", "7일간 랭크 승률"].map((i, ix) => (
						<span
							className={tab === ix ? "current" : ""}
							key={ix}
							onClick={() => _tab(ix)}>
							{i}
						</span>
					))}
				</div>

				{mostInfo ? (
					<div className="contents">
						{["champions", "recentWinRate"].map((i, ix) => (
							<div
								className={`contab${
									ix === tab ? " current" : ""
								}`}
								key={ix}>
								{i === "champions" ? (
									<Champions
										current={ix === tab}
										data={mostInfo[i]}
										key={ix}
									/>
								) : (
									<ChampionsLatest
										current={ix === tab}
										data={mostInfo[i]}
										key={ix}
									/>
								)}
							</div>
						))}
					</div>
				) : (
					<Skeleton row={2} />
				)}
			</div>
		</div>
	);
};

export default LeftBar;
