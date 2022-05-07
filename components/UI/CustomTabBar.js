import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	Pressable,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import { Themes } from "../../shared/Theme";
import { useSelector, useDispatch } from "react-redux";

import LabelText from "../Text/Label";

const CustomTabBar = ({ state, descriptors, navigation }) => {
	// console.log("Hello from custom tab bar");
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	console.log("Use DarkMode: " + useDarkMode);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
	}, [useDarkMode]);
	return (
		<View style={styles.tabBarContainer}>
			{state.routes.map((route, index) => {
				const { options } = descriptors[route.key];
				const label =
					options.tabBarLabel !== undefined
						? options.tabBarLabel
						: options.title !== undefined
						? options.title
						: route.name;

				const isFocused = state.index === index;
				const onPress = () => {
					const event = navigation.emit({
						type: "tabPress",
						target: route.key,
						canPreventDefault: true,
					});
					if (!isFocused && !event.defaultPrevented) {
						// The `merge: true` option makes sure that the params inside the tab screen are preserved
						navigation.navigate({ name: route.name, merge: true });
					}
				};
				const onLongPress = () => {
					navigation.emit({
						type: "tabLongPress",
						target: route.key,
					});
				};

				return (
					<Pressable
						accessibilityRole="button"
						accessibilityState={isFocused ? { selected: true } : {}}
						accessibilityLabel={options.tabBarAccessibilityLabel}
						testID={options.tabBarTestID}
						onPressIn={onPress}
						onLongPress={onLongPress}
						style={styles.tabBarItemContainer}
					>
						<View
							style={
								isFocused
									? styles.activeLabel
									: styles.inActiveLabel
							}
						>
							{useDarkMode && (
								<MaterialIcons
									name="fitness-center"
									size={24}
									color={
										isFocused
											? "#d5e4f7"
											: "#c2c7ce"
									}
								/>
							)}
                            {!useDarkMode && (
								<MaterialIcons
									name="fitness-center"
									size={24}
									color={
										isFocused
											? "#0e1d2a"
											: "#42474d"
									}
								/>
							)}
                            
						</View>
						<LabelText
							large={false}
							style={
								isFocused
									? styles.labelTextActive
									: styles.labelTextInActive
							}
						>
							{label}
						</LabelText>
					</Pressable>
				);
			})}
		</View>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		tabBarContainer: {
			flexDirection: "row",
			height: 80,
		},
		tabBarItemContainer: {
			flex: 1,
			flexDirection: "column",
			backgroundColor: theme.surface,
			alignItems: "center",
		},
		activeLabel: {
			height: 32,
			width: 64,
			marginTop: 12,
			marginBottom: 4,
			borderRadius: 16,
			backgroundColor: theme.secondaryContainer,
			justifyContent: "center",
			alignItems: "center",
		},
		inActiveLabel: {
			height: 32,
			width: 64,
			marginTop: 12,
			marginBottom: 4,
			borderRadius: 16,
			backgroundColor: theme.surface,
			justifyContent: "center",
			alignItems: "center",
		},
		activeLabelIcon: { color: theme.onSecondaryContainer },
		inActiveLabelIcon: { color: theme.onSurfaceVariant },
		labelTextActive: {
			color: theme.onSurface,
		},
		labelTextInActive: {
			color: theme.onSurfaceVariant,
		},
	});
};

export default CustomTabBar;
