import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBnqW6dAZJ45Ur8wHE6ov9z_Yi5HJ2gMnc',
  authDomain: 'universal-clipboard-92196.firebaseapp.com',
  projectId: 'universal-clipboard-92196',
  storageBucket: 'universal-clipboard-92196.firebasestorage.app',
  messagingSenderId: '125001281138',
  appId: '1:125001281138:web:f651051dc302054c249ceb',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)
