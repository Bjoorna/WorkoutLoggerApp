import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
	AppTabNavigator,
	AuthStackScreen,
	CreateUserStackScreen,
} from "./Navigators";
import { StyleSheet } from "react-native";

import { Themes } from "../shared/Theme";
import { useSelector } from "react-redux";
const theme = Themes.dark;

const AppNavigator = (props) => {
	const reduxState = useSelector((state) => state.auth);
	const useDarkModeStoreRef = useSelector(
		(state) => state.appSettings.useDarkMode
	);
	const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
	const [isNewUserCreation, setIsNewUserCreation] = useState(false);
	// const [isUserAuthenticated, setIsUserAuthenticated] = useState(!!reduxState.token);
	// const isNewUserCreation = useSelector(
	// 	(state) => state.auth.newUserCreation
	// );

	const [isDarkMode, setIsDarkMode] = useState(useDarkModeStoreRef);

	// const [navigatorTheme, setNavigatorTheme] = useState({colors: {background: isDarkMode} })

	const navigatorDarktheme = {
		dark: true,
		colors: {
			background: Themes.dark.surface,
		},
	};
	const navigatorLightTheme = {
		dark: false,
		colors: {
			background: Themes.light.surface,
		},

	}

	useEffect(() => {
		setIsDarkMode(useDarkModeStoreRef);
	}, [useDarkModeStoreRef]);

	useEffect(() => {
		setIsUserAuthenticated(reduxState.token);
		setIsNewUserCreation(reduxState.newUserCreation);
	}, [reduxState]);

	return (
		<NavigationContainer
			theme={isDarkMode ? navigatorDarktheme : navigatorLightTheme}
			// style={{backgroundColor: currentTheme.surface}}
		>
			{isUserAuthenticated && !isNewUserCreation && <AppTabNavigator />}
			{isUserAuthenticated && isNewUserCreation && (
				<CreateUserStackScreen />
			)}
			{!isUserAuthenticated && <AuthStackScreen />}

			{/* <AppTabNavigator /> */}
		</NavigationContainer>
	);
};

const styles = StyleSheet.create({
	navigatorBackground: {
		backgroundColor: theme.surface,
	},
});

export default AppNavigator;
