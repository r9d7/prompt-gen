import {
  defineConfig,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetWebFonts({
      provider: "bunny",
    }),
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
});
