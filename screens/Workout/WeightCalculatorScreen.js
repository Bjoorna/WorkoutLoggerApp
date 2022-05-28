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
	KeyboardAvoidingView,
	Pressable,
	Keyboard,
	StatusBar,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import RPEMap from "../../shared/utils/RPEMap";

import { Themes } from "../../shared/Theme";
import NumberInput from "../../components/UI/NumberInput";
import BodyText from "../../components/Text/Body";
import TitleText from "../../components/Text/Title";
import DisplayText from "../../components/Text/Display";

import Divider from "../../components/UI/Divider";
import FilledButton from "../../components/Buttons/FilledButton";
import OutlineButton from "../../components/Buttons/OutlineButton";
import TextButton from "../../components/Buttons/TextButton";
import HeadlineText from "../../components/Text/Headline";

import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/Buttons/CustomHeaderButton";
import { FilledTextField } from "rn-material-ui-textfield";
import LabelText from "../../components/Text/Label";

const SET_KWEIGHT = "SET_KWEIGHT";
const SET_KREPS = "SET_KREPS";
const SET_KRPE = "SET_KRPE";
const SET_WREPS = "SET_WREPS";
const SET_WRPE = "SET_WRPE";
const RESET = "RESET";
const SET_ISVALID = "SET_ISVALID";
const CHECK_ISVALID = "CHECK_ISVALID";
const ADD_VALUE = "ADD_VALUE";

const calculatorReducer = (state, action) => {
	switch (action.type) {
		// case SET_KWEIGHT:
		// 	return { ...state, kWeight: action.value };
		// case SET_KREPS:
		// 	return { ...state, kReps: action.value };
		// case SET_KRPE:
		// 	return { ...state, kRPE: action.value };
		// case SET_WREPS:
		// 	return { ...state, wReps: action.value };
		// case SET_WRPE:
		// 	return { ...state, wRPE: action.value };
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

const initialState = {
	kWeight: -1,
	kReps: -1,
	kRPE: -1,
	wReps: -1,
	wRPE: -1,
	isValid: false,
};

const WeightCalculatorScreen = (props) => {
	const rpeCalc = new RPEMap();
	const [calculatorState, dispatchCalculator] = useReducer(
		calculatorReducer,
		baseState
	);
	const [isValid, setIsValid] = useState(false);
	const [calcWeight, setCalcWeight] = useState(0);

	const [isFormValid, setIsFormValid] = useState(false);

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
					<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
						<Item
							title="info"
							iconName="info"
							onPress={() => console.log("Show Info")}
						/>
					</HeaderButtons>
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
								kg
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
			// paddingTop: StatusBar.currentheight,
			// marginTop: 20,
			flex: 1,
			// justifyContent: "center",
			alignItems: "center",
			backgroundColor: theme.surface,
		},
		inputContainer: {
			width: "100%",
			// height: 200,
			paddingHorizontal: 24,
			// backgroundColor: theme.error
			marginTop: 20,
		},
		knownInputContainer: {
			height: 100,
			width: "100%",
			// backgroundColor: theme.error,
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
			// height: 300,
			width: "100%",
			paddingHorizontal: 24,
			backgroundColor: theme.secondaryContainer,
			borderTopRightRadius: 24,
			borderTopLeftRadius: 24,
		},
		resultHeader: {
			width: "100%",
			height: 60,
			// backgroundColor: theme.error,
			flexDirection: "row",
			alignItems: "center",
		},
		resultView: {
			// height: "100%",
			// width: "100%",
			// borderWidth:1,
			// borderRadius: 24,
			// borderColor: theme.outline
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
		},
		// knownContainer: {
		// 	marginTop: 60,
		// 	width: "90%",
		// 	// ,backgroundColor: theme.secondary
		// 	borderStyle: "solid",
		// 	borderColor: theme.outline,
		// 	borderWidth: 1,
		// 	borderRadius: 16,
		// 	alignItems: "center",
		// 	paddingVertical: 10,
		// 	// justifyContent: "center"
		// },
		// wantedContainer: {
		// 	marginTop: 20,
		// 	width: "90%",
		// 	// ,backgroundColor: theme.secondary
		// 	borderStyle: "solid",
		// 	borderColor: theme.outline,
		// 	borderWidth: 1,
		// 	borderRadius: 16,
		// },
		// inputContainer: {
		// 	height: 200,
		// 	flexDirection: "row",
		// 	justifyContent: "space-around",
		// 	alignItems: "center",
		// },
		// wantedInputContainer: {
		// 	marginVertical: 10,
		// 	flexDirection: "row",
		// 	justifyContent: "space-around",
		// 	alignItems: "center",
		// },
		// resultContainer: {
		// 	// width: "100%",
		// 	// height: 100,
		// 	marginTop: 20,
		// 	borderRadius: 12,
		// 	backgroundColor: theme.secondaryContainer,
		// 	padding: 10,
		// 	alignItems: "center",
		// },
		// numberInput: {
		// 	height: 150,
		// 	width: 120,
		// 	// backgroundColor: theme.secondaryContainer,
		// 	alignItems: "center",
		// 	// justifyContent: "space-around",
		// },
	});
};

export default WeightCalculatorScreen;
