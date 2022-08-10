import React, {
	useState,
	useEffect,
	useLayoutEffect,
	useCallback,
} from "react";
import {
	View,
	StyleSheet,
	Modal,
	Pressable,
	ScrollView,
	StatusBar,
	FlatList,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/core";
import { Themes } from "../../shared/Theme";
import BodyText from "../../components/Text/Body";
import TitleText from "../../components/Text/Title";
import LabelText from "../../components/Text/Label";
import HeadlineText from "../../components/Text/Headline";
import TextButton from "../../components/Buttons/TextButton";
import IconButton from "../../components/Buttons/IconButton";
import {
	hexToRGB,
	transformObjectToWorkout,
} from "../../shared/utils/UtilFunctions";
import { TextInput as PaperInput } from "react-native-paper";
import { setHideTabBar } from "../../redux/slices/appSettingsSlice";
import {
	deleteWorkout,
	updateWorkoutField,
} from "../../redux/slices/workoutSlice";
import TopAppBar from "../../components/UI/TopAppBarComponent";
import DetailedExerciseListItem from "../../components/DetailedExerciseListItem";

const WorkoutDetailScreen = (props) => {
	const dispatch = useDispatch();
	const workoutID = props.route.params.workoutID;
	const userID = useSelector((state) => state.auth.userID);
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const reduxWorkoutsRef = useSelector((state) => state.workout.workouts);
	const reduxExercisesRef = useSelector((state) => state.workout.exercises);

	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	const [workout, setWorkout] = useState(null);
	const [exercises, setExercises] = useState(null);
	const [summaryData, setSummaryData] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [showNote, setShowNote] = useState(false);
	const [editNote, setEditNote] = useState(false);
	const [updatedNote, setUpdatedNote] = useState("");
	const [noteTextFieldMaxWidth, setNoteTextFieldMaxWidth] = useState(-1);
	const [modalBackdropHex, setModalBackdropHex] = useState(
		hexToRGB(currentTheme.surface)
	);

	useEffect(() => {
		const onWorkout = reduxWorkoutsRef[workoutID];
		setWorkout(onWorkout);
	}, []);

	useEffect(() => {
		console.log("Workout Changed");
		if (workout) {
			const exerciseIDs = workout.exercises;
			const exerciseArray = [];
			for (let id of exerciseIDs) {
				const exercise = reduxExercisesRef[id];
				exerciseArray.push(exercise);
			}
			setExercises(exerciseArray);
			calculateSummary(exerciseArray);
		}
	}, [workout]);


	useEffect(() => {
		setStyles(useDarkMode ? Themes.dark : Themes.light);
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
		setModalBackdropHex(hexToRGB(currentTheme.surface));
	}, [useDarkMode]);

	const calculateSummary = (exercises) => {
		let totalTonnage = 0;
		for (let exercise of exercises) {
			const sets = Object.values(exercise.sets);
			for (let set of sets) {
				const repWeight = set.weight;
				const repReps = set.reps;
				totalTonnage += repWeight * repReps;
			}
			// const repWeight = exercise.weight;
			// const reps = exercise.reps;
			// const sets = exercise.sets;
			// totalTonnage += repWeight * reps * sets;
		}
		const newSummaryData = { ["tonnage"]: totalTonnage };
		setSummaryData(newSummaryData);
	};


	useLayoutEffect(() => {
		// BandAid to fix react rendering without the stylesheet on changes
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
	}, [props.navigation, workout]);

	const onDeleteWorkout = async () => {
		if (workout) {
			console.log(workout);

			const workoutDeleted = await dispatch(
				deleteWorkout(workout)
			).unwrap();
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
				dispatch(setHideTabBar(false));
			};
			return () => onCloseScreen();
		}, [props.navigation])
	);

	const onUpdateNote = () => {
		const payload = { workoutID: workout.id, field: { note: updatedNote } };
		dispatch(updateWorkoutField(payload));
		setEditNote(false);
		setShowNote(false);
	};

	const onNoteModalLayout = (event) => {
		const widthOnOpen = event.nativeEvent.layout.width;
		if (noteTextFieldMaxWidth === -1) {
			setNoteTextFieldMaxWidth(widthOnOpen);
		}
	};
	return (
		<View style={styles.screen}>
			<Modal
				visible={showNote}
				animationType="fade"
				transparent={true}
				onRequestClose={() => setShowNote(false)}
			>
				<Pressable
					onPress={() => {
						setShowNote(false);
					}}
					style={{
						...styles.modalView,
						backgroundColor: `rgba(${modalBackdropHex[0]}, ${modalBackdropHex[1]}, ${modalBackdropHex[2]}, 0.8)`,
					}}
				>
					<Pressable style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<HeadlineText
								large={false}
								style={{ color: currentTheme.onSurface }}
							>
								{editNote ? "Edit note" : "Note"}
							</HeadlineText>
						</View>
						{editNote && (
							<View
								style={[
									styles.modalBody,
									noteTextFieldMaxWidth !== -1
										? { width: noteTextFieldMaxWidth }
										: {},
								]}
								onLayout={(event) => onNoteModalLayout(event)}
							>
								<PaperInput
									style={{
										maxWidth: "100%",
										backgroundColor: currentTheme.surfaceE3,
									}}
									activeOutlineColor={currentTheme.primary}
									outlineColor={currentTheme.outline}
									theme={{
										colors: {
											text: currentTheme.onSurface,
											placeholder: currentTheme.onSurface,
										},
									}}
									mode="outlined"
									label="Note"
									multiline={true}
									onChangeText={setUpdatedNote}
									keyboardType="default"
									defaultValue={
										workout.note !== "" ? workout.note : ""
									}
								/>
							</View>
						)}
						{!editNote && (
							<View style={styles.modalBody}>
								{workout != null && (
									<BodyText
										large={false}
										style={{
											color: currentTheme.onSurfaceVariant,
										}}
									>
										{workout.note}
									</BodyText>
								)}
							</View>
						)}
						{!editNote && (
							<View style={styles.modalActions}>
								<TextButton
									textStyle={{ color: currentTheme.primary }}
									disabled={false}
									onButtonPress={() => {
										setShowNote(false);
									}}
								>
									Close
								</TextButton>
								<TextButton
									textStyle={{ color: currentTheme.primary }}
									disabled={false}
									onButtonPress={() => setEditNote(true)}
								>
									Edit
								</TextButton>
							</View>
						)}
						{editNote && (
							<View style={styles.modalActions}>
								<TextButton
									textStyle={{ color: currentTheme.primary }}
									disabled={false}
									onButtonPress={() => {
										setEditNote(false);
									}}
								>
									Cancel
								</TextButton>
								<TextButton
									textStyle={{ color: currentTheme.primary }}
									disabled={false}
									onButtonPress={onUpdateNote}
								>
									Save
								</TextButton>
							</View>
						)}
					</Pressable>
				</Pressable>
			</Modal>

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
					style={{
						...styles.modalView,
						backgroundColor: `rgba(${modalBackdropHex[0]}, ${modalBackdropHex[1]}, ${modalBackdropHex[2]}, 0.8)`,
					}}
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
								onButtonPress={() => onDeleteWorkout()}
							>
								Delete
							</TextButton>
						</View>
					</Pressable>
				</Pressable>
			</Modal>
			<TopAppBar
				navigationButton={
					<IconButton
						onPress={() => props.navigation.goBack()}
						name="arrow-back"
						iconColor={currentTheme.onSurface}
					/>
				}
				headlineText="Weightlifting"
				backgroundColor={currentTheme.surfaceE2}
				trailingIcons={[
					<IconButton
						name="document-text-outline"
						iconColor={currentTheme.onSurfaceVariant}
						onPress={() => setShowNote(true)}
					/>,
					<IconButton
						name="trash-outline"
						iconColor={currentTheme.onSurfaceVariant}
						onPress={() => setShowModal(true)}
					/>,
				]}
			/>
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
										Tonnage:{" "}
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
					<FlatList
						data={exercises}
						contentContainerStyle={{ width: "100%" }}
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
						ListHeaderComponent={
							<TitleText
								large={true}
								style={{ color: currentTheme.onSurface }}
							>
								Exercises
							</TitleText>
						}
						ListHeaderComponentStyle={{ paddingHorizontal: 24 }}
						renderItem={(itemData) => (
							<DetailedExerciseListItem
								exerciseID={itemData.item.id}
							/>
						)}
					/>
				</View>
			</View>
		</View>
	);
};

