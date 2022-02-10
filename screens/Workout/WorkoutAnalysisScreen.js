import React, { useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	StatusBar,
	Dimensions,
	ActivityIndicator,
} from "react-native";
import DisplayText from "../../components/Text/Display";
import { LineChart } from "react-native-chart-kit";

import * as WorkoutActions from "../../store/actions/workout";

import { Themes } from "../../shared/Theme";
import { useDispatch, useSelector } from "react-redux";
import OutlineButton from "../../components/Buttons/OutlineButton";
const theme = Themes.dark;

const WorkoutAnalysisScreen = (props) => {
	const userID = useSelector((state) => state.auth.userID);
	const exerciseStoreRef = useSelector((state) => state.workout.exercises);
	const dispatch = useDispatch();
	const [exercises, setExercises] = useState();
	const [chartDataObject, setChartDataObject] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		// componentdidmount
		setIsLoading(true);
		loadExercise("Squat");
		// dispatch(WorkoutActions.getExerciseByType(userID, "Squat"));
	}, []);

	useEffect(() => {
		console.log(exerciseStoreRef);
		if (exerciseStoreRef.length > 0) {
            createChartData(exerciseStoreRef);
		}
		setIsLoading(false);
	}, [exerciseStoreRef]);

	const loadExercise = (type) => {
        setIsLoading(true);
		dispatch(WorkoutActions.getExerciseByType(userID, type));
	};

	const createChartData = (data) => {
		// Sort exercises before transformation
		data.sort((a, b) => a.date.seconds - b.date.seconds);
		const labelArray = [];
		const exerciseWeightArray = [];
		data.forEach((exercise) => {
			const date = new Date(exercise.date.seconds * 1000);
			const monthString = date.toDateString().split(" ")[1];
			// const dateString = date.toDateString();
			const dateString =
				date.getDate() +
				"" +
				monthString 
				// "" +
				// date.getFullYear().toString().slice(2);
			labelArray.push(dateString);
			exerciseWeightArray.push(exercise.weight);
		});
		const chartData = {
			labels: labelArray,
			datasets: [
				{
					data: exerciseWeightArray,
					color: (opacity = 1) =>
						`rgba(${hexToRGB(theme.tertiary)[0]}, ${
							hexToRGB(theme.tertiary)[1]
						}, ${hexToRGB(theme.tertiary)[2]}, ${opacity})`,
					strokeWidth: 2,
				},
			],
			legend: [data[0].exercise],
		};
		setChartDataObject(chartData);
	};

	const hexToRGB = (hex) => {
		let r = 0,
			g = 0,
			b = 0;
		// 3 digits
		if (hex.length == 4) {
			r = "0x" + hex[1] + hex[1];
			g = "0x" + hex[2] + hex[2];
			b = "0x" + hex[3] + hex[3];

			// 6 digits
		} else if (hex.length == 7) {
			r = "0x" + hex[1] + hex[2];
			g = "0x" + hex[3] + hex[4];
			b = "0x" + hex[5] + hex[6];
		}
		return [+r, +g, +b];
		// return "rgb("+ +r + "," + +g + "," + +b + ")";
	};

	return (
		<View style={styles.container}>
			<View style={styles.contentView}>
				{isLoading && (
					<ActivityIndicator color={theme.primary} size="large" />
				)}
				{!isLoading && (
					<View>
						{chartDataObject && (
							<LineChart
								data={chartDataObject}
								width={Dimensions.get("window").width - 50} // from react-native
								height={220}
								yAxisSuffix="kg"
								yAxisInterval={1} // optional, defaults to 1
								chartConfig={{
									backgroundColor: theme.surface,
									backgroundGradientFrom: theme.surface,
									backgroundGradientTo: theme.surface,
									decimalPlaces: 2, // optional, defaults to 2dp
									color: (opacity = 1) =>
										`rgba(${hexToRGB(theme.tertiary)[0]}, ${
											hexToRGB(theme.tertiary)[1]
										}, ${
											hexToRGB(theme.tertiary)[2]
										}, ${opacity})`,
									labelColor: (opacity = 1) =>
										`rgba(255, 255, 255, ${opacity})`,
									style: {
										borderRadius: 12,
									},
									propsForDots: {
										r: "1",
										strokeWidth: "1",
										stroke: "#ffa726",
									},
								}}
								style={{
									marginVertical: 8,
									borderRadius: 16,
								}}
							/>
						)}
					</View>
				)}
			</View>
			<OutlineButton onButtonPress={() => loadExercise("Squat")}>
				Squat
			</OutlineButton>
			<OutlineButton onButtonPress={() => loadExercise("Deadlift")}>
				Deadlift
			</OutlineButton>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: StatusBar.currentHeight,
		flex: 1,
		backgroundColor: theme.surface,
	},
	contentView: {
		alignItems: "center",
	},
});

export default WorkoutAnalysisScreen;
