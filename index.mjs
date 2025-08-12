import fsp from "node:fs/promises";

import { compile } from "@surplus/compiler";

const BASE_RESULT = {
	pluginName: 'Surplus Compiler'
};

export default (opts) => ({
	name: "surplus",
	setup(build) {
		const fileExtensions = [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"];

		for (let ext of fileExtensions) {
			build.onLoad({ filter: new RegExp(`\\${ext}$`) }, async (args) => {
				try {
					const source = await fsp.readFile(args.path, "utf8");

					const result = compile({
						source,
						minify: false,
						sourcemapFilename: args.path,
						...opts
					});

					return {
						...BASE_RESULT,
						contents: result.code,
						errors: result.errors?.map(err => ({text: err})),
						warnings: result.warnings?.map(err => ({text: err})),
						loader: "default",
					};
				} catch (err) {
					// Handle any errors from the transpiler
					return {
						...BASE_RESULT,
						errors: [{ text: err.message }]
					};
				}
			});
		}
	},
});
