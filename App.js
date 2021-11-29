import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, StyleSheet, Text, View, Dimensions } from "react-native";
import { TestTheme as DarkTheme } from "./shared/Theme";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import AppNavigator from "./navigation/AppNavigator";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function App() {
	return (
		<AppNavigator />
	);
}