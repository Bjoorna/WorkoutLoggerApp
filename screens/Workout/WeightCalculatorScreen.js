import React, {
	useEffect,
	useLayoutEffect,
	useReducer,
	useRef,
	useState,
} from "react";
import {
	View,
	StyleSheet,
	Pressable,
	Keyboard,
	Modal,
	ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import RPEMap from "../../shared/utils/RPEMap";
import { Themes } from "../../shared/Theme";
import BodyText from "../../components/Text/Body";
import TitleText from "../../components/Text/Title";
import DisplayText from "../../components/Text/Display";

import TextButton from "../../components/Buttons/TextButton";
import HeadlineText from "../../components/Text/Headline";
import IconButton from "../../components/Buttons/IconButton";
import { FilledTextField } from "rn-material-ui-textfield";
import UtilFunctions from "../../shared/utils/UtilFunctions";

const RESET = "RESET";
const ADD_VALUE = "ADD_VALUE";

const calculatorReducer = (state, action) => {
	switch (action.type) {
		case ADD_VALUE:
			const newState = { ...state };
			newState[action.field] = action.newValue;
			return newState;
		case RESET:
			const newBaseState = { ...baseState };
			return newBaseState;
		default:
			return state;
	}
};
const baseState = {
	knownWeight: { value: null, error: false },
	knownReps: { value: null, error: false },
	knownRPE: { value: null, error: false },
	wantReps: { value: null, error: false },
	wantRPE: { value: null, error: false },
};

const WeightCalculatorScreen = (props) => {
	const rpeCalc = new RPEMap();
	const [calculatorState, dispatchCalculator] = useReducer(
		calculatorReducer,
		baseState
	);
	const userSettings = useSelector((state) => state.user.user);
	const [calcWeight, setCalcWeight] = useState(0);

	const [isFormValid, setIsFormValid] = useState(false);
	const [useMetric, setUseMetric] = useState(true);
	const [modalVisible, setModalVisible] = useState(false);

	const knownWeightRef = useRef(null);
	const knownRepsRef = useRef(null);
	const knownRpeRef = useRef(null);
	const wantedRepsRef = useRef(null);
	const wantedRpeRef = useRef(null);

	// Themes
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);
	const [scrimColor, setScrimColor] = useState(
		UtilFunctions.hexToRGB(currentTheme.surface)
	);
	useEffect(() => {
		console.log("USERsettings from calculator");
		console.log(userSettings);
		console.log(useMetric);
	}, []);
	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	useEffect(() => {
		let validValue = true;
		for (const [key, value] of Object.entries(calculatorState)) {
			if (value.error === true || value.value === null) {
				validValue = false;
				break;
			}
		}
		setIsFormValid(validValue);
		if (validValue) {
			calculcateValue();
		}
	}, [calculatorState]);

	useEffect(() => {
		setUseMetric(userSettings.useMetric);
	}, [userSettings]);

	useEffect(() => {
		calculcateValue();
	}, [isFormValid]);

	const calculcateValue = () => {
		if (isFormValid) {
			const intensity = rpeCalc.getIntensity(
				calculatorState["knownRPE"].value,
				calculatorState["knownReps"].value
			);
			const e1RM = Math.round(
				calculatorState["knownWeight"].value / (intensity / 100)
			);
			const wantedIntensity = rpeCalc.getIntensity(
				calculatorState["wantRPE"].value,
				calculatorState["wantReps"].value
			);
			const eWeight = Math.round(e1RM * (wantedIntensity / 100));
			setCalcWeight(eWeight);
		} else {
			setCalcWeight(0);
		}
	};

	useLayoutEffect(() => {
		props.navigation.setOptions({
			headerStyle: {
				backgroundColor: currentTheme.surface,
			},
			headerTintColor: currentTheme.onSurface,
			headerRight: () => (
				<View style={{ flexDirection: "row" }}>
					<IconButton
						name="information-circle"
						iconColor={currentTheme.onSurfaceVariant}
						onPress={() => setModalVisible(true)}
					/>
				</View>
			),
		});
	}, [props.navigation, currentTheme]);

	const onValueEntered = (ref, type) => {
		const value = ref.current.value();

		const sanitizedValue = Number(value.replace(/,/g, "."));

		const isValid = inputValueValidityCheck(type, sanitizedValue);
		if (isValid) {
			dispatchCalculator({
				type: ADD_VALUE,
				field: type,
				newValue: { value: sanitizedValue, error: false },
			});
		} else {
			dispatchCalculator({
				type: ADD_VALUE,
				field: type,
				newValue: { value: sanitizedValue, error: true },
			});
		}
	};

	const onResetForm = () => {
		knownWeightRef.current.setValue(null);
		knownRepsRef.current.setValue(null);
		knownRpeRef.current.setValue(null);
		wantedRepsRef.current.setValue(null);
		wantedRpeRef.current.setValue(null);
		dispatchCalculator({ type: RESET });
	};

	const inputValueValidityCheck = (type, value) => {
		if (type === "knownRPE" || type === "wantRPE") {
			if (value >= 6.5 && value <= 10) {
				return true;
			} else {
				return false;
			}
		} else {
			if (value > 0 && value != null) {
				return true;
			}
			return false;
		}
	};

	const handleContainerPress = () => {
		Keyboard.dismiss();
	};

	return (
		<Pressable onPress={handleContainerPress} style={styles.container}>
			<Modal
				visible={modalVisible}
				transparent={true}
				onRequestClose={() => setModalVisible(false)}
			>
				<Pressable
					onPress={() => setModalVisible(false)}
					style={{
						...styles.modalScrim,
						backgroundColor: `rgba(${scrimColor[0]}, ${scrimColor[1]}, ${scrimColor[2]}, 0.8)`,
					}}
				>
					<Pressable style={styles.dialogContent}>
						<View style={styles.dialogHeader}>
							<HeadlineText
								style={{ color: currentTheme.onSurface }}
							>
								How to use
							</HeadlineText>
						</View>
						<View style={styles.dialogBody}>
							<ScrollView>
								<BodyText
									large={true}
									style={{
										color: currentTheme.onSurfaceVariant,
										marginBottom: 10,
									}}
								>
									You can use this to get an estimate for what
									weight you can use for an exercise
								</BodyText>
								<BodyText
									large={true}
									style={{
										color: currentTheme.onSurfaceVariant,
										marginBottom: 10,
									}}
								>
									If you know the RPE and amount of reps for a
									given weight, you can enter these. Then
									enter the amount of reps at a spesific RPE
									that you want to train at.
								</BodyText>
								<BodyText
									large={true}
									style={{
										color: currentTheme.onSurfaceVariant,
									}}
								>
									The app will then calculate an estimate for
									what weight you should train with.
								</BodyText>
							</ScrollView>
						</View>
						<View style={styles.dialogActions}>
							<TextButton
								onButtonPress={() => setModalVisible(false)}
							>
								Close
							</TextButton>
						</View>
					</Pressable>
				</Pressable>
			</Modal>
			<View style={styles.inputContainer}>
				<View style={styles.inputHeader}>
					<TitleText
						large={true}
						style={{ color: currentTheme.onSurface }}
					>
						Enter known Rep values
					</TitleText>
				</View>
				<View style={styles.knownInputContainer}>
					<View style={styles.knownInputItem}>
						<FilledTextField
							ref={knownWeightRef}
							label="Weight"
							keyboardType="numeric"
							textColor={currentTheme.onSurfaceVariant}
							baseColor={currentTheme.onSurfaceVariant}
							tintColor={currentTheme.primary}
							inputContainerStyle={{
								backgroundColor: currentTheme.surfaceVariant,
							}}
							errorColor={currentTheme.error}
							onBlur={() =>
								onValueEntered(knownWeightRef, "knownWeight")
							}
							error={
								calculatorState["knownWeight"].error
									? "Must be positive"
									: ""
							}
						/>
					</View>
					<View style={styles.knownInputItem}>
						<FilledTextField
							ref={knownRepsRef}
							label="Reps"
							keyboardType="numeric"
							textColor={currentTheme.onSurfaceVariant}
							baseColor={currentTheme.onSurfaceVariant}
							tintColor={currentTheme.primary}
							inputContainerStyle={{
								backgroundColor: currentTheme.surfaceVariant,
							}}
							errorColor={currentTheme.error}
							onBlur={() =>
								onValueEntered(knownRepsRef, "knownReps")
							}
							error={
								calculatorState["knownReps"].error
									? "Must be positive"
									: ""
							}
						/>
					</View>
					<View style={styles.knownInputItem}>
						<FilledTextField
							ref={knownRpeRef}
							label="RPE"
							keyboardType="numeric"
							textColor={currentTheme.onSurfaceVariant}
							baseColor={currentTheme.onSurfaceVariant}
							tintColor={currentTheme.primary}
							inputContainerStyle={{
								backgroundColor: currentTheme.surfaceVariant,
							}}
							errorColor={currentTheme.error}
							onBlur={() =>
								onValueEntered(knownRpeRef, "knownRPE")
							}
							error={
								calculatorState["knownRPE"].error
									? "Between 6.5-10"
									: ""
							}
						/>
					</View>
				</View>
				<View style={styles.inputHeader}>
					<TitleText
						large={true}
						style={{ color: currentTheme.onSurface }}
					>
						Enter wanted Rep values
					</TitleText>
				</View>
				<View style={styles.wanthedInputContainer}>
					<View style={styles.wantedInputItem}>
						<FilledTextField
							ref={wantedRepsRef}
							label="Reps"
							keyboardType="numeric"
							textColor={currentTheme.onSurfaceVariant}
							baseColor={currentTheme.onSurfaceVariant}
							tintColor={currentTheme.primary}
							inputContainerStyle={{
								backgroundColor: currentTheme.surfaceVariant,
							}}
							errorColor={currentTheme.error}
							onBlur={() =>
								onValueEntered(wantedRepsRef, "wantReps")
							}
							error={
								calculatorState["wantReps"].error
									? "Positive number"
									: ""
							}
						/>
					</View>
					<View style={styles.wantedInputItem}>
						<FilledTextField
							ref={wantedRpeRef}
							label="RPE"
							keyboardType="numeric"
							textColor={currentTheme.onSurfaceVariant}
							baseColor={currentTheme.onSurfaceVariant}
							tintColor={currentTheme.primary}
							inputContainerStyle={{
								backgroundColor: currentTheme.surfaceVariant,
							}}
							errorColor={currentTheme.error}
							onBlur={() =>
								onValueEntered(wantedRpeRef, "wantRPE")
							}
							error={
								calculatorState["wantRPE"].error
									? "Between 6.5-10"
									: ""
							}
						/>
					</View>
				</View>
			</View>
			<View style={styles.resultContainer}>
				<View style={styles.resultHeader}>
					<TitleText
						large={true}
						style={{ color: currentTheme.onSecondaryContainer }}
					>
						Estimated Weight
					</TitleText>
					<TextButton
						onButtonPress={onResetForm}
						style={{ marginLeft: "auto" }}
					>
						Clear
					</TextButton>
				</View>
				<View style={styles.resultView}>
					<View
						style={{
							flexDirection: "row",
							alignItems: "flex-end",
							// height: 100,
						}}
					>
						<DisplayText
							style={{
								color: currentTheme.onSecondaryContainer,
							}}
						>
							{calcWeight != 0 ? calcWeight.toString() : ""}
						</DisplayText>
						{isFormValid && (
							<HeadlineText
								style={{
									color: currentTheme.onSecondaryContainer,
								}}
							>
								{useMetric ? "kg" : "lbs"}
							</HeadlineText>
						)}
					</View>
				</View>
			</View>
		</Pressable>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			alignItems: "center",
			backgroundColor: theme.surface,
		},
		inputContainer: {
			width: "100%",
			paddingHorizontal: 24,
			marginTop: 20,
		},
		knownInputContainer: {
			height: 100,
			width: "100%",
			flexDirection: "row",
			justifyContent: "space-around",
			alignItems: "center",
		},
		knownInputItem: {
			width: 100,
		},
		wanthedInputContainer: {
			height: 100,
			width: "100%",
			flexDirection: "row",
			justifyContent: "space-around",
			alignItems: "center",
		},
		wantedInputItem: {
			width: 150,
		},
		resultContainer: {
			flex: 1,
			flexDirection: "column",
			width: "100%",
			paddingHorizontal: 24,
			backgroundColor: theme.secondaryContainer,
			borderTopRightRadius: 24,
			borderTopLeftRadius: 24,
		},
		resultHeader: {
			width: "100%",
			height: 60,
			flexDirection: "row",
			alignItems: "center",
		},
		resultView: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
		},
		modalScrim: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: theme.surface,
		},
		dialogContent: {
			minWidth: 280,
			maxWidth: 560,
			maxHeight: 500,
			borderRadius: 28,
			padding: 24,
			backgroundColor: theme.surfaceE3,
		},
		dialogHeader: { marginBottom: 16 },
		dialogBody: {
			width: "80%",
			marginBottom: 24,
		},
		dialogActions: {
			flexDirection: "row",
			justifyContent: "flex-end",
		},
	});
};

export default WeightCalculatorScreen;
