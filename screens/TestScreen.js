import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, StyleSheet, View, Button } from "react-native";
// import { TestTheme as theme } from "..Theme/shared/Theme";
import { useDimensions } from "@react-native-community/hooks";
import Card from "../components/Card";

import FabButton from "../components/Buttons/Fab";
import { Themes } from "../shared/Theme";
import { RotationGestureHandler } from "react-native-gesture-handler";
const theme = Themes.dark;

const TestScreen = (props) => {
	const { width, height } = useDimensions().window;
	return (
		<View style={styles.container}>
			<FabButton
      onButtonPress={() => props.navigation.navigate("AddWorkout")}
        iconName="add"
				style={{
					...styles.fabButtonPlacement,
					left: width- 200 ,
					top: height - 250,
				}}
			>
				New Workout 

			</FabButton>

			<ScrollView style={styles.scrollView}>
				<View style={styles.contentView}>
					<Card>Surface</Card>
					<Card style={{ backgroundColor: theme.surfaceE1 }}>
						Surface1
					</Card>
					<Card style={{ backgroundColor: theme.surfaceE2 }}>
						Surface2
					</Card>
					<Card style={{ backgroundColor: theme.surfaceE3 }}>
						Surface3
					</Card>
					<Card style={{ backgroundColor: theme.surfaceE4 }}>
						Surface4
					</Card>
					<Card style={{ backgroundColor: theme.surfaceE5 }}>
						Surface5
					</Card>
					<Card
						style={{ backgroundColor: theme.primary }}
						textStyle={{ color: theme.onPrimary }}
					>
						Primary
					</Card>
					<Card
						style={{ backgroundColor: theme.primaryContainer }}
						textStyle={{ color: theme.onPrimaryContainer }}
					>
						PrimaryContainer
					</Card>
					<Card
						style={{ backgroundColor: theme.secondary }}
						textStyle={{ color: theme.onSecondary }}
					>
						Secondary
					</Card>
					<Card
						style={{ backgroundColor: theme.secondaryContainer }}
						textStyle={{ color: theme.onSecondaryContainer }}
					>
						SecondaryContainer
					</Card>
					<Card
						style={{ backgroundColor: theme.error }}
						textStyle={{ color: theme.onError }}
					>
						Error
					</Card>
					<Card
						style={{ backgroundColor: theme.errorContainer }}
						textStyle={{ color: theme.onErrorContainer }}
					>
						OnErrorContainer
					</Card>
					<Card style={styles.cardWithBorder}>SurfaceBorder</Card>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.surfaceVariant,
	},
	scrollView: {
		//   // flex: 1,
		//   width: screenWidth,
		//   height: screenHeight,
		//   alignItems: "center",
		//   backgroundColor: theme.surface,
	},
	contentView: {
		flex: 1,
		alignItems: "center",
		marginTop: 40,
	},
	cardView: {
		flex: 1,
		alignItems: "center",
	},
	cardStyle: {
		backgroundColor: theme.primary,
	},
	testText: {
		color: theme.onPrimary,
	},
	cardWithBorder: {
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: theme.outline,
	},

	fabButtonPlacement: {
		position: "absolute",
		// top: "90%"
		// , right: 100,
		zIndex: 1000,
	},
});

export default TestScreen;
