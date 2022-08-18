import React, {
	useEffect,
	useState,
	useMemo,
	useRef,
	useCallback,
} from "react";
import {
	View,
	StyleSheet,
	StatusBar,
	Dimensions,
	ActivityIndicator,
	FlatList,
	UIManager,
	Platform,
	Pressable,
	useWindowDimensions,
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
import { setHideTabBar } from "../../redux/slices/appSettingsSlice";
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
import BottomSheet, {
	BottomSheetBackdropimport,
	TouchableOpacity,
	TouchableHighlight,
	TouchableWithoutFeedback,
	BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

import regression from "regression";
import TitleText from "../../components/Text/Title";
import LabelText from "../../components/Text/Label";
import BodyText from "../../components/Text/Body";
import IconButton from "../../components/Buttons/IconButton";
import CustomBackdrop from "../../components/UI/BottomSheetBackdrop";
import AnalysisScreenFilter from "../../components/AnalysisScreenFilter";
if (
	Platform.OS === "android" &&
	UIManager.setLayoutAnimationEnabledExperimental
) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

const WorkoutAnalysisScreen = (props) => {
	const windowDimensions = useWindowDimensions();
	const dispatch = useDispatch();

	const exerciseStoreRef = useSelector(
		(state) => state.workout.filteredExercises
	);

	// filter information
	const [chartDates, setChartDates] = useState([new Date(), new Date()]);
	const [statToShow, setStatToShow] = useState("e1RM");
	const [onExercise, setOnExercise] = useState("");

	const [yAxisDomains, setYAxisDomains] = useState([0, 1000]);
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

	// BottomSheet stuff
	const bottomSheetRef = useRef(null);
	const snapPoints = useMemo(
		() => ["25%", "50%", "75%", windowDimensions.height],
		[]
	);
	const [showBottomSheet, setShowBottomSheet] = useState(false);
	const handleSheetChanges = useCallback((index) => {
		if (index === -1) {
			dispatch(setHideTabBar(false));
			setShowBottomSheet(false);
		}
	});
	const renderBackdrop = useCallback(
		(props) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
			/>
		),
		[]
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
		// setStatToShow("e1RM");
	}, []);

	useEffect(() => {
		if (showBottomSheet) {
			dispatch(setHideTabBar(true));
			bottomSheetRef.current.snapToIndex(0);
		} else {
			dispatch(setHideTabBar(false));

			bottomSheetRef.current.close();
		}
	}, [showBottomSheet]);
	useEffect(() => {
		console.log("stattoshow: ", statToShow);
	}, [statToShow]);

	useEffect(() => {
		// updateFilterState();
	}, [exerciseTypes]);

	useEffect(() => {
		const newExerciseArray = Object.values(exerciseStoreRef);
		console.log("ExerciseLenght", newExerciseArray.length);

		for (let e of newExerciseArray) {
		}
		setExercises(newExerciseArray);
	}, [exerciseStoreRef]);

	useEffect(() => {
		if (exercises.length < 1) {
			return;
		}
		const dataArray = [];
		let lowerDomain = 100000;
		let upperDomain = 0;
		const currentExercise = exercises[0].exerciseName;
		for (let exercise of exercises) {
			const topSet = findTopSetInExercise(exercise.sets);
			const e1rm = calculateE1RM(topSet);
			if (e1rm < lowerDomain) {
				lowerDomain = e1rm;
			} else if (e1rm > upperDomain) {
				upperDomain = e1rm;
			}
			const date = format(new Date(exercise.date), "d.MMM");
			const dataPoint = {
				weight: e1rm,
				date: { display: date, dateNumber: exercise.date },
			};
			dataArray.push(dataPoint);
		}
		lowerDomain = lowerDomain - 10;
		upperDomain = upperDomain + 10;
		setYAxisDomains([Math.round(lowerDomain), Math.round(upperDomain)]);
		setChartDates([
			new Date(dataArray[0].date.dateNumber),
			new Date(dataArray[dataArray.length - 1].date.dateNumber),
		]);
		setOnExercise(currentExercise);
		setChartDataObject(dataArray);
	}, [exercises]);

	useEffect(() => {}, [chartDates]);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	const onChangeStatToShow = (stat) => {
		setStatToShow(stat);
	};

	return (
		<View style={styles.container}>
			<TopAppBar
				headlineText="Analysis"
				trailingIcons={[
					<IconButton
						name={showBottomSheet ? "close" : "filter-outline"}
						onPress={() => setShowBottomSheet((state) => !state)}
					/>,
				]}
			/>
			<View style={styles.contentView}>
				{/* {isLoading && (
					<ActivityIndicator
						color={currentTheme.primary}
						size="large"
					/>
				)} */}
				<View style={styles.analysisContainer}>
					<View style={styles.filterInformation}>
						<View style={styles.filterHeader}>
							<TitleText
								style={{ color: currentTheme.onSurface }}
								large={true}
							>
								Filter information
							</TitleText>
						</View>
						<View style={styles.filterStats}>
							<View style={styles.filterStatsItem}>
								<LabelText
									style={{
										color: currentTheme.onSurfaceVariant,
									}}
									large={true}
								>
									Exercise
								</LabelText>
								<BodyText
									style={{ color: currentTheme.onSurface }}
									large={true}
								>
									{onExercise}
								</BodyText>
							</View>
							<View style={styles.filterStatsItem}>
								<LabelText
									style={{
										color: currentTheme.onSurfaceVariant,
									}}
									large={true}
								>
									Showing stat
								</LabelText>
								<BodyText
									style={{ color: currentTheme.onSurface }}
									large={true}
								>
									{statToShow}
								</BodyText>
							</View>
							<View style={styles.filterStatsItem}>
								<LabelText
									style={{
										color: currentTheme.onSurfaceVariant,
									}}
									large={true}
								>
									From
								</LabelText>
								<BodyText
									style={{ color: currentTheme.onSurface }}
									large={true}
								>
									{format(chartDates[0], "d/M/yy")}
								</BodyText>
							</View>
							<View style={styles.filterStatsItem}>
								<LabelText
									style={{
										color: currentTheme.onSurfaceVariant,
									}}
									large={true}
								>
									To
								</LabelText>
								<BodyText
									style={{ color: currentTheme.onSurface }}
									large={true}
								>
									{format(chartDates[1], "d/M/yy")}
								</BodyText>
							</View>
						</View>
					</View>
					<View style={styles.chartContainer}>
						<VictoryChart
							width={400}
							theme={VictoryTheme.grayscale}
						>
							<VictoryLine
								animate={{
									duration: 2000,
									onLoad: { duration: 1000 },
								}}
								style={{
									data: { stroke: currentTheme.tertiary },
								}}
								data={chartDataObject}
								x={["date", "display"]}
								y="weight"
							/>
							<VictoryScatter
								animate={{
									duration: 2000,
									onLoad: { duration: 1000 },
								}}
								data={chartDataObject}
								x={["date", "display"]}
								y="weight"
							/>
							<VictoryAxis
								dependentAxis
								domain={[yAxisDomains[0], yAxisDomains[1]]}
								label="Kilo"
								style={{
									axis: { stroke: currentTheme.onSurface },
									axisLabel: { padding: 30 },
								}}
							/>

							<VictoryAxis
								// domain={[
								// 	0,
								// 	chartDataObject.length > 0
								// 		? chartDataObject.length
								// 		: 1,
								// ]}
								fixLabelOverlap={true}
								label="Date"
								style={{
									axis: { stroke: currentTheme.onSurface },
									axisLabel: { padding: 30 },
								}}
							/>
						</VictoryChart>
					</View>
				</View>
			</View>

			<BottomSheet
				ref={bottomSheetRef}
				index={-1}
				snapPoints={snapPoints}
				onChange={handleSheetChanges}
				enablePanDownToClose={true}
				// enableOverDrag={false}
				enableHandlePanningGesture={true}
				backdropComponent={renderBackdrop}
				handleStyle={{
					backgroundColor: currentTheme.surfaceE4,
					borderTopLeftRadius: 10,
					borderTopRightRadius: 10,
				}}
				// handleIndicatorStyle={{
				// 	backgroundColor: currentTheme.onSurface,
				// }}
			>
				<View style={{ flex: 1 }}>
					<AnalysisScreenFilter
						onSetStat={onChangeStatToShow}
						currentStat={statToShow}
					/>
				</View>
			</BottomSheet>
		</View>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.surface,
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
		analysisContainer: {
			height: 400,
			width: "100%",
			// backgroundColor: theme.surfaceVariant,
			alignItems: "center",
		},
		filterInformation: {
			height: 100,
			width: "100%",
			flexDirection: "column",
			paddingHorizontal: 24,
			paddingVertical: 12,
			// borderWidth: 1,
			// borderColor: theme.outline,
			// borderRadius: 12
		},

		filterHeader: {},
		filterStats: {
			flex: 1,
			flexDirection: "row",
			justifyContent: "space-between",
			// ,paddingHorizontal: 12,
			paddingVertical: 6,
		},
		filterStatsItem: {
			flexDirection: "column",
		},
		chartContainer: {
			height: 300,
			width: "100%",
			alignItems: "center",
		},
	});
};

export default WorkoutAnalysisScreen;
