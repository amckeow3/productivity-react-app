import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import { Link as MuiLink } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import { FC, useEffect, useState } from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { literal, object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from './FormInput';
import { ReactComponent as GoogleLogo } from '../assets/google.svg';
import { ReactComponent as GitHubLogo } from '../assets/github.svg';
import styled from '@emotion/styled';
import { 
  auth, 
  loginWithEmailAndPassword 
} from "../firebase.config";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

  //  Styled React Route Dom Link Component
export const LinkItem = styled(Link)`
text-decoration: none;
color: #3683dc;
&:hover {
  text-decoration: underline;
  color: #5ea1b6;
}
`;

//  Styled Material UI Link Component
export const OauthMuiLink = styled(MuiLink)`
display: flex;
justify-content: center;
align-items: center;
background-color: #f5f6f7;
border-radius: 1;
padding: 0.6rem 0;
column-gap: 1rem;
text-decoration: none;
color: #393e45;
font-weight: 500;
cursor: pointer;

&:hover {
  background-color: #fff;
  box-shadow: 0 1px 13px 0 rgb(0 0 0 / 15%);
}
`;

//  Login Schema with Zod
const loginSchema = object({
  email: string().min(1, 'Email is required').email('Email is invalid'),
  password: string()
    .min(1)
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  persistUser: literal(true).optional(),
});

type ILogin = TypeOf<typeof loginSchema>;

const Login = () => {
  //  Default Values
  const defaultValues: ILogin = {
    email: '',
    password: '',
  };

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, loading]);

  //  The object returned from useForm Hook
  const methods = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  //  Submit Handler
  const onSubmitHandler: SubmitHandler<ILogin> = (values: ILogin) => {
    console.log(values);
  };

  return (
    <Container
      maxWidth={false}
      sx={{ height: '100vh', backgroundColor: { xs: '#fff', md: '#f4f4f4' } }}
    >
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        sx={{ width: '100%', height: '100%' }}
      >
        <Grid
          item
          sx={{ maxWidth: '70rem', width: '100%', backgroundColor: '#fff' }}
        >
          <FormProvider {...methods}>
            <Grid
              container
              sx={{
                boxShadow: { sm: '0 0 5px #ddd' },
                py: '6rem',
                px: '1rem',
              }}
            >
              <Grid
                item
                container
                justifyContent='space-between'
                rowSpacing={5}
                sx={{
                  maxWidth: { sm: '45rem' },
                  marginInline: 'auto',
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{ borderRight: { sm: '1px solid #ddd' } }}
                >
                  <Box
                    display='flex'
                    flexDirection='column'
                    component='form'
                    noValidate
                    autoComplete='off'
                    sx={{ paddingRight: { sm: '3rem' } }}
                    onSubmit={methods.handleSubmit(onSubmitHandler)}
                  >
                    <Typography
                      variant='h6'
                      component='h1'
                      sx={{ textAlign: 'center', mb: '1.5rem' }}
                    >
                      Log into your account
                    </Typography>

                    <FormInput
                      label='Enter your email'
                      type='text'
                      name='email'
                      id='email'
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      focused
                      required
                    />
                    <FormInput
                      type='password'
                      label='password'
                      name='password'
                      id='password'
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      focused
                    />
                    <LoadingButton
                      loading={false}
                      type='submit'
                      variant='contained'
                      onClick={() => loginWithEmailAndPassword(loginEmail, loginPassword)}
                      sx={{
                        py: '0.8rem',
                        mt: 2,
                        width: '80%',
                        marginInline: 'auto',
                        backgroundColor: '#e040fb'
                      }}
                    >
                      Login
                    </LoadingButton>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant='h6'
                    component='p'
                    sx={{
                      paddingLeft: { sm: '3rem' },
                      mb: '1.5rem',
                      textAlign: 'center',
                    }}
                  >
                    Log in with another provider:
                  </Typography>
                  <Box
                    display='flex'
                    flexDirection='column'
                    sx={{ paddingLeft: { sm: '3rem' }, rowGap: '1rem' }}
                  >
                    <OauthMuiLink href=''>
                      <GoogleLogo style={{ height: '2rem' }} />
                      Google
                    </OauthMuiLink>
                    <OauthMuiLink href=''>
                      <GitHubLogo style={{ height: '2rem' }} />
                      GitHub
                    </OauthMuiLink>
                  </Box>
                </Grid>
              </Grid>
              <Grid container justifyContent='center'>
                <Stack sx={{ mt: '3rem', textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '0.9rem', mb: '1rem' }}>
                    Need an account?{' '}
                    <LinkItem to='/signup'>Sign up here</LinkItem>
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </FormProvider>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
