import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { FlatList as GestureFlatList } from "react-native-gesture-handler";

// import * as WorkoutActions from "../store/actions/workout";

import TitleText from "./Text/Title";
import OutlineButton from "./Buttons/OutlineButton";
import TextButton from "./Buttons/TextButton";
import { Themes } from "../shared/Theme";
// const theme = Themes.dark;

import SegmentedButton from "./Buttons/SegmentedButton";
import { nanoid } from "@reduxjs/toolkit";

import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import SelectExerciseListItem from "./UI/SelectExerciseListItem";
import {
	getExercisesByTypeForList,
	getExerciseTypes,
	getWorkoutsBasedOnDateInterval,
} from "../redux/slices/workoutSlice";
import DateSelector from "./UI/DateSelector";

import { isBefore, addMonths } from "date-fns";
import LabelText from "./Text/Label";
import BodyText from "./Text/Body";

const AnalysisScreenFilter = ({ exerciseTypesAvaliable }) => {
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	const userID = useSelector((state) => state.auth.userID);
	const dispatch = useDispatch();
};

const getStyles = (theme) => {
	return StyleSheet.create({});
};

export default AnalysisScreenFilter;
