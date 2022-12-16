import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import viteEslint from "vite-plugin-eslint";
import viteStylelint from "vite-plugin-stylelint";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), viteEslint({ emitError: true }), viteStylelint()]
});
