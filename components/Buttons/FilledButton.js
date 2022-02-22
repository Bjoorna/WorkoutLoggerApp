import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, View, Vibration } from "react-native";
import { useSelector } from "react-redux";

import { Themes } from "../../shared/Theme";
import LabelText from "../Text/Label";

// TODO style onPress to conform to material standards
const FilledButton = (props) => {
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
	const shouldVibrate = props.vibration;
	const isDisabled = props.disabled;

	const handleOnPressIn = () => {
		// props.onButtonPress();
		setIsPressed(true);
		Vibration.vibrate(100);
	};

	if (isDisabled) {
		return (
			<Pressable
				style={{
					...styles.disabledButtonStyle,
					...props.style,
				}}
			>
				<LabelText style={styles.disabledText} large={true}>
					{props.children}
				</LabelText>
			</Pressable>
		);
	} else {
		return (
			<Pressable
				style={{ ...styles.baseButtonStyle, ...props.style }}
				onPressIn={handleOnPressIn}
				onPressOut={() => setIsPressed(false)}
				onPress={props.onButtonPress}
			>
				<LabelText style={styles.text} large={true}>
					{props.children}
				</LabelText>
			</Pressable>
		);
	}
};
const getStyles = (theme) => {
	return StyleSheet.create({
		baseButtonStyle: {
			minWidth: 48,
			height: 40,
			borderRadius: 20,
			overflow: "hidden",
			backgroundColor: theme.primary,
			paddingHorizontal: 24,
			alignItems: "center",
			justifyContent: "center",
		},
		disabledButtonStyle: {
			minWidth: 48,
			height: 40,
			borderRadius: 20,
			overflow: "hidden",
			backgroundColor: theme.onSurface,
			paddingHorizontal: 24,
			alignItems: "center",
			justifyContent: "center",
			opacity: 0.12,
		},
		text: {
			color: theme.onPrimary,
		},
		disabledText: {
			color: theme.onSurface,
			opacity: 0.38,
		},
	});
};

export default FilledButton;
