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
import {Routes, Route, Navigate } from "react-router-dom";


function App() {
  return (
    <>
    <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Signin />} />
                <Route path="/home" element={<Dashboard />} />
    </Routes>
    </>
  );
}

export default App;
