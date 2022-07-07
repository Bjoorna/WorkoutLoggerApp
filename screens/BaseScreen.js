import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import { Themes } from "../shared/Theme";
import AppNavigator from "../navigation/AppNavigator";

const BaseScreen = () => {
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);

	const [styles, setStyles] = useState(getStyles(Themes.dark));

    useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		// setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);


	return (
		<View style={styles.screen}>
			<AppNavigator />
		</View>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		screen: {
			flex: 1,
			backgroundColor: theme.surface,
		},
		// screenContent: {
		// 	flex: 1,
		// 	alignItems: "center",
		// },
		// inputContainer: {
		// 	// marginTop: 100,
		// 	width: "100%",
		// 	justifyContent: "center",
		// 	paddingHorizontal: 24,
		// },
		// loadingSpinner: {
		// 	flex: 1,
		// 	height: "100%",
		// 	width: "100%",
		// 	justifyContent: "center",
		// 	alignItems: "center",
		// },
	});
};

export default BaseScreen;
