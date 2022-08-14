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
import {
	getExerciseTypes,
	getWorkoutByUserID,
} from "../../redux/slices/workoutSlice";
import { setHideTabBar } from "../../redux/slices/appSettingsSlice";
import TopAppBar from "../../components/UI/TopAppBarComponent";
import { render } from "react-dom";
import { async } from "validate.js";

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
	const reduxFilteredExercises = useSelector(
		(state) => state.workout.filteredExercises
	);
	const reduxFilteredWorkouts = useSelector(
		(state) => state.workout.filteredWorkouts
	);

	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const isHidingTabBar = useSelector((state) => state.appSettings.hideTabBar);
	const [workouts, setWorkouts] = useState([]);

	const [refreshing, setRefreshing] = useState(false);
	const [showFilter, setShowFilter] = useState(false);
	const [filterToggle, setFilterToggle] = useState(false);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);
	const [isScrolling, setIsScrolling] = useState(false);
	const [exerciseTypesAvaliable, setExerciseTypesAvaliable] = useState(false);

	const [showModal, setShowModal] = useState(false);

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
			// dispatch(getWorkoutByUserID(userID));
			// dispatch(getExerciseTypes());
		}
	}, []);

	useEffect(() => {
		if (reduxFilteredWorkouts !== {}) {
			const arrayOfWorkouts = Object.values(reduxFilteredWorkouts);
			setWorkouts(arrayOfWorkouts);
		}
	}, [reduxFilteredWorkouts]);

	useEffect(() => {
		const arrayOfWorkouts = Object.values(reduxWorkoutRef);
		setWorkouts(arrayOfWorkouts);
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
		console.log(reduxFilteredExercises);
	}, [reduxFilteredExercises]);

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
		console.log(userID);
		setRefreshing(true);
		dispatch(getWorkoutByUserID(userID));
		// dispatch(WorkoutActions.getUserWorkouts(userID));
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

	const onFabLayout = (event) => {
		// console.log(event.nativeEvent);
		// const layout = event.nativeEvent.layout;
		// const fabWidth = layout.width;
		// const fabHeight = layout.height;
		// setFabPosition({x: 16, y: 0})
	};
	const renderBackdrop = useCallback(
		(props) => (
			<BottomSheetBackdrop
				style={{ height: "100%" }}
				{...props}
				disappearsOnIndex={1}
				appearsOnIndex={2}
				opacity={1}
			/>
		),
		[]
	);

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
					onLayout={onFabLayout}
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
			/>
			<View style={styles.contentView}>
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
	});
};

export default WorkoutListScreen;
