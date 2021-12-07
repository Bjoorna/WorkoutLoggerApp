import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Themes } from "../../shared/Theme";
import LabelText from "../Text/Label";
const theme = Themes.dark;

const OutlineButton = (props) => {
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
				style={
					isPressed
						? { ...styles.pressableButtonOnPress }
						: { ...styles.pressableButton }
				}
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
		borderRadius: 40,
		overflow: "hidden",
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: theme.outline,
		paddingHorizontal: 24,
		minWidth: 48,
	},
	buttonBaseOnPress: {
		backgroundColor: theme.primary,
		opacity: 0.12,
	},
	pressableButton: {
		height: 40,
		alignItems: "center",
		justifyContent: "center",
	},
	pressableButtonOnPress: {
		height: 40,
		alignItems: "center",
		justifyContent: "center",
		// // borderRadius: 40,
		// overflow: "hidden",
		// borderWidth: 1,
		// borderStyle: "solid",
		// borderColor: theme.outline,
		// paddingHorizontal: 24,
		// minWidth: 48,
	},
	text: {
		color: theme.primary,
		// marginBottom: 2,
		// textAlign: "center",
	},
});

export default OutlineButton;
