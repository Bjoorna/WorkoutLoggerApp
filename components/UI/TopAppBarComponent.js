import { nanoid } from "@reduxjs/toolkit";
import React, { useState, useEffect } from "react";

import { StyleSheet, View, StatusBar } from "react-native";

import { useSelector } from "react-redux";

import { Themes } from "../../shared/Theme";
import TitleText from "../Text/Title";

/**
 * 
 * @param {string} headlineText Text to show in headline
 * @param {} navigationButton Optional <IconButton /> component 
 * @param {} trailingIcons Optional Array of ButtonComponents. Max 4 
 * @param {} backgroundColor Set backgroundcolor if one wants something other than surface
 * @param {} optionalStyle pass a style object E.g to change padding if layout is wrong

 */

const TopAppBar = ({ headlineText, navigationButton, trailingIcons, backgroundColor, optionalStyle }) => {
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

	return (
		<View style={{...styles.topAppBarContainer, ...optionalStyle, backgroundColor: backgroundColor}}>
			{navigationButton && (
				<View style={styles.topAppBarNavigationIcon}>
					{navigationButton}
				</View>
			)}
			<TitleText large={true} style={{ color: currentTheme.onSurface }}>
				{headlineText}
			</TitleText>
			{trailingIcons && (
				<View style={styles.topAppBarTrailingIconsContainer}>
					{trailingIcons.map((trailingIcon, index) => (
						<View
							key={nanoid()}
							style={styles.topAppBarTrailingIcon}
						>
							{trailingIcon}
						</View>
					))}
				</View>
			)}
		</View>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		topAppBarContainer: {
			flexDirection: "row",
			paddingTop: StatusBar.currentHeight,
			paddingHorizontal: 16,
			height: 64 + StatusBar.currentHeight,
			width: "100%",
			backgroundColor: theme.surface,
			alignItems: "center",
		},
		topAppBarNavigationIcon: {
			paddingRight: 16,
		},
		topAppBarTrailingIconsContainer: {
			marginLeft: "auto",
			flexDirection: "row",
		},
	});
};

export default TopAppBar;
