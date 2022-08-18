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

import BottomSheet, {
	BottomSheetFlatList,
	BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import SelectExerciseListItem from "./UI/SelectExerciseListItem";
import {
	getExercisesByType,
	getExercisesByTypeForList,
	getExerciseTypes,
	getWorkoutsBasedOnDateInterval,
} from "../redux/slices/workoutSlice";
import DateSelector from "./UI/DateSelector";

import { isBefore, addMonths } from "date-fns";
import LabelText from "./Text/Label";
import BodyText from "./Text/Body";
import FilterChip from "./UI/Chips/FilterChip";

const AnalysisScreenFilter = ({
	exerciseTypesAvaliable,
	onSetStat,
	currentStat,
}) => {
	const dispatch = useDispatch();
	const exerciseTypesDisplay = useSelector(
		(state) => state.workout.exerciseTypesDisplay
	);
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	const [exercisesToFilterBy, setExercisesToFilterBy] = useState([
		"Deadlift",
	]);

	const [exerciseTypesList, setExerciseTypesList] = useState([]);

	const [filterSegments, setFilterSegments] = useState([
		{ text: "Exercise", selected: true },
		{ text: "Dates", selected: false },
		{ text: "Stat", selected: false },
	]);
	const [activeFilterSegment, setActiveFilterSegment] = useState(
		filterSegments.find((segment) => segment.selected === true)
	);

	useEffect(() => {
		console.log(currentStat);
	}, [currentStat]);

	useEffect(() => {
		setExerciseTypesList([...exerciseTypesDisplay]);
	}, [exerciseTypesDisplay]);

	useEffect(() => {
		setActiveFilterSegment(
			filterSegments.find((segment) => segment.selected === true)
		);
	}, [filterSegments]);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	useEffect(() => {
		const exerciseToFilterBy = exercisesToFilterBy[0];
		if (exerciseToFilterBy) {
			dispatch(
				getExercisesByType({
					exerciseTypes: exercisesToFilterBy,
					sortType: "asc",
				})
			);
		}
	}, [exercisesToFilterBy]);

	const addExerciseToFilter = (exercise) => {
		setExercisesToFilterBy([exercise]);
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

	const onSetStatToShow = (stat) => {
		// console.log(stat);
		onSetStat(stat)
	};

	return (
		<View style={styles.filterContainer}>
			<View style={styles.filterHeader}>
				<SegmentedButton
					onPress={onSegmentPress}
					multiSelect={false}
					segments={filterSegments}
				/>
			</View>
			<View style={styles.content}>
				{activeFilterSegment.text === filterSegments[0].text && (
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
						{/* {exercisesToFilterBy.length > 10 && (
						<View style={styles.errorText}>
							<BodyText
								large={true}
								style={{ color: currentTheme.error }}
							>
								Max 10 selected exercises in filter
							</BodyText>
						</View>
					)} */}
					</View>
				)}
				{activeFilterSegment.text === filterSegments[1].text && (
					<View style={styles.selectDatesContainer}>
						<View>
							<LabelText
								large={true}
								style={{ color: currentTheme.onSurface }}
							>
								Optional
							</LabelText>
						</View>
						<View></View>
					</View>
				)}
				{activeFilterSegment.text === filterSegments[2].text && (
					<View style={styles.selectDatesContainer}>
						<View>
							<LabelText
								large={true}
								style={{ color: currentTheme.onSurface }}
							>
								Optional
							</LabelText>
						</View>
						<View>
							<BodyText
								large={true}
								style={{ color: currentTheme.onSurface }}
							>
								Stat to show
							</BodyText>
							<View style={{ flexDirection: "row" }}>
								<FilterChip
									selected={currentStat === "e1RM"}
									onPress={() => onSetStatToShow("e1RM")}
									text="e1RM"
								/>
								<FilterChip
									selected={currentStat === "Top set"}
									onPress={() => onSetStatToShow("Top set")}
									text="Top set"
								/>
								<FilterChip
									selected={currentStat === "Avg Int"}
									onPress={() => onSetStatToShow("Avg Int")}
									text="Avg Int"
								/>
							</View>
						</View>
					</View>
				)}
			</View>
			<View style={styles.buttonRow}>
				<TextButton
				// onButtonPress={onClearFilter}
				>
					Clear
				</TextButton>
				<TextButton
					// onButtonPress={onSubmitFilter}
					disabled={
						exercisesToFilterBy.length < 1 ||
						exercisesToFilterBy.length > 10
					}
				>
					Filter
				</TextButton>
			</View>
		</View>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		filterContainer: {
			flex: 1,
			backgroundColor: theme.surface,
			paddingHorizontal: 24,
		},
		filterHeader: {
			marginVertical: 12,
		},
		content: { flex: 1 },
		selectExerciseContainer: {
			marginTop: 20,
			width: "100%",
			height: 500,
			flexDirection: "column",

			// paddingHorizontal: 24,
		},
		selectDatesContainer: {
			marginTop: 20,
			width: "100%",
			height: 500,
			flexDirection: "column",
		},
		errorText: {
			marginTop: 10,
		},
		buttonRow: {
			flexDirection: "row",
			height: 100,
			justifyContent: "space-around",
		},
	});
};

export default AnalysisScreenFilter;
