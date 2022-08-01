import { nanoid } from "@reduxjs/toolkit";
import React, { useState, useReducer, useEffect } from "react";
import {
	View,
	ScrollView,
	Pressable,
	StyleSheet,
	SectionList,
	FlatList,
	Keyboard,
	KeyboardAvoidingView,
} from "react-native";
import { TextInput as PaperInput, HelperText } from "react-native-paper";
import { useSelector } from "react-redux";
import { convertPoundToKilo, inputValueValidityCheck } from "../../shared/utils/UtilFunctions";
import IconButton from "../Buttons/IconButton";
import OutlineButton from "../Buttons/OutlineButton";
import TextButton from "../Buttons/TextButton";
import BodyText from "../Text/Body";
import LabelText from "../Text/Label";
import TitleText from "../Text/Title";
import FilterChip from "./Chips/FilterChip";

const ADD_VALUE = "ADD_VALUE";
const exerciseReducer = (state, action) => {
	switch (action.type) {
		case ADD_VALUE:
			const newState = { ...state };
			newState.exercise[action.field] = action.newValue;
			return newState;
	}
};

const inputReducer = (state, action) => {
	switch (action.type) {
		case ADD_VALUE: {
			const newState = { ...state };
			newState.inputs[action.field] = action.newValue;
			return newState;
		}
	}
};

const baseExerciseState = {
	exerciseName: { value: null, error: false },
	sets: { value: null, error: false },
};

const baseInputState = {
	weight: { value: null, error: false },
	reps: { value: null, error: false },
	sets: { value: null, error: false },
	rpe: { value: null, error: false },
};

const SelectExerciseListItem = ({
	data,
	onPress,
	currentlySelected,
	currentTheme,
}) => {
	const [sortedList, setSortedList] = useState([]);

	useEffect(() => {
		const sortData = data.data.sort((a, b) => a.localeCompare(b));
		setSortedList(sortData);
	}, []);

	return (
		<View style={{ flexDirection: "column", paddingBottom: 16 }}>
			<LabelText style={{ color: currentTheme.onSurface }}>
				{data.title.charAt(0).toUpperCase() + data.title.slice(1)}
			</LabelText>
			<ScrollView>
				<View style={{ flexDirection: "row", flexWrap: "wrap" }}>
					{sortedList.map((text) => (
						<FilterChip
							key={nanoid()}
							text={text}
							onPress={() => onPress(text)}
							selected={currentlySelected == text ? true : false}
						/>
					))}
				</View>
			</ScrollView>
		</View>
	);
};

