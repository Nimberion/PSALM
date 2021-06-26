/* eslint-disable @typescript-eslint/no-var-requires */
const forms = require("@tailwindcss/forms");
const scrollbar = require("tailwind-scrollbar");
const typography = require("tailwindcss-typography");
const aspectRatio = require("@tailwindcss/aspect-ratio");

module.exports = {
	mode: "jit",
	purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	darkMode: false,
	theme: {
		extend: {},
	},
	variants: {
		backgroundColor: ["hover", "responsive"],
		borderColor: ["hover", "responsive"],
		textColor: ["hover", "responsive"],
		scrollbar: ["rounded"],
		extend: {
			filter: ["hover", "focus"],
		},
	},
	plugins: [forms, scrollbar, typography, aspectRatio],
};
