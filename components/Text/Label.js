import React from "react";
import { Text, StyleSheet } from "react-native";
// import Theme from "../shared/Theme";

const rob400 = "roboto-400";
const rob500 = "roboto-500";

/**
 * One obligatory prop, 
 * @param {string} large - Select large or medium variant of title  
 * @param  props 
 * @returns 
 */

const LabelText = props => {
    return(
        <Text style={props.large ? {...styles.labelLarge, ...props.style} : {...styles.labelMedium, ...props.style}}>{props.children}</Text>
    )
}

const styles = StyleSheet.create({
    labelLarge: {
        fontFamily: rob500,
        fontSize: 14, 
        fontWeight: "500",
    },
    labelMedium: {
        fontFamily: rob500,
        fontSize: 12,
        fontWeight: "500",
    },
    titleSmall: {
        fontFamily: rob500,
        fontSize: 14,
        fontWeight: "500",
    },
})

export default LabelText;