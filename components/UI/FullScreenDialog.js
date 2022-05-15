import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Dimensions,
	Pressable,
	ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { Themes } from "../../shared/Theme";
import BodyText from "../Text/Body";
import IconButton from "../Buttons/IconButton";
import TextButton from "../Buttons/TextButton";
import TitleText from "../Text/Title";
import HeadlineText from "../Text/Headline"
import LabelText from "../Text/Label";
import Input from "./Input";
import FilledButton from "../Buttons/FilledButton";
import FilledTonalButton from "../Buttons/FilledTonalButton";

const windowWidth = Dimensions.get("screen").width;

const FullScreenDialog = (props) => {
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

	const handleBackBehavior = () => {
		props.toggleModal();
	};

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<View style={styles.headerBackButton}>
					<IconButton onButtonPress={handleBackBehavior} />
				</View>
				<View style={styles.headerTitle}>
					<TitleText
						large={true}
						style={{ color: currentTheme.onSurface }}
					>
						New Workout
					</TitleText>
				</View>
				<View style={styles.headerSaveButton}>
					<TextButton
						onButtonPress={() => console.log("SaveButtonpress")}
					>
						Save
					</TextButton>
				</View>
			</View>
			<View style={styles.contentContainer}>
				<View style={styles.selectExerciseContainer}>
					<View style={styles.selectExercise}>
						<BodyText
							large={true}
							style={{ color: currentTheme.onSurface }}
						>
							Press to select exercise...
						</BodyText>
					</View>
				</View>
				<View style={styles.exerciseValuesContainer}>
					{/* <View style={styles.exerciseValuesHeader}>
						<LabelText
							large={false}
							style={{ color: currentTheme.onSurface }}
						>
							Enter exercise values
						</LabelText>
					</View> */}
					<View style={styles.exerciseValuesInputs}>
						<View style={styles.exerciseValuesInputRow}>
							<View style={styles.exerciseValueItem}>
								<View style={styles.exerciseValueTextField}>
									<BodyText
										large={true}
										style={{
											color: currentTheme.onSurface,
										}}
									>
										Weight
									</BodyText>
								</View>
								{/* <View style={style}></View> */}
							</View>
							<View style={styles.exerciseValueItem}>
								<View style={styles.exerciseValueTextField}>
									<BodyText
										large={true}
										style={{
											color: currentTheme.onSurface,
										}}
									>
										Reps
									</BodyText>
								</View>
							</View>
						</View>
						<View style={styles.exerciseValuesInputRow}>
							<View style={styles.exerciseValueItem}>
								<View style={styles.exerciseValueTextField}>
									<BodyText
										large={true}
										style={{
											color: currentTheme.onSurface,
										}}
									>
										Sets
									</BodyText>
								</View>
								{/* <View style={style}></View> */}
							</View>
							<View style={styles.exerciseValueItem}>
								<View style={styles.exerciseValueTextField}>
									<BodyText
										large={true}
										style={{
											color: currentTheme.onSurface,
										}}
									>
										RPE
									</BodyText>
								</View>
							</View>
						</View>
                        <View style={styles.exerciseValuesInputRow}>
							<View style={styles.exerciseValueItem}>
								<View style={styles.exerciseValueTextField}>
									<BodyText
										large={true}
										style={{
											color: currentTheme.onSurface,
										}}
									>
										Date
									</BodyText>
								</View>
							</View>
							<View style={{...styles.exerciseValueItem, }}>
                                <FilledTonalButton>Add workout</FilledTonalButton>
							</View>
						</View>

					</View>
				</View>
				<View style={styles.summaryContainer}>
					<View style={styles.summaryHeader}>
						<HeadlineText large={true} style={{color: currentTheme.onSurface}}>Summary</HeadlineText>
					</View>
					<View style={styles.summaryList}>
						<View style={styles.summaryListItem}></View>
					</View>

				</View>
			</View>
		</View>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.surface,
			maxWidth: 560,
		},
		headerContainer: {
			flexDirection: "row",
			width: "100%",
			height: 56,
			backgroundColor: theme.surface,
			alignItems: "center",
		},
		headerBackButton: {
			marginHorizontal: 16,
		},
		headerSaveButton: {
			marginLeft: "auto",
			marginRight: 24,
		},
		contentContainer: {
			flex: 1,
			// width: "100%"
			flexDirection: "column",
			alignItems: "center",
			paddingHorizontal: 24,
		},
		selectExerciseContainer: {
			width: "100%",
			height: 56,
			justifyContent: "center",
			alignItems: "center",
			marginTop: 8,
		},
		selectExercise: {
			flexDirection: "row",
			width: "100%",
			height: "100%",
			borderRadius: 4,
			borderWidth: 1,
			borderColor: theme.outline,

			paddingHorizontal: 16,
			alignItems: "center",
		},
		exerciseValuesContainer: {
			width: "100%",
			marginTop: 20,
		},
		exerciseValuesInputs: {
			width: "100%",
			marginTop: 10,
		},
		exerciseValuesInputRow: {
			flexDirection: "row",
		},
		exerciseValueItem: {
			height: 70,
			width: "45%",

			marginRight: 8,
		},
		exerciseValueTextField: {
			// width: 150,
			// width: "100%",
			height: 56,
			borderRadius: 4,
			borderWidth: 1,
			borderColor: theme.outline,
			flexDirection: "row",
			alignItems: "center",
			paddingHorizontal: 16,
		},
		summaryContainer: {
			marginTop: 20,
			width: "100%"
			,height:300,
		}
	});
};

export default FullScreenDialog;
