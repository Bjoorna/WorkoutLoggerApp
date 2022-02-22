import React, { useEffect, useState } from "react";
import { View, StyleSheet, Switch, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import BodyText from "../../components/Text/Body";

import * as UserActions from "../../store/actions/user";
import { Themes } from "../../shared/Theme";
import User from "../../models/User";
import { SET_USE_DARKMODE } from "../../store/actions/appsettings";
const theme = Themes.dark;

const UserSettingsScreen = (props) => {
	const user = useSelector((state) => state.user.user);
	const userID = useSelector((state) => state.auth.userID);
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const dispatch = useDispatch();

	const [isSwitchDisabled, setIsSwitchDisabled] = useState(false);
	const [useMetricValue, setUseMetricValue] = useState(false);
	const [useDarkModeValue, setUseDarkModeValue] = useState(false);
	const [updateUser, setUpdateUser] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [error, setError] = useState();


	const [styles, setStyles] = useState(getStyles(Themes.light));

	// useEffect(() => {
	// 	setStyles(getStyles(useDarkMode ? Themes.dark: Themes.light));
	// 	console.log(getStyles(Themes.dark));
	// })
	// initialize userSettingsValues
	useEffect(() => {
		setUseMetricValue(user.useMetric);
		setIsSwitchDisabled(false);
	}, [user]);

	useEffect(() => {
		console.log("USEdarkmode: ");
		console.log(useDarkMode);
		setUseDarkModeValue(useDarkMode);
		if(useDarkMode){
			setStyles(getStyles(Themes.dark));
		}else{
			setStyles(getStyles(Themes.light));
		}
	}, [useDarkMode]);

	useEffect(() => {
		if (!isUpdating) {
			return;
		}
		const updateUserSettings = async () => {
			const newUserData = { ...user };
			newUserData.useMetric = useMetricValue;
			setError(null);
			setIsSwitchDisabled(true);
			try {
				console.log("UseEffect in userSettings");
				await dispatch(UserActions.updateUser(userID, newUserData));
				setIsUpdating(false);
			} catch (error) {
				setError(error.message);
				setIsSwitchDisabled(false);
				setIsUpdating(false);
			}
		};
		updateUserSettings();
	}, [isUpdating]);

	const setUpdateUserFlag = (event) => {
		console.log("ONCHANGE");
		setIsUpdating(true);
	};

	useEffect(() => {
		if (error) {
			Alert.alert("Error when updating user!", error, [{ text: "Okay" }]);
		}
	}, [error]);

	const toggleUseMetric = () =>
		setUseMetricValue((previousState) => !previousState);

	const toggleUseDarkMode = (value) => {
		console.log(value);
		dispatch({type: SET_USE_DARKMODE, value: value});
		// setUseDarkModeValue(state => !state);
	}

	return (
		<View style={styles.screen}>
			<View style={styles.userSettingsList}>
				<View style={styles.userSettingsItem}>
					<BodyText large={true} style={styles.text}>
						Use Metric
					</BodyText>
					<Switch
						onValueChange={toggleUseMetric}
						onChange={(event) => setUpdateUserFlag(event)}
						value={useMetricValue}
						disabled={isSwitchDisabled}
						trackColor={{
							false: theme.onSurface,
							true: theme.secondary,
						}}
						thumbColor={
							useMetricValue
								? theme.primary
								: theme.onSurfaceVariant
						}
						ios_backgroundColor={theme.primary}
					/>
				</View>
				<View style={styles.userSettingsItem}>
					<BodyText large={true} style={styles.text}>
						Use DarkMode
					</BodyText>
					<Switch
						onValueChange={value => toggleUseDarkMode(value)}
						// onChange={(event) => setUpdateUserFlag(event)}
						value={useDarkModeValue}
						disabled={isSwitchDisabled}
						trackColor={{
							false: theme.onSurface,
							true: theme.secondary,
						}}
						thumbColor={
							useMetricValue
								? theme.primary
								: theme.onSurfaceVariant
						}
						ios_backgroundColor={theme.primary}
					/>
				</View>

			</View>
		</View>
	);
};

const getStyles = theme => {
	const styles = StyleSheet.create({
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
			marginTop: 10,
		},
		userSettingsItem: {
			width: "100%",
			height: 60,
			paddingVertical: 5,
			paddingHorizontal: 20,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		},
	});
	return styles;
}
// const styles = StyleSheet.create({
// 	screen: {
// 		flex: 1,
// 		backgroundColor: theme.surface,
// 		// justifyContent: "center",
// 		alignItems: "center",
// 	},
// 	text: {
// 		color: theme.onSurface,
// 	},
// 	userSettingsList: {
// 		width: "100%",
// 		marginTop: 10,
// 	},
// 	userSettingsItem: {
// 		width: "100%",
// 		height: 60,
// 		paddingVertical: 5,
// 		paddingHorizontal: 20,
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "space-between",
// 	},
// });

export default UserSettingsScreen;
