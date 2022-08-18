import React, { useEffect, useState } from "react";
import {
	Pressable,
	StyleSheet,
	View,
	ActivityIndicator,
	Vibration,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import BodyText from "./Text/Body";
import { Themes } from "../shared/Theme";
import * as firebase from "../firebase/firebase";
import Exercise from "../models/Exercise";
import LabelText from "./Text/Label";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/core";
import { getExercisesInWorkout } from "../redux/slices/workoutSlice";
import {
	setHideTabBar,
	setUseDarkMode,
} from "../redux/slices/appSettingsSlice";
import { nanoid } from "@reduxjs/toolkit";
import TitleText from "./Text/Title";
import {
	calculateAverageIntensity,
	convertKiloToPound,
	findTopSetInExercise,
	getIntensity,
} from "../shared/utils/UtilFunctions";
// const theme = Themes.dark;

const ExerciseItem = ({ exercise, currentTheme }) => {
	const isMetric = useSelector((state) => state.user.user.useMetric);
	// const [currentTheme, setCurrentTheme] = useState(currentTheme);
	const [exerciseStyles, setExerciseStyles] = useState(
		getExerciseStyles(currentTheme)
	);

	const [topSet, setTopSet] = useState({ weight: 0 });
	const [avgIntensity, setAvgIntensity] = useState(0);
	// const currentTheme = props.ocurrentTheme;

	useEffect(() => {
		setTopSet(findTopSetInExercise(exercise.sets));
		setAvgIntensity(calculateAverageIntensity(exercise.sets));
	}, [exercise]);

	useEffect(() => {
		setExerciseStyles(getExerciseStyles(currentTheme));
	}, [currentTheme]);

	return (
		<View style={exerciseStyles.exerciseItem}>
			<View style={{ alignItems: "flex-start", marginBottom: 6 }}>
				<BodyText
					style={{
						color: currentTheme.onSurface,
						height: 20,
						overflow: "hidden",
					}}
					large={true}
				>
					{exercise.exerciseName}
				</BodyText>
			</View>
			<View style={{ alignItems: "flex-start", marginBottom: 6 }}>
				<LabelText style={{ color: currentTheme.onSurfaceVariant }}>
					Top set
				</LabelText>
				{isMetric && (
					<BodyText
						large={true}
						style={{ color: currentTheme.onSurface }}
					>
						{topSet.weight}kg * {topSet.reps}reps
					</BodyText>
				)}
				{!isMetric && (
					<BodyText
						large={true}
						style={{ color: currentTheme.onSurface }}
					>
						{Math.round(convertKiloToPound(topSet.weight))}lbs *{" "}
						{topSet.reps}reps
					</BodyText>
				)}
			</View>
			<View style={{ alignItems: "flex-start" }}>
				<LabelText style={{ color: currentTheme.onSurfaceVariant }}>
					Avg intensity
				</LabelText>
				<BodyText
					large={true}
					style={{ color: currentTheme.onSurface }}
				>
					{Math.round(avgIntensity)}%
				</BodyText>
			</View>
		</View>
	);
};

const getExerciseStyles = (theme) => {
	return StyleSheet.create({
		exerciseItem: {
			minWidth: 100,
			marginRight: 12,
			flexDirection: "column",
			justifyContent: "flex-start",
			marginBottom: 12,
		},
		exerciseValues: {
			alignItems: "flex-start",
		},
	});
};

const WorkoutListItem = ({ workoutID, userID }) => {
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const workout = useSelector((state) => state.workout.workouts[workoutID]);
	const exercisesInStore = useSelector((state) => state.workout.exercises);

	const [exercises, setExercises] = useState([]);

	const [dateObject, setDateObject] = useState(
		workout ? new Date(workout.date) : new Date()
	);

	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);

	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	// fetch exercises
	useEffect(() => {
		if (workout) {
			const requestPayload = {
				userID: userID,
				exerciseIDs: workout.exercises,
			};
			dispatch(getExercisesInWorkout(requestPayload));
		} else {
			setDateObject(new Date());
		}
	}, [workout]);

	// when store is updated, get the exercises from store
	useEffect(() => {
		if (workout) {
			const updatedArrayOfExercises = [];
			// inefficient ?????
			for (let exerciseID of workout.exercises) {
				if (exercisesInStore[exerciseID]) {
					updatedArrayOfExercises.push(exercisesInStore[exerciseID]);
				}
			}

			setExercises(updatedArrayOfExercises);
		}
	}, [exercisesInStore]);

	const navigateToDetailPage = () => {
		// hide TabBar
		dispatch(setHideTabBar(true));
		navigation.navigate("WorkoutDetail", { workoutID: workout.id });
	};

	return (
		<View style={styles.workoutItemContainer}>
			<Pressable
				style={styles.pressableView}
				onPress={navigateToDetailPage}
				android_ripple={{ color: currentTheme.onSurface }}
				unstable_pressDelay={75}
			>
				<View style={styles.workoutItemLayout}>
					<View style={styles.workoutItemHeader}>
						<BodyText
							large={true}
							style={{ color: currentTheme.onSurface }}
						>
							Weightlifting
						</BodyText>
						<LabelText
							style={{ color: currentTheme.onSurfaceVariant }}
						>
							{dateObject.getUTCDate()}/
							{dateObject.getUTCMonth() + 1}/
							{dateObject.getUTCFullYear()}
						</LabelText>
					</View>
					<View style={styles.workoutItemExerciseContainer}>
						<FlatList
							keyExtractor={(item) => item.id}
							horizontal={false}
							numColumns={3}
							data={exercises}
							renderItem={(itemData) => (
								<ExerciseItem
									currentTheme={currentTheme}
									exercise={itemData.item}
								/>
							)}
						/>
					</View>
				</View>
			</Pressable>
		</View>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		workoutItemContainer: {
			width: "100%",
			alignSelf: "center",
			minHeight: 150,
			// borderRadius: 12,
			// overflow: "hidden",
			// borderColor: theme.outline,
			// borderStyle: "solid",
			// borderWidth: 1,
			// marginVertical: 5,
		},
		pressableView: {
			flex: 1,
			// width: "100%",
			// minHeight: 100,
			// height: "100%"
			paddingVertical: 18,
			// marginBottom: 12,
			paddingHorizontal: 24,
		},
		workoutItemLayout: {
			flex: 1,
			paddingHorizontal: 10,
		},
		workoutItemHeader: {
			flexDirection: "column",
			width: "100%",
			// height: 20,
			alignItems: "flex-start",
			marginBottom: 6,
		},
		workoutItemExerciseContainer: {
			flexDirection: "row",
		},
	});
};

export default WorkoutListItem;
