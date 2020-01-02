/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const List = ({ children }) => {
	return (
		<div
			css={css`
				--width: 12em;
				background: #222;
				display: grid;
				overflow: scroll;
				padding: 10vh calc(50vw - var(--width));
				gap: 2em;
				grid-auto-columns: calc(var(--width) * 2);
				grid-auto-flow: column;
				grid-template-rows: 80vh;

				& > * {
					box-shadow: 0 1px 1em 0 #111;
					background: #fff;
					overflow: scroll;
				}
			`}
		>
			{children}
		</div>
	);
};

export default List;
