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
		setIsPressed(true)
		Vibration.vibrate(100);
	}

	return (
		<View style={isDisabled ? {...styles.disabledButtonBase} : { ...styles.buttonBase, ...props.style }}>
			<Pressable
				onPressIn={handleOnPressIn}
				onPressOut={() => setIsPressed(false)}
				style={isPressed ? {...styles.onPressStyle, ...styles.buttonBase} :  {...styles.pressableButton, ...styles.buttonBase}}
				onPress={props.onButtonPress}
				// onPress={handleButtonPress}

			>
				<LabelText
					large={true}
					style={isDisabled ? {...styles.disabledText} : { ...styles.text, ...props.textStyle }}
				>
					{props.children}
				</LabelText>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	buttonBase: {
		// flex: 1,
		borderRadius: 40,
		overflow: "hidden",
		backgroundColor: theme.primary,
		// paddingHorizontal: 12,
		minWidth: 48,
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
		opacity: 0.12
	},
	text: {
		color: theme.onPrimary,
	},
	disabledText: {
		color: theme.onSurface,
		// opacity: 
	},
	disabledButtonBase: {
		borderRadius: 40,
		overflow: "hidden",
		backgroundColor: theme.onSurface,
		opacity: 0.12,
		// paddingHorizontal: 12,
		minWidth: 48,
		height: 40
	}
});

export default FilledButton;
