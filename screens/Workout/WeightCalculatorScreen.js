import React, { useEffect, useReducer, useState } from "react";
import {
	View,
	StyleSheet,
	KeyboardAvoidingView,
	Pressable,
	Keyboard,
	StatusBar
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

const SET_KWEIGHT = "SET_KWEIGHT";
const SET_KREPS = "SET_KREPS";
const SET_KRPE = "SET_KRPE";
const SET_WREPS = "SET_WREPS";
const SET_WRPE = "SET_WRPE";
const RESET = "RESET";
const SET_ISVALID = "SET_ISVALID";
const CHECK_ISVALID = "CHECK_ISVALID";

const rpeReducer = (state, action) => {
	switch (action.type) {
		case SET_KWEIGHT:
			return { ...state, kWeight: action.value };
		case SET_KREPS:
			return { ...state, kReps: action.value };
		case SET_KRPE:
			return { ...state, kRPE: action.value };
		case SET_WREPS:
			return { ...state, wReps: action.value };
		case SET_WRPE:
			return { ...state, wRPE: action.value };
		case RESET:
			return initialState;
		default:
			return state;
	}
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
	const [rpeState, dispatch] = useReducer(rpeReducer, initialState);
	const [isValid, setIsValid] = useState(false);
	const [calcWeight, setCalcWeight] = useState(0);

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
		if (checkValidState()) {
			console.log("ISVALID");
			setIsValid(true);
		} else {
			setIsValid(false);
		}
	}, [rpeState]);

	const checkValidState = () => {
		console.log("Checkisvalid");
		if (
			rpeState.kWeight == undefined ||
			rpeState.kReps == undefined ||
			rpeState.kRPE == undefined ||
			rpeState.wReps == undefined ||
			rpeState.wRPE == undefined
		) {
			return false;
		}
		if (
			rpeState.kWeight >= 1 &&
			10 >= rpeState.kReps &&
			rpeState.kReps >= 1 &&
			10 >= rpeState.kRPE &&
			rpeState.kRPE >= 6 &&
			10 >= rpeState.wReps &&
			rpeState.wReps >= 1 &&
			10 >= rpeState.wRPE &&
			rpeState.wRPE >= 6
		) {
			return true;
		} else return false;
	};

	const calculateWeight = () => {
		if (isValid) {
			const intensity = rpeCalc.getIntensity(
				rpeState.kRPE,
				rpeState.kReps
			);
			const estimated1RM = Math.round(
				rpeState.kWeight / (intensity / 100)
			);

			const wantedIntensity = rpeCalc.getIntensity(
				rpeState.wRPE,
				rpeState.wReps
			);
			// return Math.round(estimated1RM * (wantedIntensity / 100));
			setCalcWeight(Math.round(estimated1RM * (wantedIntensity / 100)));
			Keyboard.dismiss();
			// return;
		}
	};

	return (
		<View style={styles.container}>
			<Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
				<View style={styles.knownContainer}>
					<TitleText
						large={true}
						style={{
							color: currentTheme.onSurfaceVariant,
							textAlign: "center",
						}}
					>
						Enter Known Rep Values
					</TitleText>
					<View style={styles.inputContainer}>
						<View style={styles.numberInput}>
							<NumberInput
								keyboardType="numeric"
								textAlign="center"
								selectionColor={currentTheme.tertiary}
								onChangeText={(number) =>
									dispatch({
										type: SET_KWEIGHT,
										value: parseInt(number),
									})
								}
							/>
							<BodyText style={{color: currentTheme.onSurface}}  large={true}>Known Weight...</BodyText>
						</View>
						<View style={styles.numberInput}>
							<NumberInput
								keyboardType="numeric"
								textAlign="center"
								selectionColor={currentTheme.tertiary}
								onChangeText={(number) =>
									dispatch({
										type: SET_KREPS,
										value: parseInt(number),
									})
								}
							/>
							<BodyText style={{color: currentTheme.onSurface}}  large={true}>How Many Reps...</BodyText>
						</View>
						<View style={styles.numberInput}>
							<NumberInput
								keyboardType="numeric"
								textAlign="center"
								selectionColor={currentTheme.tertiary}
								onChangeText={(number) =>
									dispatch({
										type: SET_KRPE,
										value: parseInt(number),
									})
								}
							/>
							<BodyText style={{color: currentTheme.onSurface}}  large={true}>At RPE</BodyText>
						</View>
					</View>
					<Divider width="90%" />

					<TitleText
						large={true}
						style={{
							color: currentTheme.onSurfaceVariant,
							textAlign: "center",
						}}
					>
						Enter Wanted Reps and RPE
					</TitleText>
					<View style={styles.wantedInputContainer}>
						<View style={styles.numberInput}>
							<NumberInput
								keyboardType="numeric"
								textAlign="center"
								selectionColor={currentTheme.tertiary}
								onChangeText={(number) =>
									dispatch({
										type: SET_WREPS,
										value: parseInt(number),
									})
								}
							/>
							<BodyText style={{color: currentTheme.onSurface}}  large={true}>Reps</BodyText>
						</View>
						<View style={styles.numberInput}>
							<NumberInput
								keyboardType="numeric"
								textAlign="center"
								selectionColor={currentTheme.tertiary}
								onChangeText={(number) =>
									dispatch({
										type: SET_WRPE,
										value: parseInt(number),
									})
								}
							/>
							<BodyText style={{color: currentTheme.onSurface}}  large={true}>At RPE</BodyText>
						</View>
					</View>
					<FilledButton
						disabled={false}
						onButtonPress={() => calculateWeight()}
						style={{ width: 300 }}
					>
						Calculate
					</FilledButton>
				</View>

				{calcWeight > 0 && (
					<View style={styles.resultContainer}>
						<TitleText
							style={{ color: currentTheme.onSecondaryContainer }}
							large={true}
						>
							Target Weight
						</TitleText>
						<View style={styles.result}>
							<DisplayText
								style={{
									color: currentTheme.onSecondaryContainer,
								}}
								large={true}
							>
								{calcWeight}kg
							</DisplayText>
						</View>
					</View>
				)}
			</Pressable>
		</View>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		container: {
			paddingTop: StatusBar.currentheight,
			flex: 1,
			// justifyContent: "center",
			alignItems: "center",
			backgroundColor: theme.surface
		},
		knownContainer: {
			marginTop: 60,
			width: "90%",
			// ,backgroundColor: theme.secondary
			borderStyle: "solid",
			borderColor: theme.outline,
			borderWidth: 1,
			borderRadius: 16,
			alignItems: "center",
			paddingVertical: 10,
			// justifyContent: "center"
		},
		wantedContainer: {
			marginTop: 20,
			width: "90%",
			// ,backgroundColor: theme.secondary
			borderStyle: "solid",
			borderColor: theme.outline,
			borderWidth: 1,
			borderRadius: 16,
		},
		inputContainer: {
			height: 200,
			flexDirection: "row",
			justifyContent: "space-around",
			alignItems: "center",
		},
		wantedInputContainer: {
			marginVertical: 10,
			flexDirection: "row",
			justifyContent: "space-around",
			alignItems: "center",
		},
		resultContainer: {
			// width: "100%",
			// height: 100,
			marginTop: 20,
			borderRadius: 12,
			backgroundColor: theme.secondaryContainer,
			padding: 10,
			alignItems: "center",
		},
		numberInput: {
			height: 150,
			width: 120,
			// backgroundColor: theme.secondaryContainer,
			alignItems: "center",
			// justifyContent: "space-around",
		},
	});
};


export default WeightCalculatorScreen;
