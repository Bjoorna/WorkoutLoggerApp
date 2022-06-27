import "react-native-gesture-handler";
import "react-native-get-random-values";

// React
import React, { useState, useEffect } from "react";

// react native
import { StyleSheet, View, Dimensions, Appearance } from "react-native";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(["AsyncStorage has been"]);

// redux
import { Provider, useSelector } from "react-redux";

import { configureStore, getDefaultMiddleware, Reducer } from "@reduxjs/toolkit";

// Navigator
import AppNavigator from "./navigation/AppNavigator";

// themeing
import { Themes } from "./shared/Theme";
import StatusBarWrapper from "./components/UI/StatusBarWrapper";
const theme = Themes.dark;

// Expo
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

// Reducers
// import authReducer from "./store/reducers/auth";
// import userReducer from "./store/reducers/user";
// import workoutReducer from "./store/reducers/workout";
// import appsettingsReducer from "./store/reducers/appsettings";

// react native paper
import { Provider as PaperProvider } from "react-native-paper";
import authReducer from "./redux/slices/authSlice";
import appSettingsReducer from "./redux/slices/appSettingsSlice";
import workoutReducer from './redux/slices/workoutSlice'
import userReducer from './redux/slices/userSlice';
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
	user: userReducer
}
// const store = store;
const store = configureStore({
	reducer: reducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
});
const loadFonts = () => {
	return Font.loadAsync({
		"roboto-400": require("./assets/fonts/Roboto-Regular.ttf"),
		"roboto-500": require("./assets/fonts/Roboto-Medium.ttf"),
	});
};

export default function App() {
	const [fontLoaded, setFontLoaded] = useState(false);
	// const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [styles, setStyles] = useState(
		getStyles(Themes.dark)
	);
	
	// const [currentTheme, setCurrentTheme] = useState(
	// 	useDarkMode ? Themes.dark : Themes.light
	// );

	// useEffect(() => {
	// 	setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
	// 	// setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	// }, [useDarkMode]);

	if (!fontLoaded) {
		return (
			<AppLoading
				startAsync={loadFonts}
				onFinish={() => setFontLoaded(true)}
				onError={(err) => console.log(err)}
			/>
		);
	}
	return (
		
		<PaperProvider>
			<Provider store={store}>
				<View style={styles.baseScreen}>
					<StatusBarWrapper />
					<AppNavigator />
				</View>
			</Provider>
		</PaperProvider>
	);
}

const getStyles = theme => {
 return StyleSheet.create({
	baseScreen: {
		flex: 1,
		backgroundColor: theme.surface,
	},
});
}
