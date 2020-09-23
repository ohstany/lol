import React from "react";
import Link from "next/link";

export default React.memo(
	({
		className,
		rel,
		onClick,
		disabled,
		query,
		onMouseOver,
		to,
		href,
		children,
		blank,
		replace,
	}) => {
		const applyProps = {};
		if (className) applyProps.className = className;
		if (rel) applyProps.rel = rel;
		if (onClick) applyProps.onClick = onClick;
		if (disabled) applyProps.disabled = disabled;
		if (blank) applyProps.target = "_blank";
		const _href = !query ? "/" : { pathname: "/", query };
		const goTo = (typeof to === "object" ? to.pathname : to) || href || "/";

		if (onMouseOver) applyProps.onMouseOver = onMouseOver;

		const regularLink =
			goTo.indexOf("http") >= 0 &&
			typeof window !== "undefined" &&
			goTo.indexOf(window.location.origin) < 0;

		return regularLink ? (
			<>
				{children.type && children.type === "a" ? (
					children
				) : (
					<a href={goTo} {...applyProps}>
						{children}
					</a>
				)}
			</>
		) : (
			<Link
				href={_href}
				as={
					typeof window !== "undefined" &&
					goTo.indexOf(window.location.origin) >= 0
						? goTo.replace(window.location.origin, "")
						: goTo
				}
				replace={replace}>
				{children.type && children.type === "a" ? (
					children
				) : (
					<a {...applyProps}>{children}</a>
				)}
			</Link>
		);
	},
	(p, n) => p === n
);
