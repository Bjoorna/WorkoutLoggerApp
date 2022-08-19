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
import { useDispatch, useSelector } from "react-redux";
import RPEMap from "../../shared/utils/RPEMap";
import { Themes } from "../../shared/Theme";
import BodyText from "../../components/Text/Body";
import TitleText from "../../components/Text/Title";
import DisplayText from "../../components/Text/Display";

import TextButton from "../../components/Buttons/TextButton";
import HeadlineText from "../../components/Text/Headline";
import IconButton from "../../components/Buttons/IconButton";
import { TextInput as PaperInput, HelperText } from "react-native-paper";
import {
	getIntensity,
	hexToRGB,
	inputValueValidityCheck,
} from "../../shared/utils/UtilFunctions";
import { setHideTabBar } from "../../redux/slices/appSettingsSlice";
import TopAppBar from "../../components/UI/TopAppBarComponent";

import { useNavigation } from "@react-navigation/core";

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
	const dispatch = useDispatch();
	const navigation = useNavigation();

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
		hexToRGB(currentTheme.surface)
	);
	useEffect(() => {
		return () => {
			dispatch(setHideTabBar(false));
		};
	}, []);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	useEffect(() => {
		let validValue = true;
		for (const value of Object.values(calculatorState)) {
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
			const intensity = getIntensity(
				calculatorState["knownRPE"].value,
				calculatorState["knownReps"].value
			);
			const e1RM = Math.round(
				calculatorState["knownWeight"].value / (intensity / 100)
			);
			const wantedIntensity = getIntensity(
				calculatorState["wantRPE"].value,
				calculatorState["wantReps"].value
			);
			const eWeight = Math.round(e1RM * (wantedIntensity / 100));
			setCalcWeight(eWeight);
		} else {
			setCalcWeight(0);
		}
	};

	const onValueEntered = (text, type) => {
		// const value = event.nativeEvent.text;
		const value = text;
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
		knownWeightRef.current.clear();
		knownRepsRef.current.clear();
		knownRpeRef.current.clear();
		wantedRepsRef.current.clear();
		wantedRpeRef.current.clear();
		dispatchCalculator({ type: RESET });
	};

	const handleContainerPress = () => {
		Keyboard.dismiss();
	};

	return (
		<Pressable onPress={handleContainerPress} style={styles.container}>
			<TopAppBar
				headlineText={"Calculator"}
				navigationButton={
					<IconButton
						name="arrow-back"
						iconColor={currentTheme.onSurface}
						onPress={() => navigation.goBack()}
					/>
				}
				trailingIcons={[
					<IconButton
						onPress={() => setModalVisible(true)}
						iconColor={currentTheme.onSurfaceVariant}
						name="information-circle-outline"
					/>,
				]}
			/>
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
								onPress={() => setModalVisible(false)}
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
						<PaperInput
							ref={knownWeightRef}
							value={
								calculatorState["knownWeight"].value === null
									? ""
									: calculatorState[
											"knownWeight"
									  ].value.toString()
							}
							mode="outlined"
							keyboardType="numeric"
							style={{
								backgroundColor: currentTheme.surface,
							}}
							activeOutlineColor={
								calculatorState["knownWeight"].error
									? currentTheme.error
									: currentTheme.primary
							}
							outlineColor={
								calculatorState["knownWeight"].error
									? currentTheme.error
									: currentTheme.outline
							}
							theme={{
								colors: {
									text: calculatorState["knownWeight"].error
										? currentTheme.error
										: currentTheme.onSurface,
									placeholder: calculatorState["knownWeight"]
										.error
										? currentTheme.error
										: currentTheme.onSurface,
								},
							}}
							onChangeText={(text) =>
								onValueEntered(text, "knownWeight")
							}
							// onEndEditing={(event) =>
							// 	onValueEntered(event, "knownWeight")
							// }
							label="Weight"
						/>
						<HelperText
							theme={{
								colors: {
									error: currentTheme.error,
									text: calculatorState["knownWeight"].error
										? currentTheme.error
										: currentTheme.onSurfaceVariant,
									placeholder: calculatorState["knownWeight"]
										.error
										? currentTheme.error
										: currentTheme.onSurface,
								},
							}}
							type={
								calculatorState["knownWeight"].error
									? "error"
									: "info"
							}
						>
							{calculatorState["knownWeight"].error
								? "Must be positive"
								: useMetric
								? "kg"
								: "lbs"}
						</HelperText>
					</View>
					<View style={styles.knownInputItem}>
						<PaperInput
							ref={knownRepsRef}
							value={
								calculatorState["knownReps"].value === null
									? ""
									: calculatorState[
											"knownReps"
									  ].value.toString()
							}
							mode="outlined"
							keyboardType="numeric"
							style={{
								backgroundColor: currentTheme.surface,
							}}
							activeOutlineColor={
								calculatorState["knownReps"].error
									? currentTheme.error
									: currentTheme.primary
							}
							outlineColor={
								calculatorState["knownReps"].error
									? currentTheme.error
									: currentTheme.outline
							}
							theme={{
								colors: {
									text: calculatorState["knownReps"].error
										? currentTheme.error
										: currentTheme.onSurface,
									placeholder: calculatorState["knownReps"]
										.error
										? currentTheme.error
										: currentTheme.onSurface,
								},
							}}
							onChangeText={(text) =>
								onValueEntered(text, "knownReps")
							}
							// onEndEditing={(event) =>
							// 	onValueEntered(event, "knownReps")
							// }
							label="Reps"
						/>
						<HelperText
							theme={{
								colors: {
									error: currentTheme.error,
									text: calculatorState["knownReps"].error
										? currentTheme.error
										: currentTheme.onSurfaceVariant,
									placeholder: calculatorState["knownReps"]
										.error
										? currentTheme.error
										: currentTheme.onSurface,
								},
							}}
							type={
								calculatorState["knownReps"].error
									? "error"
									: "info"
							}
						>
							{calculatorState["knownReps"].error
								? "Must be positive"
								: ""}
						</HelperText>
					</View>
					<View style={styles.knownInputItem}>
						<PaperInput
							ref={knownRpeRef}
							value={
								calculatorState["knownRPE"].value === null
									? ""
									: calculatorState[
											"knownRPE"
									  ].value.toString()
							}
							mode="outlined"
							keyboardType="numeric"
							style={{
								backgroundColor: currentTheme.surface,
							}}
							activeOutlineColor={
								calculatorState["knownRPE"].error
									? currentTheme.error
									: currentTheme.primary
							}
							outlineColor={
								calculatorState["knownRPE"].error
									? currentTheme.error
									: currentTheme.outline
							}
							theme={{
								colors: {
									text: calculatorState["knownRPE"].error
										? currentTheme.error
										: currentTheme.onSurface,
									placeholder: calculatorState["knownRPE"]
										.error
										? currentTheme.error
										: currentTheme.onSurface,
								},
							}}
							onChangeText={(text) =>
								onValueEntered(text, "knownRPE")
							}
							// onEndEditing={(event) =>
							// 	onValueEntered(event, "knownRPE")
							// }
							label="RPE"
						/>
						<HelperText
							theme={{
								colors: {
									error: currentTheme.error,
									text: calculatorState["knownRPE"].error
										? currentTheme.error
										: currentTheme.onSurfaceVariant,
									placeholder: calculatorState["knownRPE"]
										.error
										? currentTheme.error
										: currentTheme.onSurface,
								},
							}}
							type={
								calculatorState["knownRPE"].error
									? "error"
									: "info"
							}
						>
							{calculatorState["knownRPE"].error
								? "Number between 6.5-10"
								: "Number between 6.5-10"}
						</HelperText>
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
				<View style={styles.wantedInputContainer}>
					<View style={styles.wantedInputItem}>
						<PaperInput
							ref={wantedRepsRef}
							value={
								calculatorState["wantReps"].value === null
									? ""
									: calculatorState[
											"wantReps"
									  ].value.toString()
							}
							mode="outlined"
							keyboardType="numeric"
							style={{
								backgroundColor: currentTheme.surface,
							}}
							activeOutlineColor={
								calculatorState["wantReps"].error
									? currentTheme.error
									: currentTheme.primary
							}
							outlineColor={
								calculatorState["wantReps"].error
									? currentTheme.error
									: currentTheme.outline
							}
							theme={{
								colors: {
									text: calculatorState["wantReps"].error
										? currentTheme.error
										: currentTheme.onSurface,
									placeholder: calculatorState["wantReps"]
										.error
										? currentTheme.error
										: currentTheme.onSurface,
								},
							}}
							onChangeText={(text) =>
								onValueEntered(text, "wantReps")
							}
							// onEndEditing={(event) =>
							// 	onValueEntered(event, "wantReps")
							// }
							label="Reps"
						/>
						<HelperText
							theme={{
								colors: {
									error: currentTheme.error,
									text: calculatorState["wantReps"].error
										? currentTheme.error
										: currentTheme.onSurfaceVariant,
									placeholder: calculatorState["wantReps"]
										.error
										? currentTheme.error
										: currentTheme.onSurface,
								},
							}}
							type={
								calculatorState["wantReps"].error
									? "error"
									: "info"
							}
						>
							{calculatorState["wantReps"].error
								? "Must be positive"
								: ""}
						</HelperText>
					</View>
					<View style={styles.wantedInputItem}>
						<PaperInput
							ref={wantedRpeRef}
							value={
								calculatorState["wantRPE"].value === null
									? ""
									: calculatorState[
											"wantRPE"
									  ].value.toString()
							}
							mode="outlined"
							keyboardType="numeric"
							style={{
								backgroundColor: currentTheme.surface,
							}}
							activeOutlineColor={
								calculatorState["wantRPE"].error
									? currentTheme.error
									: currentTheme.primary
							}
							outlineColor={
								calculatorState["wantRPE"].error
									? currentTheme.error
									: currentTheme.outline
							}
							theme={{
								colors: {
									text: calculatorState["wantRPE"].error
										? currentTheme.error
										: currentTheme.onSurface,
									placeholder: calculatorState["wantRPE"]
										.error
										? currentTheme.error
										: currentTheme.onSurface,
								},
							}}
							onChangeText={(text) =>
								onValueEntered(text, "wantRPE")
							}
							// onEndEditing={(event) =>
							// 	onValueEntered(event, "wantRPE")
							// }
							label="RPE"
						/>
						<HelperText
							theme={{
								colors: {
									error: currentTheme.error,
									text: calculatorState["wantRPE"].error
										? currentTheme.error
										: currentTheme.onSurfaceVariant,
									placeholder: calculatorState["wantRPE"]
										.error
										? currentTheme.error
										: currentTheme.onSurface,
								},
							}}
							type={
								calculatorState["wantRPE"].error
									? "error"
									: "info"
							}
						>
							{calculatorState["wantRPE"].error
								? "Number between 6.5-10"
								: "Number between 6.5-10"}
						</HelperText>
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
						onPress={onResetForm}
						contentStyle={{ marginLeft: "auto" }}
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
			// marginTop: 20,
		},
		knownInputContainer: {
			height: 100,
			width: "100%",
			flexDirection: "row",
			justifyContent: "space-around",
			alignItems: "flex-start",
		},
		knownInputItem: {
			width: 100,
		},
		wantedInputContainer: {
			height: 140,
			width: "100%",
			flexDirection: "row",
			justifyContent: "space-around",
			alignItems: "flex-start",
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
