const defaultTheme = require("tailwindcss/defaultTheme");
/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			fontFamily: {
				display: ["Luckiest Guy", "ui-sans-serif", "sans-serif"],
				sans: ["Rubik", ...defaultTheme.fontFamily.sans]
			}
		}
	},
	plugins: []
};
