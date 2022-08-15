import React, {
	useCallback,
	useEffect,
	useState,
	useLayoutEffect,
	useRef,
	useMemo,
	useReducer,
} from "react";
import {
	FlatList,
	StyleSheet,
	View,
	RefreshControl,
	UIManager,
	Platform,
	Modal,
} from "react-native";
import { useDimensions } from "@react-native-community/hooks";
import FabButton from "../../components/Buttons/Fab";
import IconButton from "../../components/Buttons/IconButton";
import { Themes } from "../../shared/Theme";
import { useSelector, useDispatch } from "react-redux";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

import WorkoutListItem from "../../components/WorkoutListItem";

import FilterSelect from "../../components/FilterSelect";
import AddWorkoutcreen from "./AddWorkoutScreen";

import { transformObjectToWorkout } from "../../shared/utils/UtilFunctions";
import workoutSlice, {
	getExerciseTypes,
	getWorkoutByUserID,
	resetFilter,
	resetFilteredExercises,
	resetFilteredWorkouts,
} from "../../redux/slices/workoutSlice";
import { setHideTabBar } from "../../redux/slices/appSettingsSlice";
import TopAppBar from "../../components/UI/TopAppBarComponent";
import { render } from "react-dom";
import { async } from "validate.js";
import TitleText from "../../components/Text/Title";
import BodyText from "../../components/Text/Body";
import { format } from "date-fns";
import { nanoid } from "@reduxjs/toolkit";
import OutlineButton from "../../components/Buttons/OutlineButton";

if (
	Platform.OS === "android" &&
	UIManager.setLayoutAnimationEnabledExperimental
) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

