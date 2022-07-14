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
	Platform,
	ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Themes } from "../../shared/Theme";
import BodyText from "../Text/Body";
import IconButton from "../Buttons/IconButton";
import TextButton from "../Buttons/TextButton";
import TitleText from "../Text/Title";
import HeadlineText from "../Text/Headline";
import LabelText from "../Text/Label";
import FilledTonalButton from "../Buttons/FilledTonalButton";
import OutlineButton from "../Buttons/OutlineButton";
import {
	TextField,
	FilledTextField,
	OutlinedTextField,
} from "rn-material-ui-textfield";
import Workout from "../../models/workout";
import { ExerciseTypes } from "../../shared/utils/ExerciseTypes";
import Exercise from "../../models/Exercise";
import DateTimePicker from "@react-native-community/datetimepicker";

import { saveWorkout } from "../../redux/slices/workoutSlice";
import TopAppBar from "./TopAppBarComponent";
import { Menu, Divider } from "react-native-paper";
import { setHideTabBar } from "../../redux/slices/appSettingsSlice";
import { nanoid } from "@reduxjs/toolkit";

const windowWidth = Dimensions.get("screen").width;
const textFieldWidth = Math.floor((windowWidth - 24 * 2 - 8) / 2);

const ADD_EXERCISE = "ADD_EXERCISE";
const ADD_SET_TO_EXERCISE = "ADD_SET_TO_EXERCISE";
const REMOVE_EXERCISE = "REMOVE_EXERCISE";
const RERENDER = "RERENDER";

