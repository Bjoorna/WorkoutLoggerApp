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

export const writeExercisesToDatabase = async (
	exercises,
	userID,
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
			limit(1)
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
		// const q = query(collection(database, "exercises"), where(FieldPath.))
		// const q = query(collection(database, "exercises"), where("uid", "in", workouts));
		// const querySnapshot = await getDocs(q);
		// querySnapshot.forEach(doc => {
		// 	console.log("An Exercise: " + doc.data());
		// })
		const docRefs = exercises.map((exercise) =>
			getDoc(doc(database, "exercises", exercise))
		);
		const docSnaps = await Promise.all(docRefs);
		return docSnaps;
		// docSnaps.forEach(doc => {
		// 	if(doc.exists){
		// 		console.log(doc.data());
		// 	}
		// });
	} catch (error) {
		throw new Error(error);
	}
};

export const writeWorkoutToCollection = async (workout) => {
	try {
		const timestamp = Timestamp.fromMillis(workout.date);
		const exerciseIDs = await writeExercisesToDatabase(
			workout.exercises,
			workout.owner,
			timestamp
		);
		const newWorkout = {
			exercises: exerciseIDs,
			date: timestamp,
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

export const saveUserToCollection = async (user, userID) => {
	try {
		const docRef = doc(database, "users", userID);
		const userTransform = {
			name: user.name,
			dob: user.dob,
			weight: user.weight,
			height: user.height,
			profileImageURI: user.profileImageURI,
		};
		return await setDoc(docRef, userTransform, { merge: true });
	} catch (error) {
		throw new Error(error);
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
