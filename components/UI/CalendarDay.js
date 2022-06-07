import React, { useState, useEffect } from "react";

import { View, StyleSheet, Pressable } from "react-native";
import { useSelector } from "react-redux";

import BodyText from "../Text/Body";
import LabelText from "../Text/Label";

import { Themes } from "../../shared/Theme";

import * as firebase from "../../firebase/firebase";

const CalendarDay = ({ day }) => {
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const userID = useSelector((state) => state.auth.userID);

	const [hasWorkout, setHasWorkout] = useState(false);
	const [workoutOnDay, setWorkoutOnDay] = useState([]);

	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	useEffect(() => {
		const checkIfDayHasWorkout = async (day, dayStart, dayEnd) => {
			if (userID && day) {
				const findWorkouts = await firebase.getWorkoutOnDay(
					userID,
					dayStart,
					dayEnd
				);
				if (findWorkouts) {
					const workouts = [];
					findWorkouts.forEach((doc) => {
						console.log(day.date);
						console.log(doc.data());
						workouts.push(doc.data());
					});
					setWorkoutOnDay(workouts);
					setHasWorkout(true);
				}
			} else if (!day) {
				console.log("NoDay");
			}
		};
		if (day) {
			let nextDay = new Date(day.date);
			nextDay.setUTCHours(23);
			// console.log("NextDay: ");
			// console.log(nextDay);
			const dayStart = firebase.createTimeStampFromDate(day.date);
			const dayEnd = firebase.createTimeStampFromDate(nextDay);
			// console.log(lowLimit);
			// console.log(highLimit);
			// const hasWorkout = await checkIfDayHasWorkout(day, dayStart, dayEnd);

			// if(hasWorkout){
			// 	hasWorkout.forEach(doc=> {
			// 		console.log(doc.data());
			// 	});
			// 	setHasWorkout(true);
			// }

			checkIfDayHasWorkout(day, dayStart, dayEnd);
		}
	}, [day]);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	const onDayPress = async () => {
		if (hasWorkout) {
		}
	};

	// const checkIfDayHasWorkout = async (onDay, dayStart, dayEnd) => {
	// 	if(userID && day){
	// 		console.log(userID);
	// 		return firebase.getWorkoutOnDay(userID, dayStart, dayEnd);
	// 	}else if(!day){
	// 		console.log("NoDay");
	// 	}
	// };

	if (day) {
		return (
			<Pressable
				onPress={onDayPress}
				style={
					hasWorkout
						? styles.calendarItemDayHasWorkout
						: styles.calendarItemDay
				}
			>
				{hasWorkout && workoutOnDay.length > 1 && (
					<View style={styles.multipleBadge}>
						<LabelText
							style={{ color: currentTheme.onTertiary }}
							large={false}
						>
							{workoutOnDay.length}
						</LabelText>
					</View>
				)}
				<BodyText
					large={false}
					style={
						hasWorkout
							? {
									color: currentTheme.onSecondaryContainer,
							  }
							: { color: currentTheme.onSurfaceVariant }
					}
				>
					{day.dayOfMonth}
				</BodyText>
			</Pressable>
		);
	} else {
		return (
			<View style={styles.calendarItemDay}>
				<BodyText
					large={false}
					style={{
						color: currentTheme.onSurfaceVariant,
					}}
				></BodyText>
			</View>
		);
	}
};

const getStyles = (theme) => {
	return StyleSheet.create({
		calendarItemDay: {
			// backgroundColor: theme.tertiaryContainer,
			justifyContent: "center",
			alignItems: "center",
			borderRadius: 16,
			width: 40,
		},
		calendarItemDayHasWorkout: {
			borderRadius: 16,
			width: 40,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: theme.secondaryContainer,
		},
		multipleBadge: {
			position: "absolute",
			left: 30,
			bottom: 30,

			height: 16,
			width: 16,
			justifyContent: "center",
			alignItems: "center",
			borderRadius: 8,
			backgroundColor: theme.tertiary,
		},
	});
};

export default CalendarDay;
