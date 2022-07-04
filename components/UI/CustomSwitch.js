import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Animated, View, Pressable } from "react-native";
import { useSelector } from "react-redux";
import { Themes } from "../../shared/Theme";

/**
 *
 * @param {boolean} isSwitchSelected - Set an initial selectedvalue for the switch
 * @param {boolean} isSwitchDisabled - Set if the switch should be disabled
 * @param {} onSwitchPress - Pass reference to the function that should be called when the switch is pressed
 */
const CustomSwitch = ({
	isSwitchSelected,
	isSwitchDisabled,
	onSwitchPressed,
}) => {
	const [isSelected, setIsSelected] = useState(isSwitchSelected);
	const [isDisabled, setIsDisabled] = useState(isSwitchDisabled);

	// const thumbAnim = useRef(isSelected ? new Animated.Value(18)).current : new Animated.Value(18)).current );

	const [thumbAnimRef, setThumbAnimRef] = useState();
	const thumbAnim = useRef(new Animated.Value(18)).current;
	const thumbHeight = useRef(new Animated.Value(28)).current;
	const thumbWidth = useRef(new Animated.Value(28)).current;

	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);

	useEffect(() => {
		if (isSelected) {
			thumbAnim.setValue(18);
			thumbHeight.setValue(28);
			thumbWidth.setValue(28);
		} else {
			thumbAnim.setValue(0);
			thumbHeight.setValue(16);
			thumbWidth.setValue(16);
		}
	}, []);

	useEffect(() => {
		setIsSelected(isSwitchSelected);
	}, [isSwitchSelected]);
	
	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
	}, [useDarkMode]);

	useEffect(() => {
		if (isSelected) {
			animateThumb(18, 28, 28);
		} else {
			animateThumb(0, 16, 16);
		}
	}, [isSelected]);

	const onSwitchPress = () => {
		onSwitchPressed();
		setIsSelected(!isSelected);
	};

	const animateThumb = (toTrackValue, toHeightValue, toWidthValue) => {
		Animated.parallel([
			Animated.spring(thumbAnim, {
				toValue: toTrackValue,
				useNativeDriver: false,
			}),
			// Animated.spring(thumbHeight, {
			// 	toValue: toHeightValue,
			// 	useNativeDriver: false,
			// }),
			// Animated.spring(thumbWidth, {
			// 	toValue: toWidthValue,
			// 	useNativeDriver: false,
			// }),
		]).start();
	};

	return (
		<Pressable
			onPress={onSwitchPress}
			style={
				isSelected
					? styles.switchStyleSelected
					: styles.switchStyleNotSelected
			}
		>
			<Animated.View
				style={[
					isSelected ? styles.thumbSelected : styles.thumbUnSelected,
					{ marginLeft: thumbAnim },
				]}
			></Animated.View>
		</Pressable>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		switchStyleNotSelected: {
			flexDirection: "row",
			height: 32,
			width: 52,
			borderWidth: 2,
			borderColor: theme.outline,
			backgroundColor: theme.surfaceVariant,
			borderRadius: 32,
			paddingVertical: 6,
			paddingHorizontal: 4,
			// justifyContent: "flex-start",
		},
		switchStyleSelected: {
			flexDirection: "row",
			height: 32,
			width: 52,
			backgroundColor: theme.primary,
			borderRadius: 32,
			paddingVertical: 2,
			paddingHorizontal: 2,
			// justifyContent: "flex-end",
		},
		thumbUnSelected: {
			width: 16,
			height: 16,
			borderRadius: 16,
			backgroundColor: theme.outline,
			// marginLeft: 8
		},
		thumbSelected: {
			width: 28,
			height: 28,
			borderRadius: 28,
			backgroundColor: theme.onPrimary,
			marginLeft: 18,
		},
	});
};

export default CustomSwitch;
