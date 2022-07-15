import React, { useState, useReducer } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { TextInput as PaperInput, HelperText } from "react-native-paper";
import IconButton from "../Buttons/IconButton";
import OutlineButton from "../Buttons/OutlineButton";
import TextButton from "../Buttons/TextButton";
import TitleText from "../Text/Title";

const ADD_VALUE = "ADD_VALUE";
const exerciseReducer = (state, action) => {
	switch (action.type) {
		case ADD_VALUE:
			const newState = { ...state };
			newState.exercise[action.field] = action.newValue;
			return newState;
	}
};

const AddWorkoutDialog = ({
	onAddWorkout,
	size,
	height,
	currentTheme,
	closeDialog,
}) => {
	const [styles, setStyles] = useState(getStyles(currentTheme));

	// const onValueEntered = (ref, type) => {
	// 	const value = ref.current.value();

	// 	// replace comma with dot
	// 	const sanitizedValue = Number(value.replace(/,/g, "."));
	// 	// console.log(sanitizedValue);

	// 	// check if value is valid
	// 	const isValid = inputValueValidityCheck(type, sanitizedValue);
	// 	if (isValid) {
	// 		dispatchExercise({
	// 			type: ADD_VALUE,
	// 			field: type,
	// 			newValue: { value: sanitizedValue, error: false },
	// 		});
	// 	} else {
	// 		dispatchExercise({
	// 			type: ADD_VALUE,
	// 			field: type,
	// 			newValue: { value: sanitizedValue, error: true },
	// 		});
	// 	}
	// };

	// const inputValueValidityCheck = (type, value) => {
	// 	if (type === "rpe") {
	// 		if (value >= 6.5 && value <= 10) {
	// 			return true;
	// 		} else {
	// 			return false;
	// 		}
	// 	} else {
	// 		if (value > 0 && value != null) {
	// 			return true;
	// 		}
	// 		return false;
	// 	}
	// };

	return (
		<View style={styles.modalContainer}>
			<View style={styles.header}>
				<IconButton
					name="close"
					onPress={closeDialog}
					iconColor={currentTheme.onSurface}
				/>
				<TitleText
					large={true}
					style={{ color: currentTheme.onSurface }}
				>
					New exercise
				</TitleText>
				<OutlineButton style={{marginLeft: "auto"}} onButtonPress={()=> console.log("save exercise") }>Add</OutlineButton>
			</View>
			<View style={styles.inputView}>
				{/* <View style={styles.inputViewHeader}></View> */}
			</View>
		</View>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		modalContainer: {
			flex: 1,
			// minWidth: 280,
			// maxWidth: 560,
			borderRadius: 28,
			borderBottomLeftRadius: 0,
			borderBottomRightRadius: 0,
			backgroundColor: theme.surfaceE3,
			// height: "100%",

			// marginTop: 100,
		},
		header: {
			height: 64,
			flexDirection: "row",
			alignItems: "center",
			paddingHorizontal: 24,
		},
		inputView: {
			flexDirection: "column",
			paddingHorizontal: 24,
		},
	});
};

export default AddWorkoutDialog;
