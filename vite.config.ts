import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import tsPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [wasm(), topLevelAwait(), tsPaths()],
});
