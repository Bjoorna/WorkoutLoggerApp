import React, { useEffect, useLayoutEffect, useState } from "react";
import {
	StyleSheet,
	View,
	StatusBar,
	FlatList,
	ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";

import { Themes } from "../shared/Theme";
import TitleText from "../components/Text/Title";
import BodyText from "../components/Text/Body";
import CalendarMonth from "../components/UI/CalendarMonth";
import GestureRecognizer, {
	swipeDirections,
} from "react-native-swipe-gestures";

import {
	addYearToCalendar,
	createCalendar,
	Day,
} from "../shared/utils/UtilFunctions";
import IconButton from "../components/Buttons/IconButton";
import TopAppBar from "../components/UI/TopAppBarComponent";

const CalendarScreen = (props) => {
	const [calendarMap, setCalendarMap] = useState(new Map());
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);

	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);

	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	const [onYear, setOnYear] = useState(new Date().getUTCFullYear());

	const [monthArray, setMonthArray] = useState([]);

	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const initCalendar = async () => {
			const calendar = await createCalendar([
				onYear - 1,
				onYear,
				onYear + 1,
			]);
			setCalendarMap(calendar);
		};
		// setIsLoading(true);

		initCalendar();
	}, []);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	// useEffect(() => {
	// 	if (monthArray.length > 0) {
	// 	}
	// }, [monthArray]);

	useEffect(() => {
		if (calendarMap) {
			if (calendarMap.has(onYear)) {
				const newMonthArray = [...calendarMap.get(onYear)];

				setMonthArray(newMonthArray);
			} else {
				const calendarWithAddedYear = addYearToCalendar(
					calendarMap,
					onYear
				);
				setCalendarMap(calendarWithAddedYear);
			}
		}
	}, [onYear]);

	useEffect(() => {
		if (calendarMap) {
			if (calendarMap.has(onYear)) {
				const newMonthArray = [...calendarMap.get(onYear)];
				setMonthArray(newMonthArray);
			}
		}
	}, [calendarMap]);

	const incrementOneYear = () => {
		setOnYear((past) => past + 1);
	};

	const decrementOneYear = () => {
		setOnYear((past) => past - 1);
	};

	return (
		<View style={styles.container}>
			<TopAppBar
				headlineText="Calendar"
				trailingIcons={[
					<IconButton
						name="arrow-back"
						iconColor={currentTheme.onSurfaceVariant}
						onPress={decrementOneYear}
						shouldVibrate={true}
					/>,
					<IconButton
						name="arrow-forward"
						iconColor={currentTheme.onSurfaceVariant}
						onPress={incrementOneYear}
						shouldVibrate={true}
					/>,
				]}
			/>
			{isLoading && (
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<ActivityIndicator
						size={"large"}
						color={currentTheme.primary}
					/>
				</View>
			)}
			{!isLoading && (
				<FlatList
					style={styles.listStyle}
					data={monthArray}
					extraData={monthArray}
					renderItem={(itemData) => (
						<CalendarMonth month={itemData.item.days} />
					)}
					keyExtractor={(item) => item.id}
				/>
			)}
		</View>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		headerContainer: {
			flexDirection: "row",
			// paddingTop: StatusBar.currentHeight,
			// marginTop: StatusBar.currentHeight,
			paddingTop: StatusBar.currentHeight,
			paddingHorizontal: 24,
			height: 56 + StatusBar.currentHeight,
			width: "100%",
			backgroundColor: theme.surface,
			alignItems: "center",
			// justifyContent: "space-around"
		},
		headerTitle: {},
		headerButtons: {
			marginLeft: "auto",
			flexDirection: "row",
		},
		container: {
			flex: 1,
			backgroundColor: theme.surface,
			// paddingHorizontal: 24,
			// paddingVertical: 12,
		},
		calendarContainer: {
			flex: 1,
			flexDirection: "column",
			// height: 200,
			// width: 200,
			// backgroundColor: theme.error,
		},
		listStyle: {
			paddingHorizontal: 24,
		},
		calendarItem: {
			flex: 1,
			flexDirection: "column",
			// backgroundColor: theme.surfaceVariant,
		},
		calendarItemHeader: {
			height: 40,
			width: "100%",
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
			// backgroundColor: theme.tertiary,
		},
		calendarItemDaysHeader: {
			flexDirection: "row",
			height: 40,
			justifyContent: "space-around",
		},
		calendarItemDaysRow: {
			flexDirection: "row",
			height: 40,
			justifyContent: "space-around",
			marginBottom: 12,
		},
		calendarItemDay: {
			backgroundColor: theme.primaryContainer,
			justifyContent: "center",
			alignItems: "center",
			borderRadius: 12,
			width: 40,
		},
	});
};

export default CalendarScreen;
