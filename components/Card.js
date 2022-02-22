import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Themes } from "../shared/Theme";
const theme = Themes.dark

// unused
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
    backgroundColor: theme.surface,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  baseText: {
    color: theme.onSurface,
    fontSize: 32
  },
});

export default Card;