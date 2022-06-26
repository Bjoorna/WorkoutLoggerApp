import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	Button,
	ScrollView,
	SafeAreaView,
	Image,
} from "react-native";

// import * as AuthActions from "../../store/actions/auth";
import { useDispatch, useSelector } from "react-redux";

import DisplayText from "../../components/Text/Display";
import LabelText from "../../components/Text/Label";
import HeadlineText from "../../components/Text/Headline";
import OutlineButton from "../../components/Buttons/OutlineButton";
import IconButton from "../../components/Buttons/IconButton";

import { Themes } from "../../shared/Theme";
import TopAppBar from "../../components/UI/TopAppBarComponent";

function calculateAge(user) {
	const now = new Date();
	const bd = new Date(user.dob.seconds * 1000);
	let age = now.getFullYear() - bd.getFullYear();

	const month = now.getMonth() - bd.getMonth();
	if (month < 0 || (month === 0 && now.getDate() < bd.getDate())) {
		age--;
	}
	return age;
}

const UserOverviewScreen = (props) => {
	// const user = USERS.find((user) => user.name === "Dennis");
	const user = useSelector((state) => state.user.user);
	const userID = useSelector((state) => state.auth.userID);
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

	const logoutUser = () => {
		// dispatch(AuthActions.logout());
	};

	const memoAgeValue = useMemo(() => calculateAge(user), [user]); // useMemo is probably unnecessary

	return (
		<SafeAreaView style={styles.safeView}>
			<TopAppBar
				headlineText="User"
				trailingIcons={[
					<IconButton
						name="settings-outline"
						iconColor={currentTheme.onSurfaceVariant}
						onPress={() =>
							props.navigation.navigate("UserSettings")
						}
					/>,
				]}
			/>
			<View style={styles.userHeaderContainer}>
				<DisplayText style={styles.headerText}>{user.name}</DisplayText>
				<Image
					style={styles.image}
					resizeMode="contain"
					source={{ uri: user.profileImageURI }}
				/>
			</View>
			<View style={styles.currentInfoView}>
				<View style={styles.infoItem}>
					<LabelText style={styles.infoText} large={true}>
						Height
					</LabelText>
					<HeadlineText style={styles.infoText} large={true}>
						{user.height ? user.height : "N/A"}
					</HeadlineText>
				</View>
				<View style={styles.infoItem}>
					<LabelText style={styles.infoText} large={true}>
						Weight
					</LabelText>
					<HeadlineText style={styles.infoText} large={true}>
						{user.weight ? user.weight : "N/A"}
					</HeadlineText>
				</View>
				<View style={styles.infoItem}>
					<LabelText style={styles.infoText} large={true}>
						Age
					</LabelText>
					<HeadlineText style={styles.infoText} large={true}>
						{user.dob ? memoAgeValue : "N/A"}
					</HeadlineText>
				</View>
			</View>
			{/* <OutlineButton onButtonPress={() => console.log(user)}>
				UserDetaail
			</OutlineButton> */}
			<OutlineButton
				style={{ marginTop: 20 }}
				onButtonPress={() => logoutUser()}
			>
				Logout
			</OutlineButton>
		</SafeAreaView>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		safeView: {
			flex: 1,
			backgroundColor: theme.surface,
			alignItems: "center",
		},

		userHeaderContainer: {
			height: 300,
			justifyContent: "center",
			alignItems: "center",
			width: "100%",
		},
		currentInfoView: {
			marginTop: 10,
			width: "90%",
			height: 100,
			flexDirection: "row",
			justifyContent: "space-around",
			alignItems: "center",
			borderRadius: 12,
			paddingHorizontal: 16,
			paddingVertical: 6,
			backgroundColor: theme.surfaceVariant,
		},
		infoItem: {},
		headerText: {
			color: theme.onSurface,
		},
		infoText: {
			color: theme.onSurfaceVariant,
		},
		image: {
			height: "80%",
			width: "80%",
			borderRadius: 2000,
		},
	});
};

export default UserOverviewScreen;
