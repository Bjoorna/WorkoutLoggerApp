import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View, ActivityIndicator, ProgressViewIOSComponent } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import BodyText from "./Text/Body";
import { Themes } from "../shared/Theme";
import * as firebase from "../firebase/firebase";
import Exercise from "../models/Exercise";
import LabelText from "./Text/Label";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/core";
import { SET_TAB_BAR_VALUE } from "../store/actions/appsettings";
// const theme = Themes.dark;

const ExerciseItem = (props) => {
	const exercise = props.exercise;
	const [currentTheme, setCurrentTheme] = useState(props.currentTheme);
	const [exerciseStyles, setExerciseStyles] = useState(getExerciseStyles(currentTheme)); 
	// const currentTheme = props.ocurrentTheme;

	useEffect(() => {
		setCurrentTheme(props.currentTheme);
	}, [props])
	
	useEffect(() => {
		setExerciseStyles(getExerciseStyles(currentTheme));
	},[currentTheme])
	return (
		<View style={exerciseStyles.exerciseItem}>
			
			<View style={exerciseStyles.exerciseValues}>
			<BodyText style={{ color: currentTheme.onSecondaryContainer ,height: 20, overflow: "hidden" }}>
				{exercise.exercise}
			</BodyText>
				<LabelText style={{ color: currentTheme.onSecondaryContainer }}>
					{exercise.weight} kg
				</LabelText>
				<LabelText style={{ color: currentTheme.onSecondaryContainer }}>
					{exercise.reps} reps
				</LabelText>
				<LabelText style={{ color: currentTheme.onSecondaryContainer }}>
					{exercise.sets} sets
				</LabelText>
				<LabelText style={{ color: currentTheme.onSecondaryContainer }}>
					{exercise.rpe} RPE
				</LabelText>
			</View>
		</View>
	);
};

const getExerciseStyles = theme => {
	return StyleSheet.create({
		exerciseItem: {
			width: 100,
			height: 100,
			borderRadius: 5,
			padding: 5,
			backgroundColor: theme.secondaryContainer,
			marginHorizontal: 3,
		},
		exerciseValues: {
			alignItems: "center",
			paddingHorizontal: 4
		}
	});
}

// const exerciseStyles = StyleSheet.create({
// 	exerciseItem: {
// 		width: 100,
// 		height: 100,
// 		borderRadius: 5,
// 		padding: 5,
// 		backgroundColor: theme.secondaryContainer,
// 		marginHorizontal: 3,
// 	},
// 	exerciseValues: {
// 		alignItems: "center",
// 		paddingHorizontal: 4
// 	}
// });

const WorkoutListItem = (props) => {
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const [exercises, setExercises] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

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

	const date = new Date(props.workout.date.seconds * 1000);

	const getExercises = async () => {
		setIsLoading(true);
		const test = await firebase.getExercisesInWorkout(
			props.workout.exercises,
			props.userID
		);

		setIsLoading(false);
		return test;
	};

	useEffect(() => {
		const fetchExercises = async () => {
			const exercisesQuery = await getExercises();
			const exercisesArray = [];
			exercisesQuery.forEach((query) => {
				const data = query.data();
				const newExercise = new Exercise(
					data.exercise,
					data.weight,
					data.reps,
					data.sets,
					data.rpe,
					data.date,
					data.owner,
					query.id
				);
				exercisesArray.push(newExercise);
			});
			setExercises(exercisesArray);
		};

		fetchExercises();
	}, [props.workout]);

	const navigateToDetailPage = () => {
		// hide TabBar
		dispatch({type: SET_TAB_BAR_VALUE, value: true});
		navigation.navigate("WorkoutDetail", {workoutID: props.workout.id});
	} ;

	return (
		<View style={styles.workoutItemContainer}>
			<Pressable
				style={styles.pressableView}
				onPress={navigateToDetailPage}
			>
				<View style={styles.workoutItemLayout}>
					<View style={styles.workoutItemHeader}>
						<LabelText style={{ color: currentTheme.secondary }}>
							{date.toDateString()}
							{/* {date.toISOString()} */}
						</LabelText>
					</View>
					<View style={styles.workoutItemExerciseContainer}>
						{isLoading && (
							<View>
								<ActivityIndicator
									size="small"
									color={currentTheme.primary}
								/>
							</View>
						)}
						{!isLoading && (
							<FlatList
								keyExtractor={(item) => Math.random()} // TODO other method of generating id
								horizontal={true}
								data={exercises}
								renderItem={(itemData) => (
									<ExerciseItem currentTheme={currentTheme} exercise={itemData.item} />
								)}
							/>
						)}
					</View>
				</View>
			</Pressable>
		</View>
	);
};

const getStyles = theme => {
	return StyleSheet.create({
		workoutItemContainer: {
			width: "90%",
			alignSelf: "center",
			minHeight: 130,
			borderRadius: 12,
			overflow: "hidden",
			borderColor: theme.outline,
			borderStyle: "solid",
			borderWidth: 1,
			marginVertical: 5,
		},
		pressableView: {
			flex: 1,
			// width: "100%",
			// minHeight: 100,
			// height: "100%"
		},
		workoutItemLayout: {
			flex: 1,
			paddingHorizontal: 10,
		},
		workoutItemHeader: {
			width: "100%",
			height: 20,
			alignItems: "flex-end",
		},
		workoutItemExerciseContainer: {},
	});
}


export default WorkoutListItem;
