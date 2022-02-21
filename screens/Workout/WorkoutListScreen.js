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
import TitleText from "../../components/Text/Title";

import { FlatList as GestureFlatList } from "react-native-gesture-handler";

import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import * as WorkoutActions from "../../store/actions/workout";
import * as AppSettingsActions from "../../store/actions/appsettings";
import WorkoutListItem from "../../components/WorkoutListItem";

import FilterChip from "../../components/UI/Chips/FilterChip";
import OutlineButton from "../../components/Buttons/OutlineButton";
import TextButton from "../../components/Buttons/TextButton";
import FilterSelect from "../../components/FilterSelect";

import { SET_HIDE_TABBAR } from "../../store/actions/appsettings";

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
	const hideTabBar = useSelector((state) => state.appSettings.hideTabBar);

	const [workouts, setWorkouts] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [showFilter, setShowFilter] = useState(false);
	const [filterToggle, setFilterToggle] = useState(false);

	// BottomSheet stuff
	const bottomSheetRef = useRef(null);
	const handleSheetChanges = useCallback((index) => {
		console.log("Handlesheetchanges: ", index);
		if (index === -1) {
			if (!filterToggle) {
				return;
			}
			setFilterToggle((state) => !state);
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
							title="add"
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
			bottomSheetRef.current.snapToIndex(0);
		} else {
			bottomSheetRef.current.close();
		}
	}, [filterToggle]);

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
							colors={[theme.onPrimary]}
							progressBackgroundColor={theme.primary}
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
					backgroundColor: theme.tertiary,
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

const styles = StyleSheet.create({
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
		width: "100%",
		// height: 300,
		alignItems: "center",
		// justifyContent: "center",
		marginTop: 40,
	},
	flatListStyle: {
		width: "90%",
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

export default WorkoutListScreen;
