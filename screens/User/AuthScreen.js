import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
	ScrollView,
	StyleSheet,
	View,
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	Keyboard,
} from "react-native";
import * as AuthActions from "../../store/actions/auth";
import { useDispatch, useSelector } from "react-redux";

import { TextInput } from "react-native-paper";

import { Themes } from "../../shared/Theme";
const theme = Themes.dark;

import HeadlineText from "../../components/Text/Headline";
import FilledButton from "../../components/Buttons/FilledButton";
import OutlineButton from "../../components/Buttons/OutlineButton";
import Input from "../../components/UI/Input";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";

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

	const dispatch = useDispatch();
	const [isSignup, setIsSignup] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
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

	// error handling
	useEffect(() => {
		if (error) {
			Alert.alert("Error on AuthAttempt", error, [{ text: "Dismiss" }]);
		}
	}, [error]);

	const authHandler = async () => {
		let action;
		if (isSignup) {
			action = AuthActions.signup(email, password);
		} else {
			action = AuthActions.login(email, password);
		}

		setIsLoading(true);
		setError(null);

		try {
			await dispatch(action);
		} catch (e) {
			console.log("AUTHSCREEN ERROR");
			console.log(e);
			setError(e.message);
			setIsLoading(false);
		}
	};

	const inputChangeHandler = useCallback(
		(inputIdentifier, inputValue, inputValidity) => {
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
			keyboardVerticalOffset={1}
			style={styles.screen}
		>
			<Pressable
				style={styles.pressable}
				onPress={() => Keyboard.dismiss()}
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
								<TextInput
									style={styles.authTextInput}
									outlineColor={theme.outline}
									activeOutlineColor={
										theme.onPrimaryContainer
									}
									selectionColor={theme.secondary}
									mode="outlined"
									label="Email"
									email
									theme={{
										colors: {
											text: theme.onPrimaryContainer,
											placeholder: theme.onSurface,
										},
									}}
									onChangeText={(text) => setEmail(text)}
								/>
								<TextInput
									style={styles.authTextInput}
									outlineColor={theme.outline}
									activeOutlineColor={
										theme.onPrimaryContainer
									}
									selectionColor={theme.secondary}
									mode="outlined"
									label="Password"
									keyboardType="default"
									secureTextEntry
									theme={{
										colors: {
											text: theme.onPrimaryContainer,
											placeholder: theme.onSurface,
										},
									}}
									onChangeText={(text) => setPassword(text)}
								/>
							</View>

							<View style={styles.authCardButtonRow}>
								<OutlineButton
									onButtonPress={() => setIsSignup(!isSignup)}
									style={{
										//  width: 100,
										marginHorizontal: 5,
									}}
								>
									{isSignup ? "Login" : "Signup"}
								</OutlineButton>
								<FilledButton
									style={{
										// width: 100,
										marginHorizontal: 5,
									}}
									onButtonPress={() => authHandler()}
								>
									{isSignup ? "Signup" : "Login"}
								</FilledButton>
							</View>
						</View>
					</View>
				)}
			</Pressable>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: theme.surface,
	},
	pressable: {
		flex: 1,
	},
	authScreenContent: {
		flex: 1,
		height: "100%",
		width: "100%",
		paddingTop: 100,
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
	authCardHeader: {
		paddingVertical: 10,
	},
	authCardContent: {
		// marginTop: 20,
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
	authTextInput: {
		paddingVertical: 5,
		backgroundColor: theme.surfaceVariant,
	},
});

export default AuthScreen;
