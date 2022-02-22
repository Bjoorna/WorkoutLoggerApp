import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

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
		backgroundColor: theme.surfaceE2,
	},
	headerTintColor: theme.onSurface,
	cardStyle: {
		backgroundColor: theme.background,
	},
};

const getDefaultStyleOptions = (theme) => {
	return {
		headerStyle: {
			backgroundColor: theme.surfaceE2,
		},
		headerTintColor: theme.onSurface,
		cardStyle: {
			backgroundColor: theme.background,
		},
	};
};

const TabNavigator = createBottomTabNavigator();

export const AppTabNavigator = () => {
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [currentTheme, setCurrentTheme] = useState(Themes.dark);
	useEffect(() => {
		console.log("setDarkMode NAvigator");
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);


	return (
		<TabNavigator.Navigator
			screenOptions={{
				...getDefaultStyleOptions(currentTheme),
				tabBarStyle: {
					backgroundColor: currentTheme.surface,
					height: 80,
					paddingBottom: 16,
					paddingTop: 12,
				},

				tabBarActiveTintColor: currentTheme.onSurface,
				tabBarInactiveTintColor: currentTheme.onSurfaceVariant,
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
									? currentTheme.onSecondaryContainer
									: currentTheme.onSurfaceVariant
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
									? currentTheme.onSecondaryContainer
									: currentTheme.onSurfaceVariant
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
									? currentTheme.onSecondaryContainer
									: currentTheme.onSurfaceVariant
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
									? currentTheme.onSecondaryContainer
									: currentTheme.onSurfaceVariant
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

	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [currentTheme, setCurrentTheme] = useState(Themes.dark);
	useEffect(() => {
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);


	return (
		<WorkoutStackNavigator.Navigator>
			<WorkoutStackNavigator.Screen
				name="Workouts"
				component={WorkoutListScreen}
				options={{ ...getDefaultStyleOptions(currentTheme) }}
			/>
			<WorkoutStackNavigator.Screen
				name="AddWorkout"
				component={AddWorkoutScreen}
				options={{ ...getDefaultStyleOptions(currentTheme) , headerTitle: "Add Workout" }}
			/>
		</WorkoutStackNavigator.Navigator>
	);
};

const UserStackNavigator = createStackNavigator();

export const UserStackScreen = () => {
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [currentTheme, setCurrentTheme] = useState(Themes.dark);
	useEffect(() => {
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	return (
		<UserStackNavigator.Navigator>
			<UserStackNavigator.Group>
				<UserStackNavigator.Screen
					name="UserOverview"
					component={UserOverviewScreen}
					options={{
						...getDefaultStyleOptions(currentTheme),
						headerTitle: "User",
						presentation: "card",
					}}
				/>
				<UserStackNavigator.Screen
					name="UserSettings"
					component={UserSettingsScreen}
					options={{
						...getDefaultStyleOptions(currentTheme),
						presentation: "card",
						headerTitle: "Settings",
					}}
				/>
			</UserStackNavigator.Group>
		</UserStackNavigator.Navigator>
	);
};

const AuthStackNavigator = createStackNavigator();

export const AuthStackScreen = () => {
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [currentTheme, setCurrentTheme] = useState(Themes.dark);
	useEffect(() => {
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	return (
		<AuthStackNavigator.Navigator>
			<AuthStackNavigator.Screen
				name="AuthScreen"
				component={AuthScreen}
				options={{
					...getDefaultStyleOptions(currentTheme),
					headerTitle: "Authentication",
				}}
			/>
			<AuthStackNavigator.Screen
				name="NewUserScreen"
				component={NewUserScreen}
				options={{
					...getDefaultStyleOptions(currentTheme),
					headerTitle: "Create New User",
				}}
			/>
		</AuthStackNavigator.Navigator>
	);
};

const CreateUserStackNavigator = createStackNavigator();

export const CreateUserStackScreen = () => {
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [currentTheme, setCurrentTheme] = useState(Themes.dark);
	useEffect(() => {
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	return (
		<CreateUserStackNavigator.Navigator>
			<CreateUserStackNavigator.Screen
				name="CreateNewUser"
				component={NewUserDetailScreen}
				options={{
					...getDefaultStyleOptions(currentTheme),
					headerTitle: "Enter Personal Details",
				}}
			/>
		</CreateUserStackNavigator.Navigator>
	);
};