const workoutReducer = (state, action) => {
	switch (action.type) {
		case ADD_EXERCISE: {
			// const newEArray = [...state.workout.exercises];
			// newEArray.pus
			console.log(action.exercise);
			const newWorkoutState = { ...state.workout };
			const eArrayCopy = [...newWorkoutState.exercises];
			eArrayCopy.push(action.exercise);
			newWorkoutState.exercises = eArrayCopy;
			return { ...state, workout: newWorkoutState };
		}
		case REMOVE_EXERCISE: {
			const exerciseToRemove = action.exercise;
			let exerciseArray = [...state.workout.exercises];
			exerciseArray = exerciseArray.filter(
				(exercise) => exercise !== exerciseToRemove
			);
			const workoutWithRemovedExercise = { ...state.workout };
			workoutWithRemovedExercise.exercises = exerciseArray;

			return { ...state, workout: workoutWithRemovedExercise };
		}

		case ADD_SET_TO_EXERCISE: {
			const newWorkoutState = { ...state.workout };
			const newExerciseName = action.exerciseName;
			const setToAdd = action.set;

			const existingExercise = newWorkoutState.exercises.find(
				(ex) => ex.exerciseName == newExerciseName
			);

			// avoid undefined
			if (existingExercise) {
				const sets = { ...existingExercise.sets };
				const keys = Object.keys(sets);
				const nextSetNumber = keys.length + 1;
				sets[nextSetNumber] = setToAdd;
				console.log("Sets after adding: ", sets);

				existingExercise.sets = sets;
				return { ...state, workout: newWorkoutState };
			}
		}
		case RERENDER: {
			const newState = { ...state.workout };
			return { ...state, workout: newState };
		}

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
	exerciseName: { value: null, error: false },
	weight: { value: null, error: false },
	reps: { value: null, error: false },
	sets: { value: null, error: false },
	rpe: { value: null, error: false },
};

const ex1 = {
	exerciseName: "Sumo-DL",
	listID: nanoid(),

	sets: {
		1: { weight: 100, reps: 5, rpe: 7 },
		2: { weight: 110, reps: 5, rpe: 8 },
		3: { weight: 110, reps: 5, rpe: 8 },
		4: { weight: 110, reps: 5, rpe: 8 },
		5: { weight: 110, reps: 5, rpe: 8 },
	},
};

const ex2 = {
	exerciseName: "Squat",
	listID: nanoid(),

	sets: {
		1: { weight: 100, reps: 5, rpe: 7 },
		2: { weight: 110, reps: 5, rpe: 8 },
	},
};

const ex3 = {
	exerciseName: "RDL",
	listID: nanoid(),

	sets: {
		1: { weight: 100, reps: 5, rpe: 7 },
		2: { weight: 110, reps: 5, rpe: 8 },
	},
};

const ex4 = {
	exerciseName: "Deadlift",
	listID: nanoid(),
	sets: {
		1: { weight: 100, reps: 5, rpe: 7 },
		2: { weight: 110, reps: 5, rpe: 8 },
	},
};

const AddWorkoutDialogScreen = (props) => {
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const dispatch = useDispatch();
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);
	const userID = useSelector((state) => state.auth.userID);
	// const userData = useSelector((state) => state.user);

	const [workoutState, dispatchWorkout] = useReducer(workoutReducer, {
		workout: new Workout([], Date.now(), false, "", userID),
	});

	const [exerciseState, dispatchExercise] = useReducer(exerciseReducer, {
		exercise: baseExerciseState,
	});

	const [isLoading, setIsLoading] = useState(false);

	// datePickerModal
	const [datePickerModalVisible, setDatePickerModalVisible] = useState(false);
	const [selectedDate, setSelectedDate] = useState(new Date());

	const [exerciseListDisplay, setExerciseListDisplay] = useState(null);

	const [isFormValid, setIsFormValid] = useState(false);

	const [showExerciseModal, setShowExerciseModal] = useState(false);
	const [showCloseDialogModal, setShowCloseDialogModal] = useState(false);

	const repRef = useRef(null);
	const weightRef = useRef(null);
	const setsRef = useRef(null);
	const rpeRef = useRef(null);

	useEffect(() => {
		return () => {
			dispatch(setHideTabBar(false));
		};
	}, []);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

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
		const listDisplay = workoutState.workout.exercises.map((exercise) => {
			return <ExerciseView key={nanoid()} exerciseData={exercise} currentTheme={currentTheme} isDarkMode={useDarkMode} removeExercise={removeExercise} />
		})
		setExerciseListDisplay(listDisplay);
		// setExerciseListDisplay(workoutState.workout.exercises);
		// console.log(workoutState);
	}, [workoutState]);

	useEffect(() => {}, [selectedDate]);

	// when the user wants to exit the screen
	const handleBackBehavior = () => {
		// setShowCloseDialogModal(true);
		// props.toggleModal();
	};

	const onValueEntered = (ref, type) => {
		const value = ref.current.value();

		// replace comma with dot
		const sanitizedValue = Number(value.replace(/,/g, "."));
		// console.log(sanitizedValue);

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
			field: "exerciseName",
			newValue: { value: value, error: error },
		});
		setShowExerciseModal(false);
	};

	const saveExercise = () => {
		const exerciseValues = exerciseState.exercise;
		const newExerciseName = exerciseValues.exerciseName.value;

		if (checkIfWorkoutContainsSameExercise(newExerciseName)) {
			const sets = exerciseValues.sets.value;
			const onExercise = workoutState.workout.exercises.find(exercise => exercise.exerciseName == exerciseValues.exerciseName.value);
			if(onExercise){
				console.log("FOUND EXERCISE: ", onExercise);
			}
			const newSet = {	
				weight: exerciseValues.weight.value,
				reps: exerciseValues.reps.value,
				rpe: exerciseValues.rpe.value,
			};
			dispatchWorkout({
				type: ADD_SET_TO_EXERCISE,
				set: newSet,
				exerciseName: newExerciseName,
			});
		} else {
			const sets = exerciseValues.sets.value;
			console.log(sets);
			let onSet = 1;
			const newSetObject = {};

			if (sets > 1) {
				while (onSet <= sets) {
					newSetObject[onSet] = {
						weight: exerciseValues.weight.value,
						reps: exerciseValues.reps.value,
						rpe: exerciseValues.rpe.value,
					};
					onSet++;
				}
			} else {
				newSetObject[1] = {
					weight: exerciseValues.weight.value,
					reps: exerciseValues.reps.value,
					rpe: exerciseValues.rpe.value,
				};
			}

			const newExercise = {
				exerciseName: exerciseValues.exerciseName.value,
				sets: newSetObject,
			};
			dispatchWorkout({ type: ADD_EXERCISE, exercise: newExercise });
		}
	};

	const checkIfWorkoutContainsSameExercise = (exerciseName) => {
		const currentExercisesInWorkout = workoutState.workout.exercises;
		for (let exercise of currentExercisesInWorkout) {
			if (exercise.exerciseName == exerciseName) {
				return true;
			}
		}
		return false;
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
		dispatch(saveWorkout({ workout: newWorkout, userID: userID }));
		setIsLoading(false);
		console.log("WorkoutSaved");
		props.toggleModal();
	};

	const onDateChange = (event, newDate) => {
		setDatePickerModalVisible(false);
		const currentDate = newDate || selectedDate;
		setSelectedDate(currentDate);
	};

	const handlePress = () => {
		Keyboard.dismiss();
	};

	const showModalHandler = (value) => {
		setShowExerciseModal(value);
	};

	const onAddTempData = () => {
		dispatchWorkout({ type: ADD_EXERCISE, exercise: ex1 });
		dispatchWorkout({ type: ADD_EXERCISE, exercise: ex2 });
		dispatchWorkout({ type: ADD_EXERCISE, exercise: ex3 });
		dispatchWorkout({ type: ADD_EXERCISE, exercise: ex4 });
	};

	const onNavigateBack = () => {
		props.navigation.goBack();
	};

	return (
		<Pressable onPress={handlePress} style={styles.container}>
			<Modal
				visible={showCloseDialogModal}
				transparent={true}
				onRequestClose={onNavigateBack}
			>
				<Pressable
					onPress={() => setShowCloseDialogModal(false)}
					style={{
						...styles.closeDialogModalView,
						backgroundColor: currentTheme.scrim,
					}}
				>
					<Pressable style={styles.closeDialogModalContent}>
						<View style={styles.closeDialogModalBody}>
							<BodyText
								large={false}
								style={{ color: currentTheme.onSurfaceVariant }}
							>
								Discard workout?
							</BodyText>
						</View>
						<View style={styles.closeDialogModalActions}>
							<TextButton
								textStyle={{ color: currentTheme.primary }}
								disabled={false}
								onButtonPress={() => {
									setShowCloseDialogModal(false);
								}}
							>
								Cancel
							</TextButton>
							<TextButton
								textStyle={{ color: currentTheme.primary }}
								disabled={false}
								onButtonPress={onNavigateBack}
							>
								Discard
							</TextButton>
						</View>
					</Pressable>
				</Pressable>
			</Modal>
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
						backgroundColor: currentTheme.scrim,
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

			<TopAppBar
				headlineText="New Workout"
				navigationButton={
					<IconButton
						name="close"
						onPress={() => setShowCloseDialogModal(true)}
						iconColor={currentTheme.onSurface}
					/>
				}
				trailingIcons={[
					<TextButton onButtonPress={onAddTempData}>Temp</TextButton>,
					<TextButton
						onButtonPress={onSaveWorkout}
						disabled={
							workoutState.workout.exercises.length === 0
								? true
								: false
						}
					>
						Save
					</TextButton>,
				]}
				// optionalStyle={{ paddingTop: 0, height: 64 }}
			/>
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
								{exerciseState.exercise["exerciseName"].value ==
								null
									? "Select exercise"
									: exerciseState.exercise["exerciseName"]
											.value}
							</BodyText>
							{exerciseState.exercise["exerciseName"].value !=
								null && (
								<IconButton
									style={{ marginLeft: "auto" }}
									name="close"
									onPress={() =>
										onExerciseSelected(null, true)
									}
								/>
							)}
							{exerciseState.exercise["exerciseName"].value ==
								null && (
								<IconButton
									style={{ marginLeft: "auto" }}
									name="caret-down"
									onPress={() => setShowExerciseModal(true)}
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
								name="caret-down"
								// iconColor={currentTheme.primary}
								onPress={() => setDatePickerModalVisible(true)}
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
							<View
								style={{
									...styles.exerciseValuesInputRow,
									justifyContent: "space-around",
								}}
							>
								<View style={{ width: "60%" }}>
									<FilledTonalButton
										disabled={isFormValid ? false : true}
										onButtonPress={saveExercise}
									>
										Add exercise
									</FilledTonalButton>
								</View>
								<OutlineButton>Add Note</OutlineButton>
							</View>
						</View>
					</View>
					<View style={styles.summaryContainer}>
						<ScrollView contentContainerStyle={{paddingBottom: 10}}>
							{exerciseListDisplay}
						</ScrollView>
						{/* {exerciseListDisplay.map(exercise => {
							console.log(exercise);
							return(<View style={{height: 200, width: "100%", backgroundColor: currentTheme.onSurface, marginBottom: 20}}></View>)
						})} */}
						{/* <View
							style={{
								...styles.summaryHeader,
								flexDirection: "row",
								justifyContent: "flex-start",
							}}
						>
							<HeadlineText
								large={true}
								style={{ color: currentTheme.onSurface }}
							>
								Summary
							</HeadlineText>
						</View> */}
						{/* <View style={styles.summaryList}> */}
						{/* <FlatList
							style={{ paddingBottom: 20 }}
							horizontal={true}
							data={exerciseListDisplay}
							// extraData={exerciseListDisplay}
							keyExtractor={(item) => item.listID}
							renderItem={(itemData) => {
								return (
									<ExerciseView
										exerciseData={itemData.item}
										isDarkMode={useDarkMode}
										currentTheme={currentTheme}
										removeExercise={removeExercise}
									/>
								);
							}}
						/> */}
						{/* </View> */}
					</View>
				</View>
			)}
		</Pressable>
	);
};

