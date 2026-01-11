import esbuild from "esbuild";
import { surplus, surplusCss } from "../index.mjs";
import fsp from "node:fs/promises";

await esbuild.build({
	entryPoints: ["app.jsx"],
	bundle: true,
	minify: false,
	sourcemap: true,
	outfile: "bin/app.js",
	plugins: [surplus(), surplusCss()],
});
