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
import { useDispatch, useSelector } from "react-redux";


import USERS from "../../dummy/data/Users";

import DisplayText from "../../components/Text/Display";
import FilledButton from "../../components/Buttons/FilledButton";
import { Themes } from "../../shared/Theme";
import OutlineButton from "../../components/Buttons/OutlineButton";
const theme = Themes.dark;


const UserOverviewScreen = (props) => {
	const user = USERS.find((user) => user.name === "Dennis");

	const authDetails = useSelector(state => state.auth)
	const dispatch = useDispatch();

	const logoutUser = () => {
		dispatch(AuthActions.logout());
	}

	const saveUser = () => {
		dispatch(AuthActions.saveUser(user))
	}


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
						source={{ uri: user.profileImageUri }}
					/>
				</View>
				<View style={styles.currentInfoView}>
					<FilledButton onButtonPress={() => logoutUser()}>
						Logout
					</FilledButton>
					<FilledButton onButtonPress={() => console.log(authDetails)}>
						Print authdetails
					</FilledButton>
					<OutlineButton onButtonPress={() => saveUser()} >SAVE USER</OutlineButton>
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
