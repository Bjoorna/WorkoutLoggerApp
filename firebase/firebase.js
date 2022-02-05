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
	writeBatch,
	where,
	query,
	getDocs,
	orderBy,
	limit,
	updateDoc,
} from "firebase/firestore";
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";

import * as firebaseConfig from "./config";
import Workout from "../models/workout";

import { nanoid } from "nanoid";
// APPSETUO
const app = initializeApp(firebaseConfig.firebaseConfig);

// FIRESTORE
const database = getFirestore(app);

// userFunctions

export const saveUserToCollection = async (user, userID) => {
	try {
		const docRef = doc(database, "users", userID);
		const userTransform = {
			name: user.name,
			dob: user.dob,
			weight: user.weight,
			height: user.height,
			useMetric: user.useMetric,
			profileImageURI: user.profileImageURI,
		};
		return await setDoc(docRef, userTransform, { merge: true });
	} catch (error) {
		throw new Error(error);
	}
};

export const updateUser = async (userID, newUserState) => {
	const userRef = doc(database, "users", userID);
	try {
		console.log("userState from firebase function");
		console.log(newUserState);
		return await updateDoc(userRef, { ...newUserState });
	} catch (error) {
		throw new Error(error);
	}
};

export const writeExercisesToDatabase = async (
	exercises,
	userID,
	workoutID,
	timestamp
) => {
	try {
		const batch = writeBatch(database);
		const arrayOfExerciseIDs = [];
		for (let exercise of exercises) {
			const exerciseID = nanoid();
			const exerciseTransform = {
				exercise: exercise.exercise,
				weight: exercise.weight,
				reps: exercise.reps,
				sets: exercise.sets,
				rpe: exercise.rpe,
				date: timestamp,
				owner: userID,
				workoutID: workoutID,
			};
			const exerciseRef = doc(database, "exercises", exerciseID);
			arrayOfExerciseIDs.push(exerciseID);
			batch.set(exerciseRef, exerciseTransform);
		}
		await batch.commit();
		return arrayOfExerciseIDs;
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export const getUserWorkouts = async (userID) => {
	try {
		const q = query(
			collection(database, "workouts"),
			where("owner", "==", userID),
			orderBy("date", "desc"),
			limit(5)
		);
		const querySnapshot = await getDocs(q);
		return querySnapshot;
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
};

export const getExercisesInWorkout = async (exercises, userID) => {
	try {
		const docRefs = exercises.map((exercise) =>
			getDoc(doc(database, "exercises", exercise))
		);
		const docSnaps = await Promise.all(docRefs);
		return docSnaps;
	} catch (error) {
		throw new Error(error);
	}
};

export const writeWorkoutToCollection = async (workout) => {
	try {
		const timestamp = Timestamp.fromMillis(workout.date);
		const newUUID = nanoid();
		const exerciseIDs = await writeExercisesToDatabase(
			workout.exercises,
			workout.owner,
			newUUID,
			timestamp
		);
		const newWorkout = {
			exercises: exerciseIDs,
			date: timestamp,
			complete: workout.complete,
			note: workout.note,
			owner: workout.owner,
		};

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
	shouldMerge = true
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
			return await addDoc(collection(database, dbCollection), document);
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
