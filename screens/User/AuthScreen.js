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

import { TextInput as PaperInput, HelperText } from "react-native-paper";

import { Themes } from "../../shared/Theme";

import OutlineButton from "../../components/Buttons/OutlineButton";
import { loginUser } from "../../redux/slices/authSlice";

import TopAppBar from "../../components/UI/TopAppBarComponent";
import IconButton from "../../components/Buttons/IconButton";
import { setUseDarkMode } from "../../redux/slices/appSettingsSlice";
import validator from "validator";
import FilledButton from "../../components/Buttons/FilledButton";
import HeadlineText from "../../components/Text/Headline";

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
	const [error, setError] = useState();

	useEffect(() => {
		return () => {
			setIsLoading(false);
		};
	}, []);

	// error handling
	useEffect(() => {
		if (error) {
			Alert.alert("Error on AuthAttempt", error, [{ text: "Dismiss" }]);
		}
	}, [error]);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	useEffect(() => {
		// console.log(email);
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
					<TopAppBar
						headlineText="Welcome"
						trailingIcons={[
							<OutlineButton onButtonPress={() => props.navigation.navigate("NewUserScreen")}>Create New User</OutlineButton>,
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
