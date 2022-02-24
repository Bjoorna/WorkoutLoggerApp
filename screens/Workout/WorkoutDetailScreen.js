import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import { Themes } from "../../shared/Theme";

const WorkoutDetailScreen = props => {
    const workoutID = props.route.params.workoutID;
    const useDarkMode = useSelector((state) => state.appSettings.useDarkMode);
    const workoutsRef = useSelector(state => state.workout.workouts);
	const [styles, setStyles] = useState(getStyles(useDarkMode ? Themes.dark : Themes.light));
    const [workout, setWorkout] = useState();

    useEffect(()=> {
        console.log(workoutID);
        const onWorkout = workoutsRef.find(workout => workout.id == workoutID);
        console.log(onWorkout);
    }, [])

    useEffect(() => {
        setStyles(useDarkMode ? Themes.dark : Themes.light);
    }, [useDarkMode]);

    return <View style={styles.screen}></View>
}


const getStyles = theme => {
    return StyleSheet.create({
        screen: {
            flex: 1,
            backgroundColor: theme.surfaceE5
        }
    })
}



export default WorkoutDetailScreen;