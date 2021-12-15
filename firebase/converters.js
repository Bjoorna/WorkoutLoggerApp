export const workoutConverter = {
	toFirestore: (workout) => {
		return{
			date: workout.date,
			complete: workout.complete,
			note: workout.note,
			owner: workout.owner
		};
	},
	fromFirestore: (snapshot, options) => {
		const data = snapshot.data(options);
		return new Workout(data.date, data.complete, data.note, data.owner);
	}
}