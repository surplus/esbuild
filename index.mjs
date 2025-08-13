import fsp from "node:fs/promises";

import { compile } from "@surplus/compiler";

const BASE_RESULT = {
	pluginName: "Surplus Compiler",
};

export default (opts) => ({
	name: "surplus",
	setup(build) {
		const jsFileExtensions = [".js", ".jsx", ".mjs", ".cjs"];
		const tsFileExtensions = [".ts", ".tsx"];

		const fileExtensions = [
			...jsFileExtensions.map((e) => [e, false]),
			...tsFileExtensions.map((e) => [e, true]),
		];

		for (const [ext, ts] of fileExtensions) {
			build.onLoad({ filter: new RegExp(`\\${ext}$`) }, async (args) => {
				try {
					const source = await fsp.readFile(args.path, "utf8");

					const result = compile({
						source,
						minify: false,
						sourcemapFilename: args.path,
						typescript: ts,
						...opts,
					});

					if (result.errors.length > 0) {
						return {
							...BASE_RESULT,
							errors: result.errors?.map((err) => ({
								text: err,
							})),
						};
					}

					return {
						...BASE_RESULT,
						contents: result.code,
						warnings: result.warnings?.map((err) => ({
							text: err,
						})),
						loader: "default",
					};
				} catch (err) {
					// Handle any errors from the transpiler
					return {
						...BASE_RESULT,
						errors: [{ text: err.message }],
					};
				}
			});
		}
	},
});
