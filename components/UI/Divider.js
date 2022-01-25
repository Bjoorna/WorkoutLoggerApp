import React from "react";
import { StyleSheet, View } from "react-native";

import { Themes } from "../../shared/Theme";
const theme = Themes.dark;


/**
 * UI component, divider
 * @param {*} props - Standard React props
 * @param {string} width -  Specify the width of the divider as a percentage of parent component
 * @param {string} color -  Color of the divider

 */

 

const Divider = props => {
    return (
		<View
			style={{
				height: 1,
				borderTopColor: props.color,
				width: props.width,
				borderStyle: "solid",
				borderWidth: 1,
			}}
		></View>
	);}


export default Divider