/// <reference types="vitest" />

import angular from "@analogjs/vite-plugin-angular";

import { defineConfig } from "vite";
import * as path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	return {
		plugins: [angular(), tsconfigPaths()],
		test: {
			globals: true,
			environment: "jsdom",
			setupFiles: ["src/test-setup.ts"],
			include: ["**/*.spec.ts"],
			reporters: ["default"],
		},
		define: {
			"import.meta.vitest": mode !== "production",
		},
		resolve: {
			alias: {
				"src/environments/environment": path.resolve(
					__dirname,
					"src/environments/environment.ts",
				),
			},
		},
	};
});