const AddExerciseDialog = ({ onAddExercise, currentTheme, closeDialog }) => {
	const exerciseTypes = useSelector((state) => state.workout.exerciseTypes);
	const isMetric = useSelector((state) => state.user.user.useMetric);
	const [exerciseState, dispatchExercise] = useReducer(exerciseReducer, {
		exercise: baseExerciseState,
	});
	const [inputState, dispatchInput] = useReducer(inputReducer, {
		inputs: baseInputState,
	});
	const [styles, setStyles] = useState(getStyles(currentTheme));
	const [exerciseTypesList, setExerciseTypesList] = useState([]);
	const [canSubmit, setCanSubmit] = useState(false);

	const [hasError, setHasError] = useState(false);

	const [hasSelectedExercise, setHasSelectedExercise] = useState(false);

	useEffect(() => {
		const data = [];
		for (let [key, value] of Object.entries(exerciseTypes)) {
			const dataObject = {};
			dataObject.title = key;
			const exerciseList = [];
			for (let ex of Object.values(value)) {
				exerciseList.push(ex.value);
			}
			dataObject.data = exerciseList;
			data.push(dataObject);
		}
		setExerciseTypesList(data);
		onUnselectExercise();
	}, []);

	useEffect(() => {
		setStyles(getStyles(currentTheme));
	}, [currentTheme]);

	useEffect(() => {
		if (exerciseState.exercise.exerciseName.value != null) {
			setHasSelectedExercise(true);
		} else {
			setHasSelectedExercise(false);
		}
	}, [exerciseState]);

	useEffect(() => {
		setCanSubmit(checkCanSubmit());
	}, [inputState]);


	const onSelectExercise = (exercise) => {
		dispatchExercise({
			type: ADD_VALUE,
			field: "exerciseName",
			newValue: { value: exercise, error: false },
		});
	};

	const onUnselectExercise = () => {
		dispatchExercise({
			type: ADD_VALUE,
			field: "exerciseName",
			newValue: { value: null, error: false },
		});
	};

	const onValueEntered = (event, type) => {
		const value = event.nativeEvent.text;
		const sanitizedValue = Number(value.replace(/,/g, "."));
		// const isValid = inputValueValidityCheck(type, sanitizedValue);
		const isValid = inputValueValidityCheck(type, sanitizedValue);

		if (isValid) {
			dispatchInput({
				type: ADD_VALUE,
				field: type,
				newValue: { value: sanitizedValue, error: false },
			});
		} else {
			dispatchInput({
				type: ADD_VALUE,
				field: type,
				newValue: { value: sanitizedValue, error: true },
			});
		}
	};

	const onSaveExercise = () => {
		const exerciseValues = inputState.inputs;
		const nrOfSets = exerciseValues.sets.value;
		let onSet = 1;
		const newSetObject = {};
		if (nrOfSets > 1) {
			while (onSet <= nrOfSets) {
				newSetObject[onSet] = {
					weight: isMetric
						? exerciseValues.weight.value
						: convertPoundToKilo(exerciseValues.weight.value),
					reps: exerciseValues.reps.value,
					rpe: exerciseValues.rpe.value,
				};
				onSet++;
			}
		} else {
			newSetObject[1] = {
				weight: isMetric
					? exerciseValues.weight.value
					: convertPoundToKilo(exerciseValues.weight.value),
				reps: exerciseValues.reps.value,
				rpe: exerciseValues.rpe.value,
			};
		}
		dispatchExercise({
			type: ADD_VALUE,
			field: "sets",
			newValue: newSetObject,
		});
		const exerciseToAdd = {
			exerciseName: exerciseState.exercise.exerciseName.value,
			sets: newSetObject,
			id: nanoid(),
		};
		onUnselectExercise();

		onAddExercise(exerciseToAdd);
	};

	const checkCanSubmit = () => {
		const valueState = inputState.inputs;
		const values = Object.values(valueState);
		const validState = true;
		for (let value of values) {
			if (value.error == true || value.value === null) {
				return false;
			}
		}
		return validState;
	};

	return (
		<KeyboardAvoidingView behavior="height" style={styles.modalContainer}>
			<Pressable
				onPress={closeDialog}
				style={{ flex: 1 }}
			></Pressable>
			<View style={styles.modalContent}>
				<View style={styles.header}>
					<IconButton
						name="close"
						onPress={closeDialog}
						iconColor={currentTheme.onSurface}
					/>
					<TitleText
						large={true}
						style={{ color: currentTheme.onSurface }}
					>
						New exercise
					</TitleText>
					<OutlineButton
						disabled={!canSubmit}
						style={{ marginLeft: "auto" }}
						onButtonPress={onSaveExercise}
					>
						Add
					</OutlineButton>
				</View>
				{!hasSelectedExercise && (
					<View style={styles.selectExerciseContainer}>
						<View style={styles.exerciseList}>
							<FlatList
								data={exerciseTypesList}
								renderItem={(itemData) => (
									<SelectExerciseListItem
										currentlySelected={
											exerciseState.exercise.exerciseName
												.value
										}
										onPress={onSelectExercise}
										data={itemData.item}
										currentTheme={currentTheme}
									/>
								)}
								horizontal={false}
								keyExtractor={() => nanoid()}
							/>
						</View>
					</View>
				)}

				{hasSelectedExercise && (
					<View style={styles.inputAndExerciseContainer}>
						<Pressable
							style={styles.inputView}
							onPress={() => Keyboard.dismiss()}
						>
							<View style={styles.currentlySelectedExercise}>
								<BodyText
									large={true}
									style={{ color: currentTheme.onSurface }}
								>
									{exerciseState.exercise.exerciseName.value}
								</BodyText>
								<IconButton
									onPress={onUnselectExercise}
									name="close"
									iconColor={currentTheme.onSurface}
								/>
							</View>
							<View style={styles.inputViewRow}>
								<View style={styles.weightInput}>
									<PaperInput
										mode="outlined"
										keyboardType="numeric"
										style={{
											backgroundColor:
												currentTheme.surfaceE3,
										}}
										activeOutlineColor={
											inputState.inputs["weight"].error
												? currentTheme.error
												: currentTheme.primary
										}
										outlineColor={
											inputState.inputs["weight"].error
												? currentTheme.error
												: currentTheme.outline
										}
										theme={{
											colors: {
												text: inputState.inputs[
													"weight"
												].error
													? currentTheme.error
													: currentTheme.onSurface,
												placeholder: inputState.inputs[
													"weight"
												].error
													? currentTheme.error
													: currentTheme.onSurface,
											},
										}}
										onEndEditing={(event) =>
											onValueEntered(event, "weight")
										}
										label="Weight"
									/>
									<HelperText
										theme={{
											colors: {
												error: currentTheme.error,
												text: inputState.inputs[
													"weight"
												].error
													? currentTheme.error
													: currentTheme.onSurfaceVariant,
												placeholder: inputState.inputs[
													"weight"
												].error
													? currentTheme.error
													: currentTheme.onSurface,
											},
										}}
										type={
											inputState.inputs["weight"].error
												? "error"
												: "info"
										}
									>
										{inputState.inputs["weight"].error
											? "Must be positive"
											: isMetric
											? "kg"
											: "lbs"}
									</HelperText>
								</View>
								<View style={{ flex: 1 }}>
									<PaperInput
										mode="outlined"
										keyboardType="numeric"
										style={{
											backgroundColor:
												currentTheme.surfaceE3,
										}}
										activeOutlineColor={
											inputState.inputs["reps"].error
												? currentTheme.error
												: currentTheme.primary
										}
										outlineColor={
											inputState.inputs["reps"].error
												? currentTheme.error
												: currentTheme.outline
										}
										theme={{
											colors: {
												text: inputState.inputs["reps"]
													.error
													? currentTheme.error
													: currentTheme.onSurface,
												placeholder: inputState.inputs[
													"reps"
												].error
													? currentTheme.error
													: currentTheme.onSurface,
											},
										}}
										label="Reps"
										onEndEditing={(event) =>
											onValueEntered(event, "reps")
										}
									/>
									<HelperText
										theme={{
											colors: {
												error: currentTheme.error,
												text: inputState.inputs["reps"]
													.error
													? currentTheme.error
													: currentTheme.onSurfaceVariant,
												placeholder: inputState.inputs[
													"reps"
												].error
													? currentTheme.error
													: currentTheme.onSurface,
											},
										}}
										type={
											inputState.inputs["reps"].error
												? "error"
												: "info"
										}
									>
										{inputState.inputs["reps"].error
											? "Must be positive"
											: ""}
									</HelperText>
								</View>
							</View>
							<View style={styles.inputViewRow}>
								<View style={styles.weightInput}>
									<PaperInput
										keyboardType="numeric"
										mode="outlined"
										style={{
											backgroundColor:
												currentTheme.surfaceE3,
										}}
										activeOutlineColor={
											inputState.inputs["sets"].error
												? currentTheme.error
												: currentTheme.primary
										}
										outlineColor={
											inputState.inputs["sets"].error
												? currentTheme.error
												: currentTheme.outline
										}
										theme={{
											colors: {
												text: inputState.inputs["sets"]
													.error
													? currentTheme.error
													: currentTheme.onSurface,
												placeholder: inputState.inputs[
													"sets"
												].error
													? currentTheme.error
													: currentTheme.onSurface,
											},
										}}
										onEndEditing={(event) =>
											onValueEntered(event, "sets")
										}
										label="Sets"
									/>
									<HelperText
										theme={{
											colors: {
												error: currentTheme.error,
												text: inputState.inputs["sets"]
													.error
													? currentTheme.error
													: currentTheme.onSurfaceVariant,
												placeholder: inputState.inputs[
													"sets"
												].error
													? currentTheme.error
													: currentTheme.onSurface,
											},
										}}
										type={
											inputState.inputs["sets"].error
												? "error"
												: "info"
										}
									>
										{inputState.inputs["sets"].error
											? "Must be positive"
											: ""}
									</HelperText>
								</View>
								<View style={{ flex: 1 }}>
									<PaperInput
										mode="outlined"
										keyboardType="numeric"
										style={{
											backgroundColor:
												currentTheme.surfaceE3,
										}}
										activeOutlineColor={
											inputState.inputs["rpe"].error
												? currentTheme.error
												: currentTheme.primary
										}
										outlineColor={
											inputState.inputs["rpe"].error
												? currentTheme.error
												: currentTheme.outline
										}
										theme={{
											colors: {
												text: inputState.inputs["rpe"]
													.error
													? currentTheme.error
													: currentTheme.onSurface,
												placeholder: inputState.inputs[
													"rpe"
												].error
													? currentTheme.error
													: currentTheme.onSurface,
											},
										}}
										label="RPE"
										onEndEditing={(event) =>
											onValueEntered(event, "rpe")
										}
									/>
									<HelperText
										theme={{
											colors: {
												error: currentTheme.error,
												text: inputState.inputs["rpe"]
													.error
													? currentTheme.error
													: currentTheme.onSurfaceVariant,
												placeholder: inputState.inputs[
													"rpe"
												].error
													? currentTheme.error
													: currentTheme.onSurface,
											},
										}}
										type={
											inputState.inputs["rpe"].error
												? "error"
												: "info"
										}
									>
										{inputState.inputs["rpe"].error
											? "Must be number between 6.5-10"
											: "Number between 6.5-10"}
									</HelperText>
								</View>
							</View>
						</Pressable>
					</View>
				)}
			</View>
		</KeyboardAvoidingView>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		modalContainer: {
			flex: 1,
			// height: "50%",
			marginTop: "auto",
			// minWidth: 280,
			// maxWidth: 560,
			backgroundColor: theme.scrim,
			// height: "100%",

			// marginTop: 100,
		},
		modalContent: {
			flex: 1,
			// height: "50%",
			marginTop: "auto",
			backgroundColor: theme.surfaceE3,
			borderRadius: 28,
			borderBottomLeftRadius: 0,
			borderBottomRightRadius: 0,
		},
		header: {
			height: 64,
			flexDirection: "row",
			alignItems: "center",
			paddingHorizontal: 24,
		},
		inputAndExerciseContainer: {
			marginTop: 20,
			flex: 1,
			flexDirection: "column",
			paddingHorizontal: 24,
		},
		selectExerciseContainer: {
			marginTop: 20,
			flex: 1,
			flexDirection: "column",
			paddingHorizontal: 24,
		},
		exerciseList: {
			// height: 50
		},
		currentlySelectedExercise: {
			width: "100%",
			flexDirection: "row",
			height: 56,
			paddingHorizontal: 16,
			// justifyContent: "center"
			alignItems: "center",
			borderRadius: 4,
			borderWidth: 1,
			borderColor: theme.outline,
			justifyContent: "space-between",
			marginBottom: 10,
		},
		inputView: {
			height: 300,
			width: "100%",
			flexDirection: "column",
		},
		inputViewRow: {
			height: 85,
			// marginTop: 20,
			width: "100%",
			flexDirection: "row",
			alignItems: "flex-start",
			justifyContent: "flex-start",
		},
		weightInput: {
			flex: 1,
			paddingRight: 5,
		},
	});
};

export default AddExerciseDialog;

