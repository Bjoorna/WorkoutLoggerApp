import React, { cloneElement, useEffect, useReducer, useState } from "react";
import {
	View,
	TextInput,
	StyleSheet,
	FlatList,
	Pressable,
	KeyboardAvoidingView,
} from "react-native";
import { Modal, Portal } from "react-native-paper";
import FilledButton from "../../components/Buttons/FilledButton";
import BodyText from "../../components/Text/Body";
import TitleText from "../../components/Text/Title";
import Divider from "../../components/UI/Divider";
import ExerciseSummaryView from "../../components/ExerciseSummaryItem";
import NumberInput from "../../components/UI/NumberInput";

import { Themes } from "../../shared/Theme";
import Exercise from "../../models/Exercise";
import Workout from "../../models/workout";
import { useSelector } from "react-redux";
import * as firebase from "../../firebase/firebase";
import OutlineButton from "../../components/Buttons/OutlineButton";
const theme = Themes.dark;

const ExerciseArray = ["Squat", "Deadlift", "Bench-Press"];

// TODO make this separate component?
const ExerciseList = (props) => {
	const [isPressed, setIsPressed] = useState(false);
	return (
		<View style={modalStyles.exerciseListItem}>
			<Pressable
				style={modalStyles.pressable}
				onPressIn={() => setIsPressed(true)}
				onPressOut={() => setIsPressed(false)}
				// style={isPressed ? {...styles.listItemOnPress, ...modalStyles.}}
				onPress={() => props.selectExercise(props.item)}
			>
				<TitleText style={{ color: theme.onSecondary }} large={true}>
					{props.item}
				</TitleText>
			</Pressable>
		</View>
	);
};

const ADD_EXERCISE = "ADD_EXERCISE";
const ADD_WORKSET = "ADD_WORKSET";
const REMOVE_EXERCISE = "REMOVE_EXERCISE";

const workoutReducer = (state, action) => {
	switch (action.type) {
		case ADD_EXERCISE:
			let newExerciseArray = [...state.workout.exercises];
			newExerciseArray.push(action.exercise);
			let workoutWithAddedExercise = { ...state.workout };
			workoutWithAddedExercise.exercises = newExerciseArray;
			// console.log("From WorkoutReduce");
			// console.log(newWorkout);
			return { ...state, workout: workoutWithAddedExercise };
		case REMOVE_EXERCISE:
			console.log(action.exercise);
			const exerciseToRemove = action.exercise;
			let exArray = [...state.workout.exercises];
			exArray = exArray.filter(
				(exercise) => exercise !== exerciseToRemove
			);
			let workoutWithRemovedExercise = { ...state.workout };
			workoutWithRemovedExercise.exercises = exArray;
			return { ...state, workout: workoutWithRemovedExercise };

		default:
			return state;
	}
};

// TODO save users workout when page is exited before user has saved workout to server
// https://reactnavigation.org/docs/function-after-focusing-screen/

