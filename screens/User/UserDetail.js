import React from "react";
import { View, StyleSheet, Text } from "react-native";

import { Themes } from "../../shared/Theme";
const theme = Themes.dark;

const UserDetailScreen = (props) => {
	return (
		<View style={styles.screen}>
			<Text style={styles.text}>USERDETAIL</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: theme.surface,
        justifyContent: "center",
        alignItems: "center",
	},
    text: {
        color: theme.onSurface
    }
});

export default UserDetailScreen;