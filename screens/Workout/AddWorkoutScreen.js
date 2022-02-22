import React, { cloneElement, useEffect, useReducer, useState } from "react";
import {
	View,
	StyleSheet,
	FlatList,
	Pressable,
	Vibration,
	Keyboard,
	ActivityIndicator,
	SectionList,
} from "react-native";
import { Modal, Portal } from "react-native-paper";
import FilledButton from "../../components/Buttons/FilledButton";
import BodyText from "../../components/Text/Body";
import TitleText from "../../components/Text/Title";
import Divider from "../../components/UI/Divider";
import ExerciseSummaryView from "../../components/ExerciseSummaryItem";
import NumberInput from "../../components/UI/NumberInput";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Themes } from "../../shared/Theme";
import Exercise from "../../models/Exercise";
import Workout from "../../models/workout";
import { useSelector } from "react-redux";
import * as firebase from "../../firebase/firebase";
import OutlineButton from "../../components/Buttons/OutlineButton";
import { ExerciseTypes } from "../../shared/utils/ExerciseTypes";
import LabelText from "../../components/Text/Label";
// const theme = Themes.dark;

const ExerciseArray = ["Squat", "Deadlift", "Bench-Press"];

// const TestItem = Type => (
// 	<View></View>
// )

// TODO make this separate component?
const ExerciseList = (props) => {
	const [isPressed, setIsPressed] = useState(false);

	// const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [modalStyles, setModalStyles] = useState(
		props.modalStyle
	);
	const [currentTheme, setCurrentTheme] = useState(
		props.currentTheme
	);

	useEffect(() => {
		setModalStyles(props.modalStyle);
		setCurrentTheme(props.currentTheme);
	}, [props]);

	return (
		<View style={modalStyles.exerciseListItem}>
			<Pressable
				style={modalStyles.pressable}
				onPressIn={() => setIsPressed(true)}
				onPressOut={() => setIsPressed(false)}
				// style={isPressed ? {...styles.listItemOnPress, ...modalStyles.}}
				onPress={() => props.selectExercise(props.item)}
			>
				<TitleText
					style={{ color: currentTheme.onSurfaceVariant }}
					large={true}
				>
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
			return { ...state, workout: workoutWithAddedExercise };
		case REMOVE_EXERCISE:
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

	// datePickerModal
	const [datePickerModalVisible, setDatePickerModalVisible] = useState(false);
	const [hasSetCustomDate, setHasSetCustomDate] = useState(false);

	// WorkoutState
	const [workoutState, dispatch] = useReducer(workoutReducer, {
		workout: new Workout([], Date.now(), false, "", userID),
	});
	const [selectedDate, setSelectedDate] = useState(new Date());

	// Themes
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [modalStyles, setModalStyles] = useState(
		getModalStyles(useDarkMode ? Themes.dark : Themes.light)
	);

	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setModalStyles(getModalStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	const [isLoading, setIsLoading] = useState(false);

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
		vibrateDevice();
	};

	const removeExercise = (exerciseToRemove) => {
		dispatch({ type: REMOVE_EXERCISE, exercise: exerciseToRemove });
	};

	const saveWorkout = async () => {
		setIsLoading(true);
		let workoutDate;
		if (hasSetCustomDate) {
			workoutDate = selectedDate.getTime();
		} else {
			workoutDate = Date.now();
		}
		const newWorkout = new Workout(
			workoutState.workout.exercises,
			workoutDate,
			true,
			"Note Goes Here",
			userID
		);

		await firebase.writeWorkoutToCollection(newWorkout);
		setIsLoading(false);
		props.navigation.navigate("Workouts");
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
	const [selectedRPE, setSelectedRPE] = useState();

	const vibrateDevice = () => {
		Vibration.vibrate(50);
	};

	// for datepicker
	const onChange = (event, newDate) => {
		setDatePickerModalVisible(false);
		setHasSetCustomDate(true);
		const currentDate = newDate || selectedDate;
		setSelectedDate(currentDate);
	};

	return (
		<View style={styles.container}>
			<Pressable
				style={styles.pressable}
				onPress={() => Keyboard.dismiss()}
			>
				{/* Modal component, ignore for layoutpurposes */}
				<Portal>
					<Modal
						contentContainerStyle={modalStyles.modalStyle}
						visible={modalVisible}
						onDismiss={hideModal}
					>
						<SectionList
							keyExtractor={(item, index) => item + index}
							sections={ExerciseTypes}
							renderItem={({ item }) => (
								<ExerciseList
									item={item}
									selectExercise={selectExercise}
									modalStyle={modalStyles}
									currentTheme={currentTheme}
								/>
							)}
							renderSectionHeader={({ section: { title } }) => (
								<LabelText
									large={true}
									style={{ color: currentTheme.tertiary }}
								>
									{title}
								</LabelText>
							)}
						/>
						{/* <FlatList
							keyExtractor={(item) => Math.random()}
							data={ExerciseArray}
							renderItem={(itemData) => (
								<ExerciseList
									selectExercise={selectExercise}
									item={itemData.item}
								/>
							)}
						/> */}
						<FilledButton
							style={{ marginTop: 15 }}
							onButtonPress={hideModal}
						>
							Dismiss
						</FilledButton>
					</Modal>
				</Portal>
				<View style={styles.contentView}>
					{isLoading && (
						<View style={styles.loadingSpinner}>
							<ActivityIndicator
								size="large"
								color={currentTheme.primary}
							/>
						</View>
					)}
					{!isLoading && (
						<View style={styles.newExerciseContainer}>
							<View style={styles.selectNewExercise}>
								<Pressable
									style={{
										height: "100%",
										width: "90%",
										justifyContent: "center",
										alignItems: "center",
									}}
									onPress={showModal}
								>
									<TitleText
										style={{
											color: currentTheme.onSurfaceVariant,
										}}
									>
										{selectedExercise === ""
											? "Press to select exercise..."
											: selectedExercise}
									</TitleText>
								</Pressable>
							</View>

							<View style={styles.newExerciseValues}>
								<View style={styles.newExerciseValuesRow}>
									<View style={styles.newExerciseInputValues}>
										<NumberInput
											style={{ height: 50 }}
											placeholder="Weight"
											keyboardType="numeric"
											textAlign="center"
											selectionColor={currentTheme.tertiary}
											onChangeText={(number) =>
												setSelectedWeight(number)
											}
										/>
										<BodyText style={{color: currentTheme.onSurface}}>Weight</BodyText>
									</View>
									<View style={styles.newExerciseInputValues}>
										<NumberInput
											style={{ height: 50 }}
											placeholder="Reps"
											keyboardType="numeric"
											textAlign="center"
											selectionColor={currentTheme.tertiary}
											onChangeText={(number) =>
												setSelectedReps(number)
											}
										/>
										<BodyText style={{color: currentTheme.onSurface}}>Reps</BodyText>
									</View>
								</View>
								<View style={styles.newExerciseValuesRow}>
									<View style={styles.newExerciseInputValues}>
										<NumberInput
											style={{ height: 50 }}
											placeholder="Sets"
											keyboardType="numeric"
											textAlign="center"
											selectionColor={currentTheme.tertiary}
											onChangeText={(number) =>
												setSelectedSets(number)
											}
										/>
										<BodyText style={{color: currentTheme.onSurface}}>Sets</BodyText>
									</View>
									<View style={styles.newExerciseInputValues}>
										<NumberInput
											style={{ height: 50 }}
											placeholder="RPE"
											keyboardType="numeric"
											textAlign="center"
											selectionColor={currentTheme.tertiary}
											onChangeText={(number) =>
												setSelectedRPE(number)
											}
										/>
										<BodyText style={{color: currentTheme.onSurface}}>RPE</BodyText>
									</View>
								</View>
							</View>
							<View
								style={{
									flexDirection: "row",
									width: "100%",
									justifyContent: "space-around",
								}}
							>
								<FilledButton onButtonPress={addExercise}>
									Add Exercise
								</FilledButton>
								<OutlineButton
									onButtonPress={() =>
										setDatePickerModalVisible(true)
									}
								>
									Set Date
								</OutlineButton>
							</View>
						</View>
					)}

					{datePickerModalVisible && (
						<DateTimePicker
							testID="datepicker"
							value={selectedDate}
							mode={"date"}
							is24Hour={true}
							display={"default"}
							onChange={onChange}
						/>
					)}
					{!isLoading && (
						<View style={styles.workoutSummary}>
							<View style={styles.workoutSummaryInfo}>
								<BodyText style={{color: currentTheme.onSurfaceVariant}} large={true}>
									Workout Summary
								</BodyText>
								<BodyText
									large={true}

									style={{ marginLeft: 20, color: currentTheme.onSurfaceVariant }}
								>
									Date: {selectedDate.toDateString()}
								</BodyText>
							</View>
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
					)}
					{!isLoading && (
						<View style={styles.saveWorkoutContainer}>
							<FilledButton
								disabled={exerciseDisplay.length < 1}
								onButtonPress={() => saveWorkout()}
								style={{ width: "100%" }}
							>
								Save workout
							</FilledButton>
						</View>
					)}
				</View>
			</Pressable>
		</View>
	);
};

const getStyles = theme => {
	return StyleSheet.create({
		container: {
			flex: 1,
			// justifyContent: "center",
			alignItems: "center",
		},
		pressable: { flex: 1 },
		contentView: { flex: 1, alignItems: "center" },
		saveWorkoutContainer: {
			marginTop: 10,
			width: "90%",
			justifyContent: "center",
			alignItems: "center",
		},
		workoutSummary: {
			marginTop: 10,
			width: "90%",
			maxHeight: 300,
			backgroundColor: theme.surfaceVariant,
			// justifyContent: "center",
			alignItems: "center",
			borderRadius: 12,
		},
		workoutSummaryInfo: {
			flexDirection: "row",
			height: 40,
			padding: 10,
			width: "100%",
			borderRadius: 12,
			alignItems: "baseline",
			// borderStyle: "solid",
			// borderBottomWidth: 1,
			// borderBottomColor: theme.outline
		},
		newExerciseContainer: {
			// justifyContent: "center",
			alignItems: "center",
			// height: 300,
			width: "95%",
			marginVertical: 10,
		},
		selectNewExercise: {
			// width: "90%",
			height: 60,
			borderRadius: 16,
			backgroundColor: theme.secondaryContainer,
	
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
		},
		newExerciseValues: {
			marginVertical: 10,
			width: "90%",
			// flexDirection: "row",
			// justifyContent: "space-around",
			// ,backgroundColor: theme.secondary
			borderStyle: "solid",
			borderColor: theme.outline,
			borderWidth: 1,
			borderRadius: 16,
		},
		newExerciseValuesRow: {
			marginVertical: 5,
			flexDirection: "row",
			justifyContent: "space-around",
		},
		newExerciseInputValues: {
			height: 80,
			width: 100,
			// backgroundColor: theme.secondaryContainer,
			alignItems: "center",
			justifyContent: "space-around",
		},
		newExerciseNumberInput: {
			backgroundColor: theme.secondaryContainer,
			width: 20,
			height: 40,
		},
		loadingSpinner: {
			flex: 1,
			height: "100%",
			width: "100%",
			justifyContent: "center",
			alignItems: "center",
		},
	});
	
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		// justifyContent: "center",
// 		alignItems: "center",
// 	},
// 	pressable: { flex: 1 },
// 	contentView: { flex: 1, alignItems: "center" },
// 	saveWorkoutContainer: {
// 		marginTop: 10,
// 		width: "90%",
// 		justifyContent: "center",
// 		alignItems: "center",
// 	},
// 	workoutSummary: {
// 		marginTop: 10,
// 		width: "90%",
// 		maxHeight: 300,
// 		backgroundColor: theme.surfaceVariant,
// 		// justifyContent: "center",
// 		alignItems: "center",
// 		borderRadius: 12,
// 	},
// 	workoutSummaryInfo: {
// 		flexDirection: "row",
// 		height: 40,
// 		padding: 10,
// 		width: "100%",
// 		borderRadius: 12,
// 		alignItems: "baseline",
// 		// borderStyle: "solid",
// 		// borderBottomWidth: 1,
// 		// borderBottomColor: theme.outline
// 	},
// 	newExerciseContainer: {
// 		// justifyContent: "center",
// 		alignItems: "center",
// 		// height: 300,
// 		width: "95%",
// 		marginVertical: 10,
// 	},
// 	selectNewExercise: {
// 		// width: "90%",
// 		height: 60,
// 		borderRadius: 16,
// 		backgroundColor: theme.secondaryContainer,

// 		flexDirection: "row",
// 		justifyContent: "center",
// 		alignItems: "center",
// 	},
// 	newExerciseValues: {
// 		marginVertical: 10,
// 		width: "90%",
// 		// flexDirection: "row",
// 		// justifyContent: "space-around",
// 		// ,backgroundColor: theme.secondary
// 		borderStyle: "solid",
// 		borderColor: theme.outline,
// 		borderWidth: 1,
// 		borderRadius: 16,
// 	},
// 	newExerciseValuesRow: {
// 		marginVertical: 5,
// 		flexDirection: "row",
// 		justifyContent: "space-around",
// 	},
// 	newExerciseInputValues: {
// 		height: 80,
// 		width: 100,
// 		// backgroundColor: theme.secondaryContainer,
// 		alignItems: "center",
// 		justifyContent: "space-around",
// 	},
// 	newExerciseNumberInput: {
// 		backgroundColor: theme.secondaryContainer,
// 		width: 20,
// 		height: 40,
// 	},
// 	loadingSpinner: {
// 		flex: 1,
// 		height: "100%",
// 		width: "100%",
// 		justifyContent: "center",
// 		alignItems: "center",
// 	},
// });

const getModalStyles = theme => {
	return StyleSheet.create({
		modalStyle: {
			left: "5%",
			height: "60%",
			width: 400,
			maxWidth: "90%",
			backgroundColor: theme.surfaceVariant,
			// justifyContent: "center",
			alignItems: "center",
			borderRadius: 20,
			paddingVertical: 15,
			paddingLeft: 10,
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
}

// const modalStyles = StyleSheet.create({
// 	modalStyle: {
// 		left: "5%",
// 		height: "60%",
// 		width: 400,
// 		maxWidth: "90%",
// 		backgroundColor: theme.surfaceVariant,
// 		// justifyContent: "center",
// 		alignItems: "center",
// 		borderRadius: 20,
// 		paddingVertical: 15,
// 		paddingLeft: 10,
// 	},
// 	exerciseListItem: {
// 		flexDirection: "row",
// 		// justifyContent: "center",
// 		// textAlign: "right",
// 		// alignItems: "center",
// 		width: 400,
// 		height: 60,
// 		marginVertical: 5,
// 		padding: 10,
// 		// backgroundColor: theme.secondaryContainer
// 	},
// 	pressable: {
// 		width: "100%",
// 		height: "100%",
// 	},
// });

export default AddWorkoutScreen;
