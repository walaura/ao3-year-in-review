/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const SignIn = ({ children }) => {
	return (
		<div
			css={css`
				margin: auto;
				max-width: 60em;
				padding: 2em 2em;
				& > fieldset {
					margin: 2em 0;
					padding: 1em;
					border: 1px solid var(--border);
				}
				& ol li {
					list-style: decimal inside;
				}
			`}
		>
			<fieldset>
				<h2>Help???</h2>
				<ol>
					<li>You need an Ao3 account. No way around that</li>
					<li>
						While signed in, get the value of your{" "}
						<a href="https://imgur.com/a/EL9eDI1">_otwarchive_session</a> cookie
					</li>
					<li>Paste it in the cookie input field right under</li>
					<li>Hit "load stuffs" and wait. wait A LOT.</li>
				</ol>
			</fieldset>
			{children}
		</div>
	);
};

export default SignIn;
