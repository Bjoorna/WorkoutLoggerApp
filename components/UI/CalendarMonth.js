import { format } from "prettier";
import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import BodyText from "../Text/Body";

import { Themes } from "../../shared/Theme";

const CalendarMonth = ({ month }) => {
	const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);

	const [styles, setStyles] = useState(
		getStyles(useDarkMode ? Themes.dark : Themes.light)
	);
	const [currentTheme, setCurrentTheme] = useState(
		useDarkMode ? Themes.dark : Themes.light
	);

	const [isLoading, setIsLoading] = useState(false);
	const [onMonth, setOnMonth] = useState(null);

	const [displayMonth, setDisplayMonth] = useState([]);

	const [monthName, setMonthName] = useState(null);

	useEffect(() => {
		setIsLoading(true);
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
		if (month) {
			console.log("monthSet");
			// console.log(month);

			setOnMonth(month);
			getMonthName(month[0].date);
			createViewMonth(month);
		} else {
			// console.log("no month yet");
		}
	}, [month]);
	useEffect(() => {
		if (displayMonth) {
			setIsLoading(false);
		}
	}, [displayMonth]);

	useEffect(() => {}, [onMonth]);

	const createViewMonth = (month) => {
		const monthView = [];
		// console.log("Createviewmonth");

		let week = [...Array(7).keys()].map((i) => null);
		let onDay = 0;

		for (let day of month) {
			if (day.dayOfWeek === 6) {
				week[day.dayOfWeek] = day;
				monthView.push(week);
				week = [...Array(7).keys()].map((i) => null);
				continue;
			}

			week[day.dayOfWeek] = day;
			// 	if (onDay > 6) {
			// 		onDay = 0;
			// 		console.log("New Week");
			// 		continue;
			// 	}

			// 	week[onDay] =

			// 	console.log(day);

			// 	onDay++;
		}
		monthView.push(week);
		// console.log(monthView);
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
		<View style={styles.calendarItem}>
			{isLoading && (
				<View style={styles.calendarItemHeader}>
					<BodyText
						large={true}
						style={{ color: currentTheme.onSurface }}
					>
						{monthName}
					</BodyText>
				</View>
			)}
			<View style={styles.calendarItemHeader}>
				<BodyText
					large={true}
					style={{ color: currentTheme.onSurface }}
				>
					{monthName}
				</BodyText>
			</View>
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

			{!isLoading && (
				<View style={styles.calendarDaysContainer}>
					{displayMonth.map((week) => {
						console.log(week);
						return (
							<View style={styles.calendarItemDaysRow}>
								{week.map((day) => {
									console.log(day);
									if (day) {
										return (
											<View
												style={styles.calendarItemDay}
											>
												<BodyText
													large={false}
													style={{
														color: currentTheme.onSurfaceVariant,
													}}
												>
													{day.dayOfMonth}
												</BodyText>
											</View>
										);
									}else {
										return (
											<View
												style={styles.calendarItemDay}
											>
												<BodyText
													large={false}
													style={{
														color: currentTheme.onSurfaceVariant,
													}}
												>
													
												</BodyText>
											</View>
										);

									}
								})}
							</View>
						);
					})}
				</View>
			)}

			{/* <View style={styles.calendarItemDaysRow}>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						1
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						2
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						3
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						4
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						5
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						6
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						7
					</BodyText>
				</View>
			</View>
			<View style={styles.calendarItemDaysRow}>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						1
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						2
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						3
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						4
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						5
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						6
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						7
					</BodyText>
				</View>
			</View>
			<View style={styles.calendarItemDaysRow}>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						1
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						2
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						3
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						4
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						5
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						6
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						7
					</BodyText>
				</View>
			</View>
			<View style={styles.calendarItemDaysRow}>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						1
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						2
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						3
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						4
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						5
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						6
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						7
					</BodyText>
				</View>
			</View>
			<View style={styles.calendarItemDaysRow}>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						1
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						2
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						3
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						4
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						5
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						6
					</BodyText>
				</View>
				<View style={styles.calendarItemDay}>
					<BodyText
						large={false}
						style={{ color: currentTheme.onPrimaryContainer }}
					>
						7
					</BodyText>
				</View>
			</View> */}
		</View>
	);
};

const getStyles = (theme) => {
	return StyleSheet.create({
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
			// backgroundColor: theme.tertiaryContainer,
			justifyContent: "center",
			alignItems: "center",
			borderRadius: 16,
			width: 40,
		},
	});
};

export default CalendarMonth;
