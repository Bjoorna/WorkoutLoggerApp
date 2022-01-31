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
import * as AuthActions from "../../store/actions/auth";

import User from "../../models/User";

import { Themes } from "../../shared/Theme";

const theme = Themes.dark;

const NewUserDetailScreen = (props) => {
	const dispatch = useDispatch();
	const userID = useSelector((state) => state.auth.userID);

	const [userName, setUserName] = useState();
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState(false);

	const saveOnlyName = async () => {
		const newUser = new User(userName, null, null, null, null);
		if (userID) {
			console.log(userID);
			try {
				setError(null), setIsLoading(true);
				await dispatch(AuthActions.initSaveUser(userID, newUser));
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
													theme.outline,
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

export default NewUserDetailScreen;