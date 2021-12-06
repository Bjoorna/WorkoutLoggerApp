import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Themes } from "../../shared/Theme";
import LabelText from "../Text/Label";
const theme = Themes.dark;

const FilledButton = (props) => {
	const [isPressed, setIsPressed] = useState(false);

	return (
		<View style={{ ...styles.buttonBase, ...props.style }}>
			<Pressable
				onPressIn={() => setIsPressed(true)}
				onPressOut={() => setIsPressed(false)}
				style={isPressed ? styles.onPressStyle : styles.pressableButton}
				onPress={props.onButtonPress}
			>
				<LabelText
					large={true}
					style={{ ...styles.text, ...props.textStyle }}
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
		backgroundColor: theme.primary,
		overflow: "hidden",
		width: "100%",
	},
	pressableButton: {
		height: 40,
		alignItems: "center",
		justifyContent: "center",
	},
	onPressStyle: {
		backgroundColor: theme.onPrimary,
		height: 40,
		alignItems: "center",
		justifyContent: "center",
		opacity: 0.12
	},
	text: {
		color: theme.onPrimary,
	},
});

export default FilledButton;
