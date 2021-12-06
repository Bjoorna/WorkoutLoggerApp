import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

import * as firebaseConfig from './config'


// export const firebaseConfig = {
//     apiKey: "AIzaSyAf6yOGx_V5wXyVUzot1sDgsICKPbDVgIs",
//     authDomain: "workoutlogger-48f71.firebaseapp.com",
//     databaseURL: "https://workoutlogger-48f71-default-rtdb.europe-west1.firebasedatabase.app/",
//     storageBucket: "gs://workoutlogger-48f71.appspot.com"
// };
const app = initializeApp(firebaseConfig.firebaseConfig);

export const database = getDatabase(app);