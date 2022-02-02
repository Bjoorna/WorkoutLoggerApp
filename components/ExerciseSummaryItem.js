import React from "react";
import { StyleSheet, View } from "react-native";
import TitleText from "./Text/Title";
import LabelText from "./Text/Label";
import TextButton from "./Buttons/TextButton";
import FilledButton from "./Buttons/FilledButton";
import { Themes } from "../shared/Theme";
const theme = Themes.dark;

const ExerciseSummaryView = (props) => {
	return (
		<View style={styles.exerciseSummaryView}>
			<TitleText style={{...styles.text, }} large={true}>
				{props.exercise.exercise}
			</TitleText>
			<LabelText style={styles.text} large={true}>
				{props.exercise.weight}kg {props.exercise.reps}x
				{props.exercise.sets} @{props.exercise.rpe}
			</LabelText>
			<TextButton
				textStyle={{ color: theme.onTertiaryContainer }}
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
	text: {
		color: theme.onSurfaceVariant,
	},
});

export default ExerciseSummaryView;
