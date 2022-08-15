import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, View, Vibration } from "react-native";
import { useSelector } from "react-redux";
import { hexToRGB } from "../../shared/utils/UtilFunctions";
import { Themes } from "../../shared/Theme";
import LabelText from "../Text/Label";

const OutlineButton = (props) => {
	// Themes
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	const [rippleColor, setRippleColor] = useState(hexToRGB(currentTheme.error))

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
		setRippleColor(currentTheme.primary);
	}, [useDarkMode]);

	const [isPressed, setIsPressed] = useState(false);
	const isDisabled = props.disabled;

	const handleOnPressIn = () => {
		// props.onButtonPress();
		setIsPressed(true);
		// Vibration.vibrate(100);
	};

	if (isDisabled) {
		return (
			<Pressable
				style={{
					...styles.disabledButtonStyle,
					...props.style,
				}}
			>
				<LabelText style={styles.disabledText}>
					{props.children}
				</LabelText>
			</Pressable>
		);
	} else {
		return (
			// <View style={{ borderRadius: 20, overflow: "hidden" }}>
				<Pressable
					// android_ripple={{
					// 	borderless: false,
					// 	radius: 200,
					// 	color: currentTheme.primary,
					// 	// color: `rgba(${rippleColor[0]}, ${rippleColor[1]}, ${rippleColor[2]}, 1 )`,
					// 	foreground: false,
					// }}
					style={{ ...styles.baseButtonStyle, ...props.style }}
					onPressIn={handleOnPressIn}
					onPressOut={() => setIsPressed(false)}
					onPress={props.onButtonPress}
				>
					<LabelText style={styles.text} large={true}>
						{props.children}
					</LabelText>
				</Pressable>
			// </View>
		);
	}
};

const getStyles = (theme) => {
	return StyleSheet.create({
		disabledButtonStyle: {
			minWidth: 48,
			height: 40,
			borderRadius: 20,
			overflow: "hidden",
			// backgroundColor: theme.onSurface,
			paddingHorizontal: 24,
			alignItems: "center",
			justifyContent: "center",
			borderWidth: 1,
			borderStyle: "solid",
			borderColor: theme.outline,

			opacity: 0.12,
		},
		baseButtonStyle: {
			minWidth: 48,
			height: 40,

			// overflow: "hidden",

			borderRadius: 20,
			paddingHorizontal: 24,
			alignItems: "center",
			justifyContent: "center",
			borderWidth: .5,
			borderStyle: "solid",
			borderColor: theme.outline,
		},
		text: {
			color: theme.primary,
		},
		disabledText: {
			color: theme.onSurface,
			opacity: 0.38,
		},
	});
};
// const styles = StyleSheet.create({
// 	disabledButtonStyle: {
// 		minWidth: 48,
// 		height: 40,
// 		borderRadius: 20,
// 		overflow: "hidden",
// 		// backgroundColor: theme.onSurface,
// 		paddingHorizontal: 24,
// 		alignItems: "center",
// 		justifyContent: "center",
// 		borderWidth: 1,
// 		borderStyle: "solid",
// 		borderColor: theme.outline,

// 		opacity: 0.12,
// 	},
// 	baseButtonStyle: {
// 		minWidth: 48,
// 		height: 40,
// 		borderRadius: 20,
// 		overflow: "hidden",
// 		paddingHorizontal: 24,
// 		alignItems: "center",
// 		justifyContent: "center",
// 		borderWidth: 1,
// 		borderStyle: "solid",
// 		borderColor: theme.outline,
// 	},
// 	text: {
// 		color: theme.primary,
// 	},
// 	disabledText: {
// 		color: theme.onSurface,
// 		opacity: 0.38,
// 	},
// });
export default OutlineButton;
