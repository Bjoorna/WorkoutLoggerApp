import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";

import { Themes } from "../../shared/Theme";
import LabelText from "../Text/Label";
const theme = Themes.dark;

const FabButton = (props) => {
	const [isPressed, setIsPressed] = useState(false);
	if (props.icon) {
		console.log("There is an icon");
	}
	return (
		<View style={{ ...styles.buttonBase, ...props.style }}>
			<Pressable
				onPressIn={() => setIsPressed(true)}
				onPressOut={() => setIsPressed(false)}
				style={
					isPressed
						? { ...styles.onPressStyle, ...styles.buttonBase }
						: { ...styles.pressableButton, ...styles.buttonBase }
				}
				onPress={props.onButtonPress}
			>
				{props.iconName && (
					<View style={styles.insideButton}>
						<MaterialIcons
							color={theme.onPrimaryContainer}
							name={props.iconName}
							size={24}
						/>
						<LabelText
							style={{ ...styles.text, ...props.textStyle }}
							large={true}
						>
							{props.children}
						</LabelText>
					</View>
				)}
				{!props.iconName && (
					<View style={styles.insideButton}>
						<LabelText
							style={{ ...styles.text, ...props.textStyle }}
							large={true}
						>
							{props.children}
						</LabelText>
					</View>
				)}
			</Pressable>
		</View>
	);
};

// const styles = StyleSheet.create({
// 	buttonBase: {
// 		borderRadius: 16,
// 		overflow: "hidden",
// 		backgroundColor: theme.primaryContainer,
// 		padding: 16,
// 		minWidth: 80,
// 	},
// 	pressableButton: {
// 		height: 56,
// 		alignItems: "center",
// 		justifyContent: "center",
// 	},
// 	onPressStyle: {
// 		backgroundColor: theme.onPrimaryContainer,
// 		height: 56,
// 		alignItems: "center",
// 		justifyContent: "center",
// 		opacity: 0.12,
// 	},
// 	text: {
// 		color: theme.onPrimaryContainer,
// 	},
// 	insideButton: {
// 		justifyContent: "center",
// 		alignItems: "center",
// 		flexDirection: "row",
// 	},
// });

const styles = StyleSheet.create({
	buttonBase: {
		flexDirection: "row",
		borderRadius: 16,
		overflow: "hidden",
		backgroundColor: theme.primaryContainer,
		padding: 16,
		minWidth: 80,
		height: 56,
		justifyContent: "center",
		alignItems: "center",
	},
	pressableButton: {
		height: "100%",
		// width: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	onPressStyle: {
		backgroundColor: theme.onPrimaryContainer,
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
		opacity: 0.12,
	},
	text: {
		color: theme.onPrimaryContainer,
	},
	insideButton: {
		flexDirection: "row",
		// justifyContent: "center",
		alignItems: "center",
	},
});
export default FabButton;
