import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Themes } from "../../shared/Theme";
const theme = Themes.dark;

const OutlineButton = (props) => {
	return (
		<View style={{ ...styles.buttonBase, ...props.style }}>
			<Pressable android_ripple={{color: theme.onSurfaceVariant}} style={styles.pressableButton} onPress={props.onButtonPress}>
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
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: theme.outline,
	},
	pressableButton: {
		height: 40,
		// maxWidth: ""
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		color: theme.onBackground,
		// marginBottom: 2,
		textAlign: "center"
	},
});

export default OutlineButton;
