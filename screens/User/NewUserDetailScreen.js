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
import BodyText from "../../components/Text/Body";
import TextButton from "../../components/Buttons/TextButton";

import TitleText from "../../components/Text/Title";
import FilledButton from "../../components/Buttons/FilledButton";
import { useDispatch, useSelector } from "react-redux";

import User from "../../models/User";

import { Themes } from "../../shared/Theme";

// const theme = Themes.dark;

const NewUserDetailScreen = (props) => {
	// Themes
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);


	const dispatch = useDispatch();
	const userID = useSelector((state) => state.auth.userID);

	const [userName, setUserName] = useState();
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState(false);

	const saveOnlyName = async () => {
		const newUser = new User(userName, null, null, null, null, null);
		if (userID) {
			console.log(userID);
			try {
				setError(null), setIsLoading(true);
			} catch (error) {
				setError(error.message);
				setIsLoading(false);
			}
		}
	};

	useEffect(() => {
		if (error) {
			Alert.alert("Error when creating user!", error, [{ text: "Okay" }]);
		}
	}, [error]);


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
								color={currentTheme.primary}
							/>
						</View>
					)}
					{!isLoading && (
						<View style={styles.card}>
							<View style={styles.cardContent}>
								<View style={styles.personalInfoHeader}>
									<TitleText
										style={{
											color: currentTheme.onSurface,
										}}
										large={true}
									>
										Enter Personal Info
									</TitleText>
								</View>
								<View style={styles.personalInfoInput}>
									<TextInput
										style={styles.textInput}
										outlineColor={currentTheme.outline}
										activeOutlineColor={
											currentTheme.onPrimaryContainer
										}
										selectionColor={currentTheme.secondary}
										theme={{
											colors: {
												text: currentTheme.onPrimaryContainer,
												placeholder:
													currentTheme.onSurface,
											},
										}}
										mode="outlined"
										onChangeText={(text) =>
											setUserName(text)
										}
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
													currentTheme.outline,
												borderBottomWidth: 1,
											}}
										>
											<BodyText>Enter details</BodyText>
											<TextButton
												onButtonPress={() => {
													saveOnlyName();
												}}
											>
												Continue without
											</TextButton>
										</View>
									</View>
								</View>
							</View>
						</View>
					)}
				</View>
			</Pressable>
		</View>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
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

		textInput: {
			backgroundColor: theme.surfaceVariant,
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
		loadingSpinner: {
			flex: 1,
			height: "100%",
			width: "100%",
			justifyContent: "center",
			alignItems: "center",
		},
	});
};


export default NewUserDetailScreen;
