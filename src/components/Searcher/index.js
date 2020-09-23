import {
	memo,
	useState,
	useEffect,
	useContext,
	useCallback,
	useMemo,
} from "react";
import { Star } from "components/Svg";
import { SearchBox } from "Template/Layout";
import { Skeleton } from "components/Skeleton";
import NoSsr from "components/NoSsr";
import { debounce, numComma } from "functions";
import { RootStore } from "store";
import NothingFound from "components/NothingFound";
import trophyImg from "files/trophy.png";
import close from "files/closer.png";
import lvlbox from "files/bg-levelbox.png";
import { useRouter } from "next/router";
import "./style.scss";

export default memo(({ size = "large" }) => {
	const router = useRouter();

	const {
		store: {
			data_types: {
				summoner: { recent, search, favourite },
			},
		},
		actioner,
	} = useContext(RootStore);

	const [type, _type] = useState("");
	const [spinner, _spinner] = useState(false);
	const [pop, _pop] = useState({
		show: false,
		tab: 0,
	});

	// console.log("store", recent, search, favourite);

	useEffect(() => {
		if (pop) {
			window.addEventListener("click", clickOut);
			return () => window.removeEventListener("click", clickOut);
		}
	}, [pop.show]);

	const redirecTo = useCallback((path) => {
		_pop((p) => ({ ...p, show: false }));
		router.push("/", path);
	}, []);

	const clickOut = (e) => {
		if (!document.getElementById("searchBox").contains(e.target)) {
			_pop((p) => ({ ...p, show: false }));
		}
	};

	const setTab = useCallback((tab) => {
		_pop((p) => ({ ...p, tab, show: true }));
	}, []);

	// do search using debounce method preventing execution at each rerender
	const _doSearch = useCallback(
		debounce((value) => {
			actioner({
				api: value || false,
				reduce: "SEARCH_SUMMONER",
				params: `/${value}`,
			});

			setTimeout(() => {
				_spinner((p) => !p);
			}, 500);
		}, 1000),
		[]
	);

	const _addFavourites = useCallback((name) => {
		name &&
			actioner({
				api: false,
				reduce: "ADD_FAVOURITES",
				data: { name },
			});
	}, []);

	const _removeFavourites = useCallback((name) => {
		name &&
			actioner({
				api: false,
				reduce: "REMOVE_FAVOURITES",
				data: { name },
			});
	}, []);

	const _removeRecent = useCallback((name) => {
		name &&
			actioner({
				api: false,
				reduce: "REMOVE_RECENT",
				data: { name },
			});
	}, []);

	const SummonerSmall = useCallback(
		({
			name,
			level,
			profileImageUrl,
			ladderRank: { rank } = {},
			remove = false,
			favourite = false,
			checked = false,
			type,
		}) => {
			return (
				<div className="summonerSmall">
					<div
						className="simg"
						onClick={() => redirecTo(`/summoner/${name}`)}>
						<img src={profileImageUrl} alt={name} />
					</div>
					<div
						className="sdet"
						onClick={() => redirecTo(`/summoner/${name}`)}>
						<span className="sname">{name}</span>

						<span
							className="level"
							style={{
								backgroundImage: `url(${lvlbox})`,
							}}>
							{numComma(level)}
						</span>

						{rank && (
							<span className="rank">
								<img src={trophyImg} alt="" /> {numComma(rank)}
							</span>
						)}
					</div>
					<div className="sactions">
						{favourite && (
							<span className="favourite">
								<Star
									onClick={() =>
										checked
											? _removeFavourites(name)
											: _addFavourites(name)
									}
									fill={checked ? "#ffce1a" : "#cdcdcd"}
								/>
							</span>
						)}

						{remove && (
							<span className="remove">
								<img
									src={close}
									alt=""
									onClick={() =>
										type === "favourite"
											? _removeFavourites(name)
											: _removeRecent(name)
									}
								/>
							</span>
						)}
					</div>
				</div>
			);
		},
		[]
	);

	const tabs = useMemo(
		() => [
			{
				title: "검색결과",
				Component: ({ ix }) => (
					<div className={`tab t${ix}`}>
						{spinner ? (
							<Skeleton row={3} />
						) : search.length ? (
							search.map((sum, ix) => (
								<SummonerSmall
									{...sum}
									key={ix}
									type="search"
								/>
							))
						) : (
							<NothingFound />
						)}
					</div>
				),
			},
			{
				title: "최근검색",
				Component: ({ ix }) => (
					<div className={`tab t${ix}`}>
						{recent.length ? (
							recent.map((sum, ix) => (
								<SummonerSmall
									{...sum}
									key={ix}
									remove={true}
									favourite={true}
									checked={
										favourite.length &&
										favourite.findIndex(
											(i) => i.name === sum.name
										) >= 0
									}
									type="recent"
								/>
							))
						) : (
							<NothingFound />
						)}
					</div>
				),
			},
			{
				title: "즐겨찾기",
				Before: (props) => <Star fill="#e6e6e6" {...props} />,
				Component: ({ ix }) => (
					<div className={`tab t${ix}`}>
						{favourite.length ? (
							favourite.map((sum, ix) => (
								<SummonerSmall
									{...sum}
									key={ix}
									remove={true}
									type="favourite"
								/>
							))
						) : (
							<NothingFound />
						)}
					</div>
				),
			},
		],
		[pop.tab, spinner]
	);

	return (
		<NoSsr>
			<SearchBox size={size + (pop.show ? " visible" : "")}>
				<label>
					<span>KR</span>
					<input
						placeholder="소환자 이름 찾아보세요"
						value={type}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								console.log("e", e.target.value);
							}
						}}
						onChange={({ target: { value } }) => {
							_type(value);
							_spinner(true);
							_doSearch(value);
							_pop((p) => ({ ...p, tab: 0 }));
						}}
						onFocus={() => _pop((p) => ({ ...p, show: true }))}
					/>
				</label>

				{pop.show && (
					<div className="searchpop">
						<div className="tabs">
							{!type &&
								tabs.map(({ title, Before = () => "" }, ix) => (
									<div
										className={`tabsw tsw${ix}${
											ix === pop.tab ? " current" : ""
										}`}
										onClick={() => setTab(ix)}
										key={ix}>
										<Before className="tabstar" />
										{title}
									</div>
								))}
						</div>

						<div className="tabContents">
							{tabs.map(({ Component }, ix) => {
								return ix === pop.tab ? (
									<Component key={ix} ix={ix} />
								) : (
									""
								);
							})}
						</div>
					</div>
				)}
			</SearchBox>
		</NoSsr>
	);
});