const getStyles = (theme, scrimColor) => {
	return StyleSheet.create({
		screen: {
			flex: 1,
		},
		contentView: {
			flex: 1,
		},
		overviewContainer: {
			minHeight: 200,
			// flex:1,
			// marginTop: 10,
			// width: "90%",
			backgroundColor: theme.surfaceE2,
			// borderRadius: 12,
			paddingHorizontal: 24,
			paddingVertical: 6,
		},
		overviewContent: {
			flexDirection: "row",
			flex: 1,
		},
		overviewRow: {
			height: 60,
			flexDirection: "row",
			alignItems: "baseline",
			width: "100%",
			// paddingHorizontal: 4,
			paddingVertical: 2,
		},
		exerciseListContainer: {
			// marginTop: 30,
			flex: 1,
			// paddingHorizontal: 24,
			// paddingVertical: 12,
			// width: "100%",
			// height: "60%",
			flexDirection: "column",
			justifyContent: "center",
			// alignItems: "center"
			// backgroundColor: "red",

			// paddingHorizontal: 16,
		},
		exerciseListHeader: { width: "90%", alignSelf: "center" },
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
			alignSelf: "center",
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
			minHeight: 100,
			minWidth: 280,
			maxWidth: 560,
			borderRadius: 28,
			padding: 24,
			backgroundColor: theme.surfaceE3,
		},
		modalContentEditMode: {},

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
