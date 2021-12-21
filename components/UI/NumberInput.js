import React from "react";
import { View, StyleSheet, TextInput } from "react-native";

import { Themes } from "../../shared/Theme";
const theme = Themes.dark;

const NumberInput = props => {
	return <TextInput {...props} style={{ ...styles.input, ...props.style }} />;
}

const styles = StyleSheet.create({
    input: {
		height: 80,
		backgroundColor: theme.onSecondaryContainer,
		borderRadius: 20,
		width: "90%",
	},

})

export default NumberInput;