const ExerciseView = ({
	exerciseData,
	isDarkMode,
	currentTheme,
	removeExercise,
}) => {
	const [styles, setStyles] = useState(
		getExerciseViewStyle(isDarkMode ? Themes.dark : Themes.light)
	);

	const [setView, setSetView] = useState([]);

	const [showMenu, setShowMenu] = useState(false);

	useEffect(() => {
		return () => {
			// onCloseMenu();
		};
	}, []);

	useEffect(() => {
		if (exerciseData) {
			console.log("ExerciseData changed: ", exerciseData.exerciseName);
			const newSetView = [];
			// const sets = exerciseData.sets;
			for (const [setNumber, setData] of Object.entries(
				exerciseData.sets
			)) {
				const onSet = [];
				onSet.push(setNumber);
				const eValues = [];
				eValues.push(setData.weight);
				eValues.push(setData.reps);
				eValues.push(setData.rpe);
				onSet.push(eValues);
				newSetView.push(onSet);
			}
			setSetView(newSetView);
		}
	}, [exerciseData]);

	useEffect(() => {
		// console.log("Test", setView.length);
	}, [setView]);

	const onCloseMenu = () => {
		setShowMenu(false);
	};
	const onShowMenu = () => {
		setShowMenu(true);
	};

	const onRemoveExercise = () => {
		onCloseMenu();
		removeExercise(exerciseData);
	};

	return (
		<View style={styles.exerciseContainer}>
			<View style={styles.exerciseHeader}>
				<TitleText
					style={{ color: currentTheme.onSurface }}
					large={true}
				>
					{exerciseData.exerciseName}
				</TitleText>
				<Menu
					theme={{ version: 3 }}
					visible={showMenu}
					onDismiss={onCloseMenu}
					anchor={
						<IconButton
							onPress={onShowMenu}
							name="ellipsis-horizontal"
						/>
					}
					// style={{backgroundColor: currentTheme.surfaceE2}}
					contentStyle={{ backgroundColor: currentTheme.surfaceE2 }}
				>
					<Menu.Item
						leadingIcon="redo"
						onPress={onRemoveExercise}
						title="Delete"
						titleStyle={{ color: currentTheme.onSurface }}
					/>
				</Menu>
			</View>
			<View style={styles.exerciseDisplay}>
					{setView.map((set) => {
						const setData = set;
						return (
							<View style={styles.setView} key={nanoid()}>
								<View style={styles.setNumber}>
									<LabelText
										style={{
											color: currentTheme.onSurfaceVariant,
										}}
									>
										Set {setData[0]}
									</LabelText>
								</View>
								<View style={styles.setValues}>
									<BodyText
										style={{
											color: currentTheme.onSurface,
										}}
										large={true}
									>
										{setData[1][0]}kg
									</BodyText>
									<BodyText
										style={{
											color: currentTheme.onSurface,
										}}
										large={true}
									>
										{setData[1][1]}reps
									</BodyText>
									<BodyText
										style={{
											color: currentTheme.onSurface,
										}}
										large={true}
									>
										{setData[1][2]}rpe
									</BodyText>
								</View>
							</View>
						);
					})}
			</View>
		</View>
	);
};

