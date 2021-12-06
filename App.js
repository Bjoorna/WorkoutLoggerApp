import "react-native-gesture-handler";
import React, { useState } from "react";
import { StyleSheet, View, Dimensions } from "react-native";

import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";

import AppNavigator from "./navigation/AppNavigator";

import { Themes } from "./shared/Theme";
const theme = Themes.dark;

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

import authReducer from "./store/reducers/auth";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const rootReducer = combineReducers({
	auth: authReducer,
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
		<View style={styles.baseScreen}>
			<Provider store={store}>
				<AppNavigator />
			</Provider>
		</View>
	);
}

const styles = StyleSheet.create({
	baseScreen: {
		flex: 1,
		backgroundColor: theme.primary,
	},
});
