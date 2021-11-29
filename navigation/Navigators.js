import React from "react";
import { StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TestScreen from "../screens/TestScreen";
import TestScreen1 from "../screens/TestScreen2";

import { DarkTheme as theme } from "../shared/Theme";

const defaultStyleOptions = {
	headerStyle: {
		backgroundColor: theme.surface,
	},
	headerTintColor: theme.onSurface,
};

const TabNavigator = createBottomTabNavigator();

export const AppTabNavigator = () => {
	return (
		<TabNavigator.Navigator
			screenOptions={{
				...defaultStyleOptions,
				tabBarStyle: {
					backgroundColor: theme.surface,
					height: 80,
					paddingBottom: 16,
					paddingTop: 12,
				},
				tabBarActiveTintColor: theme.onSurface,
			}}
		>
			<TabNavigator.Screen
				options={{
					tabBarIcon: (props) => (
						<MaterialIcons
							name="fitness-center"
							size={24}
							color={
								props.focused
									? theme.onSecondaryContainer
									: theme.onSurfaceVariant
							}
						/>
					),
				}}
				name="Test"
				component={TestScreen}
			/>
			<TabNavigator.Screen
				name="Test1"
				component={TestScreen1}
				options={{
					tabBarIcon: (props) => (
						<MaterialIcons
							name="account-circle"
							size={24}
							color={
								props.focused
									? theme.onSecondaryContainer
									: theme.onSurfaceVariant
							}
						/>
					),
				}}
			/>
		</TabNavigator.Navigator>
	);
};

const customTab = (state, descriptor, navigation) => {
	<View></View>;
};

const tabBarStyles = StyleSheet.create({
	container: {
		flexDirection: "row",
	},
});
