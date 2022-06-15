import { async } from '@firebase/util';
import Asyncstorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid';

export const hexToRGB = (hex) => {
	let r = 0,
		g = 0,
		b = 0;
	// 3 digits
	if (hex.length == 4) {
		r = "0x" + hex[1] + hex[1];
		g = "0x" + hex[2] + hex[2];
		b = "0x" + hex[3] + hex[3];

		// 6 digits
	} else if (hex.length == 7) {
		r = "0x" + hex[1] + hex[2];
		g = "0x" + hex[3] + hex[4];
		b = "0x" + hex[5] + hex[6];
	}
	return [+r, +g, +b];
	// return "rgb("+ +r + "," + +g + "," + +b + ")";
};

/**
 * Convert mass from kilogram to pounds, or the other way
 * @param {number} value The mass to be converted
 * @param {boolean} fromPounds Boolean is true if we want to convert from pounds to kg, false will convert from kg to pounds
 * @returns {number} Converted value
 */
export const convertMass = (value, fromPounds) => {
	if (fromPounds) {
		return value / 2.205;
	} else {
		return value * 2.205;
	}
};

/**
 *
 * @param {Array<number>} years - An array of numbers, each being a year with 4 numbers;
 */

export const createCalendar = (years) => {
	const calendar = new Map();

	for (let year of years) {
		const yearData = createYear(year);
		calendar.set(year, yearData);
	}
	return calendar;
};

export const createYear = (year) => {
	const months = [];

	for (let i = 0; i < 12; i++) {
		let date = new Date(Date.UTC(year, i, 1));
		const arrayOfDays = [];
		while (date.getUTCMonth() === i) {
			const newDay = new Day(
				nanoid(12),
				new Date(date),
				date.getUTCDay(),
				date.getUTCDate()
			);
			arrayOfDays.push(newDay);
			date.setUTCDate(date.getUTCDate() + 1);
		}
		const newMonth = new Month(nanoid(12),arrayOfDays);

		months.push(newMonth);

		// months.push(arrayOfDays);
	}
	return months;
};

export const createMonth = (month) => {
	const arrayOfDays = [];
};

export const saveCalendar = async (calendar) => {
	const serializedCalendar = JSON.stringify(Array.from(calendar.entries()));
	try{
		await(saveToAsyncStorage("calendar", serializedCalendar));
	}catch(error){

	}
	// console.log(newJSON);
	// const toMap = new Map(JSON.parse(newJSON));
	// console.log(toMap);
};

export const getCalendarFromStorage = async() => {
	try {
		const fromStorage = await getFromAsyncStorage("calendar");
		if(fromStorage){
			const calendarToMap = new Map(JSON.parse(fromStorage));
			return calendarToMap;
		}else{return null}
	} catch (error) {
		
	}
}


export const saveToAsyncStorage = async(key, value) => {
	try {
		await Asyncstorage.setItem(key, value);
	} catch (error) {
		console.log("Error on savetoasyncstorage");
	}
}

export const getFromAsyncStorage = async(key) => {
	try {
		const value = await Asyncstorage.getItem(key);
		return value != null ? value: null;
	} catch (error) {
		console.log("Error when getting item");
	}
}

export class Day {
	constructor(id, date, dayOfWeek, dayOfMonth) {
		this.id = id;
		this.date = date;
		this.dayOfWeek = dayOfWeek;
		this.dayOfMonth = dayOfMonth;
	}
}

export class Month {
	constructor(id, days) {
		this.id = id;
		this.days = days;
	}
}
