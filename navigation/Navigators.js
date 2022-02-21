import React, { useEffect } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TestScreen from "../screens/TestScreen";
import TestScreen1 from "../screens/TestScreen2";

import UserOverviewScreen from "../screens/User/UserOverview";
import UserSettingsScreen from "../screens/User/UserSettings";

import AddWorkoutScreen from "../screens/Workout/AddWorkoutScreen";

import { Themes } from "../shared/Theme";
import AuthScreen from "../screens/User/AuthScreen";
import WeightCalculatorScreen from "../screens/Workout/WeightCalculatorScreen";
import WorkoutListScreen from "../screens/Workout/WorkoutListScreen";
import WorkoutAnalysisScreen from "../screens/Workout/WorkoutAnalysisScreen";
import NewUserScreen from "../screens/User/NewUserScreen";
import NewUserDetailScreen from "../screens/User/NewUserDetailScreen";
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
	// const shouldHideTabBar = useSelector(
	// 	(state) => state.appSettings.hideTabBar
	// );
	// useEffect(() => {
	// 	console.log("Should hide tabbar from NAvigator");
	// }, [shouldHideTabBar]);

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
				headerShown: false,
				tabBarHideOnKeyboard: true,
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

			{/* incase i want to hide the tabbar*/}
			{/* {!shouldHideTabBar && (
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
			)} */}

			<TabNavigator.Screen
				name="Calculator"
				component={WeightCalculatorScreen}
				options={{
					tabBarIcon: (props) => (
						<MaterialIcons
							name="calculate"
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
				name="Analysis"
				component={WorkoutAnalysisScreen}
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
				name="Workouts"
				component={WorkoutListScreen}
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
					name="UserSettings"
					component={UserSettingsScreen}
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
			<AuthStackNavigator.Screen
				name="NewUserScreen"
				component={NewUserScreen}
				options={{
					...defaultStyleOptions,
					headerTitle: "Create New User",
				}}
			/>
		</AuthStackNavigator.Navigator>
	);
};

const CreateUserStackNavigator = createStackNavigator();

export const CreateUserStackScreen = () => {
	return (
		<CreateUserStackNavigator.Navigator>
			<CreateUserStackNavigator.Screen
				name="CreateNewUser"
				component={NewUserDetailScreen}
				options={{
					...defaultStyleOptions,
					headerTitle: "Enter Personal Details",
				}}
			/>
		</CreateUserStackNavigator.Navigator>
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
