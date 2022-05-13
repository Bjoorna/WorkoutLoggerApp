import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, Vibration } from "react-native";
import { useSelector } from "react-redux";


import { Themes } from "../../shared/Theme";
import LabelText from "../Text/Label";

const TextButton = (props) => {
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	const [isPressed, setIsPressed] = useState(false);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);
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
				<LabelText
					large={true}
					style={{ ...styles.disabledText, ...props.textStyle }}
				>
					{props.children}
				</LabelText>
			</Pressable>
		);
	} else {
		return (
			<Pressable
				style={
					isPressed
						? { ...styles.pressedButtonStyle, ...props.style }
						: { ...styles.baseButtonStyle, ...props.style }
				}
				onPressIn={handleOnPressIn}
				onPressOut={() => setIsPressed(false)}
				onPress={props.onButtonPress}
			>
				<LabelText
					style={{ ...styles.text, ...props.textStyle }}
					large={true}
				>
					{props.children}
				</LabelText>
			</Pressable>
		);
	}
};

const getStyles = (theme) => {
	return StyleSheet.create({
		baseButtonStyle: {
			height: 40,
			minWidth: 48,
			paddingHorizontal: 12,
			borderRadius: 20,
			overflow: "hidden",
			alignItems: "center",
			justifyContent: "center",
		},
		pressedButtonStyle: {
			height: 40,
			minWidth: 48,
			paddingHorizontal: 12,
			borderRadius: 20,
			overflow: "hidden",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: theme.primary,
			opacity: 0.12,
		},
		disabledButtonStyle: {
			height: 40,
			minWidth: 48,
			paddingHorizontal: 12,
			borderRadius: 20,
			overflow: "hidden",
			alignItems: "center",
			justifyContent: "center",
		},
		disabledText: {
			color: theme.onSurface,
			opacity: 0.38,
		},
		text: {
			color: theme.primary,
		},
	});
};

export default TextButton;
