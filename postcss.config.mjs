// Tailwind v4 is processed through PostCSS. It only emits styles into the CSS
// file that imports "tailwindcss" (the frontend globals.css) — the Payload
// admin CSS never imports it, so the admin UI is unaffected.
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
