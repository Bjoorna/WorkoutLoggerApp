import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View, ActivityIndicator } from "react-native";
import BodyText from "./Text/Body";
import { Themes } from "../shared/Theme";
import * as firebase from "../firebase/firebase";
import Exercise from "../models/Exercise";
import LabelText from "./Text/Label";
import { FlatList } from "react-native-gesture-handler";
const theme = Themes.dark;

const ExerciseItem = (props) => {
	const exercise = props.exercise;
	return (
		<View style={exerciseStyles.exerciseItem}>
			
			<View style={exerciseStyles.exerciseValues}>
			<BodyText style={{ color: theme.onSecondaryContainer }}>
				{exercise.exercise}
			</BodyText>
				<LabelText style={{ color: theme.onSecondaryContainer }}>
					{exercise.weight} kg
				</LabelText>
				<LabelText style={{ color: theme.onSecondaryContainer }}>
					{exercise.reps} reps
				</LabelText>
				<LabelText style={{ color: theme.onSecondaryContainer }}>
					{exercise.sets} sets
				</LabelText>
				<LabelText style={{ color: theme.onSecondaryContainer }}>
					{exercise.rpe} RPE
				</LabelText>
			</View>
		</View>
	);
};

const exerciseStyles = StyleSheet.create({
	exerciseItem: {
		width: 100,
		height: 100,
		borderRadius: 5,
		padding: 5,
		backgroundColor: theme.secondaryContainer,
		marginHorizontal: 3,
	},
	exerciseValues: {
		alignItems: "center",
		paddingHorizontal: 4
	}
});

const WorkoutListItem = (props) => {
	const [exercises, setExercises] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const date = new Date(props.workout.date.seconds * 1000);

	const getExercises = async () => {
		setIsLoading(true);
		const test = await firebase.getExercisesInWorkout(
			props.workout.exercises,
			props.userID
		);

		setIsLoading(false);
		return test;
	};

	useEffect(() => {
		const fetchExercises = async () => {
			const exercisesQuery = await getExercises();
			const exercisesArray = [];
			exercisesQuery.forEach((query) => {
				const data = query.data();
				console.log(query.id);
				const newExercise = new Exercise(
					data.exercise,
					data.weight,
					data.reps,
					data.sets,
					data.rpe,
					data.date,
					data.owner,
					query.id
				);
				exercisesArray.push(newExercise);
			});
			console.log("From WOlistitem");
			setExercises(exercisesArray);
		};

		fetchExercises();
	}, [props.workout]);

	return (
		<View style={styles.workoutItemContainer}>
			<Pressable
				style={styles.pressableView}
				onPress={() => {
					if (exercises.length > 0) {
						console.log(exercises);
					}
				}}
			>
				<View style={styles.workoutItemLayout}>
					<View style={styles.workoutItemHeader}>
						<LabelText style={{ color: theme.secondary }}>
							{date.toDateString()}
							{/* {date.toISOString()} */}
						</LabelText>
					</View>
					<View style={styles.workoutItemExerciseContainer}>
						{isLoading && (
							<View>
								<ActivityIndicator
									size="small"
									color={theme.primary}
								/>
							</View>
						)}
						{!isLoading && (
							<FlatList
								keyExtractor={(item) => item.id}
								horizontal={true}
								data={exercises}
								renderItem={(itemData) => (
									<ExerciseItem exercise={itemData.item} />
								)}
							/>
						)}
					</View>
				</View>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	workoutItemContainer: {
		width: "100%",
		minHeight: 130,
		borderRadius: 12,
		overflow: "hidden",
		borderColor: theme.outline,
		borderStyle: "solid",
		borderWidth: 1,
		marginVertical: 5,
	},
	pressableView: {
		flex: 1,
		// width: "100%",
		// minHeight: 100,
		// height: "100%"
	},
	workoutItemLayout: {
		flex: 1,
		paddingHorizontal: 10,
	},
	workoutItemHeader: {
		width: "100%",
		height: 20,
		alignItems: "flex-end",
	},
	workoutItemExerciseContainer: {},
});

export default WorkoutListItem;
