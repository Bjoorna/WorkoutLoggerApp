import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import { Themes } from "../shared/Theme";
import BodyText from "../components/Text/Body";
import CalendarMonth from "../components/UI/CalendarMonth";

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
	const [month, setMonth] = useState(null);

	//  calendarMap
	//      month
	//          day
	//              dayOfWeek

	useEffect(() => {
		const calendarMap = new Map();
		// const year = new Date();
		// year.setUTCFullYear(2022, 7,1);

		// console.log(year);
		getDaysInMonthOfYear(7, 2056);
	}, []);

    useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);



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
		// console.log(date);
		// console.log(days);
		// console.log(dayClassesArray);
        setMonth(dayClassesArray);
	};

	return (
		<View style={styles.container}>
			<View style={styles.calendarContainer}>
                <CalendarMonth month={month} />
                {/* <CalendarMonth /> */}
                {/* <CalendarMonth /> */}
			</View>
		</View>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.surface,
			paddingHorizontal: 24,
			paddingVertical: 12,
		},
		calendarContainer: {
			flex: 1,
			flexDirection: "column",
			// height: 200,
			// width: 200,
			// backgroundColor: theme.error,
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
            marginBottom: 12
            
		},
        calendarItemDay: {
            backgroundColor: theme.primaryContainer,
            justifyContent: "center"
            ,alignItems: "center"
            ,borderRadius: 12,
            width: 40
        }
	});
};

export default CalendarScreen;
