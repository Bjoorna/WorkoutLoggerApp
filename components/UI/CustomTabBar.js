import React, { useState, useEffect, useRef } from "react";
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	Pressable,
	Keyboard,
	Animated,
	Easing,
} from "react-native";

import { MaterialIcons, Ionicons } from "@expo/vector-icons";

import { Themes } from "../../shared/Theme";
import { useSelector, useDispatch } from "react-redux";

import LabelText from "../Text/Label";

const CustomTabBar = ({ state, descriptors, navigation }) => {
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const hideTabBar = useSelector((state) => state.appSettings.hideTabBar);
	// const isScrolling = useSelector((state) => state.appSettings.isScrolling);

	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const defaultLabelWidthBeforeAnim = 40;
	const [onTabIndex, setOnTabIndex] = useState(0);
	const [labelIndicatorWidths, setLabelIndicatorWidth] = useState([
		useRef(new Animated.Value(defaultLabelWidthBeforeAnim)).current,
		useRef(new Animated.Value(defaultLabelWidthBeforeAnim)).current,
		useRef(new Animated.Value(defaultLabelWidthBeforeAnim)).current,
		useRef(new Animated.Value(defaultLabelWidthBeforeAnim)).current,
	]);

	const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

	useEffect(() => {
		const keyboardShowListener = Keyboard.addListener(
			"keyboardDidShow",
			() => {
				setIsKeyboardVisible(true);
			}
		);
		const keyboardHideListener = Keyboard.addListener(
			"keyboardDidHide",
			() => {
				setIsKeyboardVisible(false);
			}
		);
		return () => {
			keyboardShowListener.remove();
			keyboardHideListener.remove();
		};
	}, []);

	useEffect(()=> {
	}, [hideTabBar])

	useEffect(() => {
		if (state.index == onTabIndex) {
			return;
		}
		const newIndex = state.index;
		const newLabelValues = [...labelIndicatorWidths];
		newLabelValues[onTabIndex].setValue(defaultLabelWidthBeforeAnim);
		setLabelIndicatorWidth(newLabelValues);
		setOnTabIndex(state.index);
		animateLabel(labelIndicatorWidths[newIndex]);
	}, [state]);

	useEffect(() => {}, [isKeyboardVisible]);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
	}, [useDarkMode]);

	const animateLabel = (refToAnimate) => {
		Animated.sequence([
			Animated.spring(refToAnimate, {
				toValue: 64,
				useNativeDriver: false,
				bounciness: 4
			}),
		]).start();
	};


	return (
		<View
			style={
				hideTabBar || isKeyboardVisible
					? { display: "none" }
					: styles.tabBarContainer
			}
			// style={
			// 	hideTabBar || isKeyboardVisible
			// 		? {...styles.tabBarContainer, top: 40 }
			// 		: styles.tabBarContainer
			// }
		>
			{state.routes.map((route, index) => {
				const { options } = descriptors[route.key];
				const labelName = route.params.labelName;
				const labelNameFocused = route.params.labelNameFocused
				const labelNameUnFocused = route.params.labelNameUnFocused

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
						key={route.key}
					>
						<View
							style={
								isFocused
									? styles.activeLabelContainer
									: styles.inActiveLabelContainer
							}
						>
							<Animated.View
								style={[
									isFocused
										? styles.activeLabel
										: styles.inActiveLabel,
									{ width: labelIndicatorWidths[index] },
								]}
							></Animated.View>
							{useDarkMode && (
								<View style={{ bottom: 16 }}>
									<Ionicons
										name={isFocused ? labelNameFocused : labelNameUnFocused}
										size={24}
										color={
											isFocused ? "#d5e4f7" : "#c2c7ce"
										}
									/>
								</View>
							)}
							{!useDarkMode && (
								<View style={{ bottom: 16 }}>
									<Ionicons
										name={isFocused ? labelNameFocused : labelNameUnFocused}
										size={24}
										color={
											isFocused ? "#0e1d2a" : "#42474d"
										}
									/>
								</View>
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
			backgroundColor: theme.surfaceE2
		},
		tabBarItemContainer: {
			flex: 1,
			flexDirection: "column",
			backgroundColor: theme.surfaceE2,
			alignItems: "center",
		},
		activeLabelContainer: {
			height: 32,
			width: 64,
			marginTop: 12,
			marginBottom: 4,
			justifyContent: "center",
			alignItems: "center",
		},
		inActiveLabelContainer: {
			height: 32,
			width: 64,
			marginTop: 12,
			marginBottom: 4,
			borderRadius: 16,
			backgroundColor: theme.surfaceE2,
			justifyContent: "center",
			alignItems: "center",
		},
		activeLabel: {
			height: 32,
			width: 40,
			backgroundColor: theme.secondaryContainer,
			borderRadius: 16,
			top: 12,
		},
		inActiveLabel: {
			height: "100%",
			width: "100%",
			top: 12,
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
