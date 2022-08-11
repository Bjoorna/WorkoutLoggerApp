import React, { useState, useEffect } from "react";
import { View, Pressable, StyleSheet, Vibration } from "react-native";
import { useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";

import { Themes } from "../../shared/Theme";
import LabelText from "../Text/Label";
import IconButton from "./IconButton";
import { Ionicons } from "@expo/vector-icons";

const SegmentedButton = ({
	onPress,
	multiSelect,
	segments,
	density,
	width,
}) => {
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);

	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	const [segmentContainerWidth, setSegmentContainerWidth] = useState(100);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);
	useEffect(() => {
		console.log(segmentContainerWidth);
	}, [segmentContainerWidth]);

	const onSegButtonLayout = (event) => {
		const wantedWidth = event.nativeEvent.layout.width;
		setSegmentContainerWidth(wantedWidth);
	};

	return (
		<View
			onLayout={(event) => onSegButtonLayout(event)}
			style={[
				styles.segmentedButtonContainer,
				// { width: segmentContainerWidth },
			]}
		>
			{segments.map((segment, index) => {
				return (
					<Pressable
                    android_ripple={{color: currentTheme.onSurface}}
						onPress={() => onPress(segment)}
						key={nanoid()}
						style={[
							styles.segmentedButtonSegment,
							{
								// width: segmentContainerWidth / 3,
							},
							segment.selected
								? {
										backgroundColor:
											currentTheme.secondaryContainer,
								  }
								: {},
						]}
					>
						{segment.selected && (
							<View style={{ marginRight: 8 }}>
								<Ionicons
									name="checkmark"
									size={18}
									color={currentTheme.onSecondaryContainer}
								/>
							</View>
						)}
						<LabelText
							style={
								segment.selected
									? {
											color: currentTheme.onSecondaryContainer,
									  }
									: {
											color: currentTheme.onSurface,
									  }
							}
							large={true}
						>
							{segment.text}
						</LabelText>
					</Pressable>
				);
			})}
		</View>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		segmentedButtonContainer: {
			height: 40,
			borderWidth: 1,
			borderColor: theme.outline,
			flexDirection: "row",
			borderRadius: 40,
			overflow: "hidden",
		},
		segmentedButtonSegment: {
			flex: 1,
			minWidth: 48,
			flexDirection: "row",
			paddingHorizontal: 12,
			alignItems: "center",
			justifyContent: "center",
		},
	});
};

export default SegmentedButton;
