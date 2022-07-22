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
	BackHandler,
	useWindowDimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Themes } from "../../shared/Theme";
import BodyText from "../../components/Text/Body";
import IconButton from "../../components/Buttons/IconButton";
import TextButton from "../../components/Buttons/TextButton";
import TitleText from "../../components/Text/Title";
import HeadlineText from "../../components/Text/Headline";
import LabelText from "../../components/Text/Label";
import FilledTonalButton from "../../components/Buttons/FilledTonalButton";
import OutlineButton from "../../components/Buttons/OutlineButton";
import {
	TextField,
	FilledTextField,
	OutlinedTextField,
} from "rn-material-ui-textfield";
import { TextInput as PaperInput, HelperText } from "react-native-paper";
import Workout from "../../models/workout";
import { ExerciseTypes } from "../../shared/utils/ExerciseTypes";
import Exercise from "../../models/Exercise";
import DateTimePicker from "@react-native-community/datetimepicker";

import { saveWorkout } from "../../redux/slices/workoutSlice";
import TopAppBar from "../../components/UI/TopAppBarComponent";
import { Menu, Divider } from "react-native-paper";
import { setHideTabBar } from "../../redux/slices/appSettingsSlice";
import { nanoid } from "@reduxjs/toolkit";
import AddExerciseDialog from "../../components/UI/AddExerciseDialog";
import FabButton from "../../components/Buttons/Fab";
import { useDimensions } from "@react-native-community/hooks";

const windowWidth = Dimensions.get("screen").width;
const textFieldWidth = Math.floor((windowWidth - 24 * 2 - 8) / 2);

