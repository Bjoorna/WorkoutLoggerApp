import "react-native-gesture-handler";
import 'react-native-get-random-values';

// React
import React, { useState } from "react";

// react native
import { StyleSheet, View, Dimensions } from "react-native";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(["AsyncStorage has been"]);

// redux

import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";

// Navigator
import AppNavigator from "./navigation/AppNavigator";

// themeing
import { Themes } from "./shared/Theme";
const theme = Themes.dark;

// Expo
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { StatusBar } from "expo-status-bar";

// Reducers
import authReducer from "./store/reducers/auth";
import userReducer from "./store/reducers/user";
import workoutReducer  from "./store/reducers/workout";
import appsettingsReducer from "./store/reducers/appsettings";

// react native paper
import { Provider as PaperProvider } from "react-native-paper";

const rootReducer = combineReducers({
	auth: authReducer,
	user: userReducer,
	workout: workoutReducer,
	appSettings: appsettingsReducer
});
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const loadFonts = () => {
	return Font.loadAsync({
		"roboto-400": require("./assets/fonts/Roboto-Regular.ttf"),
		"roboto-500": require("./assets/fonts/Roboto-Medium.ttf"),
	});
};

export default function App() {
	const [fontLoaded, setFontLoaded] = useState(false);
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
					<StatusBar style="light"  />
					<AppNavigator />
				</View>
			</Provider>
		</PaperProvider>
	);
}

const styles = StyleSheet.create({
	baseScreen: {
		flex: 1,
		backgroundColor: theme.primary,
	},
});
