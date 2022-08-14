import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import BodyText from "../Text/Body";

import DateTimePicker from "@react-native-community/datetimepicker";
import IconButton from "../Buttons/IconButton";

const DateSelector = ({
	currentTheme,
	useDarkMode,
	selectedDate,
	onDateChange,
    text
}) => {
	const [styles, setStyles] = useState(getStyles(currentTheme));
	const [datePickerModalVisible, setDatePickerModalVisible] = useState(false);

	const onToggleDatePicker = () => {
		setDatePickerModalVisible((state) => !state);
	};

	const onSetDateChange = (event, newDate) => {
		onToggleDatePicker();
		const currentDate = newDate || selectedDate;
		onDateChange(currentDate);
	};
	return (
		<View style={styles.datePickerContainer}>
			<Pressable style={styles.datePickerPressable} onPress={onToggleDatePicker}>
				<BodyText
					large={true}
					style={{ color: currentTheme.onSurface }}
				>
					{text}: {selectedDate.toDateString()}
				</BodyText>
				<IconButton
					style={{ marginLeft: "auto" }}
					name="caret-down"
					onPress={onToggleDatePicker}
				/>
			</Pressable>
			{datePickerModalVisible && (
				<DateTimePicker
					mode="date"
					is24Hour={true}
					display="default"
					onChange={onSetDateChange}
					testID="datePicker"
					value={selectedDate}
				/>
			)}
		</View>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		datePickerContainer: {
			width: "100%",
			// width: 300,
			height: 56,
			justifyContent: "center",
			alignItems: "center",
			justifyContent: "center",
		},
		datePickerPressable: {
			// flex: 1,
			width: "100%",
			height: "100%",
			// width: 400,
			flexDirection: "row",
			alignItems: "center",
			paddingHorizontal: 16,
			borderRadius: 4,
			borderWidth: 1,
			borderColor: theme.outline,
		},
	});
};
export default DateSelector;
