import { CacheProvider } from "@emotion/react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import createCache from "@emotion/cache";
import { theme } from "./theme";

export function renderShadow(root: Element | DocumentFragment, children: React.ReactNode) {

	const cacheRoot = createCache({
		key: "css",
		prepend: true,
		container: root,
		// speedy: false,
	});

	const customTheme = createTheme(theme, {
		components: {
			MuiPopover: {
				defaultProps: {
					container: root,
				},
			},
			MuiPopper: {
				defaultProps: {
					container: root,
				},
			},
			MuiModal: {
				defaultProps: {
					container: root,
				},
			},
		},
	});

	const reactRoot = ReactDOM.createRoot(root);
	reactRoot.render(
		<React.StrictMode>
			<CacheProvider value={cacheRoot}>
				<ThemeProvider theme={customTheme}>
					<CssBaseline />
					{ children }
				</ThemeProvider>
			</CacheProvider>
		</React.StrictMode>
	);
}

// export function render(children: React.ReactNode, cache: EmotionCache) {
// 	const wrapper = document.createElement("span");
// 	const reactRoot = ReactDOM.createRoot(wrapper);

// 	reactRoot.render(
// 		<React.StrictMode>
// 			<CacheProvider value={cache}>
// 				<ThemeProvider theme={theme}>
// 					{ children }
// 				</ThemeProvider>
// 			</CacheProvider>
// 		</React.StrictMode>
// 	);
// 	return wrapper;
// }

export function render(children: React.ReactNode) {
	if (!window.styleCache) {
		window.styleCache = createCache({
			key: "css",
			prepend: true,
		});
	}
	const wrapper = document.createElement("span");
	const reactRoot = ReactDOM.createRoot(wrapper);

	reactRoot.render(
		<React.StrictMode>
			<CacheProvider value={window.styleCache}>
				<ThemeProvider theme={theme}>
					{ children }
				</ThemeProvider>
			</CacheProvider>
		</React.StrictMode>
	);
	return wrapper;
}

export default render;
