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
import {
	convertKiloToPound,
	inputValueValidityCheck,
} from "../../shared/utils/UtilFunctions";

const windowWidth = Dimensions.get("screen").width;
const textFieldWidth = Math.floor((windowWidth - 24 * 2 - 8) / 2);

const AddWorkoutDialogScreen = (props) => {
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const dispatch = useDispatch();
	const isMetric = useSelector((state) => state.user.user.useMetric);

	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);
	const userID = useSelector((state) => state.auth.userID);
	// const userData = useSelector((state) => state.user);

	// layoutStuff
	const { width, height } = useWindowDimensions();
	const [fabPosition, setFabPosition] = useState({ x: 0, y: 0 });
	const [hideFAB, setHideFAB] = useState(false);

	const [isLoading, setIsLoading] = useState(false);

	// datePickerModal
	const [datePickerModalVisible, setDatePickerModalVisible] = useState(false);

	// workoutStates
	const [exercises, setExercises] = useState([]);
	const [workoutNote, setWorkoutNote] = useState("");
	const [selectedDate, setSelectedDate] = useState(new Date());

	const [showCloseDialogModal, setShowCloseDialogModal] = useState(false);

	const [addExerciseModalVisible, setAddExerciseModalVisible] =
		useState(false);

	const [isScrolling, setIsScrolling] = useState(false);

	const backAction = () => {
		console.log("BAckAction");
		return false;
	};

	useEffect(() => {
		const fabXPos = width / 2 - 56 / 2;
		// const fabHeight = layout.height;
		setFabPosition({ x: fabXPos, y: 16 });

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

	// when the user wants to exit the screen
	const handleBackBehavior = () => {
		// setShowCloseDialogModal(true);
		// props.toggleModal();
	};

	const onRemoveExercise = (exerciseToRemove) => {
		// dispatchWorkout({ type: REMOVE_EXERCISE, exercise: exerciseToRemove });
		const prevExerciseState = [...exercises];
		const nextExerciseState = prevExerciseState.filter(
			(exercise) => exercise !== exerciseToRemove
		);
		setExercises(nextExerciseState);
	};

	const onSaveWorkout = async () => {
		setIsLoading(true);
		const exerciseToSave = exercises;
		for (let exercise of exerciseToSave) {
			delete exercise.id;
		}
		const newWorkout = new Workout(
			exerciseToSave,
			selectedDate,
			true,
			workoutNote,
			userID
		);
		dispatch(saveWorkout({ workout: newWorkout, userID: userID }));
		setIsLoading(false);
		console.log("WorkoutSaved");
		props.navigation.goBack();
	};

	const onDateChange = (event, newDate) => {
		setDatePickerModalVisible(false);
		const currentDate = newDate || selectedDate;
		setSelectedDate(currentDate);
	};

	const onAddExercise = (exerciseToAdd) => {
		const newExerciseState = [...exercises];
		newExerciseState.push(exerciseToAdd);
		setExercises(newExerciseState);
		onCloseAddWorkoutModal();
	};

	const onShowAddWorkoutModal = () => {
		setAddExerciseModalVisible(true);
	};

	const onCloseAddWorkoutModal = () => {
		setAddExerciseModalVisible(false);
	};

	const onHideFAB = () => {
		setHideFAB(true);
	};

	const onShowFAB = () => {
		setHideFAB(false);
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
		setWorkoutNote(noteText);
	};

	const onFabLayout = (event) => {
		// console.log(event.nativeEvent);
		// const layout = event.nativeEvent.layout;
		// console.log(layout);
		// const fabWidth = layout.width;
	};

	const onAddSetToExercise = (nameOfExercise, set) => {
		const existingExercise = exercises.find(
			({ exerciseName }) => exerciseName === nameOfExercise
		);
		if (existingExercise != undefined) {
			const indexOfExercise = exercises.findIndex(
				(exercise) => exercise === existingExercise
			);
			const setsInExercise = Object.keys(existingExercise.sets).length;
			const nextExerciseState = { ...existingExercise };
			nextExerciseState.sets[setsInExercise + 1] = set;
			const nextExercisesState = [...exercises];
			nextExercisesState[indexOfExercise] = nextExerciseState;
			setExercises(nextExercisesState);
		}
	};

	return (
		<View style={styles.container}>
			{!hideFAB && (
				<FabButton
					onPress={onShowAddWorkoutModal}
					onLayout={onFabLayout}
					iconName="add"
					style={{
						position: "absolute",
						zIndex: 1000,
						left: fabPosition.x,
						bottom: 16,
					}}
				/>
			)}
			<Modal
				animationType="slide"
				visible={addExerciseModalVisible}
				transparent={true}
				onRequestClose={onCloseAddWorkoutModal}
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
					<TextButton
						onButtonPress={onSaveWorkout}
						disabled={exercises.length === 0 ? true : false}
					>
						Save
					</TextButton>,
				]}
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
					keyboardType="default"
				/>
			</View>

			<View style={styles.exerciseSummary}>
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
					ListFooterComponent={<View></View>}
					ListFooterComponentStyle={{ height: 80 }}
					data={exercises}
					renderItem={(itemData) => (
						<ExerciseView
							exerciseData={itemData.item}
							isDarkMode={useDarkMode}
							currentTheme={currentTheme}
							removeExercise={onRemoveExercise}
							isMetric={isMetric}
							onAddSetToExercise={onAddSetToExercise}
							onHideFAB={onHideFAB}
							onShowFAB={onShowFAB}
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
	isMetric,
	onAddSetToExercise,
	onHideFAB,
	onShowFAB,
}) => {
	const [styles, setStyles] = useState(
		getExerciseViewStyle(isDarkMode ? Themes.dark : Themes.light)
	);

	const [setView, setSetView] = useState([]);

	const [showMenu, setShowMenu] = useState(false);

	const [addSet, setAddSet] = useState(false);

	// inputState
	const [weight, setWeight] = useState({ value: 0, error: false });
	const [reps, setReps] = useState({ value: 0, error: false });
	const [rpe, setRpe] = useState({ value: 0, error: false });

	useEffect(() => {
		return () => {
			// onCloseMenu();
		};
	}, []);

	useEffect(() => {
		if (exerciseData) {
			const newSetView = [];
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

	const onAddSet = () => {
		const newSet = {
			weight: weight.value,
			reps: reps.value,
			rpe: rpe.value,
		};

		onAddSetToExercise(exerciseData.exerciseName, newSet);
		onToggleAddSet();
	};

	const onToggleAddSet = () => {
		const addSetVisible = addSet;
		if (addSetVisible) {
			onShowFAB();
		} else {
			onHideFAB();
		}
		setAddSet(!addSetVisible);
	};

	const onValueEntered = (event, type) => {
		const value = event.nativeEvent.text;
		const sanitizedValue = Number(value.replace(/,/g, "."));
		const isValid = inputValueValidityCheck(type, sanitizedValue);
		if (isValid) {
			if (type === "weight") {
				setWeight({ value: sanitizedValue, error: false });
			} else if (type === "reps") {
				setReps({ value: sanitizedValue, error: false });
			} else {
				setRpe({ value: sanitizedValue, error: false });
			}
		} else {
			if (type === "weight") {
				setWeight({ value: sanitizedValue, error: true });
			} else if (type === "reps") {
				setReps({ value: sanitizedValue, error: true });
			} else {
				setRpe({ value: sanitizedValue, error: true });
			}
		}
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
					const displayWeight = isMetric
						? setData[1][0]
						: Math.round(convertKiloToPound(setData[1][0]));
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
									{displayWeight} {isMetric ? "kg" : "lbs"} *
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
			{!addSet && (
				<View style={styles.buttonRow}>
					<TextButton onButtonPress={onRemoveExercise}>
						Delete
					</TextButton>
					<TextButton onButtonPress={onToggleAddSet}>
						Add set
					</TextButton>
				</View>
			)}
			{addSet && (
				<View style={{ width: "100%", flexDirection: "column" }}>
					<View style={styles.addSetRow}>
						<View style={{ flex: 1, marginRight: 6 }}>
							<PaperInput
								mode="outlined"
								keyboardType="numeric"
								style={{
									backgroundColor: currentTheme.surface,
								}}
								activeOutlineColor={
									weight.error
										? currentTheme.error
										: currentTheme.primary
								}
								outlineColor={
									weight.error
										? currentTheme.error
										: currentTheme.outline
								}
								theme={{
									colors: {
										text: weight.error
											? currentTheme.error
											: currentTheme.onSurface,
										placeholder: weight.error
											? currentTheme.error
											: currentTheme.onSurface,
									},
								}}
								onEndEditing={(event) =>
									onValueEntered(event, "weight")
								}
								label="Weight"
							/>
						</View>
						<View style={{ flex: 1, marginRight: 6 }}>
							<PaperInput
								mode="outlined"
								keyboardType="numeric"
								style={{
									backgroundColor: currentTheme.surface,
								}}
								activeOutlineColor={
									reps.error
										? currentTheme.error
										: currentTheme.primary
								}
								outlineColor={
									reps.error
										? currentTheme.error
										: currentTheme.outline
								}
								theme={{
									colors: {
										text: reps.error
											? currentTheme.error
											: currentTheme.onSurface,
										placeholder: reps.error
											? currentTheme.error
											: currentTheme.onSurface,
									},
								}}
								onEndEditing={(event) =>
									onValueEntered(event, "reps")
								}
								label="Reps"
							/>
						</View>
						<View style={{ flex: 1 }}>
							<PaperInput
								mode="outlined"
								keyboardType="numeric"
								style={{
									backgroundColor: currentTheme.surface,
								}}
								activeOutlineColor={
									rpe.error
										? currentTheme.error
										: currentTheme.primary
								}
								outlineColor={
									rpe.error
										? currentTheme.error
										: currentTheme.outline
								}
								theme={{
									colors: {
										text: rpe.error
											? currentTheme.error
											: currentTheme.onSurface,
										placeholder: rpe.error
											? currentTheme.error
											: currentTheme.onSurface,
									},
								}}
								onEndEditing={(event) =>
									onValueEntered(event, "rpe")
								}
								label="RPE"
							/>
						</View>
					</View>
					<View
						style={{
							flex: 1,
							flexDirection: "row",
							justifyContent: "space-around",
							alignItems: "center",
							marginTop: 10,
						}}
					>
						<TextButton onButtonPress={onToggleAddSet}>
							Discard
						</TextButton>
						<OutlineButton onButtonPress={onAddSet}>
							Add set
						</OutlineButton>
					</View>
				</View>
			)}
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
		addSetRow: {
			flexDirection: "row",
			width: "100%",
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
