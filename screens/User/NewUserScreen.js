import React, { useEffect, useState } from "react";
import {
	View,
	Pressable,
	StyleSheet,
	Keyboard,
	Alert,
	ActivityIndicator,
} from "react-native";
import { Divider, TextInput } from "react-native-paper";
import DisplayText from "../../components/Text/Display";
import TitleText from "../../components/Text/Title";
import BodyText from "../../components/Text/Body";

import { Themes } from "../../shared/Theme";
import TextButton from "../../components/Buttons/TextButton";
import { useDispatch, useSelector } from "react-redux";
import FilledButton from "../../components/Buttons/FilledButton";
import * as firebase from "../../firebase/firebase";
import * as AuthActions from "../../store/actions/auth";

const theme = Themes.dark;

const NewUserScreen = (props) => {
	const authToken = useSelector((state) => state.auth.token);
	const dispatch = useDispatch();

	const [newEmail, setNewEmail] = useState();
	const [newPassword, setNewPassword] = useState();
	const [confirmPassword, setConfirmPassword] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [isValid, setIsValid] = useState(false);

	const [error, setError] = useState();

	useEffect(() => {
		if (newPassword == undefined || confirmPassword == undefined) {
			{
				setIsValid(false);
				return;
			}
		}
		if (newPassword == confirmPassword) {
			setIsValid(true);
		} else {
			setIsValid(false);
		}
	}, [newPassword, confirmPassword]);

	useEffect(() => {
		console.log("AUTHTOKEN CHANGED");
		setIsLoading(false);
	}, [authToken]);

	useEffect(() => {
		if (error) {
			Alert.alert("Error when creating user!", error, [{ text: "Okay" }]);
		}
	}, [error]);

	const signUpUser = async () => {
		if (!isValid) {
			return;
		}
		setIsLoading(true);
		console.log("Is Signing up user");
		setError(null);

		try {
			await dispatch(AuthActions.createUser(newEmail, newPassword));
		} catch (error) {
			console.log(error);
			setError(error.message);
			setIsLoading(false);
		}
	};

	return (
		<View style={styles.screen}>
			<Pressable
				style={styles.pressable}
				onPress={() => Keyboard.dismiss()}
			>
				<View style={styles.contentView}>
					{isLoading && (
						<View style={styles.loadingSpinner}>
							<ActivityIndicator
								size="large"
								color={theme.primary}
							/>
						</View>
					)}
					{!isLoading && (
						<View style={styles.card}>
							<View style={styles.cardContent}>
								<View style={styles.personalInfoHeader}>
									<TitleText
										style={{ color: theme.onSurface }}
										large={true}
									>
										Enter Email and Password
									</TitleText>
								</View>
								<View style={styles.personalInfoInput}>
									<TextInput
										style={styles.textInput}
										outlineColor={theme.outline}
										activeOutlineColor={
											theme.onPrimaryContainer
										}
										selectionColor={theme.secondary}
										mode="outlined"
										label="Email"
										email
										keyboardType="email-address"
										theme={{
											colors: {
												text: theme.onPrimaryContainer,
												placeholder: theme.onSurface,
											},
										}}
										onChangeText={(text) =>
											setNewEmail(text)
										}
									/>
									<TextInput
										style={styles.textInput}
										outlineColor={theme.outline}
										activeOutlineColor={
											theme.onPrimaryContainer
										}
										selectionColor={theme.secondary}
										mode="outlined"
										label="Password"
										secureTextEntry
										keyboardType="default"
										theme={{
											colors: {
												text: theme.onPrimaryContainer,
												placeholder: theme.onSurface,
											},
										}}
										onChangeText={(text) =>
											setNewPassword(text)
										}
									/>
									<TextInput
										style={styles.textInput}
										outlineColor={theme.outline}
										activeOutlineColor={
											theme.onPrimaryContainer
										}
										selectionColor={theme.secondary}
										mode="outlined"
										label="Confirm Password"
										secureTextEntry
										keyboardType="default"
										theme={{
											colors: {
												text: theme.onPrimaryContainer,
												placeholder: theme.onSurface,
											},
										}}
										onChangeText={(text) =>
											setConfirmPassword(text)
										}
									/>
								</View>
								<View style={styles.buttonRow}>
									<FilledButton
										onButtonPress={() => {
											signUpUser();
										}}
										disabled={!isValid}
									>
										Create user
									</FilledButton>
								</View>
							</View>
						</View>
					)}
				</View>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: theme.surface,
	},
	pressable: {
		flex: 1,
		// height: "100%",
		// width: "100%",
		// alignItems: "",
	},
	contentView: {
		flex: 1,
		// height: "100%",
		// width: "100%",

		alignItems: "center",
	},
	card: {
		marginTop: 10,
		width: "90%",
		// height: 400,
		backgroundColor: theme.surfaceVariant,
		borderRadius: 12,
		padding: 10,
	},
	cardContent: {},
	personalInfoHeader: { marginBottom: 15 },
	personalInfoInput: {},
	personalInfoDetailInput: {
		marginVertical: 20,
	},
	textInput: {
		backgroundColor: theme.surfaceVariant,
	},
	buttonRow: {
		marginVertical: 10,
	},
	loadingSpinner: {
		flex: 1,
		height: "100%",
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
});

export default NewUserScreen;
