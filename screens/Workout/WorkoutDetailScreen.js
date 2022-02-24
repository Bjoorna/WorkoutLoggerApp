import React, {
	useState,
	useEffect,
	useLayoutEffect,
	useCallback,
} from "react";
import { View, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/core";
import { Themes } from "../../shared/Theme";
import { SET_TAB_BAR_VALUE } from "../../store/actions/appsettings";

const WorkoutDetailScreen = (props) => {
	const dispatch = useDispatch();
	const workoutID = props.route.params.workoutID;
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const workoutsRef = useSelector((state) => state.workout.workouts);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [workout, setWorkout] = useState();

	useEffect(() => {
		// console.log(props);
		// console.log(workoutID);
		// props.navigation.setOptions({
		//     tabBarStyle: {
		//         display: "none",
		//     }
		// });

		const onWorkout = workoutsRef.find(
			(workout) => workout.id == workoutID
		);
		setWorkout(onWorkout);
	}, []);

	useEffect(() => {
		setStyles(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	useEffect(() => {
		if (workout) {
			props.navigation.setOptions({
				title: new Date(workout.date.seconds * 1000).toDateString(),
			});
		}
	}, [workout]);

	useFocusEffect(
		useCallback(() => {
			console.log("IS OPENING SCREEN");
			const onCloseScreen = () => {
                console.log("IS CLOSING SCREEN");

				dispatch({
					type: SET_TAB_BAR_VALUE,
					value: false,
				});
			};
			return () => onCloseScreen();
		}, [props.navigation])
	);

	return <View style={styles.screen}></View>;
};

const getStyles = (theme) => {
	return StyleSheet.create({
		screen: {
			flex: 1,
			backgroundColor: theme.surfaceE5,
		},
	});
};

export default WorkoutDetailScreen;
