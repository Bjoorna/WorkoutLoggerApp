import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import UserOverviewScreen from "../screens/User/UserOverview";
import UserSettingsScreen from "../screens/User/UserSettings";

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
import CalendarScreen from "../screens/CalendarScreen";

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
			screenOptions={{ headerShown: false }}
			tabBar={(props) => <CustomTabBar {...props} />}
		>
			<TabNavigator.Screen
				name="Workout"
				initialParams={{
					labelNameFocused: "barbell",
					labelNameUnFocused: "barbell-outline",
				}}
				component={WorkoutStackScreen}
			/>
			<TabNavigator.Screen
				name="Calendar"
				initialParams={{
					labelNameFocused: "ios-calendar",
					labelNameUnFocused: "ios-calendar-outline",
				}}
				component={CalendarStackScreen}
			/>
			{/* <TabNavigator.Screen
				name="Calculator"
				component={WeightCalculatorScreen}
				options={{ headerShown: true }}
				initialParams={{
					labelNameFocused: "calculator",
					labelNameUnFocused: "calculator-outline",
				}}
			/> */}

			<TabNavigator.Screen
				name="Analysis"
				component={WorkoutAnalysisScreen}
				initialParams={{
					labelNameFocused: "analytics",
					labelNameUnFocused: "analytics-outline",
				}}
			/>

			<TabNavigator.Screen
				name="User"
				component={UserStackScreen}
				initialParams={{
					labelNameFocused: "person-circle-sharp",
					labelNameUnFocused: "person-circle-outline",
				}}
			/>
		</TabNavigator.Navigator>
	);
};

const CalendarStackNavigator = createStackNavigator();
export const CalendarStackScreen = () => {
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	useEffect(() => {
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);
	return (
		<CalendarStackNavigator.Navigator>
			<CalendarStackNavigator.Screen
				name="CalendarScreen"
				component={CalendarScreen}
				options={{
					...getDefaultStyleOptions(currentTheme),
					headerTitle: "Calendar",
					headerShown: false
				}}
			/>
		</CalendarStackNavigator.Navigator>
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
					name="Calculator"
					component={WeightCalculatorScreen}
					options={{ headerShown: true }}
					initialParams={{
						labelNameFocused: "calculator",
						labelNameUnFocused: "calculator-outline",
					}}
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
