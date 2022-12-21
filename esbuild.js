/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require("esbuild");
const path = require("path");
const srcDir = path.join(__dirname, "src");
const fs = require("fs");

// const entryPoints = {
// 	"pages": path.join(srcDir, "pages.ts"),
// 	"options": path.join(srcDir, "options.tsx"),
// };

// fs.readdirSync(path.join(srcDir, "plugins")).forEach(function(file) {
// 	if (path.extname(file) == ".css") {
// 		entryPoints["plugins/" + path.basename(file)] = path.join(srcDir, "plugins", file);
// 	} else {
// 		entryPoints["plugins/" + path.basename(file, path.extname(file))] = path.join(srcDir, "plugins", file);
// 	}
// });
// fs.readdirSync(path.join(srcDir, "routes")).forEach(function(file) {
// 	entryPoints["routes/" + path.basename(file, path.extname(file))] = path.join(srcDir, "routes", file);
// });
// fs.readdirSync(path.join(srcDir, "lib")).forEach(function(file) {
// 	entryPoints["lib/" + path.basename(file, path.extname(file))] = path.join(srcDir, "lib", file);
// });
// console.log(entryPoints);

/*
const entryPoints = [path.join(srcDir, "pages.ts"), path.join(srcDir, "options.tsx")];
fs.readdirSync(path.join(srcDir, "plugins")).forEach(function(file) {
	entryPoints.push(path.join(srcDir, "plugins", file));
});
fs.readdirSync(path.join(srcDir, "routes")).forEach(function(file) {
	entryPoints.push(path.join(srcDir, "routes", file));
});
fs.readdirSync(path.join(srcDir, "lib")).forEach(function(file) {
	entryPoints.push(path.join(srcDir, "lib", file));
});

esbuild
	.build({
		entryPoints,
		bundle: true,
		write: true,
		minify: process.env.NODE_ENV != "dev",
		watch:
			process.env.NODE_ENV == "dev"
				? {
					onRebuild(error, result) {
						if (error) console.error("watch build failed:", error);
						else console.log("watch build succeeded:", result);
					}
				}
				: false,
		target: ["chrome107", "firefox57"],
		outdir: "./public/dist",
		define: {
			"process.env.NODE_ENV": `"${process.env.NODE_ENV}"`
		}
	})
	.catch(() => process.exit(1));
*/





const entryPoints_inc = [path.join(srcDir, "pages.ts")];
fs.readdirSync(path.join(srcDir, "plugins")).forEach(function(file) {
	entryPoints_inc.push(path.join(srcDir, "plugins", file));
});

esbuild
	.build({
		entryPoints: entryPoints_inc,
		bundle: false,
		minify: process.env.NODE_ENV != "dev",
		watch:
			process.env.NODE_ENV == "dev"
				? {
					onRebuild(error, result) {
						if (error) console.error("watch build failed:", error);
						else console.log("watch build succeeded:", result);
					}
				}
				: false,
		target: ["chrome107", "firefox57"],
		outdir: "./public/dist",
		define: {
			"process.env.NODE_ENV": `"${process.env.NODE_ENV}"`
		}
	})
	.catch(() => process.exit(1));

const entryPoints = [path.join(srcDir, "options.tsx")];
fs.readdirSync(path.join(srcDir, "routes")).forEach(function(file) {
	if (file.match(/.*\.tsx?$/))
		entryPoints.push(path.join(srcDir, "routes", file));
});
fs.readdirSync(path.join(srcDir, "lib")).forEach(function(file) {
	if (file.match(/.*\.(tsx?|css)$/))
		entryPoints.push(path.join(srcDir, "lib", file));
});

esbuild
	.build({
	// format: "cjs",
		entryPoints,
		bundle: true,
		minify: process.env.NODE_ENV != "dev",
		watch:
			process.env.NODE_ENV == "dev"
				? {
					onRebuild(error, result) {
						if (error) console.error("watch build failed:", error);
						else console.log("watch build succeeded:", result);
					}
				}
				: false,
		target: ["chrome107", "firefox57"],
		outdir: "./public/dist",
		define: {
			"process.env.NODE_ENV": `"${process.env.NODE_ENV}"`
		}
	})
	.catch(() => process.exit(1));

