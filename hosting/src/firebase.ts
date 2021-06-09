import "firebase/storage"
import "firebase/functions"
import firebase from "firebase/app"

const firebaseConfig = {
  apiKey: "AIzaSyBXG-WEWA01lHIEGil6upSdiPjErcqLtvY",
  authDomain: "fs31-test.firebaseapp.com",
  projectId: "fs31-test",
  storageBucket: "fs31-test.appspot.com",
  messagingSenderId: "503430138275",
  appId: "1:503430138275:web:d14e40029f1bfd4baa7216",
}

export const initializeFirebase = () => {
  firebase.initializeApp(firebaseConfig)
}
