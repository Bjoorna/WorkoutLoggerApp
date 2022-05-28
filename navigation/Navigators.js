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
import WorkoutDetailScreen from "../screens/Workout/WorkoutDetailScreen";
import AddWorkoutDialogScreen from "../components/UI/AddWorkoutDialogScreen";
import CustomTabBar from "../components/UI/CustomTabBar";

const getDefaultStyleOptions = (theme) => {
	return {
		headerStyle: {
			backgroundColor: theme.surface,
		},
		headerTintColor: theme.onSurface,
		cardStyle: {
			backgroundColor: theme.surface,
		},
	};
};

const TabNavigator = createBottomTabNavigator();

export const AppTabNavigator = () => {
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const hideTabBar = useSelector((state) => state.appSettings.hideTabBar);
	const [currentTheme, setCurrentTheme] = useState(Themes.dark);
	useEffect(() => {
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	return (
		<TabNavigator.Navigator
			screenOptions={{ headerShown: false,}}
			tabBar={(props) => <CustomTabBar {...props} />}
		>
			<TabNavigator.Screen
				name="Workout"
				initialParams={
					{labelName: "fitness-center"}
				}
				component={WorkoutStackScreen}
			/>

			<TabNavigator.Screen
				name="Calculator"
				component={WeightCalculatorScreen}
				options={{headerShown: true}}
				initialParams={
					{labelName: "calculate"}
				}
			/>

			<TabNavigator.Screen
				name="Analysis"
				component={WorkoutAnalysisScreen}
				initialParams={
					{labelName: "analytics"}
				}
			/>

			<TabNavigator.Screen name="User" component={UserStackScreen} initialParams={
					{labelName: "account-circle"}
				} />
		</TabNavigator.Navigator>
	);
};


const WorkoutStackNavigator = createStackNavigator();

export const WorkoutStackScreen = () => {
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	useEffect(() => {
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	return (
		<WorkoutStackNavigator.Navigator>
			<WorkoutStackNavigator.Group>
				<WorkoutStackNavigator.Screen
					name="Workouts"
					component={WorkoutListScreen}
					options={{ ...getDefaultStyleOptions(currentTheme) }}
				/>
				<WorkoutStackNavigator.Screen
					name="AddWorkout"
					component={AddWorkoutDialogScreen}
					options={{
						...getDefaultStyleOptions(currentTheme),
						headerTitle: "Add Workout",
					}}
				/>
				<WorkoutStackNavigator.Screen
					name="TestAddWorkout"
					component={AddWorkoutDialogScreen}
				/>
			</WorkoutStackNavigator.Group>
			<WorkoutStackNavigator.Group
				screenOptions={{
					presentation: "modal",
					tabBarStyle: { display: "none" },
				}}
			>
				<WorkoutStackNavigator.Screen
					name="WorkoutDetail"
					component={WorkoutDetailScreen}
					options={{
						headerStyle: {
							backgroundColor: currentTheme.surface,
						},
						headerTintColor: currentTheme.onSurface,
						cardStyle: {
							backgroundColor: currentTheme.surface,
						},
					}}
				/>
			</WorkoutStackNavigator.Group>
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
