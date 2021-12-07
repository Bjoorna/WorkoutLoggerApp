import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TestScreen from "../screens/TestScreen";
import { AppTabNavigator, AuthStackScreen } from "./Navigators";
import { StyleSheet } from "react-native";

import { Themes } from "../shared/Theme";
import { useSelector } from "react-redux";
const theme = Themes.dark;

const AppNavigator = (props) => {

	const isUserAuthenticated = useSelector(state => !!state.auth.token)


	return (
		<NavigationContainer theme={{dark: true, colors:{background: theme.surface}}} style={styles.navigatorBackground}>
			{isUserAuthenticated && <AppTabNavigator />} 
			{!isUserAuthenticated && <AuthStackScreen />}
			{/* <AppTabNavigator /> */}
		</NavigationContainer>
	);
};

const styles = StyleSheet.create({
	navigatorBackground: {
		backgroundColor: theme.surface
	}
})

export default AppNavigator;
