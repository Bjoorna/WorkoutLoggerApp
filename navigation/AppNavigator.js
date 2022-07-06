import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
	AppTabNavigator,
	AuthStackScreen,
	CreateUserStackScreen,
} from "./Navigators";
import { StyleSheet } from "react-native";

import { Themes } from "../shared/Theme";
import { useDispatch, useSelector } from "react-redux";
import { firebaseGetAuth, firebaseGetCurrentUser, getFirebaseAuth } from "../firebase/firebase";
import { autoLogin, setAutoLoginState } from "../redux/slices/authSlice";
const theme = Themes.dark;

const AppNavigator = (props) => {
	const dispatch = useDispatch();
	const reduxAuthState = useSelector((state) => state.auth);
	const useDarkModeStoreRef = useSelector(
		(state) => state.appSettings.useDarkMode
	);
	const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
	const [isNewUserCreation, setIsNewUserCreation] = useState(false);

	

	const [isDarkMode, setIsDarkMode] = useState(useDarkModeStoreRef);


	const navigatorDarktheme = {
		dark: true,
		colors: {
			background: Themes.dark.surface,
		},
	};
	const navigatorLightTheme = {
		dark: false,
		colors: {
			background: Themes.light.surface,
		},

	}

	useEffect(()=> {
		const firebaseAuthListener = firebaseGetAuth().onAuthStateChanged(async user => {
			if(user) {
				const userID = user.uid;
				const token = await user.getIdToken()
				dispatch(autoLogin({userID, token}));
			}else {
				// console.log("no user")
			}
		})
		firebaseAuthListener();
		// return () => {
		// 	firebaseAuthListener();
		// }
	},[])

	useEffect(() => {
		setIsDarkMode(useDarkModeStoreRef);
	}, [useDarkModeStoreRef]);

	useEffect(() => {
		setIsUserAuthenticated(!!reduxAuthState.token);
		setIsNewUserCreation(reduxAuthState.newUserCreation);
	}, [reduxAuthState]);

	return (
		<NavigationContainer
			theme={isDarkMode ? navigatorDarktheme : navigatorLightTheme}
			// style={{backgroundColor: currentTheme.surface}}
		>
			{isUserAuthenticated && !isNewUserCreation && <AppTabNavigator />}
			{isUserAuthenticated && isNewUserCreation && (
				<CreateUserStackScreen />
			)}
			{!isUserAuthenticated && <AuthStackScreen />}

			{/* <AppTabNavigator /> */}
		</NavigationContainer>
	);
};

const styles = StyleSheet.create({
	navigatorBackground: {
		backgroundColor: theme.surface,
	},
});

export default AppNavigator;
