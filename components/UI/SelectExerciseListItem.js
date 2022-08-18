import { nanoid } from "@reduxjs/toolkit";
import React, { useState, useReducer, useEffect } from "react";
import {
	View,
	ScrollView,
	Pressable,
	StyleSheet,
	SectionList,
	FlatList,
	Keyboard,
	KeyboardAvoidingView,
} from "react-native";
import { TextInput as PaperInput, HelperText } from "react-native-paper";
import { useSelector } from "react-redux";
import {
	convertPoundToKilo,
	inputValueValidityCheck,
} from "../../shared/utils/UtilFunctions";
import IconButton from "../Buttons/IconButton";
import OutlineButton from "../Buttons/OutlineButton";
import TextButton from "../Buttons/TextButton";
import BodyText from "../Text/Body";
import LabelText from "../Text/Label";
import TitleText from "../Text/Title";
import FilterChip from "./Chips/FilterChip";

const SelectExerciseListItem = ({
	data,
	onPress,
	currentlySelected,
	currentTheme,
}) => {
	const [sortedList, setSortedList] = useState([]);

	useEffect(() => {
		if (data.data.length > 1) {
			const arrayToSort = [...data.data];
			const sortedData = arrayToSort.sort((a, b) => a.localeCompare(b));
			setSortedList(sortedData);
		}
	}, []);

	return (
		<View style={{ flexDirection: "column", paddingBottom: 16 }}>
			<LabelText style={{ color: currentTheme.onSurface }}>
				{data.title.charAt(0).toUpperCase() + data.title.slice(1)}
			</LabelText>
			<ScrollView>
				<View style={{ flexDirection: "row", flexWrap: "wrap" }}>
					{sortedList.map((text) => (
						<FilterChip
							key={nanoid()}
							text={text}
							onPress={() => onPress(text)}
							selected={
								currentlySelected.some((ex) => ex === text)
									? true
									: false
							}
						/>
					))}
				</View>
			</ScrollView>
		</View>
	);
};

export default SelectExerciseListItem;
