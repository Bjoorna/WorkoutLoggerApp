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
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/Buttons/CustomHeaderButton";
import * as firebase from "../../firebase/firebase";
import BodyText from "../../components/Text/Body";

const WorkoutDetailScreen = (props) => {
	const dispatch = useDispatch();
	const workoutID = props.route.params.workoutID;
	const userID = useSelector((state) => state.auth.userID);
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const workoutsRef = useSelector((state) => state.workout.workouts);
	const exercisesRef = useSelector((state) => state.workout.exercisesObject)
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [workout, setWorkout] = useState();

	useEffect(() => {
		const onWorkout = workoutsRef.find(
			(workout) => workout.id == workoutID
		);
		setWorkout(onWorkout);
	}, []);

	useEffect(() => {
		setStyles(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	// REAL
	useLayoutEffect(() => {
		if (workout) {
			props.navigation.setOptions({
				headerRight: () => (
					<View style={{ flexDirection: "row" }}>
						<HeaderButtons
							HeaderButtonComponent={CustomHeaderButton}
						>
							<Item
								title="delete"
								iconName="delete"
								onPress={deleteWorkout}
							/>
						</HeaderButtons>
					</View>
				),

				title: new Date(workout.date.seconds * 1000).toDateString(),
			});
		}

		// BandAid to fix react rendering without the stylesheet on changes
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
	}, [props.navigation, workout]);

	// UNREAL
	// useLayoutEffect(() => {
	// 	// props.navigation.setOptions({
	// 	// 	headerRight: () => (
	// 	// 		<View style={{ flexDirection: "row" }}>
	// 	// 			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
	// 	// 				<Item
	// 	// 					title="delete"
	// 	// 					iconName="delete"
	// 	// 					onPress={deleteWorkout}
	// 	// 				/>
	// 	// 			</HeaderButtons>
	// 	// 		</View>
	// 	// 	),

	// 	// 	title: "TEst",
	// 	// });
	// }, [props.navigation]);

	const deleteWorkout = async () => {
		if (workout) {
			console.log(workout);
			await firebase.deleteWorkout(userID, workout);
			console.log("workout and exercises deleted");
		}
	};

	useFocusEffect(
		useCallback(() => {
			// console.log("IS OPENING SCREEN");
			const onCloseScreen = () => {
				// console.log("IS CLOSING SCREEN");

				dispatch({
					type: SET_TAB_BAR_VALUE,
					value: false,
				});
			};
			return () => onCloseScreen();
		}, [props.navigation])
	);
	return (
		<View style={styles.screen}>
			<View style={styles.contentView}>
				<View style={styles.overview}>
					<BodyText>HELLO</BodyText>
				</View>
			</View>
		</View>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		screen: {
			flex: 1,
		},
		contentView: {
			width: "100%",
			alignItems: "center",
		},
		overview: {
			height: 200,
			width: "90%",
		},
	});
};

export default WorkoutDetailScreen;
