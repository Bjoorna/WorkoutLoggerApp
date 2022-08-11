import { async } from "@firebase/util";
import Asyncstorage from "@react-native-async-storage/async-storage";
import { getIn } from "immutable";
import { nanoid } from "nanoid";
import Workout from "../../models/workout";

export const getIntensity = (rpe, reps) => {
	const intensity10 = [100, 96, 92, 89, 86, 84, 81, 79, 76, 74];
	const intensity95 = [98, 94, 91, 88, 85, 82, 80, 77, 75, 72];
	const intensity9 = [96, 92, 89, 86, 84, 81, 79, 76, 74, 71];
	const intensity85 = [94, 91, 88, 85, 82, 80, 77, 75, 72, 69];
	const intensity8 = [92, 89, 86, 84, 81, 79, 76, 74, 71, 68];
	const intensity75 = [91, 88, 85, 82, 80, 77, 75, 72, 69, 67];
	const intensity7 = [89, 86, 84, 81, 79, 76, 74, 71, 68, 65];
	const intensity65 = [88, 85, 82, 80, 77, 75, 72, 69, 67, 64];

	switch (rpe) {
		case 6.5:
			return intensity65[reps - 1];

		case 7:
			return intensity7[reps - 1];

		case 7.5:
			return intensity75[reps - 1];
		case 8:
			return intensity8[reps - 1];
		case 8.5:
			return intensity85[reps - 1];
		case 9:
			return intensity9[reps - 1];
		case 9.5:
			return intensity95[reps - 1];
		case 10:
			return intensity10[reps - 1];
		default:
			return -1;
	}
};

export const calculateAverageIntensity = (sets) => {
	let nrOfSets = 1;
	let intensitySum = 0;
	for (let set of Object.values(sets)) {
		intensitySum += getIntensity(set.rpe, set.reps);
		nrOfSets++;
	}
	return intensitySum / nrOfSets;
};

export const calculateE1RM = set => {
	const reps = set.reps;
	const rpe = set.rpe;
	if(reps >= 1 && reps <=10 && rpe >= 6.5 && rpe <= 10){
		const intensity = getIntensity(rpe, reps);
		const e1RM = set.weight / (intensity/100);
		return e1RM;
	}
}

export const findTopSetInExercise = (sets) => {
	let topSetCandidate = sets[1];

	for (let [set, setValue] of Object.entries(sets)) {
		if (setValue.weight > topSetCandidate.weight) {
			topSetCandidate = setValue;
		}
	}

	return topSetCandidate;
};

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

export const convertKiloToPound = (weight) => {
	return weight * 2.205;
};

export const convertPoundToKilo = (weight) => {
	return weight / 2.205;
};

export const convertImperialHeightToMetric = ({ feet, inch }) => {
	const inchToCentimeters = Math.round(inch * 2.54);
	const feetToCentimeters = Math.round(feet * 30.48);

	const finalCentimeters = feetToCentimeters + inchToCentimeters;
	return finalCentimeters;
};

export const convertMetricHeightToImperial = (cm) => {
	const inches = Math.round(cm / 2.54);
	return { feet: Math.floor(inches / 12), inches: inches % 12 };
};

export const inputValueValidityCheck = (type, value) => {
	if (type === "rpe" || type==="knownRPE" || type==="wantRPE") {
		if (value >= 6.5 && value <= 10) {
			return true;
		} else {
			return false;
		}
	} else {
		if (value > 0 && value != null) {
			return true;
		}
		return false;
	}
};

/**
 *
 * @param {Array<number>} years - An array of numbers, each being a year with 4 numbers;
 */

export const createCalendar = async (years) => {
	const calendar = new Map();

	for (let year of years) {
		const yearData = createYear(year);
		calendar.set(year, yearData);
	}
	return calendar;
};

export const addYearToCalendar = (calendar, yearToAdd) => {
	const newMap = new Map(calendar);
	if (newMap) {
		const newYear = createYear(yearToAdd);
		newMap.set(yearToAdd, newYear);

		return newMap;
	} else {
		console.log("NoExitingCalendar");
	}
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
		const newMonth = new Month(nanoid(12), arrayOfDays);

		months.push(newMonth);
	}
	return months;
};

export const saveToAsyncStorage = async (key, value) => {
	try {
		await Asyncstorage.setItem(key, value);
	} catch (error) {
		console.log("Error on savetoasyncstorage");
	}
};

export const getFromAsyncStorage = async (key) => {
	try {
		const value = await Asyncstorage.getItem(key);
		return value != null ? value : null;
	} catch (error) {
		console.log("Error when getting item");
	}
};

export const transformObjectToWorkout = (object) => {
	const transformedWorkout = new Workout(
		object.exercises,
		object.date,
		object.complete,
		object.note,
		object.owner,
		object.id
	);
	return transformedWorkout;
};

export class Day {
	constructor(id, date, dayOfWeek, dayOfMonth) {
		this.id = id;
		this.date = date;
		this.dayOfWeek = dayOfWeek;
		this.dayOfMonth = dayOfMonth;
	}

	get getDate() {
		return this.date;
	}
}

export class Month {
	constructor(id, days) {
		this.id = id;
		this.days = days;
	}
}
