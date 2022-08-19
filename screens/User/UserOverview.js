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
import { logoutUser } from "../../redux/slices/authSlice";
import { setHideTabBar } from "../../redux/slices/appSettingsSlice";
import { differenceInYears } from "date-fns";
import {
	convertKiloToPound,
	convertMetricHeightToImperial,
} from "../../shared/utils/UtilFunctions";
import BodyText from "../../components/Text/Body";

function calculateAge(user) {
	const now = new Date();
	const bd = new Date(user.birthday.seconds * 1000);
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
	const useMetric = useSelector((state) => state.user.user.useMetric);

	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	const [userHeight, setUserHeight] = useState(user.height);
	const [userWeight, setUserWeight] = useState(user.weight);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	useEffect(() => {
		if (!useMetric) {
			setUserHeight(convertMetricHeightToImperial(user.height));
			setUserWeight(convertKiloToPound(user.weight));
		} else {
			setUserHeight(user.height);
			setUserWeight(user.weight);
		}
	}, [user, useMetric]);

	const dispatch = useDispatch();

	const onLogoutUser = () => {
		dispatch(logoutUser());
	};

	const onNavigateToSettings = () => {
		dispatch(setHideTabBar(true));
		props.navigation.navigate("UserSettings");
	};

	return (
		<SafeAreaView style={styles.safeView}>
			<TopAppBar
				headlineText={user.name}
				trailingIcons={[
					<IconButton
						name="settings-outline"
						iconColor={currentTheme.onSurfaceVariant}
						onPress={onNavigateToSettings}
					/>,
				]}
			/>
			{/* <View style={styles.userHeaderContainer}>
				<DisplayText style={styles.headerText}>{user.name}</DisplayText>
				<Image
					style={styles.image}
					resizeMode="contain"
					source={{ uri: user.profileImageURI }}
				/>
			</View> */}
			<View style={styles.currentInfoView}>
				<View style={styles.infoRowTop}>
					<View style={styles.infoItemLeft}>
						<LabelText style={styles.infoText} large={true}>
							Height
						</LabelText>
						{!useMetric && (
							<HeadlineText style={styles.infoText} large={true}>
								{userHeight ? userHeight.feet : "N/A"}'
								{userHeight ? userHeight.inches : "N/A"}''
							</HeadlineText>
						)}
						{useMetric && (
							<HeadlineText style={styles.infoText} large={true}>
								{userHeight > 0 ? userHeight : "N/A"}
								{useMetric ? "kg" : ""}
							</HeadlineText>
						)}
					</View>

					<View style={styles.infoItem}>
						<LabelText style={styles.infoText} large={true}>
							Weight
						</LabelText>
						<HeadlineText style={styles.infoText} large={true}>
							{userWeight ? userWeight : "N/A"}{" "}
							{useMetric ? "kg" : "lbs"}
						</HeadlineText>
					</View>
				</View>
				<View style={styles.infoRow}>
					<View style={styles.infoItemLeft}>
						<LabelText style={styles.infoText} large={true}>
							Age
						</LabelText>
						<HeadlineText style={styles.infoText} large={true}>
							{differenceInYears(
								new Date(),
								new Date(user.birthday)
							)}
						</HeadlineText>
					</View>
					<View style={styles.infoItem}>
						<LabelText style={styles.infoText} large={true}>
							Test
						</LabelText>
						<HeadlineText style={styles.infoText} large={true}>
							Temp
						</HeadlineText>
					</View>
				</View>
			</View>
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
			width: "100%",
			height: 200,
			flexDirection: "column",
			// justifyContent: "space-around",
			alignItems: "center",
			// borderRadius: 12,
			paddingHorizontal: 24,
			paddingVertical: 12,
			// backgroundColor: theme.surfaceVariant,
		},
		infoItem: { flex: 1, justifyContent: "center", alignItems: "center" },
		infoItemLeft: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			borderRightWidth: 1,
			borderRightColor: theme.outline,
			// paddingHorizontal: 12
			marginVertical: 12,
		},
		infoRow: {
			flex: 1,
			flexDirection: "row",
		},

		infoRowTop: {
			flex: 1,
			flexDirection: "row",
			borderBottomColor: theme.outline,
			borderBottomWidth: 1,
		},
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