const getExerciseViewStyle = (theme) => {
	return StyleSheet.create({
		exerciseContainer: {
			width: "100%",
			// height: "100%",
			marginRight: 20,
			paddingHorizontal: 6,
			paddingVertical: 3,

			// backgroundColor: theme.error,
			borderRadius: 12,
			borderWidth: 1,
			borderColor: theme.outline,
		},
		exerciseHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
		},
		exerciseDisplay: {
			flex: 1,
			// height: "100%",
			// width: "100%"
			// flexDirection: "column",
		},
		setView: {
			flexDirection: "row",
			paddingVertical: 4,
			paddingHorizontal: 8
			// height: 100,
			// backgroundColor: theme.error
		},
		setNumber: { width: 50 },
		setValues: {
			flex: 1,
			flexDirection: "column",
			alignItems: "flex-end",
			// marginRight: 15,
		},
	});
};

const getStyles = (theme) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.surface,
		},
		contentContainer: {
			flex: 1,
			// width: "100%"
			flexDirection: "column",
			// alignItems: "center",
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
			// flex: 1,
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
			flex: 1,

			paddingVertical: 10,
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
			// backgroundColor: theme.error,
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
			alignItems: "center",
		},
		closeDialogModalView: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			// backgroundColor: theme.surface,
		},
		closeDialogModalContent: {
			// height: 200,
			minWidth: 280,
			maxWidth: 560,
			borderRadius: 28,
			padding: 24,
			backgroundColor: theme.surfaceE3,
		},
		closeDialogModalBody: {
			marginBottom: 24,
		},
		closeDialogModalActions: {
			flexDirection: "row",
			justifyContent: "flex-end",
		},
	});
};

export default AddWorkoutDialogScreen;