const ADD_EXERCISE = "ADD_EXERCISE";
const ADD_SET_TO_EXERCISE = "ADD_SET_TO_EXERCISE";
const REMOVE_EXERCISE = "REMOVE_EXERCISE";
const RERENDER = "RERENDER";
const ADD_NOTE = "ADD_NOTE";

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
		case ADD_NOTE: {
			const newWoState = { ...state.workout };
			newWoState.note = action.note;
			return { ...state, workout: newWoState };
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
const ex5 = {
	exerciseName: "TEST",
	listID: nanoid(),
	sets: {
		1: { weight: 100, reps: 5, rpe: 7 },
		2: { weight: 110, reps: 5, rpe: 8 },
	},
};

const ex6 = {
	exerciseName: "TES2",
	listID: nanoid(),
	sets: {
		1: { weight: 100, reps: 5, rpe: 7 },
		2: { weight: 110, reps: 5, rpe: 8 },
	},
};

const ex7 = {
	exerciseName: "TEST4",
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

	// layoutStuff
	const { width, height } = useWindowDimensions();
	const [fabPosition, setFabPosition] = useState({x: 0, y: 0});

	const [isLoading, setIsLoading] = useState(false);

	// datePickerModal
	const [datePickerModalVisible, setDatePickerModalVisible] = useState(false);
	const [selectedDate, setSelectedDate] = useState(new Date());

	const [exerciseListDisplay, setExerciseListDisplay] = useState([]);

	const [showCloseDialogModal, setShowCloseDialogModal] = useState(false);

	const [addExerciseModalVisible, setAddExerciseModalVisible] =
		useState(false);

	const [isScrolling, setIsScrolling] = useState(false);

	const backAction = () => {
		console.log("BAckAction");
		return false;
	};

	useEffect(() => {
		const fabXPos = (width /2 ) - (56/2)
		console.log(fabXPos);
		// const fabHeight = layout.height;
		setFabPosition({x:fabXPos, y: 16})

		// onAddTempData();
		BackHandler.addEventListener("hardwareBackPress", backAction);
		return () => {
			BackHandler.removeEventListener("hardwareBackPress", backAction);
			dispatch(setHideTabBar(false));
		};
	}, []);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	// useEffect(() => {
	// 	let isFormValid = true;
	// 	for (const [key, value] of Object.entries(exerciseState.exercise)) {
	// 		if (value.error === true || value.value == null) {
	// 			isFormValid = false;
	// 			break;
	// 		}
	// 		// isFormValid = true
	// 	}
	// 	setIsFormValid(isFormValid);
	// }, [exerciseState]);

	useEffect(() => {
		// const listDisplay = workoutState.workout.exercises.map((exercise) => {
		// 	return (
		// 		<ExerciseView
		// 			key={nanoid()}
		// 			exerciseData={exercise}
		// 			currentTheme={currentTheme}
		// 			isDarkMode={useDarkMode}
		// 			removeExercise={removeExercise}
		// 		/>
		// 	);
		// });
		// setExerciseListDisplay(listDisplay);
		setExerciseListDisplay(workoutState.workout.exercises);
		console.log(workoutState);
		// console.log(workoutState);
	}, [workoutState]);

	// when the user wants to exit the screen
	const handleBackBehavior = () => {
		// setShowCloseDialogModal(true);
		// props.toggleModal();
	};

	const onExerciseSelected = (value, error) => {
		dispatchExercise({
			type: ADD_VALUE,
			field: "exerciseName",
			newValue: { value: value, error: error },
		});
		setShowExerciseModal(false);
	};

	// const saveExercise = () => {
	// 	const exerciseValues = exerciseState.exercise;
	// 	const newExerciseName = exerciseValues.exerciseName.value;

	// 	if (checkIfWorkoutContainsSameExercise(newExerciseName)) {
	// 		const sets = exerciseValues.sets.value;
	// 		const onExercise = workoutState.workout.exercises.find(
	// 			(exercise) =>
	// 				exercise.exerciseName == exerciseValues.exerciseName.value
	// 		);
	// 		if (onExercise) {
	// 			console.log("FOUND EXERCISE: ", onExercise);
	// 		}
	// 		const newSet = {
	// 			weight: exerciseValues.weight.value,
	// 			reps: exerciseValues.reps.value,
	// 			rpe: exerciseValues.rpe.value,
	// 		};
	// 		dispatchWorkout({
	// 			type: ADD_SET_TO_EXERCISE,
	// 			set: newSet,
	// 			exerciseName: newExerciseName,
	// 		});
	// 	} else {
	// 		const sets = exerciseValues.sets.value;
	// 		console.log(sets);
	// 		let onSet = 1;
	// 		const newSetObject = {};

	// 		if (sets > 1) {
	// 			while (onSet <= sets) {
	// 				newSetObject[onSet] = {
	// 					weight: exerciseValues.weight.value,
	// 					reps: exerciseValues.reps.value,
	// 					rpe: exerciseValues.rpe.value,
	// 				};
	// 				onSet++;
	// 			}
	// 		} else {
	// 			newSetObject[1] = {
	// 				weight: exerciseValues.weight.value,
	// 				reps: exerciseValues.reps.value,
	// 				rpe: exerciseValues.rpe.value,
	// 			};
	// 		}

	// 		const newExercise = {
	// 			exerciseName: exerciseValues.exerciseName.value,
	// 			sets: newSetObject,
	// 		};
	// 		dispatchWorkout({ type: ADD_EXERCISE, exercise: newExercise });
	// 	}
	// };

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

	const onAddTempData = () => {
		// setAddExerciseModalVisible(true);
		dispatchWorkout({ type: ADD_EXERCISE, exercise: ex1 });
		dispatchWorkout({ type: ADD_EXERCISE, exercise: ex2 });
		dispatchWorkout({ type: ADD_EXERCISE, exercise: ex3 });
		dispatchWorkout({ type: ADD_EXERCISE, exercise: ex4 });
		dispatchWorkout({ type: ADD_EXERCISE, exercise: ex5 });
		dispatchWorkout({ type: ADD_EXERCISE, exercise: ex6 });
		dispatchWorkout({ type: ADD_EXERCISE, exercise: ex7 });
	};

	const onAddExercise = (exerciseToAdd) => {
		exerciseToAdd.listID = nanoid();
		dispatchWorkout({ type: ADD_EXERCISE, exercise: exerciseToAdd });
		onCloseAddWorkoutModal();
	};

	const onShowAddWorkoutModal = () => {
		setAddExerciseModalVisible(true);
	};

	const onCloseAddWorkoutModal = () => {
		setAddExerciseModalVisible(false);
	};

	const onNavigateBack = () => {
		props.navigation.goBack();
	};

	const scrollHandler = (event) => {
		const scrollInfo = event.nativeEvent.contentOffset;
		if (scrollInfo.y > 0 && !isScrolling) {
			setIsScrolling(true);
		} else if (scrollInfo.y === 0 && isScrolling) {
			setIsScrolling(false);
		}
	};

	const onNoteEditingEnd = (event) => {
		const noteText = event.nativeEvent.text;
		console.log("note end: ", noteText);
		dispatchWorkout({ type: ADD_NOTE, note: noteText });
	};

	const onFabLayout = (event) => {
		// console.log(event.nativeEvent);
		// const layout = event.nativeEvent.layout;
		// console.log(layout);
		// const fabWidth = layout.width;
	};

	return (
		<View style={styles.container}>
			<FabButton
				onPress={() => setAddExerciseModalVisible(true)}
				onLayout={onFabLayout}
				iconName="add"
				style={{
					position: "absolute",
					zIndex: 1000,
					left: fabPosition.x,
					bottom: 16,
				}}
			/>
			<Modal
				animationType="slide"
				visible={addExerciseModalVisible}
				transparent={true}
				onRequestClose={() => setAddExerciseModalVisible(false)}
			>
				<AddExerciseDialog
					closeDialog={onCloseAddWorkoutModal}
					currentTheme={currentTheme}
					onAddExercise={onAddExercise}
				/>
			</Modal>
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
					<TextButton onButtonPress={onAddTempData}>EX</TextButton>,

					// <TextButton onButtonPress={onShowAddWorkoutModal}>
					// 	Temp
					// </TextButton>,
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
				// optionalStyle={{ }}
				backgroundColor={
					isScrolling ? currentTheme.surfaceE2 : currentTheme.surface
				}
			/>
			<View
				style={{
					...styles.addWorkoutScreenInfo,
					backgroundColor: isScrolling
						? currentTheme.surfaceE2
						: currentTheme.surface,
				}}
			>
				<TitleText style={{ color: currentTheme.onSurface }}>
					Workout Info
				</TitleText>
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
				</View>
			</View>
			<View
				style={{
					...styles.noteInput,
					backgroundColor: isScrolling
						? currentTheme.surfaceE2
						: currentTheme.surface,
				}}
			>
				<PaperInput
					style={{
						backgroundColor: isScrolling
							? currentTheme.surfaceE2
							: currentTheme.surface,
					}}
					activeOutlineColor={currentTheme.primary}
					outlineColor={currentTheme.outline}
					theme={{
						colors: {
							text: currentTheme.onSurface,
							placeholder: currentTheme.onSurface,
						},
					}}
					mode="outlined"
					label="Note"
					multiline={true}
					onEndEditing={(event) => onNoteEditingEnd(event)}
				/>
			</View>

			<View style={styles.exerciseSummary}>
				{/* <View style={styles.exerciseSummaryHeader}>
					<TitleText
						large={true}
						style={{ color: currentTheme.onSurface }}
					>
						Exercises
					</TitleText>
				</View> */}
				<FlatList
					onScroll={(event) => scrollHandler(event)}
					ItemSeparatorComponent={() => {
						return (
							<View
								style={{
									width: "100%",
									borderBottomWidth: 1,
									borderBottomColor: currentTheme.outline,
								}}
							></View>
						);
					}}
					ListHeaderComponent={
						<View style={styles.exerciseSummaryHeader}>
							<TitleText
								large={false}
								style={{ color: currentTheme.onSurface }}
							>
								Exercises
							</TitleText>
						</View>
					}
					keyExtractor={(item) => item.listID}
					data={exerciseListDisplay}
					renderItem={(itemData) => (
						<ExerciseView
							exerciseData={itemData.item}
							isDarkMode={useDarkMode}
							currentTheme={currentTheme}
							removeExercise={removeExercise}
						/>
					)}
				/>
			</View>
		</View>
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
			// console.log("ExerciseData changed: ", exerciseData.exerciseName);
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
				{/* <Menu
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
				</Menu> */}
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
									{setData[1][0]}kg *
								</BodyText>
								<BodyText
									style={{
										color: currentTheme.onSurface,
									}}
									large={true}
								>
									{" "}
									{setData[1][1]}reps
								</BodyText>
								<BodyText
									style={{
										color: currentTheme.onSurface,
									}}
									large={true}
								>
									{" "}
									@{setData[1][2]}
								</BodyText>
							</View>
						</View>
					);
				})}
			</View>
			<View style={styles.buttonRow}>
				<IconButton
					name="trash-outline"
					iconColor={currentTheme.onSurfaceVariant}
					onPress={() => console.log("deleteexercise")}
				/>
				<IconButton
					name="add"
					iconColor={currentTheme.onSurfaceVariant}
					onPress={() => console.log("deleteexercise")}
				/>
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
			paddingHorizontal: 24,
			paddingVertical: 3,

			// backgroundColor: theme.error,
			// borderRadius: 12,
			// borderWidth: 1,
			// borderColor: theme.outline,
		},
		buttonRow: {
			flexDirection: "row",
			justifyContent: "flex-end",
			// height: 60,
			width: "100%",
			// backgroundColor: theme.error
		},
		exerciseHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
		},
		exerciseDisplay: {
			flex: 1,
			// height: 200,
			// width: "100%"
			// flexDirection: "column",
		},
		setView: {
			flexDirection: "row",
			alignItems: "center",
			paddingVertical: 4,
			paddingHorizontal: 8,
			// height: 100,
			// backgroundColor: theme.error
		},
		setNumber: { width: 50 },
		setValues: {
			flex: 1,
			flexDirection: "row",
			justifyContent: "flex-end",
			alignItems: "baseline",
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
		addWorkoutScreenInfo: {
			width: "100%",
			height: 100,
			backgroundColor: theme.surface,
			paddingHorizontal: 24,
			paddingVertical: 6,
		},
		exerciseSummary: {
			flex: 1,
			// marginTop: 20,
			// paddingHorizontal: 24,
			flexDirection: "column",
		},
		exerciseSummaryHeader: { paddingHorizontal: 24 },
		noteInput: {
			// width: "100%",
			zIndex: 200,
			paddingHorizontal: 24,
			paddingBottom: 6,
		},
	});
};

export default AddWorkoutDialogScreen;
