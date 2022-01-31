import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View, Vibration } from "react-native";

import { Themes } from "../../shared/Theme";
import LabelText from "../Text/Label";
const theme = Themes.dark;

const OutlineButton = (props) => {
	const [isPressed, setIsPressed] = useState(false);
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
				<LabelText style={styles.disabledText}>{props.children}</LabelText>
			</Pressable>
		);
	}
	else{
		return(
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
		)
	}
};

const styles = StyleSheet.create({
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
		borderRadius: 20,
		overflow: "hidden",
		paddingHorizontal: 24,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: theme.outline,
	},
	text: {
		color: theme.primary,
	},
	disabledText: {
		color: theme.onSurface,
		opacity: 0.38
	}
});
export default OutlineButton;
