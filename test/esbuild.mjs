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

const badSym = Symbol();
try {
	console.warn(
		"NOTE: The next error message is expected as part of the test.",
	);

	await esbuild.build({
		entryPoints: ["app_err.jsx"],
		bundle: true,
		minify: false,
		sourcemap: true,
		outfile: "bin/app_err.js",
		plugins: [surplus(), surplusCss()],
	});

	throw { [badSym]: true };
} catch (e) {
	if (e[badSym]) {
		throw new Error("esbuild succeeded when it should have failed");
	}
}
