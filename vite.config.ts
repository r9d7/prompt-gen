import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import devtools from "solid-devtools/vite";
import UnoCSS from "unocss/vite";

export default defineConfig({
  plugins: [
    devtools({
      autoname: true,
      locator: {
        targetIDE: "vscode",
        key: "Alt",
        jsxLocation: true,
        componentLocation: true,
      },
    }),
    solidPlugin(),
    UnoCSS(),
  ],
  server: { port: 3000 },
  build: { target: "esnext" },
});
