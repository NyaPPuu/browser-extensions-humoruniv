/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require("esbuild");
const path = require("path");
const srcDir = path.join(__dirname, "src");
const fs = require("fs");


class EntryPointHelper {
	root = "";
	entryPoints = [];

	constructor(root = "") {
		this.root = root;
	}

	add(...pathString) {
		if (Array.isArray(pathString)) {
			pathString.map((p) => { this._add(p) });
		} else {
			this._add(pathString);
		}
	}
	_add(pathString) {
		const fullPath = path.join(this.root, pathString);
		if (!fs.existsSync(fullPath)) return;
		if (fs.lstatSync(fullPath).isDirectory()) {
			fs.readdirSync(fullPath).forEach((file) => {
				this.entryPoints.push(path.join(fullPath, file));
			});
		} else {
			this.entryPoints.push(fullPath);
		}
	}

	list() {
		return this.entryPoints;
	}
}

const buildOptions = {
	minify: process.env.NODE_ENV != "dev",
	target: ["chrome107", "firefox57"],
	outbase: "./src",
	outdir: "./public/dist",
	define: {
		"process.env.NODE_ENV": `"${process.env.NODE_ENV}"`
	},
};
if (process.env.NODE_ENV == "dev") {
	buildOptions.plugins = [{
		name: "watcher",
		setup(build) {
			build.onEnd(result => {
				if (result.errors?.length) console.error("%c✖ ERROR", "background-color: #ef5350; color: black; padding: 2px 4px;", result.errors);
				if (result.warnings?.length) console.warn("%c‼ WARNING", "background-color: #ff9800; color: black; padding: 2px 4px;", result.warnings);
				if (!result.errors?.length || !result.warnings?.length) console.log("%c✔ PASS", "background-color: #4caf50; color: black; padding: 2px 4px;", "watch build succeeded");
			});
		},
	}];
}

(async() => {
	const entryInc = new EntryPointHelper(srcDir);
	entryInc.add("pages.ts", "plugins");
	const normalBuild = await esbuild.context({ ...buildOptions, entryPoints: entryInc.list(), bundle: false, });

	const entry = new EntryPointHelper(srcDir);
	entry.add("background.ts", "options.tsx", "popup.tsx", "routes");
	const bundleBuild = await esbuild.context({ ...buildOptions, entryPoints: entry.list(), bundle: true, });

	if (process.env.NODE_ENV == "dev") {
		await normalBuild.watch();
		await bundleBuild.watch();
	} else {
		await normalBuild.rebuild();
		await bundleBuild.rebuild();

		normalBuild.dispose();
		bundleBuild.dispose();
	}
})();
