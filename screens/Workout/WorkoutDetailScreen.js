import React, {
	useState,
	useEffect,
	useLayoutEffect,
	useCallback,
} from "react";
import { View, StyleSheet, Modal, Pressable, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/core";
import { Themes } from "../../shared/Theme";
import { SET_TAB_BAR_VALUE } from "../../store/actions/appsettings";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/Buttons/CustomHeaderButton";
import * as firebase from "../../firebase/firebase";
import BodyText from "../../components/Text/Body";
import TitleText from "../../components/Text/Title";
import LabelText from "../../components/Text/Label";
import HeadlineText from "../../components/Text/Headline";
import TextButton from "../../components/Buttons/TextButton";
import RPEMap from "../../shared/utils/RPEMap";
import UtilFunctions from "../../shared/utils/UtilFunctions";
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

const WorkoutDetailScreen = (props) => {
	const rpeCalc = new RPEMap();
	const dispatch = useDispatch();
	const workoutID = props.route.params.workoutID;
	const userID = useSelector((state) => state.auth.userID);
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const workoutsRef = useSelector((state) => state.workout.workouts);
	const exercisesRef = useSelector((state) => state.workout.exercisesObject);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	const [workout, setWorkout] = useState();
	const [exercises, setExercises] = useState(null);
	const [summaryData, setSummaryData] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [modalBackdropHex, setModalBackdropHex] = useState(UtilFunctions.hexToRGB(currentTheme.surface));
	useEffect(() => {
		const onWorkout = workoutsRef.find(
			(workout) => workout.id == workoutID
		);
		console.log("OnWorkoout: ");
		console.log(onWorkout);
		setWorkout(onWorkout);
		console.log(UtilFunctions.hexToRGB(currentTheme.surface));
	}, []);

	useEffect(() => {
		if (workout) {
			const exerciseIDs = workout.exercises;
			console.log(exerciseIDs);
			const exerciseArray = [];
			for (let id of exerciseIDs) {
				console.log(id);
				const exercise = exercisesRef[id];
				exerciseArray.push(exercise);
			}
			setExercises(exerciseArray);
			calculateSummary(exerciseArray);
		}
	}, [workout]);

	useEffect(() => {
		setStyles(useDarkMode ? Themes.dark : Themes.light);
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
		setModalBackdropHex(UtilFunctions.hexToRGB(currentTheme.surface));
	}, [useDarkMode]);

	const calculateSummary = (exercises) => {
		let tonnage = 0;
		for (let exercise of exercises) {
			const repWeight = exercise.weight;
			const reps = exercise.reps;
			const sets = exercise.sets;
			tonnage += repWeight * reps * sets;
		}
		const newSummaryData = { ["tonnage"]: tonnage };
		setSummaryData(newSummaryData);
	};

	const calcIntensity = (rpe, reps) => {
		console.log("RPE: " + rpe);
		console.log("REPS: " + reps);
		return 3;
	}
	// REAL
	useLayoutEffect(() => {
		if (workout) {
			props.navigation.setOptions({
				headerRight: () => (
					<View style={{ flexDirection: "row" }}>
						{/* <HeaderButtons
							HeaderButtonComponent={CustomHeaderButton}
						>
							<Item
								title="delete"
								iconName="info"
								onPress={() => showModalHandler(true)}
							/>
						</HeaderButtons> */}
						<HeaderButtons
							HeaderButtonComponent={CustomHeaderButton}
						>
							<Item
								title="delete"
								iconName="delete"
								onPress={() => showModalHandler(true)}
							/>
						</HeaderButtons>
					</View>
				),

				title: new Date(workout.date.seconds * 1000).toDateString(),
			});
		}

		// BandAid to fix react rendering without the stylesheet on changes
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
	}, [props.navigation, workout]);

	const deleteWorkout = async () => {
		if (workout) {
			console.log(workout);
			await firebase.deleteWorkout(userID, workout);
			console.log("workout and exercises deleted");
			showModalHandler(false);
			props.navigation.goBack();
		}
	};

	const showModalHandler = (value) => {
		setShowModal(value);
	};

	useFocusEffect(
		useCallback(() => {
			const onCloseScreen = () => {

				dispatch({
					type: SET_TAB_BAR_VALUE,
					value: false,
				});
			};
			return () => onCloseScreen();
		}, [props.navigation])
	);
	return (
		<View style={styles.screen}>
			<Modal
				visible={showModal}
				animationType="fade"
				transparent={true}
				onRequestClose={() => setShowModal(false)}
			>
				<Pressable
					onPress={() => {
						showModalHandler(false);
					}}
					style={{...styles.modalView, backgroundColor: `rgba(${modalBackdropHex[0]}, ${modalBackdropHex[1]}, ${modalBackdropHex[2]}, 0.8)`}}
				>
					<Pressable style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<HeadlineText
								large={false}
								style={{ color: currentTheme.onSurface }}
							>
								Delete workout?
							</HeadlineText>
						</View>
						<View style={styles.modalBody}>
							<BodyText
								large={false}
								style={{ color: currentTheme.onSurfaceVariant }}
							>
								This will permanently delete the workout
							</BodyText>
						</View>
						<View style={styles.modalActions}>
							<TextButton
								textStyle={{ color: currentTheme.primary }}
								disabled={false}
								onButtonPress={() => {
									showModalHandler(false);
								}}
							>
								Cancel
							</TextButton>
							<TextButton
								textStyle={{ color: currentTheme.primary }}
								disabled={false}
								onButtonPress={() => deleteWorkout()}
							>
								Delete
							</TextButton>
						</View>
					</Pressable>
				</Pressable>
			</Modal>
			<View style={styles.contentView}>
				<View style={styles.overviewContainer}>
					<TitleText large={false} style={styles.titleText}>
						Overview
					</TitleText>
					<View style={styles.overviewContent}>
						{summaryData != null && (
							<View style={styles.overviewRow}>
								<View style={styles.overviewItem}>
									<LabelText
										large={false}
										style={{
											color: currentTheme.onSurfaceVariant,
										}}
									>
										Tonnage:
									</LabelText>
									<BodyText
										large={false}
										style={{
											color: currentTheme.onSurfaceVariant,
										}}
									>
										{summaryData["tonnage"]} kg
									</BodyText>
								</View>
								<View style={styles.overviewItem}></View>
							</View>
						)}
					</View>
				</View>
				<View style={styles.exerciseListContainer}>
					<View style={styles.exerciseListHeader}>
						<HeadlineText style={{ color: currentTheme.onSurface }}>
							Exercises
						</HeadlineText>
					</View>
					{exercises && (
						<View style={styles.exerciseListList}>
							<ScrollView>
								{exercises.map((exercise) => {
									return (
										<View
											key={exercise.id}
											style={
												styles.exerciseListItemContainer
											}
										>
											<View
												style={{...styles.exerciseListItem, alignSelf: "flex-start"}}
											>
												<LabelText
													style={{
														color: currentTheme.onSurface,
													}}
												>
													Exercise name
												</LabelText>
												<BodyText
													style={{
														color: currentTheme.onSurface,
													}}
												>
													{exercise.exercise}
												</BodyText>
											</View>
											<View
												style={styles.exerciseListItem}
											>
												<LabelText
													style={{
														color: currentTheme.onSurface, alignSelf: "flex-end"
													}}
												>
													Weight 
												</LabelText>
												<BodyText
													style={{
														color: currentTheme.onSurface,
													}}
												>
													{exercise.weight} kg
												</BodyText>
											</View>
											<View
												style={styles.exerciseListItem}
											>
												<LabelText
													style={{
														color: currentTheme.onSurface,
													}}
												>
													Reps
												</LabelText>
												<BodyText
													style={{
														color: currentTheme.onSurface,
													}}
												>
													{exercise.reps}
												</BodyText>
											</View>
											<View
												style={styles.exerciseListItem}
											>
												<LabelText
													style={{
														color: currentTheme.onSurface,
													}}
												>
													Sets
												</LabelText>
												<BodyText
													style={{
														color: currentTheme.onSurface,
													}}
												>
													{exercise.sets}
												</BodyText>
											</View>
											<View
												style={styles.exerciseListItem}
											>
												<LabelText
													style={{
														color: currentTheme.onSurface,
													}}
												>
													RPE
												</LabelText>
												<BodyText
													style={{
														color: currentTheme.onSurface,
													}}
												>
													{exercise.rpe}
												</BodyText>
											</View>
											{/* {exercise.rpe >= 6.5 &&
												exercise.rpe <= 10 &&
												exercise.reps >= 1 &&
												exercise.reps <= 10 && (
													<View
														style={
															styles.exerciseListItem
														}
													>
														<LabelText
															style={{
																color: currentTheme.onSurface,
															}}
														>
															Intensity
														</LabelText>
														<BodyText
															style={{
																color: currentTheme.onSurface,
															}}
														>
															{calcIntensity(exercise.rpe, exercise.reps)}
														</BodyText>
													</View>
												)} */}
										</View>
									);
								})}
							</ScrollView>
						</View>
					)}
				</View>
			</View>
		</View>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		screen: {
			flex: 1,
		},
		contentView: {
			width: "100%",
			alignItems: "center",
		},
		overviewContainer: {
			height: 200,
			marginTop: 10,
			width: "90%",
			backgroundColor: theme.surfaceVariant,
			borderRadius: 12,
			paddingHorizontal: 16,
			paddingVertical: 6,
		},
		overviewContent: {
			flexDirection: "row",
		},
		overviewRow: {
			height: 60,
			flexDirection: "row",
			alignItems: "baseline",
			width: "100%",
			paddingHorizontal: 4,
			paddingVertical: 2,
		},
		exerciseListContainer: {
			marginTop: 30,
			width: "100%",
			height: "60%",
			flexDirection: "column",


			// paddingHorizontal: 16,
		},
		exerciseListHeader: { width: "90%", alignSelf: "center"},
		exerciseListItemContainer: {
			height: 80,
			width: "90%",
			paddingHorizontal: 6,
			paddingVertical: 4,
			flexDirection: "row",
			justifyContent: "space-between",
			marginBottom: 6,
			backgroundColor: theme.surfaceVariant,
			borderRadius: 12,
			alignSelf: "center"
		},
		exerciseListItem: {
			flexDirection: "column",
			alignContent: "flex-start",
			justifyContent: "space-around",
			height: "100%",
		},

		overviewItem: { flex: 1, flexDirection: "row", alignItems: "baseline" },

		titleText: {
			color: theme.onSurfaceVariant,
		},

		modalView: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: theme.surface,
		},
		modalContent: {
			height: 200,
			minWidth: 280,
			maxWidth: 560,
			borderRadius: 28,
			padding: 24,
			backgroundColor: theme.surfaceE3,
		},
		modalHeader: {
			marginBottom: 16,
		},
		modalBody: {
			marginBottom: 24,
		},
		modalActions: {
			flexDirection: "row",
			justifyContent: "flex-end",
		},
	});
};

export default WorkoutDetailScreen;
