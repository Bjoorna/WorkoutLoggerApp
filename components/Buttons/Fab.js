import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";


import { Pressable, StyleSheet, Text, View, Vibration } from "react-native";

import { Themes } from "../../shared/Theme";
import LabelText from "../Text/Label";

const FabButton = (props) => {
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

	const [isPressed, setIsPressed] = useState(false);
	const handleOnPressIn = () => {
		// props.onButtonPress();
		setIsPressed(true);
		Vibration.vibrate(100);
	};

	return (
		<Pressable
			onPressIn={handleOnPressIn}
			onPressOut={() => setIsPressed(false)}
			onPress={props.onButtonPress}
			style={{ ...styles.fabButtonStyle, ...props.style }}
		>
			{props.iconName && (
				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<MaterialIcons
						color={currentTheme.onPrimaryContainer}
						name={props.iconName}
						size={24}
					/>
					<LabelText large={true} style={styles.text}>
						{props.children}
					</LabelText>
				</View>
			)}
			{!props.iconName && (
				<LabelText large={true} style={styles.text}>
					{props.children}
				</LabelText>
			)}
		</Pressable>
	);
};


const getStyles = theme => {
	return StyleSheet.create({
		fabButtonStyle: {
			height: 56,
			minWidth: 80,
			borderRadius: 16,
			overflow: "hidden",
			backgroundColor: theme.primaryContainer,
			alignItems: "center",
			justifyContent: "center",
			elevation: 3,
			padding: 16,
		},
		text: { color: theme.onPrimaryContainer },
	});
}
export default FabButton;
