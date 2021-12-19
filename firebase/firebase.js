
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {
	collection,
	doc,
	setDoc,
	getFirestore,
	getDoc,
	addDoc,
	Timestamp,
	writeBatch
} from "firebase/firestore";
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";

import * as firebaseConfig from "./config";
import Workout from "../models/workout";

import {nanoid} from 'nanoid';
// APPSETUO
const app = initializeApp(firebaseConfig.firebaseConfig);

// FIRESTORE
const database = getFirestore(app);

export const writeExercisesToDatabase = async (exercises) => {
	try {
		const batch = writeBatch(database);
		let arrayOfExerciseIDs = [];
		for(let exercise of exercises) {
			const exerciseID = nanoid();
			const exerciseTransform = {
				exercise: exercise.exercise,
				weight: exercise.weight,
				reps: exercise.reps,
				sets: exercise.sets
			};
			const exerciseRef = doc(database, "exercises", exerciseID);
			arrayOfExerciseIDs.push(exerciseID);
			batch.set(exerciseRef, exerciseTransform);
		}
		await batch.commit();
		return arrayOfExerciseIDs;
	} catch (error) {
		console.log(error);
	}
}

export const writeWorkoutToCollection = async (workout) => {
	try {
		const exerciseIDs = await writeExercisesToDatabase(workout.exercises)

		const newWorkout = {
			exercises: exerciseIDs,
			date: Timestamp.now(),
			complete: workout.complete,
			note: workout.note,
			owner: workout.owner,
		};

		const newUUID = nanoid();
		console.log(newUUID);

		const docRef = doc(database, "workouts", newUUID);
		return await setDoc(docRef, newWorkout);
	} catch (e) {
		console.log("From WriteWrokoutToCOllection");
		console.log(e);

	}
};

export const writeDocumentToCollection = async (
	document,
	dbCollection,
	optionalID = "",
	shouldMerge = true,
	converter
) => {
	console.log("doc: " + document);
	if (optionalID !== "") {
		try {
			const docRef = doc(database, dbCollection, optionalID);
			return await setDoc(docRef, document, { merge: shouldMerge });
		} catch (e) {
			console.log("From WriteDocumentToCOllection");
			console.log(e);
		}
	} else {
		try {
			return (
				await addDoc(collection(database, dbCollection), document)
			).withConverter(converter);
		} catch (e) {
			console.log("From WriteDocumentToCOllection, with no specified ID");
			console.log(e);
		}
	}
};

export const getDocumentFromCollection = async (docID, collectionName) => {
	console.log(docID, collectionName);
	const docRef = doc(database, collectionName, docID);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		// console.log("Document Data: ");
		// console.log( docSnap.data());
		return docSnap.data();
	} else {
		console.log("No such document");
	}
};

// AUTHENTICATION
const auth = getAuth();

export const signUpNewUserWithEmailAndPassword = async (email, password) => {
	try {
		const userCredentials = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		return userCredentials.user;
	} catch (error) {
		const errorCode = error.code;
		const errorMessage = error.message;
		console.log(error.message);
		// TODO, return better errorsmessages
		throw new Error(error);
	}
};

export const loginWithEmailAndPassword = async (email, password) => {
	try {
		const userCredentials = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		return userCredentials.user;
	} catch (e) {
		const errorCode = error.code;
		const errorMessage = error.message;
		console.log(error.message);
		// TODO, return better errorsmessages
		throw new Error(error);
	}
};

// converters

const workoutConverter = {
	toFirestore: (workout) => {
		return {
			date: workout.date,
			complete: workout.complete,
			note: workout.note,
			owner: workout.owner,
		};
	},
	fromFirestore: (snapshot, options) => {
		const data = snapshot.data(options);
		return new Workout(data.date, data.complete, data.note, data.owner);
	},
};
