import { defineConfig } from "vite";
import { ViteFaviconsPlugin } from "vite-plugin-favicon2";

export default defineConfig({
	root: "src",
	server: {
		port: 5577,
		open: "/src/index.html/#set",
	},
	build: {
		emptyOutDir: true,
		cssMinify: true,

		reportCompressedSize: true,
		outDir: "../distrib",
		// sourcemap: false,
		rollupOptions: {},
		cssCodeSplit: true,
		minify: "terser",
		chunkSizeWarningLimit: 5000,
	},
	plugins: [
		ViteFaviconsPlugin({
			logo: "./src/img/synevo-logo-icon.svg",
			inject: true,
			favicons: {
				pixel_art: true, // Keeps pixels "sharp" when scaling up, for pixel art.  Only supported in offline mode.
				loadManifestWithCredentials: true, // Browsers don't send cookies when fetching a manifest, enable this to fix that. `boolean`

				icons: {
					android: { mask: true, overlayShadow: true },
					appleIcon: { mask: true, overlayShadow: true },
					appleStartup: false,
					coast: { mask: true, overlayShadow: true },
					favicons: { mask: true, overlayShadow: true },
					firefox: { mask: true, overlayShadow: true },
					windows: { mask: true, overlayShadow: true },
					yandex: { mask: true, overlayShadow: true },
				},
			},
		}),
	],
});
