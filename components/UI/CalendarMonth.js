import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";

import BodyText from "../Text/Body";

import { Themes } from "../../shared/Theme";
import CalendarDay from "./CalendarDay";

const CalendarMonth = ({ month }) => {
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
	const isMondayFirstDayOfWeek = useSelector(
		(state) => state.appSettings.isMondayFirstDay
	);

	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	const [isLoading, setIsLoading] = useState(false);

	const [displayMonth, setDisplayMonth] = useState(null);

	const [monthName, setMonthName] = useState();

	const [mondayFirst, setMondayFirst] = useState(isMondayFirstDayOfWeek);

	useEffect(() => {
		if (month) {
		} else {
			console.log("no month yet");
		}
	}, []);

	useEffect(() => {
		setStyles(getStyles(useDarkMode ? Themes.dark : Themes.light));
		setCurrentTheme(useDarkMode ? Themes.dark : Themes.light);
	}, [useDarkMode]);

	useEffect(() => {
		setMondayFirst(isMondayFirstDayOfWeek);
	}, [isMondayFirstDayOfWeek]);

	useEffect(() => {
		if (month) {
			getMonthName(month[0].getDate);
			createViewMonth(month);
		}
	}, [month]);

	useEffect(() => {
		if (displayMonth) {
			setIsLoading(false);
		}
	}, [displayMonth]);

	const createViewMonth = (month) => {
		const monthView = [];

		let week = [...Array(7).keys()].map((i) => null);

		for (let day of month) {
			if (day.dayOfWeek === 6) {
				week[day.dayOfWeek] = day;
				monthView.push(week);
				week = [...Array(7).keys()].map((i) => null);
				continue;
			}
			week[day.dayOfWeek] = day;
		}
		monthView.push(week);
		setDisplayMonth(monthView);
	};

	const getMonthName = (date) => {
		const monthNumber = date.getUTCMonth();
		const year = date.getUTCFullYear();
		switch (monthNumber) {
			case 0:
				setMonthName("January " + year);
				break;
			case 1:
				setMonthName("February " + year);
				break;

			case 2:
				setMonthName("March " + year);
				break;

			case 3:
				setMonthName("April " + year);
				break;

			case 4:
				setMonthName("May " + year);
				break;

			case 5:
				setMonthName("June " + year);
				break;

			case 6:
				setMonthName("July " + year);
				break;

			case 7:
				setMonthName("August " + year);
				break;

			case 8:
				setMonthName("September " + year);
				break;

			case 9:
				setMonthName("October " + year);
				break;

			case 10:
				setMonthName("November " + year);
				break;
			case 11:
				setMonthName("December " + year);
				break;
			default:
				break;
		}
	};

	return (
		<View style={{ flex: 1 }}>
			{isLoading && (
				<View>
					<ActivityIndicator
						size={"small"}
						color={currentTheme.primary}
					/>
				</View>
			)}
			{displayMonth != null && (
				<View style={styles.calendarItem}>
					<View style={styles.calendarItemHeader}>
						<BodyText
							large={true}
							style={{ color: currentTheme.onSurface }}
						>
							{monthName}
						</BodyText>
					</View>
					{isMondayFirstDayOfWeek && (
						<View style={styles.calendarItemDaysHeader}>
							<BodyText
								large={false}
								style={{ color: currentTheme.onSurface }}
							>
								M
							</BodyText>
							<BodyText
								large={false}
								style={{ color: currentTheme.onSurface }}
							>
								T
							</BodyText>
							<BodyText
								large={false}
								style={{ color: currentTheme.onSurface }}
							>
								W
							</BodyText>
							<BodyText
								large={false}
								style={{ color: currentTheme.onSurface }}
							>
								T
							</BodyText>
							<BodyText
								large={false}
								style={{ color: currentTheme.onSurface }}
							>
								F
							</BodyText>
							<BodyText
								large={false}
								style={{ color: currentTheme.onSurface }}
							>
								S
							</BodyText>
							<BodyText
								large={false}
								style={{ color: currentTheme.onSurface }}
							>
								S
							</BodyText>
						</View>
					)}
					{!isMondayFirstDayOfWeek && (
						<View style={styles.calendarItemDaysHeader}>
							<BodyText
								large={false}
								style={{ color: currentTheme.onSurface }}
							>
								S
							</BodyText>

							<BodyText
								large={false}
								style={{ color: currentTheme.onSurface }}
							>
								M
							</BodyText>
							<BodyText
								large={false}
								style={{ color: currentTheme.onSurface }}
							>
								T
							</BodyText>
							<BodyText
								large={false}
								style={{ color: currentTheme.onSurface }}
							>
								W
							</BodyText>
							<BodyText
								large={false}
								style={{ color: currentTheme.onSurface }}
							>
								T
							</BodyText>
							<BodyText
								large={false}
								style={{ color: currentTheme.onSurface }}
							>
								F
							</BodyText>
							<BodyText
								large={false}
								style={{ color: currentTheme.onSurface }}
							>
								S
							</BodyText>
						</View>
					)}

					{displayMonth != null && (
						<View style={styles.calendarDaysContainer}>
							{displayMonth.map((week, index) => {
								return (
									<View
										key={index}
										style={styles.calendarItemDaysRow}
									>
										{week.map((day) => {
											return (
												// <View style={styles.calendarItemDay}>
												// 	<BodyText
												// 		large={false}
												// 		style={{
												// 			color: currentTheme.onSurface,
												// 		}}
												// 	>3</BodyText>
												// </View>
												<CalendarDay
													key={
														day === null
															? Math.random()
															: day.id
													}
													day={day}
												/>
											);
										})}
									</View>
								);
							})}
						</View>
					)}
				</View>
			)}
		</View>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
		calendarItem: {
			flex: 1,
			flexDirection: "column",
			// backgroundColor: theme.surfaceVariant,
			// marginBottom: 20
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
			// height: 30,
			// backgroundColor: theme.error,
			marginBottom: 6,
			justifyContent: "space-around",
			alignItems: "center",
		},
		calendarItemDaysRow: {
			flexDirection: "row",
			height: 40,
			justifyContent: "space-around",
			marginBottom: 12,
		},
		calendarItemDay: {
			// backgroundColor: theme.tertiaryContainer,
			justifyContent: "center",
			alignItems: "center",
			borderRadius: 16,
			width: 40,
		},
	});
};

export default CalendarMonth;
