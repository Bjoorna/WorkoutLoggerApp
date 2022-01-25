import React, { useEffect, useState } from "react";
import { View, Pressable, StyleSheet, Keyboard } from "react-native";
import { Divider, TextInput } from "react-native-paper";
import DisplayText from "../../components/Text/Display";
import TitleText from "../../components/Text/Title";
import BodyText from "../../components/Text/Body";

import { Themes } from "../../shared/Theme";
import TextButton from "../../components/Buttons/TextButton";
import { useSelector } from "react-redux";
import FilledButton from "../../components/Buttons/FilledButton";
const theme = Themes.dark;

const NewUserScreen = (props) => {
	const authToken = useSelector((state) => state.auth.token);

	const [newEmail, setNewEmail] = useState();
	const [newPassword, setNewPassword] = useState();
	const [confirmPassword, setConfirmPassword] = useState();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isValid, setIsValid] = useState(false);

	useEffect(() => {
		if(newPassword == undefined || confirmPassword == undefined){{
			setIsValid(false);
		}}
		if (newPassword == confirmPassword) {
			setIsValid(true);
		} else {
			setIsValid(false);
		}
	}, [newPassword, confirmPassword]);

	useEffect(() => {}, [authToken]);

	const [name, setName] = useState("");

	return (
		<View style={styles.screen}>
			<Pressable
				style={styles.pressable}
				onPress={() => Keyboard.dismiss()}
			>
				<View style={styles.contentView}>
					<View style={styles.card}>
						{!isLoggedIn && !isLoading && (
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
									<FilledButton disabled={!isValid}>
										Create user
									</FilledButton>
								</View>
							</View>
						)}
						{isLoggedIn && !isLoading && (
							<View style={styles.cardContent}>
								<View style={styles.personalInfoHeader}>
									<TitleText
										style={{ color: theme.onSurface }}
										large={true}
									>
										Enter Personal Info
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
										theme={{
											colors: {
												text: theme.onPrimaryContainer,
												placeholder: theme.onSurface,
											},
										}}
										mode="outlined"
										onChangeText={(text) => setName(text)}
										keyboardType="default"
										label="Name"
									/>
									<View
										style={styles.personalInfoDetailInput}
									>
										<View
											style={{
												flexDirection: "row",
												justifyContent: "space-around",
												alignItems: "baseline",
												paddingVertical: 10,
												borderBottomColor:
													theme.outline,
												borderBottomWidth: 1,
											}}
										>
											<BodyText>Enter details</BodyText>
											<TextButton>
												Continue without
											</TextButton>
										</View>
									</View>
								</View>
							</View>
						)}
					</View>
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
});

export default NewUserScreen;
