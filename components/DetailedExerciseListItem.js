import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import BodyText from "./Text/Body";
import { Themes } from "../shared/Theme";
import { nanoid } from "@reduxjs/toolkit";
import LabelText from "./Text/Label";
import {
	calculateAverageIntensity,
	calculateE1RM,
	convertKiloToPound,
	findTopSetInExercise,
} from "../shared/utils/UtilFunctions";
import TitleText from "./Text/Title";

const DetailedExerciseListItem = ({ exerciseID }) => {
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const reduxExercisesRef = useSelector((state) => state.workout.exercises);
	const isMetric = useSelector((state) => state.user.user.useMetric);

	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	const [exercise, setExercise] = useState(reduxExercisesRef[exerciseID]);

	const [setDisplay, setSetDisplay] = useState([]);
	const [avgInt, setAvgInt] = useState(-1);
	const [topSet, setTopSet] = useState(null);
	const [e1RM, sete1RM] = useState(-1);
	const [tonnage, setTonnage] = useState(-1);
	const [isPR, setIsPR] = useState(false);
	const [numberOfReps, setNumberOfReps] = useState(0);

	useEffect(() => {}, [exerciseID]);

	useEffect(() => {
		if (exercise) {
			prepareSetsDisplay();
			setAvgInt(calculateAverageIntensity(exercise.sets));
			setTopSet(findTopSetInExercise(exercise.sets));
			findTrend();
			getNumberOfReps();
			calcTonnage();
		} else {
			console.log("NO Exercise");
		}
	}, [exercise]);

	useEffect(() => {
		// console.log(topSet);
		if (topSet) {
			sete1RM(calculateE1RM(topSet));
		}
		// 	if (topSet.reps) {
		// 		sete1RM(calculateE1RM(topSet));
		// 	}
	}, [topSet]);

	const prepareSetsDisplay = () => {
		const newSetView = [];
		for (const [setNumber, setData] of Object.entries(exercise.sets)) {
			const onSet = [];
			onSet.push(setNumber);
			const eValues = [];
			eValues.push(setData.weight);
			eValues.push(setData.reps);
			eValues.push(setData.rpe);
			onSet.push(eValues);
			newSetView.push(onSet);
		}
		setSetDisplay(newSetView);
	};

	const prepareStatsDisplay = () => {};

	const findTrend = () => {
		const allExercises = Object.values(reduxExercisesRef);
		const sameAsExercise = allExercises.filter(
			(ex) => ex.exerciseName === exercise.exerciseName
		);
		const sortByDate = sameAsExercise.sort((a, b) => a.date + b.date);
		const removeFutureExercises = sortByDate.filter(
			(ex) => ex.date < exercise.date
		);
		for (let test of removeFutureExercises) {
		}
	};

	const getNumberOfReps = () => {
		let repAmount = 0;
		const sets = Object.values(exercise.sets);
		for (let set of sets) {
			repAmount += set.reps;
		}
		setNumberOfReps(repAmount);
	};

	const calcTonnage = () => {
		let totalTonnage = 0;
		const sets = Object.values(exercise.sets);
		for (let set of sets) {
			const repWeight = set.weight;
			const repReps = set.reps;
			totalTonnage += repWeight * repReps;
		}
		setTonnage(totalTonnage);
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<BodyText style={{ color: currentTheme.onSurface }}>
					{exercise.exerciseName}
				</BodyText>
			</View>
			<View style={styles.contentContainer}>
				<View style={styles.setDisplay}>
					{setDisplay.map((set) => {
						const setData = set;
						const displayWeight = isMetric
							? setData[1][0]
							: Math.round(convertKiloToPound(setData[1][0]));
						return (
							<View key={nanoid()} style={styles.setItem}>
								<LabelText
									style={{
										color: currentTheme.onSurfaceVariant,
									}}
									large={false}
								>
									Set {setData[0]}:{" "}
								</LabelText>
								<BodyText
									style={{
										color: currentTheme.onSurface,
									}}
									large={true}
								>
									{displayWeight} {isMetric ? "kg" : "lbs"} *
								</BodyText>
								<BodyText
									style={{
										color: currentTheme.onSurface,
									}}
									large={true}
								>
									{" "}
									{setData[1][1]}reps{" "}
								</BodyText>
								<BodyText
									style={{
										color: currentTheme.onSurface,
									}}
									large={true}
								>
									@{setData[1][2]}
								</BodyText>
							</View>
						);
					})}
				</View>
				<View style={styles.exerciseStats}>
					<View style={styles.statItem}>
						<LabelText
							style={{ color: currentTheme.onSurfaceVariant }}
						>
							Avg. Int.
						</LabelText>
						<BodyText
							style={{
								color: currentTheme.onSurface,
							}}
							large={true}
						>
							{Math.round(avgInt)}%
						</BodyText>
					</View>
					<View style={styles.statItem}>
						<LabelText
							style={{ color: currentTheme.onSurfaceVariant }}
						>
							e1RM
						</LabelText>
						<BodyText
							style={{
								color: currentTheme.onSurface,
							}}
							large={true}
						>
							{Math.round(e1RM)}kg
						</BodyText>
					</View>
					<View style={styles.statItem}>
						<LabelText
							style={{ color: currentTheme.onSurfaceVariant }}
						>
							Reps
						</LabelText>
						<BodyText
							style={{
								color: currentTheme.onSurface,
							}}
							large={true}
						>
							{numberOfReps}
						</BodyText>
					</View>
					<View style={styles.statItem}>
						<LabelText
							style={{ color: currentTheme.onSurfaceVariant }}
						>
							Tonnage
						</LabelText>
						<BodyText
							style={{
								color: currentTheme.onSurface,
							}}
							large={true}
						>
							{tonnage}kg
						</BodyText>
					</View>
				</View>
			</View>
			{isPR && (
				<View style={styles.prBox}>
					<TitleText style={{ color: currentTheme.onTertiary }}>
						{topSet != null ? topSet.reps : "NaN"}rep PR for{" "}
						{exercise.exerciseName}
					</TitleText>
				</View>
			)}
		</View>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		container: {
			minHeight: 150,
			width: "100%",
			paddingHorizontal: 24,
			paddingVertical: 6,
			// borderWidth: 1,
			// borderColor: theme.primary
			alignSelf: "center",
			// ,marginBottom: 20
			// ,backgroundColor: theme.secondaryContainer
		},
		contentContainer: {
			flex: 1,
			flexDirection: "row",
		},
		setDisplay: {
			flex: 2,
			flexDirection: "column",
			alignItems: "flex-start",
			borderRightWidth: 1,
			borderRightColor: theme.outline,
		},
		exerciseStats: {
			flex: 1,
			flexDirection: "column",
			paddingHorizontal: 6,
			paddingVertical: 3,
		},
		statItem: {
			flexDirection: "column",
			alignItems: "center",
			marginBottom: 6,
		},
		setItem: {
			flexDirection: "row",
			alignItems: "baseline",
			minHeight: 40,
		},
		prBox: {
			marginVertical: 6,
			width: "100%",
			height: 50,
			borderRadius: 50,
			backgroundColor: theme.tertiary,
			alignItems: "center",
			justifyContent: "center",
		},
	});
};

export default DetailedExerciseListItem;
