import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Themes } from "../../shared/Theme";
import LabelText from "../Text/Label";
const theme = Themes.dark;

const TextButton = (props) => {
	const [isPressed, setIsPressed] = useState(false);

	return (
		<View
			style={
				isPressed
					? {
							...styles.buttonBase,
							...styles.buttonBaseOnPress,
							...props.style,
					  }
					: { ...styles.buttonBase, ...props.style }
			}
		>
			<Pressable
				onPressIn={() => setIsPressed(true)}
				onPressOut={() => setIsPressed(false)}
				style={styles.pressableButton}
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
		overflow: "hidden",
		paddingHorizontal: 12,
		minWidth: 48,
		height: 40,
	},
	buttonBaseOnPress: {
		backgroundColor: theme.primary,
		opacity: 0.12,
	},
	pressableButton: {
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		color: theme.primary,
	},
});

export default TextButton;
