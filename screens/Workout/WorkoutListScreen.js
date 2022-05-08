import { StatusBar } from "expo-status-bar";
import React, {
	useCallback,
	useEffect,
	useState,
	useLayoutEffect,
	useRef,
	useMemo,
} from "react";
import {
	FlatList,
	StyleSheet,
	View,
	RefreshControl,
	LayoutAnimation,
	UIManager,
	Platform,
	Animated,
} from "react-native";
import { useDimensions } from "@react-native-community/hooks";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/Buttons/CustomHeaderButton";
import FabButton from "../../components/Buttons/Fab";
import { Themes } from "../../shared/Theme";
import { useSelector, useDispatch } from "react-redux";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import * as WorkoutActions from "../../store/actions/workout";
import WorkoutListItem from "../../components/WorkoutListItem";

import FilterSelect from "../../components/FilterSelect";

import { SET_TAB_BAR_VALUE } from "../../store/actions/appsettings";

const theme = Themes.dark;

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

	// BottomSheet stuff
	const bottomSheetRef = useRef(null);
	const handleSheetChanges = useCallback((index) => {
		if (index === -1) {
			dispatch({type: SET_TAB_BAR_VALUE, value: false});

			if (!filterToggle) {
				return;
			}
			setFilterToggle((state) => !state);
		} else {
			// dispatch({type: SET_TAB_BAR_VALUE, value: true});
		}
	});
	const snapPoints = useMemo(() => ["25%", "50%"], []);

	// load workouts on page open
	useEffect(() => {
		console.log("Page is Loading");
		setRefreshing(true);
		dispatch(WorkoutActions.getUserWorkouts(userID));
	}, []);

	useLayoutEffect(() => {
		props.navigation.setOptions({
			headerRight: () => (
				<View style={{ flexDirection: "row" }}>
					<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
						<Item
							title="filter"
							iconName={filterToggle ? "close" : "filter-list"}
							onPress={toggle}
						/>
					</HeaderButtons>
				</View>
			),
		});
	}, [props.navigation, filterToggle]);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		dispatch(WorkoutActions.getUserWorkouts(userID));
	}, []);

	useEffect(() => {
		console.log("Page Loaded");
		const newArray = [...reduxWorkoutRef];
		setWorkouts(newArray);
		setRefreshing(false);
	}, [reduxWorkoutRef]);

	useEffect(() => {
		setShowFilter(filterToggle);
		if (filterToggle) {
			dispatch({type: SET_TAB_BAR_VALUE, value: true});
		// 	bottomSheetRef.current.snapToIndex(0);
		} else {
			bottomSheetRef.current.close();
		}
	}, [filterToggle]);

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

	const toggle = () => {
		if (filterToggle) {
			setFilterToggle(false);
		} else {
			setFilterToggle(true);
		}
	};

	return (
		<View style={styles.container}>
			{!showFilter && (
				<FabButton
					onButtonPress={() =>
						props.navigation.navigate("AddWorkout")
					}
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
			{/* {showFilter && <FilterBox />} */}

			<View style={styles.contentView}>
				<FlatList
					style={styles.flatListStyle}
					data={workouts}
					keyExtractor={(item) => item.id}
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
							workout={itemData.item}
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
					backgroundColor: currentTheme.primaryContainer,
					borderTopLeftRadius: 10,
					borderTopRightRadius: 10,
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
			backgroundColor: theme.surfaceE2,
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
