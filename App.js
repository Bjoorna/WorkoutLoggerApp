import "react-native-gesture-handler";
import "react-native-get-random-values";

// React
import React, { useState, useEffect, useCallback } from "react";

// react native
import { StyleSheet, View, Dimensions, Appearance } from "react-native";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core"]);

// redux
import { Provider, useSelector } from "react-redux";

import {
	configureStore,
	getDefaultMiddleware,
	Reducer,
} from "@reduxjs/toolkit";

// Navigator
import AppNavigator from "./navigation/AppNavigator";

// sda
import BaseScreen from "./screens/BaseScreen";

// themeing
import { Themes } from "./shared/Theme";
import StatusBarWrapper from "./components/UI/StatusBarWrapper";
const theme = Themes.dark;

// Expo
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// react native paper
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import authReducer from "./redux/slices/authSlice";
import appSettingsReducer from "./redux/slices/appSettingsSlice";
import workoutReducer from "./redux/slices/workoutSlice";
import userReducer from "./redux/slices/userSlice";
import { async } from "validate.js";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import store from "./redux/store/store";

// const rootReducer = combineReducers({
// 	auth: authReducer,
// 	user: userReducer,
// 	workout: workoutReducer,
// 	appSettings: appsettingsReducer,
// });
// const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const reducer = {
	auth: authReducer,
	appSettings: appSettingsReducer,
	workout: workoutReducer,
	user: userReducer,
};

const store = configureStore({
	reducer: reducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({ serializableCheck: false }),
});

const paperTheme = {
	...DefaultTheme,
	version: 3,
};

export default function App() {
	const [isAppReady, setIsAppReady] = useState(false);
	const [styles, setStyles] = useState(getStyles(Themes.dark));

	useEffect(() => {
		const prepare = async () => {
			try {
				await Font.loadAsync({
					"roboto-400": require("./assets/fonts/Roboto-Regular.ttf"),
					"roboto-500": require("./assets/fonts/Roboto-Medium.ttf"),
				});
			} catch (error) {
				console.warn(error);
			} finally {
				setIsAppReady(true);
			}
		};
		prepare();
	}, []);
	const onLayoutRootView = useCallback(async () => {
		if (isAppReady) {
			await SplashScreen.hideAsync();
		}
	}, [isAppReady]);

	if (!isAppReady) {
		return null;
	}
	return (
		<Provider store={store}>
			<PaperProvider theme={paperTheme}>
				<GestureHandlerRootView
					style={styles.baseScreen}
					onLayout={onLayoutRootView}
				>
					<StatusBarWrapper />
					<BaseScreen />
				</GestureHandlerRootView>
				{/* <View style={styles.baseScreen} onLayout={onLayoutRootView}>
					<StatusBarWrapper />
					<BaseScreen />
				</View> */}
			</PaperProvider>
		</Provider>
	);
}

// 		<GestureHandlerRootView></GestureHandlerRootView>

const getStyles = (theme) => {
	return StyleSheet.create({
		baseScreen: {
			flex: 1,
			backgroundColor: theme.surface,
		},
	});
};
