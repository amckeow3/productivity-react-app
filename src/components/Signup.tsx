import React, { useState, useRef } from "react";
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { getAuth, createUserWithEmailAndPassword, Auth } from "firebase/auth";
import { auth } from "../firebase.config";


function Signup() {
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [user, setUser] = useState({});

    const register = () => {
        try {
          const user = createUserWithEmailAndPassword(
            auth,
            registerEmail,
            registerPassword
          );
          console.log(user)
        } catch (error) {
          console.log(error);
        }
      };

    const signup = () => {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          console.log("User was successfully created!");
          console.log(user);
        })
       .catch((error: { code: any; message: any; }) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
          console.log(errorCode);
          console.log(errorMessage);
        });
    }

    const handleSubmit = (event: { preventDefault: () => void; }) => {
      event.preventDefault();
      signup(); 
    }

    
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
                Sign Up
            </Typography>
            <Box component="form" sx={{ mt: 1 }}>
                <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="registerEmail"
                      name="registerEmail"
                      type="text"
                      placeholder="Email"
                >
                </TextField>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="registerPassword"
                    name="registerPassword"
                    type="password"
                    placeholder="Password"
                >
                </TextField>
                <Button
                type="submit"
                fullWidth
                onChange={handleSubmit}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}>Submit</Button>
                <Grid container>
                    <Grid item>
                        <Link href="#" variant="body2">
                            {"Already have an account? Sign In"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    </Container>
    </>
    );
}

export default Signup;
