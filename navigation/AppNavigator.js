import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppTabNavigator, AuthStackScreen, CreateUserStackScreen } from "./Navigators";
import { StyleSheet } from "react-native";

import { Themes } from "../shared/Theme";
import { useSelector } from "react-redux";
const theme = Themes.dark;

const AppNavigator = (props) => {
	const reduxState = useSelector((state) => state.auth);
	const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
	const [isNewUserCreation, setS] = useState(false)
	// const [isUserAuthenticated, setIsUserAuthenticated] = useState(!!reduxState.token);
	// const isNewUserCreation = useSelector(
	// 	(state) => state.auth.newUserCreation
	// );

	useEffect(() => {
		console.log(reduxState);
		setIsUserAuthenticated(reduxState.token);
	}, [reduxState]);

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
