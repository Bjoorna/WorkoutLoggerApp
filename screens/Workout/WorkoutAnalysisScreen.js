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
	VictoryScatter,
	VictoryAxis,
	VictoryLegend,
	VictoryLabel,
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
			dispatch(
				getExercisesByType({
					exerciseTypes: ["Deadlift"],
					sortType: "asc",
				})
			);
		};
		// createExerciseTypeArray();
		const existingExercises = Object.values(exerciseStoreRef).length > 0;
		if (!existingExercises) {
			loadDeadlift();
		}
	}, []);

	useEffect(() => {
		// updateFilterState();
	}, [exerciseTypes]);

	useEffect(() => {
		const newExerciseArray = Object.values(exerciseStoreRef);
		// console.log(newExerciseArray);
		for (let e of newExerciseArray) {
			// console.log(e.date);
		}
		setExercises(newExerciseArray);
	}, [exerciseStoreRef]);
	useEffect(() => {
		console.log(exercises);
		const dataArray = [];
		for (let exercise of exercises) {
			const topSet = findTopSetInExercise(exercise.sets);
			const e1rm = calculateE1RM(topSet);
			const date = format(new Date(exercise.date), "d.MMM");
			const dataPoint = {
				weight: e1rm,
				date: { display: date, dateNumber: exercise.date },
			};
			// console.log(dataPoint);
			dataArray.push(dataPoint);
		}
		// const regPointArray = dataArray.map((point, index) => {
		// 	// console.log(index);
		// 	return [Math.round(point.weight), index];
		// });
		// // console.log(regPointArray);
		// if (regPointArray.length > 0) {
		// 	const linearRegression = regression.linear(regPointArray);
		// 	const linRegDisplayData = linearRegression.points.map(
		// 		(regPoint, index) => {
		// 			return [regPoint[0], index];
		// 		}
		// 	);
		// 	// console.log("linear reg: ", linRegDisplayData);
		// 	// setRegressionLine(linRegDisplayData);
		// }
		setChartDataObject(dataArray);
	}, [exercises]);

	const createChartData = () => {};

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
		setChartSurfaceColorHexCode(hexToRGB(currentTheme.onSurface));
		setChartDotColorHexCode(hexToRGB(currentTheme.tertiary));
	}, [useDarkMode]);

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
					width={400}
					theme={VictoryTheme.grayscale}
					style={{ grid: { stroke: "red", fill: "red" } }}
					// padding= {{left: 300,}}
					// domain={{
					// 	x: [
					// 		0,
					// 		chartDataObject.length > 0
					// 			? chartDataObject.length
					// 			: 1,
					// 	],
					// 	y: [90, 150],
					// }}
				>
					{/* <VictoryBar  data={chartDataObject} x="quarter" y="earnings" /> */}
					<VictoryLine
						animate={{ duration: 2000, onLoad: { duration: 1000 } }}
						style={{
							data: { stroke: currentTheme.tertiary },
							// axis: { stroke: "none", fill: "none" },
							// labels: {
							// 	fontSize: 15,
							// 	// padding: -70,
							// },
						}}
						data={chartDataObject}
						x={["date", "display"]}
						y="weight"

						// labels={({datum}) => Math.round(datum.weight)}
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
					<VictoryScatter
						animate={{ duration: 2000, onLoad: { duration: 1000 } }}
						data={chartDataObject}
						x={["date", "display"]}
						y="weight"
					/>
					<VictoryAxis
						dependentAxis
						domain={[95, 120]}
						label="Kilo"
						style={{
							axis: { stroke: currentTheme.onSurface },
							axisLabel: {  padding: 30 },
						}}
					/>

					<VictoryAxis
						domain={[
							0,
							chartDataObject.length > 0
								? chartDataObject.length
								: 1,
						]}
						fixLabelOverlap={true}
						label="Date"
						style={{
							axis: { stroke: currentTheme.onSurface },
							axisLabel: {  padding: 30 },
						}}

					/>
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
			// height: 400,

			width: "100%",
			alignItems: "center",
		},
	});
};

export default WorkoutAnalysisScreen;
