export const Landing = ({ background = false, children, style = {} }) => (
	<div className="landing">
		<div
			className="background"
			style={{
				...(background
					? { backgroundImage: `url(${background})` }
					: {}),
				...style,
			}}
		/>
		{children}
	</div>
);

export const SearchBox = ({ size = "large", children }) => (
	<div id="searchBox" className={"searchBox " + size}>
		{children}
	</div>
);

export const Logo = ({ children }) => <div className="logo">{children}</div>;

export const Header = ({ children }) => (
	<div id="header" className="header">
		{children}
	</div>
);

export const HeaderFeatures = ({ children }) => (
	<div className="hFeatures">{children}</div>
);

export const Footer = ({ children }) => (
	<div id="footer" className="footer">
		{children}
	</div>
);

export const SubPage = ({ children }) => (
	<div id="subpage" className="subpage">
		{children}
	</div>
);

export const Heading = ({ children }) => (
	<div className="heading">{children}</div>
);

export const Contents = ({ children }) => (
	<div className="contents">{children}</div>
);

export const Container = ({ children, show = true }) => {
	return show ? <div className="container">{children}</div> : children;
};

export const RightBar = ({ children }) => (
	<div className="rightBar">{children}</div>
);
