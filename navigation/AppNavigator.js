import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TestScreen from "../screens/TestScreen";
import { AppTabNavigator, AuthStackScreen, CreateUserStackScreen } from "./Navigators";
import { StyleSheet } from "react-native";

import { Themes } from "../shared/Theme";
import { useSelector } from "react-redux";
const theme = Themes.dark;

const AppNavigator = (props) => {
	const isUserAuthenticated = useSelector((state) => !!state.auth.token);
	const isNewUserCreation = useSelector(
		(state) => state.auth.newUserCreation
	);

	useEffect(() => {
		console.log("From NAVIGATOR");
		console.log(isUserAuthenticated);
		console.log("Is NEw user creation: ");

		console.log(isNewUserCreation);
	}, [isUserAuthenticated, isNewUserCreation]);

	return (
		<NavigationContainer
			theme={{ dark: true, colors: { background: theme.surface } }}
			style={styles.navigatorBackground}
		>
			{isUserAuthenticated && !isNewUserCreation && <AppTabNavigator />}
			{isUserAuthenticated && isNewUserCreation && <CreateUserStackScreen />}
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
