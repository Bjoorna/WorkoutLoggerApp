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
