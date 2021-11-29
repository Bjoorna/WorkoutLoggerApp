import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TestScreen from "../screens/TestScreen";
import { AppTabNavigator } from "./Navigators";

const AppNavigator = (props) => {
	return (
		<NavigationContainer>
			<AppTabNavigator />
		</NavigationContainer>
	);
};

export default AppNavigator;
