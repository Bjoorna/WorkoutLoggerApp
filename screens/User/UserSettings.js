import React, { useEffect, useState } from "react";
import { View, StyleSheet, Switch, Alert } from "react-native";
import { useSelector } from "react-redux";
import BodyText from "../../components/Text/Body";

import * as UserActions from "../../store/actions/user";
import { Themes } from "../../shared/Theme";
import User from "../../models/User";
const theme = Themes.dark;

const UserSettingsScreen = (props) => {
	const user = useSelector((state) => state.user.user);
	const userID = useSelector((state) => state.auth.userID);

	const [isSwitchDisabled, setIsSwitchDisabled] = useState(false);
	const [useMetricValue, setUseMetricValue] = useState(false);
	const [error, setError] = useState();

	// initialize userSettingsValues
	useEffect(() => {
		setUseMetricValue(user.useMetric);
		setIsSwitchDisabled(false);
	}, [user]);

	useEffect(() => {
		const updateUserSettings = async () => {
			console.log("Hello");
			const newUserData = { ...user };
			newUserData.useMetric = useMetricValue;
			setError(null);
			try {
				await UserActions.updateUser(userID, newUserData);
			} catch (error) {
				setError(error.message);
				setIsSwitchDisabled(false);
			}
		};
		updateUserSettings();
	}, [useMetricValue]);

	useEffect(() => {
		if (error) {
			Alert.alert("Error when updating user!", error, [{ text: "Okay" }]);
		}
	}, [error]);

	const toggleUseMetric = () =>
		setUseMetricValue((previousState) => !previousState);

	return (
		<View style={styles.screen}>
			<View style={styles.userSettingsList}>
				<View style={styles.userSettingsItem}>
					<BodyText large={true} style={styles.text}>
						Use Metric
					</BodyText>
					<Switch
						onValueChange={toggleUseMetric}
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
			</View>
		</View>
	);
};

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

export default UserSettingsScreen;
