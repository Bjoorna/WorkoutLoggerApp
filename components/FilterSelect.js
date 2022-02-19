import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { FlatList as GestureFlatList } from "react-native-gesture-handler";

import * as WorkoutActions from "../store/actions/workout";

import TitleText from "./Text/Title";
import OutlineButton from "./Buttons/OutlineButton";
import TextButton from "./Buttons/TextButton";
import FilterChip from "./UI/Chips/FilterChip";
import { Themes } from "../shared/Theme";
const theme = Themes.dark;

import { ExerciseTypes } from "../shared/utils/ExerciseTypes";

const FilterSelect = (props) => {
	const userID = useSelector((state) => state.auth.userID);
	const dispatch = useDispatch();
	const [exerciseTypes, setExerciseTypes] = useState([]);

	const [exerciseFilterState, setExerciseFilterState] = useState([]);

	useEffect(() => {
		createExerciseTypeArray();
		// initFilterState();
	}, []);

	useEffect(() => {
        initFilterState();
    }, [exerciseTypes]);

	useEffect(() => {
	}, [exerciseFilterState]);

	const updateFilterState = (exercise) => {
		const newState = [...exerciseFilterState];
		const findEx = newState.find(
			(arrayItem) => arrayItem.exercise == exercise
		);
		if (!findEx) {
			return;
		}
		findEx.selected = !findEx.selected;
		setExerciseFilterState(newState);
	};

	const queryForFilter = async () => {
		const exerciseFilter = exerciseFilterState
			.filter((ex) => ex.selected == true)
			.map((ex) => ex.exercise);
		try {
			if (exerciseFilter.length < 1) {
				dispatch(WorkoutActions.getUserWorkouts(userID));
			} else {
				dispatch(
					WorkoutActions.getWorkoutFilteredByExerciseType(
						userID,
						exerciseFilter
					)
				);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const clearFilter = () => {
		const newValues = [...exerciseFilterState];
		newValues.forEach((element) => {
			element.selected = false;
		});
		setExerciseFilterState(newValues);
	};

	const createExerciseTypeArray = async () => {
		let finalArray = [];
		for (let eData of ExerciseTypes) {
			finalArray = finalArray.concat(eData.data);
		}
		setExerciseTypes(finalArray);
	};

	const initFilterState = async () => {
		const newFilterState = [];
		for (const ex of exerciseTypes) {
			const exerciseState = { exercise: ex, selected: false };
			newFilterState.push(exerciseState);
		}
		setExerciseFilterState(newFilterState);
	};

	return (
		<View style={styles.container}>
			<View style={styles.filterBoxContent}>
				<View style={styles.header}>
					<TitleText style={{ color: theme.onSurfaceVariant }}>
						Filter by exercise
					</TitleText>
				</View>
				<View style={{ width: "100%" }}>
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
				</View>
				<View
					style={{
						flexDirection: "row",
						width: "90%",
						justifyContent: "center",
					}}
				>
					<OutlineButton
						style={{ width: "40%", marginRight: 10 }}
						onButtonPress={queryForFilter}
					>
						Filter
					</OutlineButton>
					<TextButton onButtonPress={() => clearFilter()}>
						Clear
					</TextButton>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	filterBoxContainer: {
		width: "100%",
		height: 200,
		alignItems: "center",
	},
	filterBoxContent: {
		height: "90%",
		padding: 20,
		borderRadius: 12,
	},
});

export default FilterSelect;
