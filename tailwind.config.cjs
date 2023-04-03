const defaultTheme = require("tailwindcss/defaultTheme");
/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			colors: {
				spotify: "#1db954"
			},
			fontFamily: {
				display: ["Luckiest Guy", "ui-sans-serif", "sans-serif"],
				sans: ["Rubik", ...defaultTheme.fontFamily.sans]
			},
			boxShadow: {
				bottombar: "0 0rem 1rem 1rem #000000"
			}
		}
	},
	plugins: []
};
