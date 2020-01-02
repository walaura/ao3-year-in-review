/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const List = ({ children }) => {
	return (
		<div
			css={css`
				width: 100vw;
				height: 100vh;
				background: #222;
				overflow: scroll;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				scroll-snap-type: x mandatory;
			`}
		>
			<div>
				<div
					css={css`
						--width: 12em;
						display: grid;
						gap: 2em;
						margin: 0 calc(50vw - var(--width));
						grid-auto-columns: calc(var(--width) * 2);
						grid-auto-flow: column;
						grid-template-rows: 80vh;
						width: intrinsic;

						& > * {
							box-shadow: 0 1px 1em 0 #111;
							background: #fff;
							overflow: scroll;
							scroll-snap-align: center;
						}
					`}
				>
					{children}
				</div>
			</div>
		</div>
	);
};

export default List;
