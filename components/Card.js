import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { DarkTheme } from "../shared/Theme";

const Card = (props) => {
  return (
    <View style={{ ...styles.cardBase, ...props.style }}>
      <Text style={{ ...styles.baseText, ...props.textStyle }}>
        {props.children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardBase: {
    //   flex: 1,
    width: "90%",
    height: 150,
    borderRadius: 15,
    backgroundColor: DarkTheme.surface,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  baseText: {
    color: DarkTheme.onSurface,
    fontSize: 32
  },
});

export default Card;