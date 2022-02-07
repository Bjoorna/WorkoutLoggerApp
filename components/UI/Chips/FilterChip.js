import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Themes } from "../../../shared/Theme";
import LabelText from "../../Text/Label";

const theme = Themes.dark;


// TODO the state of each chip is now set separately from the state that is being managed in the component the chip is being used in
// Change that
const FilterChip = (props) => {
	const [isSelected, setIsSelected] = useState(props.selected);

    const onPress =() => {
        props.onChipPress();
        setIsSelected(state => !state);
    }
	// useEffect(()=> {
	// 	setIsSelected(props.selected);
	// },[props.selected])

	if (isSelected) {
		return (
			<Pressable
				style={filterChipStyles.selectedChipStyle}
				// android_ripple={{ color: theme.onSecondaryContainer }}
                onPress={onPress}
			>
				<MaterialIcons
					style={{ marginHorizontal: 8 }}
					color={theme.onSecondaryContainer}
					name="check"
					size={18}
				/>
				<LabelText
					large={true}
					style={{ color: theme.onSurfaceVariant }}
				>
					{props.children}
				</LabelText>
			</Pressable>
		);
	} else {
		return (
			<Pressable
				style={filterChipStyles.unselectedChipStyle}
				// android_ripple={{ color: theme.onSecondaryContainer }}
                onPress={onPress}
			>
				<LabelText
					large={true}
					style={{ color: theme.onSurfaceVariant }}
				>
					{props.children}
				</LabelText>
			</Pressable>
		);
	}
};

const filterChipStyles = StyleSheet.create({
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

export default FilterChip;
