import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Switch, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import BodyText from "../../components/Text/Body";

import * as UserActions from "../../store/actions/user";
import { Themes } from "../../shared/Theme";
import User from "../../models/User";
import {
	SET_MONDAY_FIRSTDAY,
	SET_USE_DARKMODE,
} from "../../store/actions/appsettings";
import CustomSwitch from "../../components/UI/CustomSwitch";
import LabelText from "../../components/Text/Label";

import {
	createCalendar,
	getCalendarFromStorage,
	saveCalendar,
} from "../../shared/utils/UtilFunctions";
import FilledButton from "../../components/Buttons/FilledTonalButton";
import { setUseDarkMode } from "../../store/slices/appSettingsSlice";
import TopAppBar from "../../components/UI/TopAppBarComponent";
import IconButton from "../../components/Buttons/IconButton";
const UserSettingsScreen = (props) => {
	const user = useSelector((state) => state.user.user);
	const userID = useSelector((state) => state.auth.userID);
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const isMondayFirstDay = useSelector(
		(state) => state.appSettings.isMondayFirstDay
	);
	const dispatch = useDispatch();

	// State for different settings
	const [useMetricValue, setUseMetricValue] = useState(user.useMetric);
	const [useDarkModeValue, setUseDarkModeValue] = useState(useDarkMode);

	const [isMondayFirstDayValue, setIsMondayFirstDayValue] =
		useState(isMondayFirstDay);

	const [isSwitchDisabled, setIsSwitchDisabled] = useState(false);
	const [updateUser, setUpdateUser] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [error, setError] = useState();

	const [calendar, setCalendar] = useState(null);

	const [styles, setStyles] = useState(getStyles(Themes.light));
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	// initialize userSettingsValues
	useEffect(() => {
		setUseMetricValue(user.useMetric);
		setIsSwitchDisabled(false);
	}, [user]);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
		setUseDarkModeValue(useDarkMode);
	}, [useDarkMode]);

	useEffect(() => {
		console.log("Calendar set");
	}, [calendar]);

	useEffect(() => {
		console.log("USER: ");
		console.log(user);
		setUseMetricValue(user.useMetric);
	}, [user]);

	useEffect(() => {
		if (error) {
			Alert.alert("Error when updating user!", error, [{ text: "Okay" }]);
		}
	}, [error]);

	const onToggleDarkMode = () => {
		console.log("ontoggledarkmode");
		dispatch(setUseDarkMode(!useDarkModeValue));
	};

	const onToggleUseMetric = () => {
		console.log("ontoggleuseMetric");

		try {
			const newField = { useMetric: !useMetricValue };
			dispatch(UserActions.updateUserField(userID, newField));
		} catch (error) {
			setError(error.message);
		}
	};

	const onToggleMondayFirstDay = () => {
		dispatch({ type: SET_MONDAY_FIRSTDAY, value: !isMondayFirstDayValue });
	};

	const onCreateCalendar = () => {
		const newCalendar = createCalendar([2022]);
		setCalendar(newCalendar);
	};

	const onSaveCalendar = async () => {
		if (calendar) {
			try {
				await saveCalendar(calendar);
			} catch (error) {
				console.log(error);
			} finally {
				console.log("Saved calendar");
			}
		}
	};

	const onGetCalendar = async () => {
		try {
			const calendar = await getCalendarFromStorage();
			if (calendar) {
				console.log("Calendar gotten from storage");
				for (let t of calendar.keys()) {
					console.log(t);
				}
			}
		} catch (error) {}
	};

	return (
		<View style={styles.screen}>
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
			<View style={styles.userSettingsList}>
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
								units like weight and height.
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
							isSwitchSelected={useDarkMode}
							isSwitchDisabled={false}
							onSwitchPressed={onToggleDarkMode}
						/>
					</View>
					<View style={styles.userSettingsItem}>
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
					</View>
					<View style={styles.userSettingsItem}>
						<BodyText
							large={true}
							style={{ color: currentTheme.onSurface }}
						>
							Test Switch
						</BodyText>
						<CustomSwitch
							isSwitchSelected={false}
							isSwitchDisabled={false}
							onSwitchPressed={() => {
								console.log("TestSwitch");
							}}
						/>
					</View>
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
			</View>
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
