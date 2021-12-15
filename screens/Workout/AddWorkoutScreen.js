import React, { useState } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import { Modal, Portal } from "react-native-paper";
import FilledButton from "../../components/Buttons/FilledButton";
import BodyText from "../../components/Text/Body";

import { Picker } from "@react-native-picker/picker";
import { Themes } from "../../shared/Theme";
const theme = Themes.dark;

const ExerciseArray = ["Squat", "DeadLift", "Bench-Press"];
const ExerciseList = (props) => {
	console.log(props.item);
	return (
		<View style={styles.exerciseListItem}>
			<BodyText
				style={{ color: theme.onSecondaryContainer }}
				large={true}
			>
				{props.item}
			</BodyText>
		</View>
	);
};

const AddWorkoutScreen = (props) => {
	const [modalVisible, setModalVisible] = useState(false);
	const showModal = () => setModalVisible(true);
	const hideModal = () => setModalVisible(false);

	const [selectedExercise, setSelectedExercise] = useState();
	return (
		<View style={styles.container}>
			{/* <Picker
				selectedValue={selectedExercise}
				onValueChange={(itemValue, itemIndex) =>
					setSelectedExercise(itemValue)
				}
			>
                <Picker.Item label="Squat" value="squat" />
                <Picker.Item label="Bench" value="bench" />
                <Picker.Item label="Deadlift" value="deadlift" />

            </Picker> */}
			<Portal>
				<Modal
					contentContainerStyle={styles.modalStyle}
					visible={modalVisible}
					onDismiss={hideModal}
				>
					<FlatList
						keyExtractor={(item) => Math.random()}
						data={ExerciseArray}
						renderItem={(itemData) => (
							<ExerciseList item={itemData.item} />
						)}
					/>
					<FilledButton onButtonPress={hideModal}>
						Dismiss
					</FilledButton>
				</Modal>
			</Portal>

			<FilledButton onButtonPress={showModal}>ShowModal</FilledButton>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	modalStyle: {
		left: "5%",
		height: "60%",
		width: "90%",
		backgroundColor: theme.secondaryContainer,
		justifyContent: "center",
		alignItems: "center",
	},
	exerciseListItem: {
        flexDirection: "row",
        justifyContent: "flex-start",
		width: "100%",
		height: 50,
        marginVertical: 5
		// backgroundColor: theme.tertiaryContainer,
	},
});

export default AddWorkoutScreen;
