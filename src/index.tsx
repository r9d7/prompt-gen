/* @refresh reload */
import { render } from "solid-js/web";

import "@unocss/reset/tailwind-compat.css";

import "virtual:uno.css";

import App from "~/App";

import "~/styles/app.css";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(() => <App />, root!);
