import React from "react";
import { Text, StyleSheet } from "react-native";
// import theme from "../../store/reducers/theme";
import { Themes } from "../../shared/Theme";
const rob400 = "roboto-400";
const rob500 = "roboto-500";
const theme = Themes.dark;

const BodyText = (props) => {
	return (
		<Text
			style={
				props.large
					? { ...styles.bodyLarge, ...props.style }
					: { ...styles.bodyMedium, ...props.style }
			}
		>
			{props.children}
		</Text>
	);
};

const styles = StyleSheet.create({
	bodyLarge: {
		fontFamily: rob400,
		fontSize: 16,
		fontWeight: "400",
		color: theme.onSurface,
	},
	bodyMedium: {
		fontFamily: rob400,
		fontSize: 14,
		fontWeight: "500",
		color: theme.onSurface,
	},
	titleSmall: {
		fontFamily: rob500,
		fontSize: 14,
		fontWeight: "500",
	},
});

export default BodyText;
