import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import { MaterialIcons } from "@expo/vector-icons";
import { Themes } from "../../../shared/Theme";
import LabelText from "../../Text/Label";

const theme = Themes.dark;

/**
 * 
 * @param {boolean} selected - Set the selected state of the chip
 * @param {function} onPress - Pass a reference to the function being called when user presses the chip
 * @param {string} text - Text to display
 */

const FilterChip = ({selected, onPress, text}) => {
	// Themes
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);
	const [isSelected, setIsSelected] = useState(selected);

    // const onPress =() => {
    //     onPress();
    // }
	
	useEffect(()=> {
		setIsSelected(selected);
	},[selected])


	if (isSelected) {
		return (
			<Pressable
				style={styles.selectedChipStyle}
                onPress={onPress}
			>
				<MaterialIcons
					style={{ marginHorizontal: 8 }}
					color={currentTheme.onSecondaryContainer}
					name="check"
					size={18}
				/>
				<LabelText
					large={true}
					style={{ color: currentTheme.onSurfaceVariant }}
				>
					{text}
				</LabelText>
			</Pressable>
		);
	} else {
		return (
			<Pressable
				style={styles.unselectedChipStyle}
				// android_ripple={{ color: theme.onSecondaryContainer }}
                onPress={onPress}
			>
				<LabelText
					large={true}
					style={{ color: currentTheme.onSurfaceVariant }}
				>
					{text}
				</LabelText>
			</Pressable>
		);
	}
};

const getStyles = theme => {
	return StyleSheet.create({
		unselectedChipStyle: {
			overflow: "hidden",
			marginVertical: 4,
			marginRight: 8,
			height: 32,
			borderRadius: 8,
			paddingHorizontal: 16,
			borderStyle: "solid",
			borderWidth: 1,
			borderColor: theme.outline,
			justifyContent: "center",
		},
		selectedChipStyle: {
			overflow: "hidden",
			marginVertical: 4,
			marginRight: 8,
			height: 32,
			borderRadius: 8,
			paddingRight: 16,
			backgroundColor: theme.secondaryContainer,
			flexDirection: "row",
			alignItems: "center",
		},
		selectedIcon: {},
	});
}

export default FilterChip;
