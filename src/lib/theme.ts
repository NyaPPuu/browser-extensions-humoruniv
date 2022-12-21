import { createTheme } from "@mui/material";
import createCache from "@emotion/cache";
import { EmotionCache } from "@emotion/react";

/*
let theme = createTheme({ palette: { mode: "dark" } });
theme = createTheme(theme, {
	palette: {
		primary: { main: "#EEE", light: "#FFF", dark: "#BBB" },
		mode: "dark",
	},
	shape: { borderRadius: 0 },
	typography: {
		small1: { ...theme.typography.body2, fontSize: "0.75rem" },
		small2: { ...theme.typography.body2, fontSize: "0.688rem" },
		small3: { ...theme.typography.body2, fontSize: "0.625rem" },
	},
});
*/

declare global {
	interface Window {
		styleCache?: EmotionCache;
	}
}

export const theme = createTheme({
	palette: {
		primary: {
			main: "#F58E86",
			light: "#ffbfb6",
			dark: "#bf5f59",
		},
		action: {
			selectedOpacity: 0.3
		}
	},
	shape: { borderRadius: 0 }
});

export const cache = function() {
	return createCache({
		key: "css",
		prepend: true,
	});
};

export default theme;
