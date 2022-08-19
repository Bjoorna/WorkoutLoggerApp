import { Themes } from "./Theme";

const strokeLinecap = "round";
const strokeLinejoin = "round";

const letterSpacing = "normal";
const fontSize = 14;

const baseLabelStylesDark = {
	fontFamily: "sans-serif",
	fontSize: 14,
	padding: 10,
	fill: Themes.dark.onSurface,
	stroke: "transparent",
};

const baseLabelStylesLight = {
	fontFamily: "sans-serif",
	fontSize: 14,
	padding: 10,
	fill: Themes.light.onSurface,

	stroke: "transparent",
};

const centeredLabelStylesDark = {
	textAnchor: "middle",
	...baseLabelStylesDark,
};
const centeredLabelStylesLight = {
	textAnchor: "middle",
	...baseLabelStylesLight,
};

export const GetChartTheme = {
	dark: {
		area: {
			style: {
				data: {
					fill: Themes.dark.onSurface,
				},
				labels: baseLabelStylesDark,
			},
		},
		axis: {
			style: {
				axis: {
					fill: "transparent",
					stroke: Themes.dark.onSurface,
					strokeWidth: 1,
					strokeLinecap,
					strokeLinejoin,
				},
				axisLabel: { ...centeredLabelStylesDark, padding: 25 },

				grid: {
					fill: "none",
					stroke: "none",
					pointerEvents: "painted",
				},
				ticks: {
					fill: "transparent",
					size: 1,
					stroke: "transparent",
				},
				tickLabels: baseLabelStylesDark,
			},
		},
		line: {
			style: {
				data: {
					fill: "transparent",
					stroke: Themes.dark.onSurface,
					strokeWidth: 2,
				},
				labels: {
					fontFamily: "sans-serif",
					fontSize: 14,
					padding: 10,
					fill: Themes.dark.onSurface,
					stroke: "transparent",
				},
			},
		},
		scatter: {
			style: {
				data: {
					fill: Themes.dark.onSurface,
					stroke: "transparent",
					strokeWidth: 0,
				},
				labels: baseLabelStylesDark,
			},
		},
	},
	light: {
		area: {
			style: {
				data: {
					fill: Themes.dark.onSurface,
				},
				labels: baseLabelStylesDark,
			},
		},
		axis: {
			style: {
				axis: {
					fill: "transparent",
					stroke: Themes.light.onSurface,
					strokeWidth: 1,
					strokeLinecap,
					strokeLinejoin,
				},
				axisLabel: { ...centeredLabelStylesLight, padding: 25 },

				grid: {
					fill: "none",
					stroke: "none",
					pointerEvents: "painted",
				},
				ticks: {
					fill: "transparent",
					size: 1,
					stroke: "transparent",
				},
				tickLabels: baseLabelStylesLight,
			},
		},
		line: {
			style: {
				data: {
					fill: "transparent",
					stroke: Themes.light.onSurface,
					strokeWidth: 2,
				},
				labels: {
					fontFamily: "sans-serif",
					fontSize: 14,
					padding: 10,
					fill: Themes.light.onSurface,
					stroke: "transparent",
				},
			},
		},
		scatter: {
			style: {
				data: {
					fill: Themes.light.onSurface,
					stroke: "transparent",
					strokeWidth: 0,
				},
				labels: baseLabelStylesLight,
			},
		},
	},
};