const AddWorkoutScreen = (props) => {
	// Modal stuff
	const [modalVisible, setModalVisible] = useState(false);
	const showModal = () => setModalVisible(true);
	const hideModal = () => setModalVisible(false);
	const userID = useSelector((state) => state.auth.userID);

	// WorkoutState
	const [workoutState, dispatch] = useReducer(workoutReducer, {
		workout: new Workout([], Date.now(), false, "", userID),
	});

	const selectExercise = (exercise) => {
		setSelectedExercise(exercise);
		hideModal();
	};

	const addExercise = () => {
		const newExercise = new Exercise(
			selectedExercise,
			selectedWeight,
			selectedReps,
			selectedSets,
			selectedRPE
		);
		dispatch({ type: ADD_EXERCISE, exercise: newExercise });
	};

	const removeExercise = (exerciseToRemove) => {
		dispatch({ type: REMOVE_EXERCISE, exercise: exerciseToRemove });
	};

	const saveWorkout = async () => {
		const newWorkout = new Workout(
			workoutState.workout.exercises,
			Date.now(),
			true,
			"Note Goes Here",
			userID
		);
		await firebase.writeWorkoutToCollection(newWorkout);
	};

	const [exerciseDisplay, setExerciseDisplay] = useState([]);

	useEffect(() => {
		setExerciseDisplay(workoutState.workout.exercises);
	}, [workoutState]);

	// exercise states
	const [selectedExercise, setSelectedExercise] = useState("");
	const [selectedWeight, setSelectedWeight] = useState();
	const [selectedReps, setSelectedReps] = useState();
	const [selectedSets, setSelectedSets] = useState();
	const [selectedRPE, setSelectedRPE] = useState(8);

	return (
		<KeyboardAvoidingView behavior="padding" style={styles.container}>
			{/* Modal component, ignore for layoutpurposes */}
			<Portal>
				<Modal
					contentContainerStyle={modalStyles.modalStyle}
					visible={modalVisible}
					onDismiss={hideModal}
				>
					<FlatList
						keyExtractor={(item) => Math.random()}
						data={ExerciseArray}
						renderItem={(itemData) => (
							<ExerciseList
								selectExercise={selectExercise}
								item={itemData.item}
							/>
						)}
					/>
					<FilledButton onButtonPress={hideModal}>
						Dismiss
					</FilledButton>
				</Modal>
			</Portal>

			<View style={styles.newExerciseContainer}>
				<View style={styles.selectNewExercise}>
					<Pressable
						style={{
							height: "100%",
							width: "100%",
							justifyContent: "center",
							alignItems: "center",
						}}
						onPress={showModal}
					>
						<TitleText style={{ color: theme.onSurfaceVariant }}>
							{selectedExercise === ""
								? "Press to select exercise..."
								: selectedExercise}
						</TitleText>
					</Pressable>
				</View>

				<View style={styles.newExerciseValues}>
					<View style={styles.newExerciseWeight}>
						<NumberInput
							placeholder="Weight"
							keyboardType="numeric"
							textAlign="center"
							selectionColor={theme.tertiary}
							onChangeText={(number) => setSelectedWeight(number)}
						/>
						<BodyText>Weight</BodyText>
					</View>
					<View style={styles.newExerciseWeight}>
						<NumberInput
							placeholder="Reps"
							keyboardType="numeric"
							textAlign="center"
							selectionColor={theme.tertiary}
							onChangeText={(number) => setSelectedReps(number)}
						/>
						<BodyText>Reps</BodyText>
					</View>
					<View style={styles.newExerciseWeight}>
						<NumberInput
							placeholder="Sets"
							keyboardType="numeric"
							textAlign="center"
							selectionColor={theme.tertiary}
							onChangeText={(number) => setSelectedSets(number)}
						/>
						<BodyText>Sets</BodyText>
					</View>
				</View>
				<FilledButton onButtonPress={addExercise}>
					Add Exercise
				</FilledButton>
			</View>
			<Divider width="90%" />
			<View style={styles.workoutSummary}>
				<FlatList
					style={{ width: "100%" }}
					keyExtractor={(item, index) => index}
					data={exerciseDisplay}
					extraData={exerciseDisplay}
					renderItem={(itemData) => {
						return (
							<ExerciseSummaryView
								index={itemData.index}
								exercise={itemData.item}
								removeExercise={() =>
									removeExercise(itemData.item)
								}
							/>
						);
					}}
				/>
			</View>
			<View style={styles.saveWorkoutContainer}>
				<FilledButton
					onButtonPress={() => saveWorkout()}
					style={{ width: "100%" }}
				>
					Save workout
				</FilledButton>
			</View>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// justifyContent: "center",
		alignItems: "center",
	},
	saveWorkoutContainer: {
		marginTop: 10,
		width: "90%",
		justifyContent: "center",
		alignItems: "center",
	},
	workoutSummary: {
		marginTop: 20,
		width: "90%",
		height: 300,
		backgroundColor: theme.surfaceVariant,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 12,
	},
	newExerciseContainer: {
		// justifyContent: "center",
		alignItems: "center",
		// height: 300,
		width: "95%",
		marginVertical: 10,
	},
	selectNewExercise: {
		width: "90%",
		height: 60,
		borderRadius: 16,
		backgroundColor: theme.secondaryContainer,

		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	newExerciseValues: {
		marginVertical: 10,
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-around",
		// ,backgroundColor: theme.secondary
		borderStyle: "solid",
		borderColor: theme.outline,
		borderWidth: 1,
		borderRadius: 16,
	},
	newExerciseWeight: {
		height: 120,
		width: 120,
		// backgroundColor: theme.secondaryContainer,
		alignItems: "center",
		justifyContent: "space-around",
	},
	newExerciseNumberInput: {
		backgroundColor: theme.secondaryContainer,
		width: 20,
		height: 40,
	},
});

const modalStyles = StyleSheet.create({
	modalStyle: {
		left: "5%",
		height: "60%",
		width: 400,
		maxWidth: "90%",
		backgroundColor: theme.secondary,
		// justifyContent: "center",
		alignItems: "center",
		borderRadius: 20,
	},
	exerciseListItem: {
		flexDirection: "row",
		// justifyContent: "center",
		// textAlign: "right",
		// alignItems: "center",
		width: 400,
		height: 60,
		marginVertical: 5,
		padding: 10,
		// backgroundColor: theme.secondaryContainer
	},
	pressable: {
		width: "100%",
		height: "100%",
	},
});

export default AddWorkoutScreen;