const WorkoutListScreen = (props) => {
	const { width, height } = useDimensions().window;
	const dispatch = useDispatch();
	const userID = useSelector((state) => state.auth.userID);
	const reduxWorkoutRef = useSelector((state) => state.workout.workouts);

	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const isHidingTabBar = useSelector((state) => state.appSettings.hideTabBar);
	const [workouts, setWorkouts] = useState([]);

	const [refreshing, setRefreshing] = useState(false);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);
	const [isScrolling, setIsScrolling] = useState(false);
	const [exerciseTypesAvaliable, setExerciseTypesAvaliable] = useState(false);

	// filterInformation
	const [showFilter, setShowFilter] = useState(false);
	const [filterToggle, setFilterToggle] = useState(false);
	const reduxFilteredExercises = useSelector(
		(state) => state.workout.filteredExercises
	);
	const reduxFilteredWorkouts = useSelector(
		(state) => state.workout.filteredWorkouts
	);
	const filterInfo = useSelector((state) => state.workout.filterInfo);

	// layout
	// const [fabPosition, setFabPosition] = useState({x: 0, y: 0});

	// BottomSheet stuff
	const bottomSheetRef = useRef(null);
	const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);
	const handleSheetChanges = useCallback((index) => {
		if (index === -1) {
			dispatch(setHideTabBar(false));

			if (!filterToggle) {
				return;
			}
			setFilterToggle((state) => !state);
		} else {
			// dispatch({type: SET_TAB_BAR_VALUE, value: true});
		}
	});

	// load workouts on page open
	useEffect(() => {
		const getAsyncInfo = async () => {
			dispatch(getWorkoutByUserID(userID));
			const exerciseTypesGot = await dispatch(
				getExerciseTypes()
			).unwrap();
			setExerciseTypesAvaliable(true);
		};
		console.log("Page is Loading");
		setRefreshing(true);
		if (userID) {
			getAsyncInfo();
		}
	}, []);

	useEffect(() => {
		if (reduxFilteredWorkouts !== {}) {
			const arrayOfWorkouts = Object.values(reduxFilteredWorkouts);
			if (arrayOfWorkouts.length === 0 && filterInfo.error !== "") {
				setWorkouts([]);
				return;
			}
			setWorkouts(arrayOfWorkouts);
		}
	}, [reduxFilteredWorkouts, filterInfo]);

	useEffect(() => {
		const arrayOfWorkouts = Object.values(reduxWorkoutRef);
		console.log(arrayOfWorkouts.length);

		setWorkouts([...arrayOfWorkouts]);
		setRefreshing(false);
	}, [reduxWorkoutRef]);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	useEffect(() => {
		// The assumtion is that when the tab bar is hidden, we want to show the bottom sheet
		if (isHidingTabBar && filterToggle) {
			bottomSheetRef.current.snapToIndex(0);
		}
	}, [isHidingTabBar]);

	useEffect(() => {
		setShowFilter(filterToggle);
		if (filterToggle) {
			dispatch(setHideTabBar(true));
			// 	bottomSheetRef.current.snapToIndex(0);
		} else {
			bottomSheetRef.current.close();
		}
	}, [filterToggle]);

	useEffect(() => {}, [exerciseTypesAvaliable]);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		dispatch(getWorkoutByUserID(userID));
	}, []);

	const toggle = () => {
		if (filterToggle) {
			setFilterToggle(false);
		} else {
			setFilterToggle(true);
		}
	};

	const scrollHandler = (event) => {
		const y = event.nativeEvent.contentOffset.y;
		if (y > 0 && !isScrolling) {
			setIsScrolling(true);
		} else if (y === 0 && isScrolling) {
			setIsScrolling(false);
		}
	};

	const navigateToAddNewWorkout = () => {
		// setShowModal(true);
		dispatch(setHideTabBar(true));
		props.navigation.navigate("AddWorkout");
	};

	const onNavigateToCalculator = () => {
		dispatch(setHideTabBar(true));
		props.navigation.navigate("Calculator");
	};

	// const renderBackdrop = useCallback(
	// 	(props) => (
	// 		<BottomSheetBackdrop
	// 			style={{ height: "100%" }}
	// 			{...props}
	// 			disappearsOnIndex={1}
	// 			appearsOnIndex={2}
	// 			opacity={1}
	// 		/>
	// 	),
	// 	[]
	// );

	const onClearFilter = () => {
		dispatch(resetFilter());
		dispatch(resetFilteredExercises());
		dispatch(resetFilteredWorkouts());

		setStandardWorkouts();
	};

	const setStandardWorkouts = () => {
		const arrayOfWorkouts = Object.values(reduxWorkoutRef);
		setWorkouts(arrayOfWorkouts);
	};

	return (
		<View style={styles.container}>
			{/* <Modal style={{zIndex: 2}} visible={filterToggle} transparent={true} onRequestClose={()=> setFilterToggle(state => !state)} >
				<View style={{flex: 1, backgroundColor: currentTheme.scrim}}></View>
			</Modal> */}
			{!showFilter && (
				<FabButton
					onPress={navigateToAddNewWorkout}
					iconName="add"
					style={{
						...styles.fabButtonPlacement,
						right: 16,
						bottom: 16,
					}}
					title="New Workout"
				/>
			)}
			<TopAppBar
				headlineText="Workouts"
				trailingIcons={[
					<IconButton
						iconColor={currentTheme.onSurfaceVariant}
						name="calculator-outline"
						onPress={onNavigateToCalculator}
					/>,
					<IconButton
						iconColor={currentTheme.onSurfaceVariant}
						name={filterToggle ? "close" : "filter"}
						onPress={toggle}
					/>,
				]}
				backgroundColor={
					filterInfo.usingFilter
						? currentTheme.surfaceE2
						: currentTheme.surface
				}
			/>
			<View style={styles.contentView}>
				{filterInfo.usingFilter && (
					<View style={styles.filterInformationContainer}>
						{filterInfo.type === "Exercises" && (
							<View style={{}}>
								<TitleText
									large={true}
									style={{ color: currentTheme.onSurface }}
								>
									Filter:
								</TitleText>
								{filterInfo.filterQuery.exerciseTypes.map(
									(exerciseType) => (
										<View key={nanoid()}>
											<BodyText
												style={{
													color: currentTheme.onSurface,
												}}
												large={false}
											>
												{exerciseType}
											</BodyText>
										</View>
									)
								)}
								{filterInfo.error !== "" && (
									<View>
										<BodyText
											style={{
												color: currentTheme.error,
											}}
										>
											{filterInfo.error}
										</BodyText>
									</View>
								)}
							</View>
						)}
						{filterInfo.type === "Date" && (
							<View
							// style={{
							// 	flex: 1,
							// }}
							>
								<View style={{ marginLeft: 12 }}>
									<BodyText
										style={{
											color: currentTheme.onSurface,
										}}
										large={false}
									>
										From Date:{" "}
										{format(
											filterInfo.filterQuery.from,
											"dd/MM/yyyy"
										)}
									</BodyText>
									<BodyText
										style={{
											color: currentTheme.onSurface,
										}}
										large={false}
									>
										To Date:{" "}
										{format(
											filterInfo.filterQuery.to,
											"dd/MM/yyyy"
										)}
									</BodyText>
									{filterInfo.error !== "" && (
										<View>
											<BodyText
												style={{
													color: currentTheme.error,
												}}
											>
												{filterInfo.error}
											</BodyText>
										</View>
									)}
								</View>
							</View>
						)}
						<View style={{ marginTop: 12 }}>
							<OutlineButton onButtonPress={onClearFilter}>
								Clear filter
							</OutlineButton>
						</View>
					</View>
				)}
				<FlatList
					style={styles.flatListStyle}
					data={workouts}
					keyExtractor={(item) => item.id}
					onScroll={(e) => scrollHandler(e)}
					ListFooterComponent={<View></View>}
					ListFooterComponentStyle={{ height: 80 }}
					ItemSeparatorComponent={() => {
						return (
							<View
								style={{
									width: "100%",
									borderBottomWidth: 1,
									borderBottomColor: currentTheme.outline,
								}}
							></View>
						);
					}}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							colors={[currentTheme.onPrimary]}
							progressBackgroundColor={currentTheme.primary}
						/>
					}
					renderItem={(itemData) => (
						<WorkoutListItem
							userID={userID}
							workoutID={itemData.item.id}
						/>
					)}
				/>
			</View>
			<BottomSheet
				style={{ flex: 1 }}
				ref={bottomSheetRef}
				index={-1}
				snapPoints={snapPoints}
				onChange={handleSheetChanges}
				enablePanDownToClose={true}
				enableOverDrag={false}
				handleStyle={{
					backgroundColor: currentTheme.surfaceE4,
					borderTopLeftRadius: 10,
					borderTopRightRadius: 10,
				}}
				handleIndicatorStyle={{
					backgroundColor: currentTheme.onSurface,
				}}
			>
				<View style={styles.bottomSheetContainer}>
					<FilterSelect
						exerciseTypesAvaliable={exerciseTypesAvaliable}
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
			// backgroundColor: "red",
		},
		transparentOverlay: {
			position: "absolute",
			height: "100%",
			width: "100%",

			left: 0,
			top: 0,
			// opacity: .5,
			backgroundColor: theme.scrim,
			zIndex: 3,
		},
		bottomSheetContainer: {
			flex: 1,
			alignItems: "center",
			backgroundColor: theme.surface,
			zIndex: 1000,
		},
		contentView: {
			flex: 1,
			flexDirection: "column",
			// width: "100%",
			// height: 300,
			// alignItems: "center",
			justifyContent: "center",
			// marginTop: 40,
		},
		flatListStyle: {
			width: "100%",
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
		filterInformationContainer: {
			width: "100%",
			minHeight: 100,
			paddingHorizontal: 24,
			paddingVertical: 12,

			backgroundColor: theme.surfaceE2,
		},
	});
};

export default WorkoutListScreen;
