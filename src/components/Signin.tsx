import React, { useState, useRef } from "react";
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
  } from "firebase/auth";
  import { auth } from "../firebase.config";


function Signin() {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [user, setUser] = useState({});

    const login = () => {
        try {
          const user = signInWithEmailAndPassword(
            auth,
            loginEmail,
            loginPassword
          );
          console.log(user);
        } catch (error) {
          console.log(error);
          console.log("error creating new user");
        }
      };

    return (
        <>
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
            >
            <Typography component="h1" variant="h5">
                Sign In
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
                <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="loginEmail"
                      name="loginEmail"
                      type="text"
                      placeholder="Email"
                      onChange={(event) => {
                        setLoginEmail(event.target.value);
                    }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    name="password"
                    type="text"
                    placeholder="Password"
                    onChange={(event) => {
                        setLoginPassword(event.target.value);
                    }}
                />
                <Button
                type="submit"
                fullWidth
                onClick={login}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}>Submit</Button>
                <Grid container>
                    <Grid item>
                        <Link href="#" variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    </Container>
    </>
    );
}

export default Signin;