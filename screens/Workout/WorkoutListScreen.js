import { StatusBar } from "expo-status-bar";
import React, {
	useCallback,
	useEffect,
	useState,
	useLayoutEffect,
} from "react";
import {
	FlatList,
	StyleSheet,
	View,
	RefreshControl,
	LayoutAnimation,
	UIManager,
	Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { useDimensions } from "@react-native-community/hooks";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/Buttons/CustomHeaderButton";
import FabButton from "../../components/Buttons/Fab";
import { Themes } from "../../shared/Theme";
import { useSelector, useDispatch } from "react-redux";
import * as WorkoutActions from "../../store/actions/workout";
import WorkoutListItem from "../../components/WorkoutListItem";

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

	const [workouts, setWorkouts] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [showFilter, setShowFilter] = useState(false);
	const [filterToggle, setFilterToggle] = useState(false);
	const [testCounter, incrementCounter] = useState(0);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		dispatch(WorkoutActions.getUserWorkouts(userID));
	}, []);

	// load workouts on page open
	useEffect(() => {
		console.log("Page is Loading");
		setRefreshing(true);
		dispatch(WorkoutActions.getUserWorkouts(userID));
	}, []);

	useEffect(() => {
		// console.log(reduxWorkoutRef);
		console.log("Page Loaded");
		const newArray = [...reduxWorkoutRef];
		setWorkouts(newArray);
		setRefreshing(false);
	}, [reduxWorkoutRef]);

	useEffect(() => {
		setShowFilter(filterToggle);
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
	}, [filterToggle]);

	const toggle = () => {
		if (filterToggle) {
			setFilterToggle(false);
		} else {
			setFilterToggle(true);
		}
	};

	useLayoutEffect(() => {
		props.navigation.setOptions({
			headerRight: () => (
				<View style={{ flexDirection: "row" }}>
					<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
						<Item
							title="add"
							iconName="filter-list"
							onPress={toggle}
						/>
					</HeaderButtons>
				</View>
			),
		});
	}, [props.navigation, filterToggle]);

	return (
		<View style={styles.container}>
			<FabButton
				onButtonPress={() => props.navigation.navigate("AddWorkout")}
				iconName="add"
				style={{
					...styles.fabButtonPlacement,
					left: width - 160,
					top: height - 200,
				}}
			>
				New Workout
			</FabButton>
			{showFilter && (
				<View
					style={{ width: "100%", height: 200, alignItems: "center" }}
				>
					<View
						style={{
							width: "90%",
							height: "90%",
							backgroundColor: theme.primaryContainer,
						}}
					></View>
				</View>
			)}

			<View style={styles.contentView}>
				<FlatList
					style={styles.flatListStyle}
					data={workouts}
					keyExtractor={(item) => item.id}
					// refreshing={refreshing}
					// onRefresh={onRefresh}
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
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.surface,
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
