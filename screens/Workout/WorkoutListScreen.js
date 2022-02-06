import { StatusBar } from "expo-status-bar";
import React, {
	useCallback,
	useEffect,
	useState,
	useLayoutEffect,
	useRef,
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
import { useNavigation } from "@react-navigation/core";
import { useDimensions } from "@react-native-community/hooks";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/Buttons/CustomHeaderButton";
import FabButton from "../../components/Buttons/Fab";
import { Themes } from "../../shared/Theme";
import { useSelector, useDispatch } from "react-redux";
import DisplayText from "../../components/Text/Display";
import TitleText from "../../components/Text/Title";

import * as WorkoutActions from "../../store/actions/workout";
import WorkoutListItem from "../../components/WorkoutListItem";

import FilterChip from "../../components/UI/Chips/FilterChip";

const theme = Themes.dark;

if (
	Platform.OS === "android" &&
	UIManager.setLayoutAnimationEnabledExperimental
) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FilterBox = (props) => {
	const exerciseList = [
		"Squat",
		"Deadlift",
		"RDL",
		"Bench-Press",
		"Sumo-DL",
		"Press",
	];
	const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 1000,
			useNativeDriver: true,
		}).start();
	}, [fadeAnim]);
	return (
		<Animated.View style={filterBoxStyles.filterBoxContainer}>
			<View style={filterBoxStyles.filterBoxContent}>
				<View style={filterBoxStyles.header}>
					<TitleText style={{ color: theme.onSurfaceVariant }}>
						Filter
					</TitleText>
				</View>
				<View style={{ width: "100%" }}>
					<FlatList
						horizontal={true}
						keyExtractor={item => Math.random()}
						data={exerciseList}
						renderItem={(itemData) => (
							<FilterChip selected={false}>
								{itemData.item}
							</FilterChip>
						)}
					/>
				</View>
			</View>
		</Animated.View>
	);
};

const filterBoxStyles = StyleSheet.create({
	filterBoxContainer: {
		width: "100%",
		height: 200,
		alignItems: "center",
	},
	filterBoxContent: {
		width: "90%",
		height: "90%",
		padding: 20,
		borderRadius: 12,
		// borderColor: theme.outline,
		// borderWidth: 1,
		// borderStyle: "solid"
	},
	header: {},
});

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
		console.log("Page Loaded");
		const newArray = [...reduxWorkoutRef];
		setWorkouts(newArray);
		setRefreshing(false);
	}, [reduxWorkoutRef]);

	useEffect(() => {
		setShowFilter(filterToggle);
		// LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
				// <View
				// 	style={{ width: "100%", height: 200, alignItems: "center" }}
				// >
				// 	<View
				// 		style={{
				// 			width: "90%",
				// 			height: "90%",
				// 			backgroundColor: theme.secondaryContainer,
				// 			padding: 20,
				// 		}}
				// 	>
				// 		<DisplayText
				// 			large={true}
				// 			style={{ color: theme.onSecondaryContainer }}
				// 		>
				// 			Hello
				// 		</DisplayText>
				// 	</View>
				// </View>
				<FilterBox />
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
