import React from "react";
import { HeaderButton } from "react-navigation-header-buttons";
import { MaterialIcons } from "@expo/vector-icons";
import { Themes } from "../../shared/Theme";
const theme = Themes.dark;

const CustomHeaderButton = (props) => {
	return (
		<HeaderButton
			{...props}
			IconComponent={MaterialIcons}
			iconSize={23}
			color={theme.primary}
		/>
	);
};

export default CustomHeaderButton;
