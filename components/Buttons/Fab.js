import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";

import { Pressable, StyleSheet, Text, View, Vibration } from "react-native";

import { Themes } from "../../shared/Theme";
import LabelText from "../Text/Label";
const theme = Themes.dark;

const FabButton = (props) => {
	const [isPressed, setIsPressed] = useState(false);
	const handleOnPressIn = () => {
		// props.onButtonPress();
		setIsPressed(true);
		Vibration.vibrate(100);
	};

	return (
		<Pressable
			onPressIn={handleOnPressIn}
			onPressOut={() => setIsPressed(false)}
			onPress={props.onButtonPress}
			style={{ ...styles.fabButtonStyle, ...props.style }}
		>
			{props.iconName && (
				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<MaterialIcons
						color={theme.onPrimaryContainer}
						name={props.iconName}
						size={24}
					/>
					<LabelText large={true} style={styles.text}>
						{props.children}
					</LabelText>
				</View>
			)}
			{!props.iconName && (
				<LabelText large={true} style={styles.text}>
					{props.children}
				</LabelText>
			)}
		</Pressable>
	);

};

const styles = StyleSheet.create({
	fabButtonStyle: {
		height: 56,
		minWidth: 80,
		borderRadius: 16,
		overflow: "hidden",
		backgroundColor: theme.primaryContainer,
		alignItems: "center",
		justifyContent: "center",
		elevation: 3,
		padding: 16,
	},
	text: { color: theme.onPrimaryContainer },
});
export default FabButton;
