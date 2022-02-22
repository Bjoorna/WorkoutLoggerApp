import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import TitleText from "./Text/Title";
import LabelText from "./Text/Label";
import TextButton from "./Buttons/TextButton";
import FilledButton from "./Buttons/FilledButton";
import { Themes } from "../shared/Theme";

const ExerciseSummaryView = (props) => {

	const [currentTheme, setCurrentTheme] = useState(props.currentTheme);

	useEffect(() => {
		setCurrentTheme(props.currentTheme);
	}, [props]);
	return (
		<View style={styles.exerciseSummaryView}>
			<TitleText style={{ color: currentTheme.onSurfaceVariant }} large={true}>
				{props.exercise.exercise}
			</TitleText>
			<LabelText style={{ color: currentTheme.onSurfaceVariant }} large={true}>
				{props.exercise.weight}kg {props.exercise.reps}x
				{props.exercise.sets} @{props.exercise.rpe}
			</LabelText>
			<TextButton
				textStyle={{ color: currentTheme.error }}
				onButtonPress={props.removeExercise}
			>
				Delete
			</TextButton>
		</View>
	);
};

const styles = StyleSheet.create({
	exerciseSummaryView: {
		width: "100%",
		height: 50,
		padding: 10,
		marginVertical: 5,
		borderRadius: 12,
		flexDirection: "row",
		justifyContent: "space-around",
		// borderStyle: "solid",
		// borderWidth : 1,
		// borderColor: "red",
		alignItems: "baseline",
	},
	
});

export default ExerciseSummaryView;
