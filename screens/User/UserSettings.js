import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Switch, Alert, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import BodyText from "../../components/Text/Body";

// import * as UserActions from "../../redux/actions/user";
import { Themes } from "../../shared/Theme";
import CustomSwitch from "../../components/UI/CustomSwitch";
import LabelText from "../../components/Text/Label";

import FilledButton from "../../components/Buttons/FilledTonalButton";
import {
	setHideTabBar,
	setUseDarkMode,
} from "../../redux/slices/appSettingsSlice";
import TopAppBar from "../../components/UI/TopAppBarComponent";
import IconButton from "../../components/Buttons/IconButton";
import { getUserData, updateUserField } from "../../redux/slices/userSlice";

import { Snackbar, Menu } from "react-native-paper";
import { getExerciseTypes } from "../../redux/slices/workoutSlice";
import { logoutUser } from "../../redux/slices/authSlice";

const UserSettingsScreen = (props) => {
	const userStoreRef = useSelector((state) => state.user);
	const workoutStoreRef = useSelector((state) => state.workout);
	const userID = useSelector((state) => state.auth.userID);
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const isMondayFirstDay = useSelector(
		(state) => state.appSettings.isMondayFirstDay
	);
	const dispatch = useDispatch();

	// State for different settings
	const [user, setUser] = useState(userStoreRef.user);
	const [useMetricValue, setUseMetricValue] = useState(user.useMetric);
	const [useDarkModeValue, setUseDarkModeValue] = useState(useDarkMode);

	const [isMondayFirstDayValue, setIsMondayFirstDayValue] =
		useState(isMondayFirstDay);

	const [styles, setStyles] = useState(getStyles(Themes.light));
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	const [snackBarVisible, setSnackBarVisible] = useState(false);
	const [snackBarText, setSnackBarText] = useState("");

	const [showMenu, setShowMenu] = useState(false);

	useEffect(() => {
		return () => {
			dispatch(setHideTabBar(false));
		};
	}, []);
	useEffect(() => {
		console.log(workoutStoreRef.exerciseTypes);
	}, [workoutStoreRef]);

	// initialize userSettingsValues
	useEffect(() => {
		setUseDarkMode(user.useDarkMode);
		setUseMetricValue(user.useMetric);
	}, [user]);

	useEffect(() => {
		const storeError = userStoreRef.error;
		if (storeError != null) {
			console.log(storeError);
		}
		if (userStoreRef.user) {
			setUser(userStoreRef.user);
		}
	}, [userStoreRef]);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
		setUseDarkModeValue(useDarkMode);
	}, [useDarkMode]);

	const onToggleDarkMode = async () => {
		const newValue = !useDarkModeValue;
		dispatch(setUseDarkMode(newValue));
		try {
			const dispatchResult = await dispatch(
				updateUserField({ useDarkMode: newValue })
			).unwrap();

			setSnackBarText("User updated");
			setSnackBarVisible(true);
		} catch (error) {}
	};

	const onToggleUseMetric = async () => {
		try {
			const updateData = { useMetric: !useMetricValue };
			const dispatchResult = await dispatch(
				updateUserField(updateData)
			).unwrap();
			setSnackBarText("User updated");
			setSnackBarVisible(true);
		} catch (error) {
			console.log(error);
		}
	};

	// const onToggleMondayFirstDay = () => {
	// 	dispatch({ type: SET_MONDAY_FIRSTDAY, value: !isMondayFirstDayValue });
	// };

	const onSnackBarDismissed = () => {
		setSnackBarText("");
		setSnackBarVisible(false);
	};

	const onLogoutUser = () => {
		dispatch(logoutUser());
	};

	const onScroll = () => {};
	return (
		<View style={styles.screen}>
			<Snackbar
				style={{
					backgroundColor: currentTheme.secondaryContainer,
					borderRadius: 24,
					marginBottom: 50,
					elevation: 0,
					color: currentTheme.error,
				}}
				visible={snackBarVisible}
				onDismiss={onSnackBarDismissed}
				theme={{
					colors: {
						surface: currentTheme.onSecondaryContainer,
					},
				}}
				duration={3000}
			>
				{snackBarText}
			</Snackbar>

			<TopAppBar
				headlineText="Settings"
				navigationButton={
					<IconButton
						name="arrow-back"
						iconColor={currentTheme.onSurface}
						onPress={() => props.navigation.goBack()}
					/>
				}
			/>
			<ScrollView style={styles.userSettingsList}>
				<View style={styles.userSettingsSection}>
					<View style={styles.userSettingsHeader}>
						<LabelText
							large={true}
							style={{ color: currentTheme.primary }}
						>
							User Settings
						</LabelText>
					</View>
					<View style={styles.userSettingsItem}>
						<View style={styles.userSettingsText}>
							<BodyText
								large={true}
								style={{ color: currentTheme.onSurface }}
							>
								Use Metric
							</BodyText>
							<LabelText
								large={false}
								style={{ color: currentTheme.onSurfaceVariant }}
							>
								Display units in metric or imperial. Affects
								length and weight units
							</LabelText>
						</View>
						<CustomSwitch
							isSwitchSelected={useMetricValue}
							isSwitchDisabled={false}
							onSwitchPressed={onToggleUseMetric}
						/>
					</View>
				</View>
				<View style={styles.userSettingsSection}>
					<View style={styles.userSettingsHeader}>
						<LabelText
							large={true}
							style={{ color: currentTheme.primary }}
						>
							App Settings
						</LabelText>
					</View>
					<View style={styles.userSettingsItem}>
						<BodyText
							large={true}
							style={{ color: currentTheme.onSurface }}
						>
							Dark Mode
						</BodyText>
						<CustomSwitch
							isSwitchSelected={useDarkModeValue}
							isSwitchDisabled={false}
							onSwitchPressed={onToggleDarkMode}
						/>
					</View>
					{/* <View style={styles.userSettingsItem}>
						<View style={styles.userSettingsText}>
							<BodyText
								large={true}
								style={{ color: currentTheme.onSurface }}
							>
								Monday first day in week?
							</BodyText>
							<LabelText
								large={false}
								style={{ color: currentTheme.onSurfaceVariant }}
							>
								If toggled, monday is set as first day of the
								week, sunday if not toggled
							</LabelText>
						</View>

						<CustomSwitch
							isSwitchSelected={false}
							isSwitchDisabled={false}
							onSwitchPressed={onToggleMondayFirstDay}
						/>
					</View> */}
					<View style={styles.userSettingsItem}>
						<View style={styles.userSettingsText}>
							<BodyText
								large={true}
								style={{ color: currentTheme.onSurface }}
							>
								Dummy
							</BodyText>
						</View>

						<FilledButton
							onButtonPress={() => console.log("dummy")}
						>
							Dummy
						</FilledButton>
					</View>
					<View style={styles.userSettingsItem}>
						<View style={styles.userSettingsText}>
							<BodyText
								large={true}
								style={{ color: currentTheme.onSurface }}
							>
								Logout user
							</BodyText>
						</View>

						<FilledButton onButtonPress={onLogoutUser}>
							Logout
						</FilledButton>
					</View>
				</View>
				{/* <View style={styles.userSettingsItem}>
					<BodyText large={true} style={styles.text}>
						Use Metric
					</BodyText>
					<Switch
						onValueChange={toggleUseMetric}
						onChange={(event) => setUpdateUserFlag(event)}
						value={useMetricValue}
						disabled={isSwitchDisabled}
						trackColor={{
							false: currentTheme.onSurface,
							true: currentTheme.secondary,
						}}
						thumbColor={
							useMetricValue
								? currentTheme.primary
								: currentTheme.onSurfaceVariant
						}
						ios_backgroundColor={currentTheme.primary}
					/>
				</View>
				<View style={styles.userSettingsItem}>
					<BodyText large={true} style={styles.text}>
						Use DarkMode
					</BodyText>
					<Switch
						onValueChange={(value) => toggleUseDarkMode(value)}
						// onChange={(event) => setUpdateUserFlag(event)}
						value={useDarkModeValue}
						disabled={isSwitchDisabled}
						trackColor={{
							false: currentTheme.onSurface,
							true: currentTheme.secondary,
						}}
						thumbColor={
							useMetricValue
								? currentTheme.primary
								: currentTheme.onSurfaceVariant
						}
						ios_backgroundColor={currentTheme.primary}
					/>
				</View> */}
			</ScrollView>
		</View>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		screen: {
			flex: 1,
			backgroundColor: theme.surface,
			// justifyContent: "center",
			alignItems: "center",
		},
		text: {
			color: theme.onSurface,
		},
		userSettingsList: {
			width: "100%",
			flex: 1,
			paddingHorizontal: 24,
			marginTop: 10,
		},
		userSettingsItem: {
			width: "100%",
			height: 80,
			paddingVertical: 5,
			// paddingHorizontal: 20,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			// backgroundColor: theme.error
		},
		userSettingsSection: {
			marginBottom: 16,
		},
		userSettingsText: {
			flexDirection: "column",
			justifyContent: "space-around",
			maxWidth: "60%",
		},
	});
};

export default UserSettingsScreen;
