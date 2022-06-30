import { useEffect, useState } from "react";
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import { 
    collection,
    addDoc, 
    query,  
    getDocs, 
    where } from "firebase/firestore"; 
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "../firebase.config";
import Todos from './Todos';
import AddTodo from './AddTodo';

const Dashboard = () => {
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const [openAddModal, setOpenAddModal] = useState(false);
    
    const navigate = useNavigate();

    const fetchName = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setName(data.name);
        } catch (err) {
            console.log(err);
            alert("An error occured while fetching user data");
        }
    }

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
        fetchName();
      }, [user, loading]);
    
    return (
        <>
        <Container>
            <Typography variant="h4" color="primary" gutterBottom>
                Hello, {name}
            </Typography>
         <Button onClick={() => logout()}>
          Logout
         </Button>
            <Box sx={{ display: 'flex' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Button 
                            onClick={() => setOpenAddModal(true)}>
                                Add Todo <AddIcon />
                        </Button>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <Todos />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            { openAddModal &&
            <AddTodo onClose={() => setOpenAddModal(false)} open={openAddModal}/>
            }
        </Container>
        </>
    )
}

export default Dashboard;