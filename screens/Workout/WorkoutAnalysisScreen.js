import React, { useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	StatusBar,
	Dimensions,
	ActivityIndicator,
	FlatList,
} from "react-native";
import DisplayText from "../../components/Text/Display";
import { LineChart } from "react-native-chart-kit";
import FilterChip from "../../components/UI/Chips/FilterChip";

// import * as WorkoutActions from "../../store/actions/workout";

import { Themes } from "../../shared/Theme";
import { useDispatch, useSelector } from "react-redux";
import { ExerciseTypes } from "../../shared/utils/ExerciseTypes";

import {
	calculateE1RM,
	findTopSetInExercise,
	hexToRGB,
} from "../../shared/utils/UtilFunctions";
import {
	getExercisesByType,
	resetFilteredExercises,
} from "../../redux/slices/workoutSlice";
import TopAppBar from "../../components/UI/TopAppBarComponent";

import {
	VictoryChart,
	VictoryLine,
	VictoryTheme,
	VictoryBar,
} from "victory-native";
import { format } from "date-fns";

import regression from "regression";
// TODO rework the hex-to-rgb on chart so that it doesnt call 3 times for one color code
const WorkoutAnalysisScreen = (props) => {
	const userID = useSelector((state) => state.auth.userID);
	const exerciseStoreRef = useSelector(
		(state) => state.workout.filteredExercises
	);

	const dispatch = useDispatch();

	const [exercises, setExercises] = useState([]);
	const [exerciseTypes, setExerciseTypes] = useState([]);
	const [filterState, setFilterState] = useState([]);
	const [chartDataObject, setChartDataObject] = useState([]);
	const [regressionLine, setRegressionLine] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentChartExercise, setCurrentChartExercise] = useState();
	const [onlyOneExerciseRecorded, setOnlyOneExerciseRecorded] =
		useState(false);

	// Themes
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	const [chartDotColorHexCode, setChartDotColorHexCode] = useState(
		hexToRGB(currentTheme.tertiary)
	);
	const [chartSurfaceColorHexCode, setChartSurfaceColorHexCode] = useState(
		hexToRGB(currentTheme.onSurface)
	);

	useEffect(() => {
		// componentdidmount
		// setIsLoading(true);
		const loadDeadlift = async () => {
			dispatch(getExercisesByType({ exerciseTypes: ["Deadlift"], sortType: "asc" }));
		};
		// createExerciseTypeArray();
		loadDeadlift();
	}, []);

	useEffect(() => {
		// updateFilterState();
	}, [exerciseTypes]);

	useEffect(() => {
		const newExerciseArray = Object.values(exerciseStoreRef);
		console.log(newExerciseArray);
		for (let e of newExerciseArray) {
			// console.log(e.date);
		}
		setExercises(newExerciseArray);
		// const sortedByDate = newExerciseArray.sort((a, b) => a.date + b.date);
		// for (let e of sortedByDate) {
		// 	console.log(e.date);
		// }

		// if (newExerciseArray.length < 1) {
		// 	return;
		// }
		// newExerciseArray.sort((a, b) => b - a);

		// setExercises(newExerciseArray);
		// if (newExerciseArray.length > 1) {
		// 	createChartData(newExerciseArray);
		// 	setOnlyOneExerciseRecorded(false);
		// } else if (newExerciseArray.length === 1) {
		// 	setOnlyOneExerciseRecorded(true);
		// 	setChartDataObject(null);
		// } else {
		// 	setChartDataObject(null);
		// 	setOnlyOneExerciseRecorded(false);
		// }
		// setIsLoading(false);
	}, [exerciseStoreRef]);
	useEffect(() => {
		console.log(exercises);
		const dataArray = [];
		for (let exercise of exercises) {
			const topSet = findTopSetInExercise(exercise.sets);
			const e1rm = calculateE1RM(topSet);
			const date = format(new Date(exercise.date), "d,MM");
			const dataPoint = {
				weight: e1rm,
				date: { display: date, dateNumber: exercise.date },
			};
			// console.log(dataPoint);
			dataArray.push(dataPoint);
		}
		const regPointArray = dataArray.map((point, index) => {
			console.log(index);
			return [Math.round(point.weight), index];
		});
		console.log(regPointArray);
		if (regPointArray.length > 0) {
			const linearRegression = regression.linear(regPointArray);
			const linRegDisplayData = linearRegression.points.map(
				(regPoint, index) => {
					return [regPoint[0], index];
				}
			);
			console.log("linear reg: ", linRegDisplayData);
			// setRegressionLine(linRegDisplayData);
		}
		setChartDataObject(dataArray);
	}, [exercises]);

	const createChartData = () => {};

	// useEffect(() => {
	// 	const selectedExercise = filterState.find(
	// 		(exercise) => exercise.selected == true
	// 	);
	// 	if (selectedExercise) {
	// 		// dispatch(resetFilteredExercises());
	// 		loadExercise(selectedExercise.exercise);
	// 	}
	// }, [filterState]);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
		setChartSurfaceColorHexCode(hexToRGB(currentTheme.onSurface));
		setChartDotColorHexCode(hexToRGB(currentTheme.tertiary));
	}, [useDarkMode]);

	const loadExercise = async (type) => {
		setIsLoading(true);
		setCurrentChartExercise(type);
		console.log(type);
		const typeArray = [];
		typeArray.push(type);

		const thunkResult = await dispatch(
			getExercisesByType({ exerciseTypes: typeArray })
		).unwrap();
		// stop indicating that the app is loading if the query comes back empty
		if (thunkResult === null) {
			setChartDataObject(null);
			setIsLoading(false);
		}
	};

	// TODO make it so that when pressing a selected exercise, it is unselected
	// const updateFilterState = (exercise, selectedState) => {
	// 	// if the filterstate is not initiated
	// 	if (filterState.length < 1) {
	// 		const newFilterState = [];
	// 		for (const ex of exerciseTypes) {
	// 			const exerciseState = { exercise: ex, selected: false };
	// 			newFilterState.push(exerciseState);
	// 		}
	// 		setFilterState(newFilterState);
	// 	} else {
	// 		const newFilterState = [...filterState];
	// 		const isSelected = newFilterState.find(
	// 			(arrayItem) => arrayItem.selected == true
	// 		);
	// 		if (isSelected) {
	// 			isSelected.selected = !isSelected.selected;
	// 			if (isSelected.exercise == exercise) {
	// 				console.log("Cancel the same exercise");
	// 			}
	// 		}
	// 		const updateStateOfExercise = newFilterState.find(
	// 			(arrayItem) => arrayItem.exercise == exercise
	// 		);
	// 		if (updateStateOfExercise) {
	// 			updateStateOfExercise.selected = true;
	// 		}
	// 		setFilterState(newFilterState);
	// 	}
	// };

	// const createExerciseTypeArray = () => {
	// 	let finalArray = [];
	// 	for (let eData of ExerciseTypes) {
	// 		finalArray = finalArray.concat(eData.data);
	// 	}
	// 	setExerciseTypes(finalArray);
	// };

	// const createChartData = (data) => {
	// 	// Sort exercises before transformation
	// 	data.sort((a, b) => a.date.seconds - b.date.seconds);
	// 	const labelArray = [];
	// 	const exerciseWeightArray = [];
	// 	data.forEach((exercise) => {
	// 		const date = new Date(exercise.date);
	// 		const monthString = date.toDateString().split(" ")[1];
	// 		// const dateString = date.toDateString();
	// 		const dateString = date.getDate() + "" + monthString;
	// 		// "" +
	// 		// date.getFullYear().toString().slice(2);
	// 		labelArray.push(dateString);
	// 		exerciseWeightArray.push(exercise.weight);
	// 	});
	// 	const chartData = {
	// 		labels: labelArray,
	// 		datasets: [
	// 			{
	// 				data: exerciseWeightArray,
	// 				color: (opacity = 1) =>
	// 					`rgba(${chartDotColorHexCode[0]}, ${chartDotColorHexCode[1]}, ${chartDotColorHexCode[2]}, ${opacity})`,
	// 				strokeWidth: 2,
	// 			},
	// 		],
	// 		legend: [data[0].exercise],
	// 	};
	// 	setChartDataObject(chartData);
	// };

	const testClickPoint = (value, dataset, getColor) => {};

	return (
		<View style={styles.container}>
			<TopAppBar headlineText="Analysis" />
			<View style={styles.contentView}>
				{isLoading && (
					<ActivityIndicator
						color={currentTheme.primary}
						size="large"
					/>
				)}
			</View>
			<View style={styles.chartContainer}>
				<VictoryChart
					width={350}
					theme={VictoryTheme.grayscale}
					style={{ grid: { stroke: "red", fill: "red" } }}
				>
					{/* <VictoryBar  data={chartDataObject} x="quarter" y="earnings" /> */}
					<VictoryLine
						animate={{ duration: 2000, onLoad: { duration: 1000 } }}
						style={{
							data: { stroke: currentTheme.tertiary },
							axis: { stroke: "none", fill: "none" },
						}}
						data={chartDataObject}
						x={["date", "display"]}
						y="weight"
					/>
					{/* <VictoryLine
						data={regressionLine}
						x={1}
						y={0}
						style={{
							data: { stroke: currentTheme.error },
							axis: { stroke: "none", fill: "none" },
						}}
					/> */}
				</VictoryChart>
			</View>
			{/* <View style={styles.filterBox}>
				<FlatList
					style={{ marginVertical: 5 }}
					horizontal={true}
					keyExtractor={(item) => Math.random()}
					data={filterState}
					showsHorizontalScrollIndicator={false}
					renderItem={(itemData) => (
						<FilterChip
							onChipPress={() =>
								updateFilterState(
									itemData.item.exercise,
									itemData.item.selected
								)
							}
							selected={itemData.item.selected}
						>
							{itemData.item.exercise}
						</FilterChip>
					)}
				/>
			</View> */}
		</View>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.surface,
			alignItems: "center",
		},
		contentView: {
			alignItems: "center",
		},
		filterBox: {
			height: 50,
			width: "90%",
			backgroundColor: theme.surface,
			// alignItems: "center"
		},
		chartContainer: {
			height: 300,
			width: "100%",
			alignItems: "center",
		},
	});
};

export default WorkoutAnalysisScreen;
