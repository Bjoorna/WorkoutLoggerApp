import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, StyleSheet, View} from "react-native";
// import { TestTheme as theme } from "..Theme/shared/Theme";
import { useDimensions } from "@react-native-community/hooks";
import * as firebase from '../../firebase/firebase';
import FabButton from "../../components/Buttons/Fab";
import { Themes } from "../../shared/Theme";
import OutlineButton from "../../components/Buttons/OutlineButton";
import { useSelector } from "react-redux";
const theme = Themes.dark;

const WorkoutListScreen = (props) => {
	const { width, height } = useDimensions().window;

	const userID = useSelector((state) => state.auth.userID);

    const getUserWorkoutsFromServer = async() => {
        const workouts = await firebase.getUserWorkouts(userID);
        console.log(workouts);
    }
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
                    <OutlineButton onButtonPress={() => getUserWorkoutsFromServer()}>GetUserWorkouts</OutlineButton>
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

export default WorkoutListScreen;
