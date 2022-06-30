import React, { useEffect, useReducer, useState } from "react";
import {
	View,
	Pressable,
	StyleSheet,
	Keyboard,
	Alert,
	ActivityIndicator,
	ScrollView,
} from "react-native";
import {
	TextInput as PaperInput,
	HelperText,
	Snackbar,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import BodyText from "../../components/Text/Body";
import IconButton from "../../components/Buttons/IconButton";
import OutlineButton from "../../components/Buttons/OutlineButton";
import CustomSwitch from "../../components/UI/CustomSwitch";
import { Themes } from "../../shared/Theme";
import TopAppBar from "../../components/UI/TopAppBarComponent";
import TitleText from "../../components/Text/Title";
import { setUseDarkMode } from "../../redux/slices/appSettingsSlice";
import LabelText from "../../components/Text/Label";
import {
	convertImperialHeightToMetric,
	convertMass,
	convertMetricHeightToImperial,
} from "../../shared/utils/UtilFunctions";
import {
	clearErrorState,
	initalUserInfoSave,
} from "../../redux/slices/authSlice";

const SET_NAME = "SET_NAME";
const SET_BIRTHDAY = "SET_BIRTHDAY";
const SET_HEIGHT = "SET_HEIGHT";
const SET_WEIGHT = "SET_WEIGHT";
const SET_USE_DARKMODE = "SET_USE_DARKMODE";
const SET_USEMETRIC = "SET_USEMETRIC";

const userInfoReducer = (state, action) => {
	switch (action.type) {
		case SET_NAME:
			return { ...state, name: action.name };
		case SET_BIRTHDAY:
			return { ...state, birthday: action.birthday };
		case SET_HEIGHT:
			return { ...state, height: action.height };
		case SET_WEIGHT:
			return { ...state, weight: action.weight };
		case SET_USE_DARKMODE:
			return { ...state, useDarkMode: action.useDarkMode };
		case SET_USEMETRIC:
			return { ...state, useMetric: action.useMetric };
		default:
			return state;
	}
};

const userInfoBaseState = {
	name: "",
	birthday: null,
	height: 0,
	weight: 0,
	useDarkMode: false,
	useMetric: true,
};

const NewUserDetailScreen = (props) => {
	// Themes
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const authState = useSelector((state) => state.auth);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	const [showDatePicker, setShowDatePicker] = useState(false);

	const [userInfoState, userInfoDispatch] = useReducer(
		userInfoReducer,
		userInfoBaseState
	);

	const placeholderDate = new Date();

	const dispatch = useDispatch();
	const userID = useSelector((state) => state.auth.userID);

	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		console.log(userInfoState);
		dispatch(setUseDarkMode(userInfoState.useDarkMode));
		// if (!userInfoState.useMetric) {
		// 	const test = convertImperialHeightToMetric(userInfoState.height);
		// 	console.log(test);
		// }else {
		// 	const test = convertMetricHeightToImperial(userInfoState.height);
		// 	console.log(test);
		// }
	}, [userInfoState]);

	useEffect(() => {
		if (authState.error) {
			console.log(authState.error);
			dispatch(clearErrorState());
		}
	});

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	useEffect(() => {
		if (error) {
			Alert.alert("Error when creating user!", error, [{ text: "Okay" }]);
		}
	}, [error]);

	const onNameEndEditing = (event) => {
		const nameCand = event.nativeEvent.text;
		userInfoDispatch({ type: SET_NAME, name: nameCand });
	};

	const onFeetEndEditing = (event) => {
		const newFeet = event.nativeEvent.text;
		console.log(newFeet);
		const heightImp = { feet: newFeet, inch: userInfoState.height.inch };
		userInfoDispatch({ type: SET_HEIGHT, height: heightImp });
	};

	const onInchesEndEditing = (event) => {
		const newInch = event.nativeEvent.text;
		console.log(newInch);
		const heightImp = { feet: userInfoState.height.feet, inch: newInch };
		userInfoDispatch({ type: SET_HEIGHT, height: heightImp });
	};

	const onHeightEndEditing = (event) => {
		userInfoDispatch({ type: SET_HEIGHT, height: event.nativeEvent.text });
	};

	const onWeightEndEditing = (event) => {
		userInfoDispatch({ type: SET_WEIGHT, weight: event.nativeEvent.text });
	};

	const onSetBirthDate = (event, date) => {
		setShowDatePicker(false);
		const newbirthday = date || userInfoState.birthday;
		userInfoDispatch({ type: SET_BIRTHDAY, birthday: newbirthday });
	};

	const onToggleDarkMode = () => {
		const nextValue = !userInfoBaseState.useDarkMode;
		userInfoDispatch({
			type: SET_USE_DARKMODE,
			useDarkMode: !userInfoState.useDarkMode,
		});
	};

	const onSetUseMetric = () => {
		const newValue = !userInfoState.useMetric;
		// if going to metric
		if (newValue) {
			userInfoDispatch({
				type: SET_USEMETRIC,
				useMetric: newValue,
			});
			userInfoDispatch({ type: SET_HEIGHT, height: 0 });
		} else {
			// going to imperial
			userInfoDispatch({
				type: SET_USEMETRIC,
				useMetric: newValue,
			});
			userInfoDispatch({
				type: SET_HEIGHT,
				height: { feet: 0, inch: 0 },
			});
		}
	};

	const onSubmitUserInfo = () => {
		console.log(userInfoState);
		try {
			setIsLoading(true);
			const userInfo = userInfoState;
			if(!userInfo.useMetric) {
				userInfo.height = convertImperialHeightToMetric(userInfo.height);
				userInfo.weight = convertMass(userInfo.weight, true);
			}
			dispatch(initalUserInfoSave({ userInfo: userInfoState }));
		} catch (error) {

		}
	};

	return (
		<Pressable style={styles.screen} onPress={() => Keyboard.dismiss()}>
			{isLoading && (
				<View style={styles.loadingSpinner}>
					<ActivityIndicator
						size="large"
						color={currentTheme.primary}
					/>
				</View>
			)}
			{!isLoading && (
				<ScrollView contentContainerStyle={styles.contentView}>
					<TopAppBar
						headlineText="Enter personal info"
						trailingIcons={[
							<OutlineButton
								onButtonPress={onSubmitUserInfo}
								disabled={userInfoState.name === ""}
							>
								Continue
							</OutlineButton>,
						]}
					/>
					<View style={styles.inputContainer}>
						{showDatePicker && (
							<View style={{ width: "100%" }}>
								<DateTimePicker
									value={
										userInfoState.birthday != null
											? userInfoState.birthday
											: placeholderDate
									}
									mode="date"
									display="default"
									onChange={onSetBirthDate}
								/>
							</View>
						)}
						<View style={styles.requiredInput}>
							<View style={styles.requiredInputHeader}>
								<TitleText
									style={{ color: currentTheme.onSurface }}
								>
									Required info
								</TitleText>
							</View>
							<View style={styles.nameInput}>
								<PaperInput
									style={{
										backgroundColor: currentTheme.surface,
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
									label="Name"
									onEndEditing={(event) =>
										onNameEndEditing(event)
									}
								/>
								<HelperText
									style={{
										color: currentTheme.onSurfaceVariant,
									}}
									visible={true}
									type="info"
								>
									Required*
								</HelperText>
							</View>
						</View>
						<View style={styles.optionalInfo}>
							<View style={styles.optionalInfoHeader}>
								<TitleText
									style={{ color: currentTheme.onSurface }}
								>
									Optional info
								</TitleText>
							</View>
							<View style={styles.birthdayInput}>
								<View
									style={{
										...styles.selectExerciseContainer,
										marginTop: 8,
									}}
								>
									<Pressable
										onPress={() => setShowDatePicker(true)}
										style={styles.selectDate}
									>
										{userInfoState.birthday == null && (
											<BodyText
												large={true}
												style={{
													color: currentTheme.onSurface,
												}}
											>
												Press to add birthday
											</BodyText>
										)}
										{userInfoState.birthday != null && (
											<BodyText
												large={true}
												style={{
													color: currentTheme.onSurface,
												}}
											>
												Birthday:{" "}
												{userInfoState.birthday.toDateString()}
											</BodyText>
										)}
										<IconButton
											style={{ marginLeft: "auto" }}
											name="caret-down"
											// iconColor={currentTheme.primary}
											onPress={() =>
												setShowDatePicker(true)
											}
										/>
									</Pressable>
								</View>
								{/* <HelperText
									style={{
										color: currentTheme.onSurfaceVariant,
									}}
									visible={true}
									type="info"
								>
									Required*
								</HelperText> */}
							</View>

							{!userInfoState.useMetric && (
								<View style={styles.heightWeightInput}>
									<View
										style={{
											...styles.heightInFeet,
											width: "30%",
										}}
									>
										<PaperInput
											style={{
												backgroundColor:
													currentTheme.surface,
											}}
											activeOutlineColor={
												currentTheme.primary
											}
											outlineColor={currentTheme.outline}
											theme={{
												colors: {
													text: currentTheme.onSurface,
													placeholder:
														currentTheme.onSurface,
												},
											}}
											mode="outlined"
											label="Height"
											onEndEditing={(event) =>
												onFeetEndEditing(event)
											}
											keyboardType="numeric"
										/>
										<HelperText
											style={{
												color: currentTheme.onSurfaceVariant,
											}}
											visible={true}
											type="info"
										>
											feet
										</HelperText>
									</View>
									<View
										style={{
											...styles.heightInInches,
											width: "30%",
										}}
									>
										<PaperInput
											style={{
												backgroundColor:
													currentTheme.surface,
											}}
											activeOutlineColor={
												currentTheme.primary
											}
											outlineColor={currentTheme.outline}
											theme={{
												colors: {
													text: currentTheme.onSurface,
													placeholder:
														currentTheme.onSurface,
												},
											}}
											mode="outlined"
											label="Height"
											onEndEditing={(event) =>
												onInchesEndEditing(event)
											}
											keyboardType="numeric"
										/>
										<HelperText
											style={{
												color: currentTheme.onSurfaceVariant,
											}}
											visible={true}
											type="info"
										>
											inches
										</HelperText>
									</View>
									<View
										style={{
											...styles.heightInFeet,
											width: "30%",
										}}
									>
										<PaperInput
											style={{
												backgroundColor:
													currentTheme.surface,
											}}
											activeOutlineColor={
												currentTheme.primary
											}
											outlineColor={currentTheme.outline}
											theme={{
												colors: {
													text: currentTheme.onSurface,
													placeholder:
														currentTheme.onSurface,
												},
											}}
											mode="outlined"
											label="Weight"
											onEndEditing={(event) =>
												onWeightEndEditing(event)
											}
											keyboardType="numeric"
										/>
										<HelperText
											style={{
												color: currentTheme.onSurfaceVariant,
											}}
											visible={true}
											type="info"
										>
											lbs
										</HelperText>
									</View>
								</View>
							)}
							{userInfoState.useMetric && (
								<View style={styles.heightWeightInput}>
									<View
										style={{
											...styles.height,
											width: "48%",
										}}
									>
										<PaperInput
											style={{
												backgroundColor:
													currentTheme.surface,
											}}
											activeOutlineColor={
												currentTheme.primary
											}
											outlineColor={currentTheme.outline}
											theme={{
												colors: {
													text: currentTheme.onSurface,
													placeholder:
														currentTheme.onSurface,
												},
											}}
											mode="outlined"
											label="Height"
											onEndEditing={(event) =>
												onHeightEndEditing(event)
											}
											keyboardType="numeric"
										/>
										<HelperText
											style={{
												color: currentTheme.onSurfaceVariant,
											}}
											visible={true}
											type="info"
										>
											Centimeters
										</HelperText>
									</View>
									<View
										style={{
											...styles.weight,
											width: "48%",
										}}
									>
										<PaperInput
											style={{
												backgroundColor:
													currentTheme.surface,
											}}
											activeOutlineColor={
												currentTheme.primary
											}
											outlineColor={currentTheme.outline}
											theme={{
												colors: {
													text: currentTheme.onSurface,
													placeholder:
														currentTheme.onSurface,
												},
											}}
											mode="outlined"
											label="Weight"
											keyboardType="numeric"
											onEndEditing={(event) =>
												onWeightEndEditing(event)
											}
										/>
										<HelperText
											style={{
												color: currentTheme.onSurfaceVariant,
											}}
											visible={true}
											type="info"
										>
											Kg
										</HelperText>
									</View>
								</View>
							)}

							<View
								style={{
									...styles.appSettingsInput,
									marginTop: 40,
								}}
							>
								<View>
									<TitleText
										style={{
											color: currentTheme.onSurface,
										}}
									>
										App settings
									</TitleText>
									<BodyText
										style={{
											color: currentTheme.onSurface,
										}}
									>
										These will sync across devices you log
										onto
									</BodyText>
								</View>
								<View style={styles.userSettingsItem}>
									<View style={styles.userSettingsText}>
										<BodyText
											large={true}
											style={{
												color: currentTheme.onSurface,
											}}
										>
											Dark Mode
										</BodyText>
									</View>
									<CustomSwitch
										isSwitchSelected={
											userInfoState.useDarkMode
										}
										isSwitchDisabled={false}
										onSwitchPressed={onToggleDarkMode}
									/>
								</View>
								<View style={styles.userSettingsItem}>
									<View style={styles.userSettingsText}>
										<BodyText
											large={true}
											style={{
												color: currentTheme.onSurface,
											}}
										>
											Use Metric
										</BodyText>
										<LabelText
											style={{
												color: currentTheme.onSurface,
											}}
										>
											Affects weight and height units
										</LabelText>
									</View>
									<CustomSwitch
										isSwitchSelected={
											userInfoState.useMetric
										}
										isSwitchDisabled={false}
										onSwitchPressed={onSetUseMetric}
									/>
								</View>
							</View>
						</View>
					</View>
				</ScrollView>
			)}
		</Pressable>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		screen: {
			flex: 1,
			backgroundColor: theme.surface,
		},
		contentView: {
			// flex: 1,
			alignItems: "center",
		},
		requiredInput: {
			marginTop: 20,
		},
		optionalInfo: {
			marginTop: 40,
		},
		inputContainer: {
			width: "100%",
			justifyContent: "center",
			paddingHorizontal: 24,
		},
		birthdayInput: {
			marginBottom: 10,
		},
		selectExerciseContainer: {
			width: "100%",
			height: 56,
			justifyContent: "center",
			alignItems: "center",
			marginTop: 8,
		},
		heightWeightInput: {
			height: 80,
			width: "100%",
			// backgroundColor: theme.error,
			flexDirection: "row",
			justifyContent: "space-between",
		},
		userSettingsItem: {
			height: 80,
			width: "100%",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		},
		userSettingsText: {
			flexDirection: "column",
			justifyContent: "space-around",
			maxWidth: "60%",
		},

		selectDate: {
			flexDirection: "row",
			width: "100%",
			height: "100%",
			borderRadius: 4,
			borderWidth: 1,
			borderColor: theme.outline,

			paddingHorizontal: 16,
			alignItems: "center",
		},

		loadingSpinner: {
			flex: 1,
			height: "100%",
			width: "100%",
			justifyContent: "center",
			alignItems: "center",
		},
	});
};

export default NewUserDetailScreen;
