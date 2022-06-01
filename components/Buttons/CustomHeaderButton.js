import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";

// import { HeaderButton } from "react-navigation-header-buttons";
import { MaterialIcons } from "@expo/vector-icons";
import { Themes } from "../../shared/Theme";
const theme = Themes.dark;

const CustomHeaderButton = (props) => {
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	// const [styles, setStyles] = useState(
	// 	getStyles(useDarkMode ? Themes.dark : Themes.light)
	// );
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	useEffect(() => {
		// setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	return (
		// placeholder
		<View> 

		</View>
		// <HeaderButton
		// 	{...props}
		// 	IconComponent={MaterialIcons}
		// 	iconSize={23}
		// 	color={currentTheme.primary}
		// />
	);
};

export default CustomHeaderButton;
