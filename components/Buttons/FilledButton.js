import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View, Vibration } from "react-native";

import { Themes } from "../../shared/Theme";
import LabelText from "../Text/Label";
const theme = Themes.dark;

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
				// disabled button, pressing does nothing
				// onPressIn={handleOnPressIn}
				// onPressOut={() => setIsPressed(false)}
				// onPress={props.onButtonPress}
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

	// <View style={isDisabled ? {...styles.disabledButtonBase, ...props.style} : { ...styles.buttonBase, ...props.style }}>
	// 	<Pressable
	// 		onPressIn={handleOnPressIn}
	// 		onPressOut={() => setIsPressed(false)}
	// 		style={isPressed ? {...styles.onPressStyle, ...styles.buttonBase} :  {...styles.pressableButton, ...styles.buttonBase}}
	// 		onPress={props.onButtonPress}
	// 		// style={isPressed ? {...styles.onPressStyle, ...styles.buttonBase} :  {...styles.pressableButton}}

	// 		// onPress={handleButtonPress}

	// 	>
	// 		<LabelText
	// 			large={true}
	// 			style={isDisabled ? {...styles.disabledText} : { ...styles.text, ...props.textStyle }}
	// 		>
	// 			{props.children}
	// 		</LabelText>
	// 	</Pressable>
	// </View>
};

const styles = StyleSheet.create({
	baseButtonStyle: {
		minWidth: 48,
		// width: 300,
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
	buttonBase: {
		// flex: 1,
		borderRadius: 20,
		overflow: "hidden",
		backgroundColor: theme.primary,
		paddingHorizontal: 24,
		// minWidth: 48,
		height: 40,
	},
	pressableButton: {
		flex: 1,
		// height: "100%",
		// width: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	onPressStyle: {
		backgroundColor: theme.onPrimary,
		height: "100%",
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
	disabledButtonBase: {
		borderRadius: 20,
		overflow: "hidden",
		backgroundColor: theme.onSurface,
		opacity: 0.12,
		paddingHorizontal: 24,
		// minWidth: 48,
		height: 40,
	},
});

export default FilledButton;
