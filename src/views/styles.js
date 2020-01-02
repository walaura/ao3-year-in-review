/** @jsx jsx */
import { css, jsx, Global } from "@emotion/core";

const Styles = () => (
	<Global
		styles={css`
			* {
				margin: 0;
				padding: 0;
				list-style: none;
				font-size: 1em;
			}
			:root {
				font-family: "Lucida Grande", "Lucida Sans Unicode", "GNU Unifont",
					Verdana, Helvetica, sans-serif;
				--border: rgb(221, 221, 221);
				--brand: rgb(153, 0, 0);
			}
		`}
	></Global>
);

export default Styles;
