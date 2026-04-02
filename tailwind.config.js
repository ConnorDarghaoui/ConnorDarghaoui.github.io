/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './_includes/**/*.html',
    './_layouts/**/*.html',
    './_projects/**/*.md',
    './about/**/*.html',
    './es/**/*.html',
    './process/**/*.html',
    './index.html',
    './404.html'
  ],
  theme: {
    extend: {
      colors: {
        "surface-bright": "#f9f9f9",
        "on-primary": "#faf7f6",
        "inverse-on-surface": "#9c9d9d",
        "surface-container-low": "#f2f4f4",
        "on-secondary-container": "#3f5469",
        "inverse-surface": "#0c0f0f",
        "on-tertiary-fixed-variant": "#376430",
        "primary": "#5f5e5e",
        "error-container": "#fe8983",
        "surface-container-high": "#e4e9ea",
        "surface-dim": "#d4dbdd",
        "secondary": "#4c6177",
        "on-secondary-fixed": "#2c4156",
        "surface-tint": "#5f5e5e",
        "secondary-container": "#cfe5ff",
        "tertiary-container": "#b9eeab",
        "tertiary": "#3c6a35",
        "primary-fixed-dim": "#d7d4d3",
        "on-tertiary-container": "#2d5a27",
        "secondary-dim": "#40556b",
        "primary-dim": "#535252",
        "tertiary-fixed-dim": "#abdf9e",
        "on-error-container": "#752121",
        "on-error": "#fff7f6",
        "on-tertiary": "#ebffe0",
        "surface-variant": "#dde4e5",
        "on-surface-variant": "#5a6061",
        "on-secondary-fixed-variant": "#485d73",
        "on-background": "#2d3435",
        "error-dim": "#4e0309",
        "on-primary-fixed": "#403f3f",
        "tertiary-dim": "#305d2a",
        "surface": "#f9f9f9",
        "on-surface": "#2d3435",
        "on-tertiary-fixed": "#1a4716",
        "error": "#9f403d",
        "secondary-fixed-dim": "#c1d7f0",
        "surface-container-highest": "#dde4e5",
        "on-primary-container": "#525151",
        "outline-variant": "#adb3b4",
        "on-secondary": "#f7f9ff",
        "secondary-fixed": "#cfe5ff",
        "on-primary-fixed-variant": "#5c5b5b",
        "tertiary-fixed": "#b9eeab",
        "background": "#f9f9f9",
        "inverse-primary": "#ffffff",
        "surface-container-lowest": "#ffffff",
        "outline": "#757c7d",
        "primary-fixed": "#e5e2e1",
        "surface-container": "#ebeeef",
        "primary-container": "#e5e2e1"
      },
      fontFamily: {
        "headline": ["Newsreader", "serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0px",
        "lg": "0px",
        "xl": "0px",
        "full": "9999px"
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    }),
    require('@tailwindcss/container-queries')
  ]
}
