import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
// import { TestTheme as theme } from "..Theme/shared/Theme";
import { useDimensions } from "@react-native-community/hooks";
import * as firebase from "../../firebase/firebase";
import FabButton from "../../components/Buttons/Fab";
import { Themes } from "../../shared/Theme";
import OutlineButton from "../../components/Buttons/OutlineButton";
import BodyText from "../../components/Text/Body";
import { useSelector, useDispatch } from "react-redux";

import { Timestamp } from "firebase/firestore";
import Workout from "../../models/workout";
import * as WorkoutActions from "../../store/actions/workout";
import WorkoutListItem from "../../components/WorkoutListItem";
const theme = Themes.dark;

const TestWorkoutView = (props) => {
	return (
		<View style={{ width: "100%", height: 100}}>
			<BodyText style={{ color: theme.primary  }}>
				{props.workout.id}
			</BodyText>
		</View>
	);
};

const WorkoutListScreen = (props) => {
	const { width, height } = useDimensions().window;
	const dispatch = useDispatch();

	const userID = useSelector((state) => state.auth.userID);
	const reduxWorkoutRef = useSelector((state) => state.workout.workouts);
	const [workouts, setWorkouts] = useState([]);

	// const getUserWorkoutsFromServer = async () => {
	// 	const serverWorkouts = await firebase.getUserWorkouts(userID);
	// 	const toWorkout = serverWorkouts.map(
	// 		(serverWO) =>
	// 			new Workout(
	// 				serverWO.exercises,
	// 				serverWO.date,
	// 				serverWO.complete,
	// 				serverWO.note,
	// 				serverWO.owner
	// 			)
	// 	);
	// 	// console.log(serverWorkouts);
	// 	setWorkouts(toWorkout);
	// };

	// const testGetWorkout = async () => {
	// 	console.log(userID);
	// 	let now = Date.now();
	// 	console.log(now);
	// 	dispatch(WorkoutActions.getUserWorkouts(userID));
	// 	let then = Date.now();
	// 	console.log(then);
	// };

	const printDate = () => {
		if (workouts.length > 0) {
			const testwo = workouts[0];
			console.log(testwo.date);
			const newDate = new Date(testwo.date.seconds * 1000);
			console.log(newDate);
		}
	};

	useEffect(() => {
		// console.log(reduxWorkoutRef);
		console.log("Page Loaded");
		const newArray = [...reduxWorkoutRef];
		setWorkouts(newArray);
	}, [reduxWorkoutRef]);

	// load workouts on page open
	useEffect(() => {
		console.log("Page is Loading");
		dispatch(WorkoutActions.getUserWorkouts(userID));
	}, []);
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
				<FlatList
					style={styles.flatListStyle}
					data={workouts}
					keyExtractor={(item) => item.id}
					renderItem={(itemData) => (
						<WorkoutListItem userID={userID} workout={itemData.item} />
					)}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.surface,
	},
	contentView: {
		width: "100%",
		height: 300,
		alignItems: "center",
		// justifyContent: "center",
		marginTop: 40,
		
	},
	flatListStyle: {
		width: "90%",
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
