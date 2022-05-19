import React, { useState, useEffect, useRef, useReducer } from "react";
import {
	View,
	StyleSheet,
	Dimensions,
	Pressable,
	ActivityIndicator,
	Modal,
	Keyboard,
	SectionList,
	FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import { Themes } from "../../shared/Theme";
import BodyText from "../Text/Body";
import IconButton from "../Buttons/IconButton";
import TextButton from "../Buttons/TextButton";
import TitleText from "../Text/Title";
import HeadlineText from "../Text/Headline";
import LabelText from "../Text/Label";
import Input from "./Input";
import FilledButton from "../Buttons/FilledButton";
import FilledTonalButton from "../Buttons/FilledTonalButton";
import { TextInput } from "react-native-paper";
import {
	TextField,
	FilledTextField,
	OutlinedTextField,
} from "rn-material-ui-textfield";
import Workout from "../../models/workout";
import UtilFunctions from "../../shared/utils/UtilFunctions";
import { ExerciseTypes } from "../../shared/utils/ExerciseTypes";
import { Divider } from "react-native-paper";
import Exercise from "../../models/Exercise";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as firebase from "../../firebase/firebase";
import { async } from "@firebase/util";

const windowWidth = Dimensions.get("screen").width;
const textFieldWidth = Math.floor((windowWidth - 24 * 2 - 8) / 2);

const ADD_EXERCISE = "ADD_EXERCISE";
const REMOVE_EXERCISE = "REMOVE_EXERCISE";
const workoutReducer = (state, action) => {
	switch (action.type) {
		case ADD_EXERCISE:
			// const newEArray = [...state.workout.exercises];
			// newEArray.pus
			console.log(action.exercise);
			const newWorkoutState = { ...state.workout };
			const eArrayCopy = [...newWorkoutState.exercises];
			eArrayCopy.push(action.exercise);
			newWorkoutState.exercises = eArrayCopy;
			return { ...state, workout: newWorkoutState };
		case REMOVE_EXERCISE:
			const exerciseToRemove = action.exercise;
			let exerciseArray = [...state.workout.exercises];
			exerciseArray = exerciseArray.filter(
				(exercise) => exercise !== exerciseToRemove
			);
			const workoutWithRemovedExercise = { ...state.workout };
			workoutWithRemovedExercise.exercises = exerciseArray;

			return { ...state, workout: workoutWithRemovedExercise };
		default:
			return state;
	}
};

const ADD_VALUE = "ADD_VALUE";
const exerciseReducer = (state, action) => {
	switch (action.type) {
		case ADD_VALUE:
			const newState = { ...state };
			newState.exercise[action.field] = action.newValue;
			return newState;
	}
};

const baseExerciseState = {
	exercise: { value: null, error: false },
	weight: { value: null, error: false },
	reps: { value: null, error: false },
	sets: { value: null, error: false },
	rpe: { value: null, error: false },
};

const FullScreenDialog = (props) => {
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);
	const userID = useSelector((state) => state.auth.userID);

	const [workoutState, dispatchWorkout] = useReducer(workoutReducer, {
		workout: new Workout([], Date.now(), false, "", userID),
	});

	const [exerciseState, dispatchExercise] = useReducer(exerciseReducer, {
		exercise: baseExerciseState,
	});

	const [isLoading, setIsLoading] = useState(false);

	// datePickerModal
	const [datePickerModalVisible, setDatePickerModalVisible] = useState(false);
	const [hasSetCustomDate, setHasSetCustomDate] = useState(false);
	const [selectedDate, setSelectedDate] = useState(new Date());

	const [exerciseListDisplay, setExerciseListDisplay] = useState([]);

	const [isFormValid, setIsFormValid] = useState(false);

	const [showExerciseModal, setShowExerciseModal] = useState(false);
	const [modalBackdropHex, setModalBackdropHex] = useState(
		UtilFunctions.hexToRGB(currentTheme.surface)
	);

	const repRef = useRef(null);
	const weightRef = useRef(null);
	const setsRef = useRef(null);
	const rpeRef = useRef(null);

	useEffect(() => {}, []);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	// TODO FIX logic
	useEffect(() => {
		let isFormValid = true;
		for (const [key, value] of Object.entries(exerciseState.exercise)) {
			if (value.error === true || value.value == null) {
				isFormValid = false;
				break;
			}
			// isFormValid = true
		}
		setIsFormValid(isFormValid);
	}, [exerciseState]);

	useEffect(() => {
		setExerciseListDisplay(workoutState.workout.exercises);
	}, [workoutState]);

	useEffect(() => {
		console.log(selectedDate);
	}, [selectedDate]);

	// when the user wants to exit the screen
	const handleBackBehavior = () => {
		props.toggleModal();
	};

	const onValueEntered = (ref, type) => {
		const value = ref.current.value();

		// replace comma with dot
		const sanitizedValue = Number(value.replace(/,/g, "."));
		console.log(sanitizedValue);

		// check if value is valid
		const isValid = inputValueValidityCheck(type, sanitizedValue);
		if (isValid) {
			dispatchExercise({
				type: ADD_VALUE,
				field: type,
				newValue: { value: sanitizedValue, error: false },
			});
		} else {
			dispatchExercise({
				type: ADD_VALUE,
				field: type,
				newValue: { value: sanitizedValue, error: true },
			});
		}
	};

	const onExerciseSelected = (value, error) => {
		dispatchExercise({
			type: ADD_VALUE,
			field: "exercise",
			newValue: { value: value, error: error },
		});
		setShowExerciseModal(false);
	};

	const saveExercise = () => {
		const exerciseValues = exerciseState.exercise;
		const newExercise = new Exercise(
			exerciseValues.exercise.value,
			exerciseValues.weight.value,
			exerciseValues.reps.value,
			exerciseValues.sets.value,
			exerciseValues.rpe.value
		);

		dispatchWorkout({ type: ADD_EXERCISE, exercise: newExercise });
	};

	const removeExercise = (exerciseToRemove) => {
		dispatchWorkout({ type: REMOVE_EXERCISE, exercise: exerciseToRemove });
	};

	const inputValueValidityCheck = (type, value) => {
		if (type === "rpe") {
			if (value >= 6.5 && value <= 10) {
				return true;
			} else {
				return false;
			}
		} else {
			if (value > 0 && value != null) {
				return true;
			}
			return false;
		}
	};

	const onSaveWorkout = async () => {
		setIsLoading(true);
		const currentWorkoutState = workoutState.workout;
		const newWorkout = new Workout(
			currentWorkoutState.exercises,
			selectedDate,
			true,
			"Note",
			userID
		);
		await firebase.writeWorkoutToCollection(newWorkout);
		setIsLoading(false);
		console.log("WorkoutSaved");
		props.toggleModal();
	};

	const onDateChange = (event, newDate) => {
		setDatePickerModalVisible(false);
		setHasSetCustomDate(true);
		const currentDate = newDate || selectedDate;
		setSelectedDate(currentDate);
	};

	const handlePress = () => {
		Keyboard.dismiss();
	};

	const showModalHandler = (value) => {
		setShowExerciseModal(value);
	};

	return (
		<Pressable onPress={handlePress} style={styles.container}>
			<Modal
				visible={showExerciseModal}
				animationType="fade"
				transparent={true}
				onRequestClose={() => setShowExerciseModal(false)}
			>
				<Pressable
					onPress={() => {
						showModalHandler(false);
					}}
					style={{
						...styles.modalView,
						backgroundColor: `rgba(${modalBackdropHex[0]}, ${modalBackdropHex[1]}, ${modalBackdropHex[2]}, 0.8)`,
					}}
				>
					<Pressable style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<HeadlineText
								large={false}
								style={{ color: currentTheme.onSurface }}
							>
								Press to select exercise
							</HeadlineText>
						</View>
						<View style={{ marginBottom: 8 }}>
							<Divider
								style={{
									height: 1,
									color: currentTheme.onSurfaceVariant,
								}}
							/>
						</View>
						<View style={styles.modalBody}>
							<SectionList
								keyExtractor={(item, index) => item + index}
								sections={ExerciseTypes}
								renderItem={({ item }) => (
									<View style={styles.exerciseListItem}>
										<Pressable
											onPress={() =>
												onExerciseSelected(item, false)
											}
											style={{
												flexDirection: "row",
												width: "100%",
												height: 60,
												paddingHorizontal: 10,
												paddingVertical: 4,
												marginTop: 5,
											}}
										>
											<BodyText
												large={true}
												style={{
													color: currentTheme.onSurfaceVariant,
												}}
											>
												{item}
											</BodyText>
										</Pressable>
									</View>
								)}
								renderSectionHeader={({
									section: { title },
								}) => (
									<LabelText
										large={true}
										style={{ color: currentTheme.tertiary }}
									>
										{title}
									</LabelText>
								)}
							/>
						</View>
						<View style={{ marginBottom: 8 }}>
							<Divider
								style={{
									height: 1,
									color: currentTheme.onSurfaceVariant,
								}}
							/>
						</View>

						<View style={styles.modalActions}>
							<TextButton
								textStyle={{ color: currentTheme.primary }}
								disabled={false}
								onButtonPress={() => {
									showModalHandler(false);
								}}
							>
								Back
							</TextButton>
						</View>
					</Pressable>
				</Pressable>
			</Modal>

			<View style={styles.headerContainer}>
				
				<View style={styles.headerBackButton}>
					<IconButton
						name="close"
						onButtonPress={handleBackBehavior}
					/>
				</View>
				<View style={styles.headerTitle}>
					<TitleText
						large={true}
						style={{ color: currentTheme.onSurface }}
					>
						New Workout
					</TitleText>
				</View>
				<View style={styles.headerSaveButton}>
					<TextButton
						disabled={
							workoutState.workout.exercises.length === 0
								? true
								: false
						}
						onButtonPress={onSaveWorkout}
					>
						Save
					</TextButton>
				</View>
			</View>
			{isLoading && (
				<View style={styles.loadingSpinner}>
					<ActivityIndicator
						size="large"
						color={currentTheme.primary}
					/>
				</View>
			)}

			{!isLoading && (
				<View style={styles.contentContainer}>
					<View style={styles.selectExerciseContainer}>
						<Pressable
							onPress={() => setShowExerciseModal(true)}
							style={styles.selectExercise}
						>
							<BodyText
								large={true}
								style={{ color: currentTheme.onSurface }}
							>
								{exerciseState.exercise["exercise"].value ==
								null
									? "Select exercise"
									: exerciseState.exercise["exercise"].value}
							</BodyText>
							{exerciseState.exercise["exercise"].value !=
								null && (
								<IconButton
									style={{ marginLeft: "auto" }}
									name="close"
									onButtonPress={() =>
										onExerciseSelected(null, true)
									}
								/>
							)}
							{exerciseState.exercise["exercise"].value ==
								null && (
								<IconButton
									style={{ marginLeft: "auto" }}
									name="arrow-drop-down"
									onButtonPress={() =>
										setShowExerciseModal(true)
									}
								/>
							)}
						</Pressable>
					</View>
					<View
						style={{
							...styles.selectExerciseContainer,
							marginTop: 8,
						}}
					>
						<Pressable
							onPress={() => setDatePickerModalVisible(true)}
							style={styles.selectExercise}
						>
							<BodyText
								large={true}
								style={{ color: currentTheme.onSurface }}
							>
								Date: {selectedDate.toDateString()}
							</BodyText>
							<IconButton
								style={{ marginLeft: "auto" }}
								name="arrow-drop-down"
								onButtonPress={() =>
									setDatePickerModalVisible(true)
								}
							/>
						</Pressable>
					</View>
					{datePickerModalVisible && (
						<DateTimePicker
							mode="date"
							is24Hour={true}
							display="default"
							onChange={onDateChange}
							testID="datepicker"
							value={selectedDate}
						/>
					)}

					<View style={styles.exerciseValuesContainer}>
						<View style={styles.exerciseValuesInputs}>
							<View style={styles.exerciseValuesInputRow}>
								<View style={styles.exerciseValueItem}>
									<FilledTextField
										label="Weight"
										ref={weightRef}
										keyboardType="numeric"
										textColor={
											currentTheme.onSurfaceVariant
										}
										baseColor={
											currentTheme.onSurfaceVariant
										}
										tintColor={currentTheme.primary}
										// activeLineWidth={2}
										// disabledLineWidth={10}
										title="Kilogram"
										inputContainerStyle={{
											backgroundColor:
												currentTheme.surfaceVariant,
										}}
										errorColor={currentTheme.error}
										// onChangeText={(textValue) =>handleValueInput("weight", textValue)}
										onBlur={() =>
											onValueEntered(weightRef, "weight")
										}
										error={
											exerciseState.exercise["weight"]
												.error
												? "Must be positive number"
												: ""
										}
									/>
								</View>
								<View style={styles.exerciseValueItem}>
									<FilledTextField
										ref={repRef}
										label="Reps"
										keyboardType="numeric"
										textColor={
											currentTheme.onSurfaceVariant
										}
										baseColor={
											currentTheme.onSurfaceVariant
										}
										tintColor={currentTheme.primary}
										inputContainerStyle={{
											backgroundColor:
												currentTheme.surfaceVariant,
										}}
										onBlur={() =>
											onValueEntered(repRef, "reps")
										}
										errorColor={currentTheme.error}
										error={
											exerciseState.exercise["reps"].error
												? "Must be positive number"
												: ""
										}
									/>
								</View>
							</View>
							<View style={styles.exerciseValuesInputRow}>
								<View style={styles.exerciseValueItem}>
									<FilledTextField
										ref={setsRef}
										label="Sets"
										keyboardType="numeric"
										textColor={
											currentTheme.onSurfaceVariant
										}
										baseColor={
											currentTheme.onSurfaceVariant
										}
										tintColor={currentTheme.primary}
										inputContainerStyle={{
											backgroundColor:
												currentTheme.surfaceVariant,
										}}
										onBlur={() =>
											onValueEntered(setsRef, "sets")
										}
										errorColor={currentTheme.error}
										error={
											exerciseState.exercise["sets"].error
												? "Must be positive number"
												: ""
										}
									/>
								</View>
								<View style={styles.exerciseValueItem}>
									<FilledTextField
										ref={rpeRef}
										label="RPE"
										keyboardType="numeric"
										textColor={
											currentTheme.onSurfaceVariant
										}
										baseColor={
											currentTheme.onSurfaceVariant
										}
										tintColor={currentTheme.primary}
										title="Number from 6.5-10"
										inputContainerStyle={{
											backgroundColor:
												currentTheme.surfaceVariant,
										}}
										onBlur={() =>
											onValueEntered(rpeRef, "rpe")
										}
										errorColor={currentTheme.error}
										error={
											exerciseState.exercise["rpe"].error
												? "Must be a number between 6.5 and 10"
												: ""
										}
									/>
								</View>
							</View>
							<View style={styles.exerciseValuesInputRow}>
								<View style={{ width: "100%" }}>
									<FilledTonalButton
										disabled={isFormValid ? false : true}
										onButtonPress={saveExercise}
									>
										Add exercise
									</FilledTonalButton>
								</View>
							</View>
						</View>
					</View>
					<View style={styles.summaryContainer}>
						<View style={styles.summaryHeader}>
							<HeadlineText
								large={true}
								style={{ color: currentTheme.onSurface }}
							>
								Summary
							</HeadlineText>
						</View>
						<View style={styles.summaryList}>
							<FlatList
								data={exerciseListDisplay}
								extraData={exerciseListDisplay}
								keyExtractor={(item, index) => index}
								renderItem={(itemData) => {
									return (
										<View style={styles.summaryListItem}>
											<TitleText
												large={true}
												style={{
													color: currentTheme.onSurface,
												}}
											>
												{itemData.item.exercise}
											</TitleText>
											<LabelText
												large={true}
												style={{
													color: currentTheme.onSurface,
												}}
											>
												{itemData.item.weight}kg{" "}
												{itemData.item.reps}reps{" "}
												{itemData.item.sets}sets @
												{itemData.item.rpe}
											</LabelText>
											<TextButton
												textStyle={{
													color: currentTheme.error,
												}}
												onButtonPress={() =>
													removeExercise(
														itemData.item
													)
												}
											>
												Delete
											</TextButton>
										</View>
									);
								}}
							/>
						</View>
					</View>
				</View>
			)}
		</Pressable>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.surface,
			maxWidth: 560,
		},
		headerContainer: {
			flexDirection: "row",
			width: "100%",
			height: 56,
			backgroundColor: theme.surface,
			alignItems: "center",
		},
		headerBackButton: {
			marginHorizontal: 16,
		},
		headerSaveButton: {
			marginLeft: "auto",
			marginRight: 24,
		},
		contentContainer: {
			flex: 1,
			// width: "100%"
			flexDirection: "column",
			alignItems: "center",
			paddingHorizontal: 24,
		},
		selectExerciseContainer: {
			width: "100%",
			height: 56,
			justifyContent: "center",
			alignItems: "center",
			marginTop: 8,
		},
		selectExercise: {
			flexDirection: "row",
			width: "100%",
			height: "100%",
			borderRadius: 4,
			borderWidth: 1,
			borderColor: theme.outline,

			paddingHorizontal: 16,
			alignItems: "center",
		},
		exerciseValuesContainer: {
			width: "100%",
			marginTop: 20,
		},
		exerciseValuesInputs: {
			width: "100%",
			marginTop: 10,
		},
		exerciseValuesInputRow: {
			flexDirection: "row",
			marginBottom: 5,
		},
		exerciseValueItem: {
			height: 85,
			width: textFieldWidth,

			marginRight: 8,
		},
		exerciseValueTextField: {
			// width: 150,
			// width: "100%",
			height: 56,
			borderRadius: 4,
			borderWidth: 1,
			borderColor: theme.outline,
			flexDirection: "row",
			alignItems: "center",
			paddingHorizontal: 16,
		},
		textFieldStyle: {
			// height: 56,
			// paddingHorizontal: 16,
			// width: 177
			backgroundColor: theme.surface,
		},
		summaryContainer: {
			marginTop: 20,
			width: "100%",
			height: 300,
		},
		summaryList: {
			height: 300,
			width: "100%",
			flexDirection: "column",
		},
		summaryListItem: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-around",
			width: "100%",
			height: 60,
			paddingHorizontal: 12,
			paddingVertical: 6,
		},
		modalView: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: theme.surface,
		},
		modalContent: {
			minHeight: 200,
			minWidth: 280,
			maxWidth: 560,
			borderRadius: 28,
			padding: 24,
			backgroundColor: theme.surfaceE3,
		},
		modalHeader: {
			marginBottom: 8,
		},
		modalBody: {
			marginBottom: 8,
			height: 500,
		},
		modalActions: {
			flexDirection: "row",
			justifyContent: "flex-end",
		},
		loadingSpinner: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center"
		}
	});
};

export default FullScreenDialog;
