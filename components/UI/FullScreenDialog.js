import React, { useState, useEffect, useRef, useReducer } from "react";
import {
	View,
	StyleSheet,
	Dimensions,
	Pressable,
	ScrollView,
	Modal,
	Keyboard,
	SectionList,
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

const windowWidth = Dimensions.get("screen").width;
const textFieldWidth = Math.floor((windowWidth - 24 * 2 - 8) / 2);

const workoutReducer = (state, action) => {
	switch (action.type) {
		case ADD_EXERCISE:
			return { ...state };
		case REMOVE_EXERCISE:
			return { ...state };
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
			if (value.error === true) {
				isFormValid = false;
				break;
			}
			// isFormValid = true
		}
		setIsFormValid(isFormValid);
	}, [exerciseState]);

	const handleBackBehavior = () => {
		props.toggleModal();
	};

	const onValueEntered = (ref, type) => {
		const value = ref.current.value();

		// replace comma with dot
		const sanitizedValue = +value.replace(/,/g, ".");
		console.log(sanitizedValue);

		// check if value is valid
		const isValid = validCheck(type, sanitizedValue);
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
		console.log(value);
		dispatchExercise({
			type: ADD_VALUE,
			field: "exercise",
			newValue: { value: value, error: error },
		});
		setShowExerciseModal(false);
	};

	const validCheck = (type, value) => {
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
							{/* <BodyText
								large={false}
								style={{ color: currentTheme.onSurfaceVariant }}
							>
								Test
							</BodyText> */}
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
						onButtonPress={() => console.log("SaveButtonpress")}
					>
						Save
					</TextButton>
				</View>
			</View>
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
							{exerciseState.exercise["exercise"].value == null
								? "Press to select exercise ..."
								: exerciseState.exercise["exercise"].value}
						</BodyText>
						{exerciseState.exercise["exercise"].value != null && (
							<IconButton
								style={{ marginLeft: "auto" }}
								name="close"
								onButtonPress={()=>onExerciseSelected(null, true)}
							/>
						)}
					</Pressable>
				</View>
				<View style={styles.exerciseValuesContainer}>
					<View style={styles.exerciseValuesInputs}>
						<View style={styles.exerciseValuesInputRow}>
							<View style={styles.exerciseValueItem}>
								<FilledTextField
									label="Weight"
									ref={weightRef}
									keyboardType="numeric"
									textColor={currentTheme.onSurfaceVariant}
									baseColor={currentTheme.onSurfaceVariant}
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
										exerciseState.exercise["weight"].error
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
									textColor={currentTheme.onSurfaceVariant}
									baseColor={currentTheme.onSurfaceVariant}
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
									textColor={currentTheme.onSurfaceVariant}
									baseColor={currentTheme.onSurfaceVariant}
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
									textColor={currentTheme.onSurfaceVariant}
									baseColor={currentTheme.onSurfaceVariant}
									tintColor={currentTheme.primary}
									title="Number from 6.5-10"
									inputContainerStyle={{
										backgroundColor:
											currentTheme.surfaceVariant,
									}}
									onBlur={() => onValueEntered(rpeRef, "rpe")}
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
							<View style={styles.exerciseValueItem}>
								<View style={styles.exerciseValueTextField}>
									<BodyText
										large={true}
										style={{
											color: currentTheme.onSurface,
										}}
									>
										Date
									</BodyText>
								</View>
							</View>
							<View style={{ ...styles.exerciseValueItem }}>
								<FilledTonalButton
									disabled={isFormValid ? false : true}
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
						<View style={styles.summaryListItem}>
							<TitleText
								large={true}
								style={{ color: currentTheme.onSurface }}
							>
								Squat
							</TitleText>
							<LabelText
								large={true}
								style={{ color: currentTheme.onSurface }}
							>
								100kg 4x3x4 @8
							</LabelText>
						</View>
						<View style={styles.summaryListItem}>
							<TitleText
								large={true}
								style={{ color: currentTheme.onSurface }}
							>
								Squat
							</TitleText>
							<LabelText
								large={true}
								style={{ color: currentTheme.onSurface }}
							>
								100kg 4x3x4 @8
							</LabelText>
						</View>
						<View style={styles.summaryListItem}>
							<TitleText
								large={true}
								style={{ color: currentTheme.onSurface }}
							>
								Squat
							</TitleText>
							<LabelText
								large={true}
								style={{ color: currentTheme.onSurface }}
							>
								100kg 4x3x4 @8
							</LabelText>
						</View>
					</View>
				</View>
			</View>
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
			height: 150,
			width: "100%",
			flexDirection: "column",
		},
		summaryListItem: {
			flexDirection: "row",
			alignItems: "baseline",
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
	});
};

export default FullScreenDialog;
