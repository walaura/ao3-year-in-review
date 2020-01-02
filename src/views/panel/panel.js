/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useState } from "react";

const themes = {
	default: css`
		--panel-color: var(--text);
		--panel-bg: #fff;
		--panel-header-bg: rgb(221, 221, 221);
		--panel-header-line: var(--brand);
		--panel-line: var(--border);

		--panel-rating: var(--brand);
		--panel-rating-color: #fff;
	`,
	red: css`
		--panel-color: #fff;
		--panel-bg: var(--brand);
		--panel-header-bg: rgba(0, 0, 0, 0.1);
		--panel-header-line: rgba(0, 0, 0, 0.1);
		--panel-line: rgba(0, 0, 0, 0.25);
		--panel-rating: #fff;
		--panel-rating-color: var(--brand);
	`,
	dark: css`
		--panel-color: #fff;
		--panel-bg: #111;
		--panel-header-bg: #111;
		--panel-header-line: #000;
		--panel-line: #000;
		--panel-rating: var(--brand);
		--panel-rating-color: #fff;
	`
};

const Panel = ({ title, info, children, theme = "default" }) => {
	return (
		<section
			css={[
				css`
					width: 100%;
					overflow-x: hidden;
					color: var(--panel-color);
					background: var(--panel-bg);
				`,
				themes[theme]
			]}
		>
			<header
				css={css`
					padding: 1.5em 4em 2em 1em;
					background: var(--panel-header-bg);
					box-shadow: inset 0 0.5em 0 0 var(--panel-header-line);
				`}
			>
				<h2
					css={css`
						font-family: Georgia;
						font-weight: 800;
						font-size: 4em;
						letter-spacing: -0.025em;
						line-height: 1;
						margin-bottom: 0.25em;
						transform: scaleX(0.95);
						transform-origin: 0 0;
					`}
				>
					{title}
				</h2>
				<p
					css={css`
						font-family: monospace;
						clear: both;
						width: 75%;
					`}
				>
					{info}
				</p>
			</header>
			<div>{children}</div>
		</section>
	);
};

const Rating = ({ index, appearances, totalAppearances }) => (
	<div
		title={`${appearances} appearances`}
		css={css`
			width: 3em;
			height: 3em;
			color: var(--panel-rating-color);
			display: flex;
			position: relative;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			z-index: 10;
		`}
	>
		<h3
			css={css`
				transform: rotate(-10deg);
			`}
		>
			#{index}
		</h3>
		<div
			css={css`
				width: 100%;
				height: 100%;
				background: var(--panel-rating);
				position: absolute;
				z-index: -1;
				border-radius: 100%;
				transform: scale(${0.5 + (appearances / totalAppearances) * 1});
			`}
		></div>
	</div>
);

const Top12Panel = ({ list, ...props }) => {
	const [slice, setSlice] = useState(6);

	return (
		<Panel {...props}>
			<ul>
				{list.slice(0, slice).map((t, i) => (
					<li
						css={css`
							border-top: 1px solid var(--panel-line);
							display: grid;
							grid-template-columns: 3em 1fr 3em;
							align-items: center;
							gap: 2em;
							padding: 0.5em 1em;
							direction: ${(i + 1) % 2 === 0 ? "rtl" : "ltr"};
						`}
					>
						<Rating
							index={i + 1}
							appearances={t.appearances}
							totalAppearances={list[0].appearances}
						/>
						<h4
							css={css`
								direction: ltr;
							`}
						>
							{t.title.replace(/\//gi, " / ")}
						</h4>
					</li>
				))}
			</ul>
			<button
				onClick={() => {
					setSlice(s => s + 6);
				}}
			>
				More tags
			</button>
		</Panel>
	);
};
export { Top12Panel };
export default Panel;
