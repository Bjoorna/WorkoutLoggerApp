import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import BodyText from "./Text/Body";
import { Themes } from "../shared/Theme";
import * as firebase from "../firebase/firebase";
import Exercise from "../models/Exercise";
const theme = Themes.dark;

const WorkoutListItem = (props) => {
	const [exercises, setExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

	const getExercises = async () => {
		const test = await firebase.getExercisesInWorkout(
			props.workout.exercises,
			props.userID
		);
		return test;
	};

	useEffect(() => {
		const fetchExercises = async () => {
			const exercisesQuery = await getExercises();
			const exercisesArray = [];
			exercisesQuery.forEach((query) => {
				const data = query.data();
				const newExercise = new Exercise(
					data.exercise,
					data.weight,
					data.reps,
					data.sets,
					data.rpe,
					data.date,
					data.owner
				);
				exercisesArray.push(newExercise);
			});
			console.log("From WOlistitem");
			console.log(exercisesArray);
			setExercises(exercisesQuery);
		};

		fetchExercises();
	}, [props.workout]);
	return (
		<View style={styles.workoutItemContainer}>
			<Pressable>
				<BodyText style={{ color: theme.primary }}>
					{props.workout.id}
				</BodyText>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
    workoutItemContainer: {
        width: "100%",
        minHeight: 100,
        borderRadius: 12,
        overflow: "hidden",
        borderColor: theme.outline,
        borderStyle: "solid",
        borderWidth: 1
    }
});

export default WorkoutListItem;
