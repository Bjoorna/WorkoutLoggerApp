import React from 'react'
import { StyleSheet, View } from 'react-native'
import TitleText from './Text/Title'
import TextButton from './Buttons/TextButton'
import { ThemeProvider } from 'react-native-paper'


const ExerciseSummaryView = props => {
    console.log(props);
    return <View style={styles.exerciseSummaryView}>
        <TitleText large={true} >{props.exercise.exercise}</TitleText>
        <TextButton onButtonPress={props.removeExercise}>Delete</TextButton>
    </View>
}


const styles = StyleSheet.create({
    exerciseSummaryView: {
        width: "100%",
        height: 100,
        padding: 10,
        marginVertical: 5,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: "space-between"
    }
})

export default ExerciseSummaryView;