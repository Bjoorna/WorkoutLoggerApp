import React, {useState, useEffect} from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { useSelector } from "react-redux";

import { Themes } from "../../shared/Theme";
const theme = Themes.dark;

const NumberInput = (props) => {
	// Themes
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	return <TextInput {...props} style={{ ...styles.input, ...props.style }} />;
};

const getStyles = (theme) => {
	return StyleSheet.create({
		input: {
			height: 80,
			backgroundColor: theme.secondaryContainer,
			borderRadius: 20,
			width: "90%",
			color: theme.onSecondaryContainer
		},
	});
};
// const styles = StyleSheet.create({
//     input: {
// 		height: 80,
// 		backgroundColor: theme.onSecondaryContainer,
// 		borderRadius: 20,
// 		width: "90%",
// 	},

// })

export default NumberInput;
