import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
	ScrollView,
	StyleSheet,
	View,
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import * as AuthActions from "../../store/actions/auth";
import { useDispatch, useSelector } from "react-redux";

import { Themes } from "../../shared/Theme";
const theme = Themes.dark;

import HeadlineText from "../../components/Text/Headline";
import FilledButton from "../../components/Buttons/FilledButton";
import OutlineButton from "../../components/Buttons/OutlineButton";
import Input from "../../components/UI/Input";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
	if (action.type === FORM_INPUT_UPDATE) {
		const updatedFormValue = {
			...state.formValues,
			[action.input]: action.value,
		};
		const updatedFormValueValid = {
			...state.isFormValuesValid,
			[action.input]: action.isValid,
		};
		let updatedFormIsValid = true;
		for (const key in updatedFormValueValid) {
			updatedFormIsValid =
				updatedFormIsValid && updatedFormValueValid[key];
		}
		return {
			isFormValid: updatedFormIsValid,
			isFormValuesValid: updatedFormValueValid,
			formValues: updatedFormValue,
		};
	}
	return state;
};

const AuthScreen = (props) => {
	const authStatus = useSelector((state) => state.auth);
	console.log(authStatus);

	const dispatch = useDispatch();
	const [isSignup, setIsSignup] = useState(true); // CHANGE TO FALSE
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();
	const [formState, dispatchFormState] = useReducer(formReducer, {
		formValues: {
			email: "",
			password: "",
		},
		isFormValuesValid: {
			email: false,
			password: false,
		},
		isFormValid: false,
	});

	useEffect(() => {
		if (error) {
			Alert.alert("Error on AuthAttempt", error, [{ text: "Dismiss" }]);
		}
	}, [error]);

	const testLoginCreds = {
		email: "marcusbjorna@gmail.com",
		password: "123456",
	};

	const authHandler = async () => {
		let action;
		if (isSignup) {
			action = AuthActions.signup(
				formState.formValues.email,
				formState.formValues.password
			);
		} else {
			action = AuthActions.login(
				formState.formValues.email,
				formState.formValues.password
			);
		}

		setIsLoading(true);
		console.log("LOADING: " + isLoading);

		try {
			await dispatch(action);
		} catch (e) {
			console.log("error: " + e);
		}
	};

	const inputChangeHandler = useCallback(
		(inputIdentifier, inputValue, inputValidity) => {
			console.log("HELLO FORM INPUTCHANGEHANDLER");
			dispatchFormState({
				type: FORM_INPUT_UPDATE,
				value: inputValue,
				isValid: inputValidity,
				input: inputIdentifier,
			});
		},
		[dispatchFormState]
	);

	return (
		<KeyboardAvoidingView
			behavior="padding"
			keyboardVerticalOffset={10}
			style={styles.screen}
		>
			{!isLoading && (
				<View style={styles.authScreenContent}>
					<View style={styles.authCardContainer}>
						<View style={styles.authCardHeader}>
							<HeadlineText
								large={true}
								style={{ color: theme.onSurfaceVariant }}
							>
								Login
							</HeadlineText>
						</View>
						<View style={styles.authCardContent}>
							<Input
								id="email"
								label="E-Mail"
								keyboardType="email-address"
								required
								email
								autoCapitalize="none"
								errorText="Please enter a valid email address."
								onInputChange={inputChangeHandler}
								initialValue=""
							/>
							<Input
								id="password"
								label="Password"
								keyboardType="default"
								secureTextEntry
								required
								minLength={6}
								autoCapitalize="none"
								errorText="Please enter a valid password."
								onInputChange={inputChangeHandler}
								initialValue=""
							/>
						</View>

						<View style={styles.authCardButtonRow}>
							<OutlineButton
								onButtonPress={() => setIsSignup(!isSignup)}
								style={{ width: 100, marginHorizontal: 5 }}
							>
								{isSignup ? "Login" : "Signup"}
							</OutlineButton>
							<FilledButton
								style={{ width: 100, marginHorizontal: 5 }}
								onButtonPress={() => authHandler()}
							>
								{isSignup ? "Signup" : "Login"}
							</FilledButton>
						</View>
					</View>
				</View>
			)}
		</KeyboardAvoidingView>
	);

};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: theme.surface,
		// justifyContent: "center",
		// alignItems: "center",
	},
	authScreenContent: {
		flex: 1,
		height: "100%",
		width: "100%",
		paddingTop: 100,
		// justifyContent: "center",
		alignItems: "center",
	},
	loadingSpinner: {
		flex: 1,
		height: "100%",
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	authCardContainer: {
		width: "90%",
		// height: 200,
		paddingHorizontal: 16,
		paddingBottom: 12,
		borderRadius: 12,
		backgroundColor: theme.surfaceVariant,
	},
	authCardContent: {
		marginTop: 10,
		// flexDirection: "row",
		// justifyContent: "flex-end"
	},
	authCardDivider: {
		borderStyle: "solid",
		width: "100%",
		height: 2,
		borderTopWidth: 1,
		borderTopColor: theme.outline,
		marginVertical: 3,
	},
	authCardButtonRow: {
		marginTop: 10,
		flexDirection: "row",
		justifyContent: "flex-end",
	},
});

export default AuthScreen;
