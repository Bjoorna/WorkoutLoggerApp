import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	View,
	ActivityIndicator,
	Alert,
	Pressable,
	Keyboard,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
	TextInput as PaperInput,
	HelperText,
	Snackbar,
} from "react-native-paper";

import { Themes } from "../../shared/Theme";

import OutlineButton from "../../components/Buttons/OutlineButton";
import { clearErrorState, loginUser } from "../../redux/slices/authSlice";

import TopAppBar from "../../components/UI/TopAppBarComponent";
import IconButton from "../../components/Buttons/IconButton";
import { setUseDarkMode } from "../../redux/slices/appSettingsSlice";
import validator from "validator";
import FilledButton from "../../components/Buttons/FilledButton";
import HeadlineText from "../../components/Text/Headline";
import {
	firebaseGetAuth,
	setAuthPersistence,
	firebaseSignOutUser,
} from "../../firebase/firebase";

const passwordRegEx = new RegExp(
	/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/
);

const AuthScreen = (props) => {
	// Themes
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	const authStatus = useSelector((state) => state.auth);

	const dispatch = useDispatch();
	const [email, setEmail] = useState({
		value: "",
		isValid: false,
		showError: false,
	});
	const [password, setPassword] = useState({
		value: "",
		isValid: false,
		showError: false,
	});
	const [isFormValid, setIsFormValid] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	// const [error, setError] = useState();
	const [snackBarVisible, setIsSnackBarVisible] = useState(false);
	const [snackBarText, setSnackBarText] = useState("");

	useEffect(() => {
		return () => {
			setIsLoading(false);
		};
	}, []);

	useEffect(() => {
		if (authStatus.error) {
			const errorMessage = authStatus.error.message;
			console.log(errorMessage);
			let errorText = "Error on login";
			if (errorMessage == "auth/email-already-in-use") {
				errorText = "Wrong email or password";
			} else if (errorMessage == "auth/user-not-found") {
				errorText = "User not found";
			}
			setSnackBarText(errorText);
			setIsLoading(false);
			setIsSnackBarVisible(true);
		}
	}, [authStatus]);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	useEffect(() => {
		setIsFormValid(email.isValid && password.isValid);
	}, [email, password]);

	const setTempLoginCreds = () => {
		setEmail("marcusbjorna@gmail.com");
		setPassword("Password1");
	};

	const emailValidator = (email) => {
		return validator.isEmail(email);
	};

	const passwordValidator = (password) => {
		return passwordRegEx.test(password);
	};

	const onEmailEndEditing = (event) => {
		const emailCandidate = event.nativeEvent.text;
		if (emailCandidate.length < 1) {
			setEmail({ value: "", isValid: false, showError: false });
		} else {
			const emailIsValid = emailValidator(emailCandidate);

			setEmail({
				value: emailCandidate,
				isValid: emailIsValid,
				showError: !emailIsValid,
			});
		}
	};

	const onPasswordEndEditing = (event) => {
		const passwordCandidate = event.nativeEvent.text;
		if (passwordCandidate.length < 1) {
			setPassword({ value: "", isValid: false, showError: false });
		} else {
			const passwordIsValid = passwordValidator(passwordCandidate);
			setPassword({
				value: passwordCandidate,
				isValid: passwordIsValid,
				showError: !passwordIsValid,
			});
		}
	};

	const onSubmitLogin = async () => {
		setIsLoading(true);
		dispatch(loginUser({ email: email.value, password: password.value }));
	};

	const onSnackBarDismissed = () => {
		// clear error state in store
		dispatch(clearErrorState());
		setIsSnackBarVisible(false);
		setSnackBarText("");
	};

	return (
		<Pressable style={styles.screen} onPress={() => Keyboard.dismiss()}>
			{isLoading && (
				<View style={styles.loadingSpinner}>
					<ActivityIndicator
						size="large"
						color={currentTheme.primary}
					/>
				</View>
			)}
			{!isLoading && (
				<View style={styles.authScreenContent}>
					<Snackbar
						style={{
							backgroundColor: currentTheme.secondaryContainer,
							borderRadius: 24,
							marginBottom: 50,
							elevation: 0,
							color: currentTheme.error,
						}}
						visible={snackBarVisible}
						onDismiss={onSnackBarDismissed}
						theme={{
							colors: {
								surface: currentTheme.onSecondaryContainer,
							},
						}}
						duration={4000}
					>
						{snackBarText}
					</Snackbar>

					<TopAppBar
						headlineText="Welcome"
						trailingIcons={[
							<OutlineButton
								onButtonPress={() =>
									props.navigation.navigate("NewUserScreen")
								}
							>
								Create New User
							</OutlineButton>,
							,
							<IconButton
								name="sunny-outline"
								onPress={() =>
									dispatch(setUseDarkMode(!useDarkMode))
								}
							/>,
						]}
					/>
					<View style={styles.inputContainer}>
						<View>
							<HeadlineText
								large={true}
								style={{ color: currentTheme.onSurface }}
							>
								Login
							</HeadlineText>
						</View>
						<View style={styles.emailInput}>
							<PaperInput
								style={{
									backgroundColor: currentTheme.surface,
								}}
								activeOutlineColor={
									email.showError
										? currentTheme.error
										: currentTheme.primary
								}
								outlineColor={
									email.showError
										? currentTheme.error
										: currentTheme.outline
								}
								theme={{
									colors: {
										text: email.showError
											? currentTheme.error
											: currentTheme.onSurface,
										placeholder: email.showError
											? currentTheme.error
											: currentTheme.onSurface,
									},
								}}
								mode="outlined"
								label="Email"
								email
								onEndEditing={(event) =>
									onEmailEndEditing(event)
								}
							/>
							<HelperText
								style={{ color: currentTheme.error }}
								visible={email.showError}
								type="error"
							>
								Email might not be valid.
							</HelperText>
						</View>
						<View style={styles.passwordInput}>
							<PaperInput
								mode="outlined"
								style={{
									backgroundColor: currentTheme.surface,
								}}
								activeOutlineColor={
									password.showError
										? currentTheme.error
										: currentTheme.primary
								}
								outlineColor={
									password.showError
										? currentTheme.error
										: currentTheme.outline
								}
								theme={{
									colors: {
										text: password.showError
											? currentTheme.error
											: currentTheme.onSurface,
										placeholder: password.showError
											? currentTheme.error
											: currentTheme.onSurface,
									},
								}}
								label="Password"
								secureTextEntry={true}
								keyboardType="default"
								onEndEditing={(event) =>
									onPasswordEndEditing(event)
								}
							/>
							<HelperText
								style={{ color: currentTheme.error }}
								visible={password.showError}
								type="error"
							>
								Password must contain at least 6 characters, one
								number, one uppercase and one lowercase letter
							</HelperText>
						</View>
						<View>
							<FilledButton
								onButtonPress={onSubmitLogin}
								disabled={!isFormValid}
							>
								Login
							</FilledButton>
						</View>
					</View>
				</View>
			)}
		</Pressable>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		screen: {
			flex: 1,
			backgroundColor: theme.surface,
		},
		authScreenContent: {
			flex: 1,
			alignItems: "center",
		},
		inputContainer: {
			marginTop: 100,
			width: "100%",
			justifyContent: "center",
			paddingHorizontal: 24,
		},
		emailInput: {
			// marginBottom: 10,
		},
		loadingSpinner: {
			flex: 1,
			height: "100%",
			width: "100%",
			justifyContent: "center",
			alignItems: "center",
		},
	});
};

export default AuthScreen;
