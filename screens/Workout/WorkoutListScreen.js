import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
// import { TestTheme as theme } from "..Theme/shared/Theme";
import { useDimensions } from "@react-native-community/hooks";
import * as firebase from "../../firebase/firebase";
import FabButton from "../../components/Buttons/Fab";
import { Themes } from "../../shared/Theme";
import OutlineButton from "../../components/Buttons/OutlineButton";
import { useSelector, useDispatch } from "react-redux";

import { Timestamp } from "firebase/firestore";
import Workout from "../../models/workout";
import * as WorkoutActions from '../../store/actions/workout';
const theme = Themes.dark;

const WorkoutListScreen = (props) => {
	const { width, height } = useDimensions().window;
	const dispatch = useDispatch();

	const userID = useSelector((state) => state.auth.userID);
	const reduxWorkoutRef = useSelector((state) => state.workout.workouts);
	const [workouts, setWorkouts] = useState([]);

	const getUserWorkoutsFromServer = async () => {
		const serverWorkouts = await firebase.getUserWorkouts(userID);
		const toWorkout = serverWorkouts.map(
			(serverWO) =>
				new Workout(
					serverWO.exercises,
					serverWO.date,
					serverWO.complete,
					serverWO.note,
					serverWO.owner
				)
		);
		// console.log(serverWorkouts);
		setWorkouts(toWorkout);
	};

	const testGetWorkout = async() =>{
		console.log(userID);
		let now = Date.now();
		console.log(now);
		dispatch(WorkoutActions.getUserWorkouts(userID));
		let then = Date.now();c
		console.log(then);
	}

	const printDate = () => {
		if(workouts.length > 0){
			const testwo = workouts[0];
			console.log(testwo.date);
			const newDate = new Date(testwo.date.seconds * 1000);
			console.log(newDate);
	
		}
	};

	useEffect(() => {
		// console.log(reduxWorkoutRef);
		console.log("Page Loaded");
		setWorkouts(reduxWorkoutRef);

	}, [reduxWorkoutRef]);

	// load workouts on page open
	useEffect(() => {
		console.log("Page is Loading");
		dispatch(WorkoutActions.getUserWorkouts(userID));
	}, [])
	return (
		<View style={styles.container}>
			<FabButton
				onButtonPress={() => props.navigation.navigate("AddWorkout")}
				iconName="add"
				style={{
					...styles.fabButtonPlacement,
					left: width - 200,
					top: height - 250,
				}}
			>
				New Workout
			</FabButton>

				<View style={styles.contentView}>
					<OutlineButton onButtonPress={printDate}>
						Print Time
					</OutlineButton>
					<OutlineButton onButtonPress={testGetWorkout}>
						Redux
					</OutlineButton>

				</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.surface,
	},
	scrollView: {
	},
	contentView: {
		flex: 1,
		alignItems: "center",
		marginTop: 40,
	},
	cardView: {
		flex: 1,
		alignItems: "center",
	},
	cardStyle: {
		backgroundColor: theme.primary,
	},
	testText: {
		color: theme.onPrimary,
	},
	cardWithBorder: {
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: theme.outline,
	},

	fabButtonPlacement: {
		position: "absolute",
		// top: "90%"
		// , right: 100,
		zIndex: 1000,
	},
});

export default WorkoutListScreen;
