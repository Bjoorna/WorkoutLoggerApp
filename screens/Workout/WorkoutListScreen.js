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
import BottomSheet from "@gorhom/bottom-sheet";

import * as WorkoutActions from "../../store/actions/workout";
import WorkoutListItem from "../../components/WorkoutListItem";

import FilterSelect from "../../components/FilterSelect";
import AddWorkoutDialogScreen from "../../components/UI/AddWorkoutDialogScreen";

import {
	SET_IS_SCROLLING,
	SET_TAB_BAR_VALUE,
} from "../../store/actions/appsettings";
import { transformObjectToWorkout } from "../../shared/utils/UtilFunctions";
import { getWorkoutByUserID } from "../../store/slices/workoutSlice";

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
	const [showFilter, setShowFilter] = useState(false);
	const [filterToggle, setFilterToggle] = useState(false);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);
	const [isScrolling, setIsScrolling] = useState(false);

	const [showModal, setShowModal] = useState(false);

	// BottomSheet stuff
	const bottomSheetRef = useRef(null);
	const snapPoints = useMemo(() => ["25%", "50%"], []);
	const handleSheetChanges = useCallback((index) => {
		if (index === -1) {
			dispatch({ type: SET_TAB_BAR_VALUE, value: false });

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
		console.log("Page is Loading");
		setRefreshing(true);
		if (userID) {
			dispatch(getWorkoutByUserID(userID));
		}
		// dispatch(WorkoutActions.getUserWorkouts(userID));
		// dispatch({ type: SET_TAB_BAR_VALUE, value: false });
	}, []);

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
		setShowFilter(filterToggle);
		if (filterToggle) {
			dispatch({ type: SET_TAB_BAR_VALUE, value: true });
			// 	bottomSheetRef.current.snapToIndex(0);
		} else {
			bottomSheetRef.current.close();
		}
	}, [filterToggle]);

	useLayoutEffect(() => {
		if (isScrolling) {
			props.navigation.setOptions({
				headerStyle: { backgroundColor: currentTheme.surfaceE2 },
				headerRight: () => (
					<View style={{ flexDirection: "row" }}>
						{/* <IconButton
							name="arrow-down"
							iconColor={currentTheme.onSurfaceVariant}
							onPress={deSerialize}
						/>
						<IconButton
							name="arrow-up"
							iconColor={currentTheme.onSurfaceVariant}
							onPress={serialize}
						/> */}

						<IconButton
							onPress={() =>
								props.navigation.navigate("Calculator")
							}
							shouldVibrate={false}
							iconColor={currentTheme.onSurfaceVariant}
							name={"calculator"}
						/>
						<IconButton
							name={filterToggle ? "close" : "filter"}
							iconColor={currentTheme.onSurfaceVariant}
							shouldVibrate={false}
							onPress={toggle}
						/>
					</View>
				),
			});
		} else {
			props.navigation.setOptions({
				headerStyle: { backgroundColor: currentTheme.surface },
				headerRight: () => (
					<View style={{ flexDirection: "row" }}>
						{/* <IconButton
							name="arrow-down"
							iconColor={currentTheme.onSurfaceVariant}
							onPress={deSerialize}
						/>
						<IconButton
							name="arrow-up"
							iconColor={currentTheme.onSurfaceVariant}
							onPress={serialize}
						/> */}

						<IconButton
							onPress={() =>
								props.navigation.navigate("Calculator")
							}
							shouldVibrate={false}
							iconColor={currentTheme.onSurfaceVariant}
							name={"calculator"}
						/>

						<IconButton
							name={filterToggle ? "close" : "filter"}
							iconColor={currentTheme.onSurfaceVariant}
							shouldVibrate={false}
							onPress={toggle}
						/>
					</View>
				),
			});
		}
	}, [props.navigation, filterToggle, isScrolling, currentTheme]);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		dispatch(getWorkoutByUserID(userID))
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
		setShowModal(true);
		// dispatch({ type: SET_TAB_BAR_VALUE, value: true });
		// props.navigation.navigate("AddWorkout");
	};


	return (
		<View style={styles.container}>
			<Modal
				visible={showModal}
				animationType="slide"
				transparent={true}
				onRequestClose={() => setShowModal(false)}
			>
				<AddWorkoutDialogScreen
					toggleModal={() => setShowModal(false)}
				/>
			</Modal>
			{!showFilter && (
				<FabButton
					onButtonPress={navigateToAddNewWorkout}
					iconName="add"
					style={{
						...styles.fabButtonPlacement,
						left: width - 160,
						top: height - 200,
					}}
				>
					New Workout
				</FabButton>
			)}

			<View style={styles.contentView}>
				<FlatList
					style={styles.flatListStyle}
					data={workouts}
					keyExtractor={(item) => item.id}
					onScroll={(e) => scrollHandler(e)}
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
					<FilterSelect />
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
		bottomSheetContainer: {
			flex: 1,
			alignItems: "center",
			backgroundColor: theme.surfaceE4,
		},
		contentView: {
			flexDirection: "column",
			width: "100%",
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
