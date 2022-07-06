import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";

import { Themes } from "../shared/Theme";

const SplashScreen = () => {
    const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);

	const [styles, setStyles] = useState(getStyles(Themes.light));
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);
	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
		// setUseDarkModeValue(useDarkMode);
	}, [useDarkMode]);
	return (
		<View style={styles.screen}>
			<ActivityIndicator size="large" color={currentTheme.onPrimary} />
		</View>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		screen: {
			flex: 1,
			backgroundColor: theme.primary,
			justifyContent: "center",
			alignItems: "center",
		},
	});
};

export default SplashScreen;
