import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

// base: "./" keeps asset paths relative so the site works from the domain root
// or from a GitHub Pages project subpath. With hash routing no repo-name config
// is needed.
export default defineConfig({
  base: "./",
  plugins: [vue()],
})