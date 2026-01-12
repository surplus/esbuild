import esbuild from "esbuild";
import { surplus, surplusCss } from "../index.mjs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Regression test: https://github.com/surplus/esbuild/issues/1
await (async () => {
	let contents = await fsp.readFile(
		path.join(__dirname, "bin/app.css"),
		"utf8",
	);

	const checkClass = (name) => {
		assert(contents.includes(`${name}-0`));
		contents = contents.replaceAll(`${name}-0`, "");
		assert(!contents.includes(`${name}-1`));
		assert(!contents.includes(`${name}`));
	};

	checkClass("both-media");
	checkClass("just-media");
	checkClass("within-screen");
	checkClass("within-print");
})();
