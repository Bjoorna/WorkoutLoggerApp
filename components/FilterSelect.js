import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { FlatList as GestureFlatList } from "react-native-gesture-handler";

// import * as WorkoutActions from "../store/actions/workout";

import TitleText from "./Text/Title";
import OutlineButton from "./Buttons/OutlineButton";
import TextButton from "./Buttons/TextButton";
import { Themes } from "../shared/Theme";
// const theme = Themes.dark;

import SegmentedButton from "./Buttons/SegmentedButton";
import { nanoid } from "@reduxjs/toolkit";

import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import SelectExerciseListItem from "./UI/SelectExerciseListItem";
import {
	getExercisesByTypeForList,
	getExerciseTypes,
	getWorkoutsBasedOnDateInterval,
} from "../redux/slices/workoutSlice";
import DateSelector from "./UI/DateSelector";

import { isBefore, addMonths } from "date-fns";
import LabelText from "./Text/Label";
import BodyText from "./Text/Body";

const FilterSelect = ({ exerciseTypesAvaliable }) => {
	const exerciseTypes = useSelector((state) => state.workout.exerciseTypes);

	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	const userID = useSelector((state) => state.auth.userID);
	const dispatch = useDispatch();
	// const [exerciseTypes, setExerciseTypes] = useState([]);
	const [error, setError] = useState(null);

	// ExerciseFilter
	const [exerciseTypesList, setExerciseTypesList] = useState([]);
	const [exercisesToFilterBy, setExercisesToFilterBy] = useState([]);

	const [filterSegments, setFilterSegments] = useState([
		{ text: "Exercise", selected: true },
		{ text: "Date", selected: false },
		{ text: "PR", selected: false },
	]);
	const [activeFilterSegment, setActiveFilterSegment] = useState(
		filterSegments.find((segment) => segment.selected === true)
	);

	// DateFilter
	const [fromDate, setFromDate] = useState(addMonths(new Date(), -1));
	const [toDate, setToDate] = useState(new Date());
	const [dateFilterValid, onSetDateFilterValid] = useState(false);

	useEffect(() => {}, []);
	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	useEffect(() => {
		console.log("Etypes aval from FilterSelext: ", exerciseTypesAvaliable);
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
	}, [exerciseTypesAvaliable]);

	useEffect(() => {
		// console.log(exerciseTypesList);
	}, [exerciseTypesList]);

	useEffect(() => {
		const isValid = verifyDateFilter(fromDate, toDate);
		onSetDateFilterValid(isValid);
	}, [fromDate, toDate]);

	useEffect(() => {
		if (error) {
			Alert.alert("Error on AuthAttempt", error, [{ text: "Dismiss" }]);
		}
	}, [error]);

	// useEffect(() => {}, [exerciseFilterState]);
	useEffect(() => {
		console.log(activeFilterSegment);
	}, [activeFilterSegment]);

	useEffect(() => {
		setActiveFilterSegment(
			filterSegments.find((segment) => segment.selected === true)
		);
	}, [filterSegments]);

	useEffect(() => {
		console.log("exertofilterby: ", exercisesToFilterBy);
	}, [exercisesToFilterBy]);

	const onUnselectExercise = () => {
		// dispatchExercise({
		// 	type: ADD_VALUE,
		// 	field: "exerciseName",
		// 	newValue: { value: null, error: false },
		// });
	};

	const onSegmentPress = (segment) => {
		// console.log("Segment");

		// console.log(segment);
		if (segment.selected) {
			return;
		}
		const nextState = [...filterSegments];
		for (let segmentState of nextState) {
			if (segmentState.text === segment.text) {
				segmentState.selected = true;
			} else {
				segmentState.selected = false;
			}
		}
		setFilterSegments(nextState);
	};

	const addExerciseToFilter = (exercise) => {
		const indexOfExercise = exercisesToFilterBy.indexOf(exercise);
		if (indexOfExercise === -1) {
			const newFilter = [...exercisesToFilterBy];
			newFilter.push(exercise);
			setExercisesToFilterBy(newFilter);
		} else {
			let newFilter = [...exercisesToFilterBy];
			newFilter = newFilter.filter((ex) => ex !== exercise);
			setExercisesToFilterBy(newFilter);
		}
	};

	const onClearFilter = () => {
		setExercisesToFilterBy([]);
	};

	const onSubmitFilter = () => {
		dispatch(
			getExercisesByTypeForList({
				exerciseTypes: exercisesToFilterBy,
				userID: userID,
			})
		);
	};

	const onSetFromDate = (date) => {
		setFromDate(date);
	};
	const onSetToDate = (date) => {
		setToDate(date);
	};

	const verifyDateFilter = (from, to) => {
		return isBefore(from, to);
	};

	const onFilterByDates = () => {
		if (dateFilterValid) {
			dispatch(
				getWorkoutsBasedOnDateInterval({ from: fromDate, to: toDate })
			);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.filterBoxContent}>
				<View style={styles.selectHeader}>
					<TitleText
						style={{
							color: currentTheme.onSurfaceVariant,
							marginBottom: 10,
						}}
					>
						Filter by
					</TitleText>
					<SegmentedButton
						onPress={onSegmentPress}
						multiSelect={false}
						segments={filterSegments}
					/>
				</View>
				{activeFilterSegment.text === "Exercise" && (
					<View style={styles.selectExerciseContainer}>
						<BottomSheetFlatList
							data={exerciseTypesList}
							keyExtractor={() => nanoid()}
							renderItem={(itemData) => (
								<SelectExerciseListItem
									currentlySelected={exercisesToFilterBy}
									onPress={addExerciseToFilter}
									data={itemData.item}
									currentTheme={currentTheme}
								/>
							)}
							extraData={exercisesToFilterBy}
						/>
						{exercisesToFilterBy.length > 10 && (
							<View style={styles.errorText}>
								<BodyText
									large={true}
									style={{ color: currentTheme.error }}
								>
									Max 10 selected exercises in filter
								</BodyText>
							</View>
						)}
						<View style={styles.buttonRow}>
							<TextButton onButtonPress={onClearFilter}>
								Clear
							</TextButton>
							<TextButton
								onButtonPress={onSubmitFilter}
								disabled={
									exercisesToFilterBy.length < 1 ||
									exercisesToFilterBy.length > 10
								}
							>
								Filter
							</TextButton>
						</View>
					</View>
				)}
				{activeFilterSegment.text === "Date" && (
					<View
						style={{
							flex: 1,
							flexDirection: "column",
							marginTop: 12,
						}}
					>
						<View
							style={{
								marginBottom: 12,
							}}
						>
							<TitleText
								style={{
									color: currentTheme.onSurfaceVariant,
									marginBottom: 10,
								}}
							>
								From:
							</TitleText>
							<DateSelector
								currentTheme={currentTheme}
								selectedDate={fromDate}
								onDateChange={onSetFromDate}
								text={"From Date"}
							/>
						</View>
						<View>
							<TitleText
								style={{
									color: currentTheme.onSurfaceVariant,
									marginBottom: 10,
								}}
							>
								To:
							</TitleText>
							<DateSelector
								currentTheme={currentTheme}
								selectedDate={toDate}
								onDateChange={onSetToDate}
								text="To Date"
							/>
							{/* <LabelText style={{color: currentTheme.error, marginLeft: 12}}>Must be after From Date</LabelText> */}
						</View>
						<View style={styles.buttonRow}>
							<TextButton onButtonPress={onClearFilter}>
								Clear
							</TextButton>
							<TextButton
								onButtonPress={onFilterByDates}
								disabled={!dateFilterValid}
							>
								Filter
							</TextButton>
						</View>
					</View>
				)}
				{/* <View style={{ width: "100%" }}>
					<GestureFlatList // need to use the flatlist from react-native-gesture-handler in order to scroll inside the BottomSheet
						style={{ marginVertical: 5 }}
						horizontal={true}
						keyExtractor={(item) => Math.random()}
						data={exerciseFilterState}
						showsHorizontalScrollIndicator={false}
						renderItem={(itemData) => (
							<FilterChip
								onChipPress={() =>
									updateFilterState(itemData.item.exercise)
								}
								selected={itemData.item.selected}
							>
								{itemData.item.exercise}
							</FilterChip>
						)}
					/>
				</View> */}
				{/* <View
					style={{
						flexDirection: "row",
						width: "90%",
						justifyContent: "center",
					}}
				>
					<OutlineButton
						style={{ width: "40%", marginRight: 10 }}
						textStyle={{ color: currentTheme.onSurfaceVariant }}
						onButtonPress={queryForFilter}
					>
						Filter
					</OutlineButton>
					<TextButton
						textStyle={{ color: currentTheme.onSurfaceVariant }}
						onButtonPress={() => clearFilter()}
					>
						Clear
					</TextButton>
				</View> */}
			</View>
		</View>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			width: "100%",
			marginTop: 10,
			// backgroundColor: "red"
		},
		filterBoxContainer: {
			width: "100%",
			height: 200,
			alignItems: "center",
		},
		filterBoxContent: {
			// height: 300,
			flex: 1,
			paddingHorizontal: 24,
			// borderRadius: 12,
		},
		selectHeader: {
			// flex: 1,
			// backgroundColor: "red"
		},
		selectExerciseContainer: {
			marginTop: 20,
			flex: 1,
			flexDirection: "column",
			// paddingHorizontal: 24,
		},
		buttonRow: {
			flexDirection: "row",
			height: 100,
			justifyContent: "space-around",

		},
		errorText: { 
			marginTop: 10
		}
	});
};

export default FilterSelect;
