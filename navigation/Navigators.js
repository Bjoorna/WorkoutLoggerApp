import React from "react";
import { StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TestScreen from "../screens/TestScreen";
import TestScreen1 from "../screens/TestScreen2";

import UserOverviewScreen from "../screens/User/UserOverview";
import UserDetailScreen from "../screens/User/UserDetail";

import AddWorkoutScreen from "../screens/Workout/AddWorkoutScreen";

import { Themes } from "../shared/Theme";
import AuthScreen from "../screens/User/AuthScreen";
const theme = Themes.dark;

const defaultStyleOptions = {
	headerStyle: {
		backgroundColor: theme.surface,
	},
	headerTintColor: theme.onSurface,
	cardStyle: {
		backgroundColor: theme.surface,
	},
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
				tabBarInactiveTintColor: theme.onSurfaceVariant,
				headerShown: false
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
				name="Workout"
				component={WorkoutStackScreen}
			/>
			<TabNavigator.Screen
				name="Test1"
				component={TestScreen1}
				options={{
					tabBarIcon: (props) => (
						<MaterialIcons
							name="analytics"
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
			<TabNavigator.Screen
				name="User"
				component={UserStackScreen}
				options={{
					headerShown: false,
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

const WorkoutStackNavigator = createStackNavigator();

export const WorkoutStackScreen = () => {
	return (
		<WorkoutStackNavigator.Navigator>
			<WorkoutStackNavigator.Screen
				name="TestFrontPage"
				component={TestScreen}
				options={{ ...defaultStyleOptions }}
			/>
			<WorkoutStackNavigator.Screen
				name="AddWorkout"
				component={AddWorkoutScreen}
				options={{ ...defaultStyleOptions, headerTitle: "Add Workout" }}
			/>
		</WorkoutStackNavigator.Navigator>
	);
};

const UserStackNavigator = createStackNavigator();

export const UserStackScreen = () => {
	return (
		<UserStackNavigator.Navigator>
			<UserStackNavigator.Group>
				<UserStackNavigator.Screen
					name="UserOverview"
					component={UserOverviewScreen}
					options={{
						...defaultStyleOptions,
						headerTitle: "User",
						presentation: "card",
					}}
				/>
				<UserStackNavigator.Screen
					name="UserDetail"
					component={UserDetailScreen}
					options={{ ...defaultStyleOptions, presentation: "card" }}
				/>
			</UserStackNavigator.Group>
		</UserStackNavigator.Navigator>
	);
};

const AuthStackNavigator = createStackNavigator();

export const AuthStackScreen = () => {
	return (
		<AuthStackNavigator.Navigator>
			<AuthStackNavigator.Screen
				name="AuthScreen"
				component={AuthScreen}
				options={{
					...defaultStyleOptions,
					headerTitle: "Authentication",
				}}
			/>
		</AuthStackNavigator.Navigator>
	);
};

// const customTab = (state, descriptor, navigation) => {
// 	<View></View>;
// };

const tabBarStyles = StyleSheet.create({
	container: {
		flexDirection: "row",
	},
});
