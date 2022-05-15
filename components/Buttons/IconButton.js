import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, Vibration, View } from "react-native";
import { useSelector } from "react-redux";

import { Themes } from "../../shared/Theme";
import LabelText from "../Text/Label";

const IconButton = (props) => {
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	const [isPressed, setIsPressed] = useState(false);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	const handleOnPressIn = () => {
		// props.onButtonPress();
		setIsPressed(true);
		Vibration.vibrate(100);
	};

	return (
		<Pressable
			onPress={props.onButtonPress}
			onPressIn={handleOnPressIn}
			onPressOut={() => setIsPressed(false)}
			style={{ ...styles.iconButton, ...props.style }}
		>
			<Pressable
				onPress={props.onButtonPress}
				onPressIn={handleOnPressIn}
				onPressOut={() => setIsPressed(false)}
				style={
					isPressed
						? { ...styles.innerIconPressed, ...props.style }
						: { ...styles.innerIconUnPressed, ...props.style }
				}
			>
				<MaterialIcons
					color={currentTheme.onSurface}
					size={24}
					name="close"
				/>
			</Pressable>
		</Pressable>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		iconButton: {
			height: 48,
			width: 48,
			justifyContent: "center",
			alignItems: "center",
		},
		innerIconPressed: {
			width: 40,
			height: 40,
			borderRadius: 40,
			overflow: "hidden",
			backgroundColor: theme.onSurfaceVariant,
			opacity: 0.12,
            justifyContent: "center",
			alignItems: "center",

		},
		innerIconUnPressed: {
			width: 40,
			height: 40,
			borderRadius: 40,
			overflow: "hidden",
            justifyContent: "center",
			alignItems: "center",

		},
		iconColor: { color: theme.onPrimaryContainer },
	});
};

export default IconButton;
