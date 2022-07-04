import React, { useEffect, useState } from "react";
import {
	View,
	Pressable,
	StyleSheet,
	Keyboard,
	Alert,
	ActivityIndicator,
} from "react-native";
import {
	TextInput as PaperInput,
	HelperText,
	Snackbar,
} from "react-native-paper";
import HeadlineText from "../../components/Text/Headline";

import { Themes } from "../../shared/Theme";
import { useDispatch, useSelector } from "react-redux";
import FilledButton from "../../components/Buttons/FilledButton";
import TopAppBar from "../../components/UI/TopAppBarComponent";
import IconButton from "../../components/Buttons/IconButton";
import validator from "validator";
import authSlice, { clearErrorState, createUserWithEmailAndPassword, DEVLoginAndCreateUser } from "../../redux/slices/authSlice";
import TitleText from "../../components/Text/Title";

const passwordRegEx = new RegExp(
	/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/
);

const NewUserScreen = (props) => {
	const auth = useSelector((state) => state.auth);
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);
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
	const [confirmPassword, setConfirmPassword] = useState({
		value: "",
		isValid: false,
		showError: false,
	});

	const [isFormValid, setIsFormValid] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [snackBarVisible, setSnackBarVisible] = useState(false);
	const [snackBarText, setSnackBarText] = useState("");

	useEffect(() => {
		return () => {
			setIsLoading(false);
		};
	}, []);

	useEffect(() => {
		if (auth.error) {
			console.log(auth.error.message);
			let errorText = "Generic error";
			if(auth.error.message == "auth/email-already-in-use"){
				errorText = "User with email already exists!"
			}
			setIsLoading(false);
			setSnackBarVisible(true);
			setSnackBarText(errorText);
		}else {
			setSnackBarText("");
			setSnackBarVisible(false);
			console.log("auth error cleared");
		}
	}, [auth]);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	useEffect(() => {
		// console.log(email);
		setIsFormValid(
			email.isValid && password.isValid && confirmPassword.isValid
		);
	}, [email, password, confirmPassword]);

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

	const onConfirmPasswordEndEditing = (event) => {
		const confirmPasswordCandidate = event.nativeEvent.text;

		// ensure that password is valid
		if (confirmPasswordCandidate.length > 0 && password.isValid) {
			const isConfirmSameAsPassword =
				confirmPasswordCandidate === password.value;
			setConfirmPassword({
				value: confirmPasswordCandidate,
				isValid: isConfirmSameAsPassword,
				showError: !isConfirmSameAsPassword,
			});
		} else if (confirmPasswordCandidate.length < 1) {
			setConfirmPassword({ value: "", isValid: false, showError: false });
		}
	};

	const onSubmitNewUser = () => {
		setIsLoading(true);

		dispatch(
			createUserWithEmailAndPassword({
				email: email.value,
				password: password.value,
			})
		);
	};

	const onSnackBarDismissed = () => {
		dispatch(clearErrorState());
	}
	const onDevCreateUser = () => {
		dispatch(DEVLoginAndCreateUser({email: "test@test.com", password: "Password1"}));
	}

	return (
		<Pressable onPress={() => Keyboard.dismiss()} style={styles.screen}>
			{isLoading && (
				<View style={styles.loadingSpinner}>
					<ActivityIndicator
						size="large"
						color={currentTheme.primary}
					/>
				</View>
			)}
			{!isLoading && (
				<View style={styles.screenContent}>
					<Snackbar
						style={{
							backgroundColor: currentTheme.secondaryContainer,
							borderRadius: 24,
							marginBottom: 50,
							elevation : 0,
							color: currentTheme.error
						}}
						visible={snackBarVisible}
						onDismiss={onSnackBarDismissed}
						theme={{colors: {
							surface: currentTheme.onSecondaryContainer
						}}}
						duration={4000}
					>
						{snackBarText}
					</Snackbar>
					<TopAppBar
						navigationButton={
							<IconButton
								name="arrow-back"
								iconColor={currentTheme.onSurface}
								onPress={() => {
									props.navigation.goBack();
								}}
							/>
						}
						headlineText="Create new User"
					/>
					<View style={styles.inputContainer}>
						<View>
							<HeadlineText
								large={true}
								style={{ color: currentTheme.onSurface }}
							>
								Enter email and password
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
						<View style={styles.confirmPasswordInput}>
							<PaperInput
								mode="outlined"
								style={{
									backgroundColor: currentTheme.surface,
								}}
								activeOutlineColor={
									confirmPassword.showError
										? currentTheme.error
										: currentTheme.primary
								}
								outlineColor={
									confirmPassword.showError
										? currentTheme.error
										: currentTheme.outline
								}
								theme={{
									colors: {
										text: confirmPassword.showError
											? currentTheme.error
											: currentTheme.onSurface,
										placeholder: confirmPassword.showError
											? currentTheme.error
											: currentTheme.onSurface,
									},
								}}
								label="Confirm password"
								secureTextEntry={true}
								keyboardType="default"
								onEndEditing={(event) =>
									onConfirmPasswordEndEditing(event)
								}
							/>
							<HelperText
								style={{ color: currentTheme.error }}
								visible={confirmPassword.showError}
								type="error"
							>
								Must match password
							</HelperText>
						</View>

						<View>
							<FilledButton
								onButtonPress={onSubmitNewUser}
								disabled={!isFormValid}
							>
								Login
							</FilledButton>
						</View>
						{/* <View style={{marginTop: 50}}>
							<TitleText style={{color: currentTheme.onSurface}}>DEV</TitleText>
							<FilledButton onButtonPress={onDevCreateUser}>Createuserdetail</FilledButton>
						</View> */}
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
		screenContent: {
			flex: 1,
			alignItems: "center",
		},
		inputContainer: {
			// marginTop: 100,
			width: "100%",
			justifyContent: "center",
			paddingHorizontal: 24,
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

export default NewUserScreen;
