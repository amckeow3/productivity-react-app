import React, { useEffect, useState }from 'react';
import Signin from './components/Signin';
import Signup from './components/Signup';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import Dashboard from './components/Dashboard';


function App() {
  return (
    <>
    <Signup />
    <Dashboard />
    </>
  );
}

export default App;
