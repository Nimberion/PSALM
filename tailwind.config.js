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
		extend: {
			boxShadow: {
				input: "0.4rem 0.4rem 0.5rem 0.0rem rgba(0,0,0,0.25)",
			},
			colors: {
				primary: "#33658A",
				secondary: "#F26419",
				success: "#0c9c57",
				info: "#86BBD8",
				warning: "#F6AE2D",
				danger: "#B91C1C",
				darkPrimary: "#2F4858",
			},
		},
	},
	variants: {
		backgroundColor: ["hover", "responsive"],
		borderColor: ["hover", "responsive"],
		textColor: ["hover", "responsive"],
		scrollbar: ["rounded"],
		extend: {
			filter: ["hover", "focus"],
			boxShadow: ["active"],
		},
	},
	plugins: [forms, scrollbar, typography, aspectRatio],
};
