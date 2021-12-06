import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Themes } from "../../shared/Theme";
const theme = Themes.dark;

const TextButton = (props) => {
	return (
		<View style={{ ...styles.buttonBase, ...props.style }}>
			<Pressable style={styles.pressableButton}  onPress={props.onButtonPress}>
				<Text style={{...styles.text, ...props.textStyle}}>{props.children}</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	buttonBase: {
		// flex: 1,
		borderRadius: 40,
		overflow: "hidden",
	},
	pressableButton: {
		height: 40,
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		color: theme.onBackground,
	},
});

export default TextButton;
