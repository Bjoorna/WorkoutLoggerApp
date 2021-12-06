import React from "react";
import { Text, StyleSheet } from "react-native";
// import Theme from "../shared/Theme";

const rob400 = "roboto-400";
const rob500 = "roboto-500";


const HeadlineText = props => {
    return(
        <Text style={props.large ? {...styles.headlineLarge, ...props.style} : {...styles.headlineMedium, ...props.style}}>{props.children}</Text>
    )
}

const styles = StyleSheet.create({
    headlineLarge: {
        fontFamily: rob400,
        fontSize: 32, 
        fontWeight: "400",
    },
    headlineMedium: {
        fontFamily: rob400,
        fontSize: 28,
        fontWeight: "400",
    },
    titleSmall: {
        fontFamily: rob500,
        fontSize: 14,
        fontWeight: "500",
    },
})

export default HeadlineText;