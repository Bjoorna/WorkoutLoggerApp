import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View, Vibration } from "react-native";

import { Themes } from "../../shared/Theme";
import LabelText from "../Text/Label";
const theme = Themes.dark;


// TODO style onPress to conform to material standards
const FilledButton = (props) => {
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

const styles = StyleSheet.create({
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

export default FilledButton;
