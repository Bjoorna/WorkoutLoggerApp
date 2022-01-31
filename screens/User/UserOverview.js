import React, { useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	Button,
	ScrollView,
	SafeAreaView,
	Image,
} from "react-native";

import * as AuthActions from "../../store/actions/auth";
import * as WorkoutActions from "../../store/actions/workout";
import { useDispatch, useSelector } from "react-redux";

import DisplayText from "../../components/Text/Display";
import BodyText from "../../components/Text/Body";
import OutlineButton from "../../components/Buttons/OutlineButton";
import TextButton from "../../components/Buttons/TextButton";
import { Themes } from "../../shared/Theme";
const theme = Themes.dark;

import Workout from "../../models/workout";

const UserOverviewScreen = (props) => {
	// const user = USERS.find((user) => user.name === "Dennis");
	const user = useSelector((state) => state.user.user);
	const userID = useSelector((state) => state.auth.userID);
	console.log("USER from UserOverview: ");
	console.log(user);

	const authDetails = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	const logoutUser = () => {
		dispatch(AuthActions.logout());
	};

	const saveUser = () => {
		dispatch(AuthActions.saveUser(user));
	};

	const testWorkout = new Workout(
		Date.now(),
		false,
		"This is a workout",
		userID
	);

	return (
		<SafeAreaView style={styles.safeView}>
			<ScrollView style={styles.screen}>
				<View style={styles.userHeaderContainer}>
					<DisplayText style={styles.headerText}>
						{user.name}
					</DisplayText>
					<Image
						style={styles.image}
						resizeMode="contain"
						source={{ uri: user.profileImageURI }}
					/>
				</View>
				<View style={styles.currentInfoView}>
					<BodyText large={true}>{user.weight}</BodyText>
					<OutlineButton onButtonPress={() => logoutUser()}>
						Logout
					</OutlineButton>
					<OutlineButton
						disabled={false}
						// style={{width: 300}}
						onButtonPress={() => console.log(authDetails)}
					>
						authDetails
					</OutlineButton>
					<TextButton disabled={false}>
						TestButton
					</TextButton>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeView: {
		flex: 1,
		backgroundColor: theme.surface,
	},
	screen: {
		// flex: 1,
		backgroundColor: theme.surface,
	},
	userHeaderContainer: {
		height: 300,
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
	},
	currentInfoView: {
		width: "90%",
		alignItems: "center"
	},
	headerText: {
		color: theme.onSurface,
	},
	image: {
		height: "80%",
		width: "80%",
		borderRadius: 2000,
	},
});

export default UserOverviewScreen;
