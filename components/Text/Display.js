import React from "react";
import { Text, StyleSheet } from "react-native";
// import Theme from "../shared/Theme";

const rob400 = "roboto-400";
const rob500 = "roboto-500";


const DisplayText = props => {
    return(
        <Text style={props.large ? {...styles.displayLarge, ...props.style} : {...styles.displayMedium, ...props.style}}>{props.children}</Text>
    )
}

const styles = StyleSheet.create({
    displayLarge: {
        fontFamily: rob400,
        fontSize: 57, 
        fontWeight: "400",
    },
    displayMedium: {
        fontFamily: rob500,
        fontSize: 45,
        fontWeight: "500",
    },
    titleSmall: {
        fontFamily: rob500,
        fontSize: 14,
        fontWeight: "500",
    },
})

export default DisplayText;