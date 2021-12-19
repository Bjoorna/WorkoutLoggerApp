import React, { cloneElement, useEffect, useState } from "react";
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

import { Themes } from "../../shared/Theme";
import Exercise from "../../models/Exercise";
import Workout from "../../models/workout";
import { useSelector } from "react-redux";
import * as firebase from '../../firebase/firebase';
const theme = Themes.dark;

const ExerciseArray = ["Squat", "Deadlift", "Bench-Press"];

const TestInput = (props) => {
	return <TextInput {...props} style={{ ...styles.input, ...props.style }} />;
};

const ExerciseList = (props) => {
	// console.log(props.item);
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

const AddWorkoutScreen = (props) => {
	const [modalVisible, setModalVisible] = useState(false);
	const showModal = () => setModalVisible(true);
	const hideModal = () => setModalVisible(false);

	const userID = useSelector(state => state.auth.userID);

	const selectExercise = (exercise) => {
		console.log("SELECETEXERCISE IS: " + exercise);
		setSelectedExercise(exercise);
		hideModal();
	};

	const clearSelectedExercise = () => {
		setSelectedExercise("");
	};

	const [exercises, setExercises] = useState([]);
	const [exerciseArrayUpdated, setExerciseArrayUpdated] = useState(false);

	const addExercise = () => {
		const newExercise = new Exercise(
			selectedExercise,
			selectedWeight,
			selectedReps,
			selectedSets
		);
		let exerciseArray = [...exercises];
		exerciseArray.push(newExercise);
		setExercises(exerciseArray);
		console.log(exercises);
		setExerciseArrayUpdated(!exerciseArrayUpdated);
	};

	const [testArray, addToTestArray] = useState(["Hello1"]);

	const updateTestArray = () => {
		let newArray = [...testArray];
		newArray.push("Hello");
		addToTestArray(newArray);
	};

	const removeExercise = (index) => {
		let oldArray = exercises;
		oldArray.splice(index, 1);
		console.log(oldArray);
		const newArray = [...oldArray];
		setExercises(newArray);
	};

	const saveWorkout = async() => {

		const newWorkout = new Workout(exercises, Date.now(), true, "This is a workout", userID);
		console.log(newWorkout);
		await firebase.writeWorkoutToCollection(newWorkout);
	}
 
	// const [exerciseIsSelected, toggleExerciseIsSelected] = useState(false);
	// exercise states
	const [selectedExercise, setSelectedExercise] = useState("");
	const [selectedWeight, setSelectedWeight] = useState();
	const [selectedReps, setSelectedReps] = useState();
	const [selectedSets, setSelectedSets] = useState();
	const [selectedRPE, setSelectedRPE] = useState();

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
						<TestInput
							placeholder="Weight"
							keyboardType="numeric"
							textAlign="center"
							selectionColor={theme.tertiary}
							onChangeText={(number) => setSelectedWeight(number)}
						/>
						<BodyText>Weight</BodyText>
					</View>
					<View style={styles.newExerciseWeight}>
						<TestInput
							placeholder="Reps"
							keyboardType="numeric"
							textAlign="center"
							selectionColor={theme.tertiary}
							onChangeText={(number) => setSelectedReps(number)}
						/>
						<BodyText>Reps</BodyText>
					</View>
					<View style={styles.newExerciseWeight}>
						<TestInput
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
					data={exercises}
					extraData={exercises}
					renderItem={(itemData) => {
						return (
							<ExerciseSummaryView
								index={itemData.index}
								exercise={itemData.item}
								removeExercise={() => removeExercise(itemData.index)}
							/>
						);
					}}
				/>
			</View>
			<View style={styles.saveWorkoutContainer}>
				<FilledButton onButtonPress={() => saveWorkout()} style={{width: "100%"}}>Save workout</FilledButton>
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
	input: {
		height: 80,
		backgroundColor: theme.onSecondaryContainer,
		borderRadius: 20,
		width: "90%",
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
