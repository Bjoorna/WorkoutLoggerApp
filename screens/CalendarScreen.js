import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	View,
	StatusBar,
	FlatList,
	ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";

import { Themes } from "../shared/Theme";
import BodyText from "../components/Text/Body";
import CalendarMonth from "../components/UI/CalendarMonth";
import GestureRecognizer, {
	swipeDirections,
} from "react-native-swipe-gestures";

class Year {}
class Month {}
class Week {
	constructor(days) {
		this.days = days;
	}
}
class Day {
	constructor(date, dayOfWeek, dayOfMonth) {
		this.date = date;
		this.dayOfWeek = dayOfWeek;
		this.dayOfMonth = dayOfMonth;
	}
}

const CalendarScreen = () => {
	const [calendarMap, setCalendarMap] = useState();
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);

	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	const [onMonth, setOnMonth] = useState(6);
	const [onYear, setOnYear] = useState(2022);
	const [month, setMonth] = useState(null);
	const [secondMonth, setSecondMonth] = useState(null);

	const [monthArray, setMonthArray] = useState([]);

	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		const thisYear = new Date().getUTCFullYear();
		const arrayOfMonths = [];
		for (let index = 0; index < 12; index++) {
			const daysInMonth = getDaysInMonthOfYear(index, thisYear);
			arrayOfMonths.push(daysInMonth);
		}
		setMonthArray(arrayOfMonths);
		setMonth(getDaysInMonthOfYear(onMonth, onYear));
		setSecondMonth(getDaysInMonthOfYear(onMonth + 1, onYear));
	}, []);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	useEffect(() => {
		// console.log(monthArray);
		if (monthArray.length > 0) {
			console.log(monthArray[0][0]);
			setIsLoading(false);
		}
	}, [monthArray]);

	const getDaysInMonthOfYear = (month, year) => {
		let date = new Date(Date.UTC(year, month, 1));
		const days = [];
		const dayClassesArray = [];
		while (date.getUTCMonth() === month) {
			days.push(new Date(date));
			const newDay = new Day(
				new Date(date),
				date.getUTCDay(),
				date.getUTCDate()
			);
			dayClassesArray.push(newDay);
			date.setUTCDate(date.getUTCDate() + 1);
		}
		return dayClassesArray;
	};

	useEffect(() => {
		setMonth(getDaysInMonthOfYear(onMonth, onYear));
		setSecondMonth(getDaysInMonthOfYear(onMonth + 1, onYear));
	}, [onMonth]);

	const changeOnMonth = (direction) => {
		if (direction == "up") {
			console.log("up");
			const nextOnMonth = onMonth + 2;
			if (nextOnMonth > 10) {
				setOnMonth(0);
				setOnYear(onYear + 1);
			} else {
				setOnMonth(nextOnMonth);
			}
		} else if (direction == "down") {
			console.log("down");
			const nextOnMonth = onMonth - 2;
			if (nextOnMonth < 0) {
				setOnMonth(10);
				setOnYear(onYear - 1);
			} else {
				setOnMonth(nextOnMonth);
			}
		}
	};

	return (
		<View style={styles.container}>
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
					renderItem={(itemData) => (
						<CalendarMonth month={itemData.item} />
					)}
					keyExtractor={(index) => Math.random()}
				/>
			)}
			{/* <CalendarMonth month={month} />
			<CalendarMonth month={secondMonth} /> */}
		</View>
		// <GestureRecognizer
		// 	onSwipeDown={() => changeOnMonth("down")}
		// 	onSwipeUp={() => changeOnMonth("up")}
		// 	style={styles.container}
		// >
		// 	<View style={styles.calendarContainer}>
		// 		<CalendarMonth month={month} />
		// 		<CalendarMonth month={secondMonth} />
		// 	</View>
		// </GestureRecognizer>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.surface,
			// paddingHorizontal: 24,
			paddingVertical: 12,
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
