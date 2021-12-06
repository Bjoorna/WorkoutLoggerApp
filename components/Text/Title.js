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

const TitleText = props => {
    return(
        <Text style={props.large ? {...styles.titleLarge, ...props.style} : {...styles.titleMedium, ...props.style}}>{props.children}</Text>
    )
}

const styles = StyleSheet.create({
    titleLarge: {
        fontFamily: rob400,
        fontSize: 22, 
        fontWeight: "400",
    },
    titleMedium: {
        fontFamily: rob500,
        fontSize: 16,
        fontWeight: "500",
    },
    titleSmall: {
        fontFamily: rob500,
        fontSize: 14,
        fontWeight: "500",
    },
})

export default TitleText;