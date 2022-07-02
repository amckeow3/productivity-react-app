import React, { useEffect, useState, useMemo  } from "react";
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
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import { 
    collection,
    addDoc, 
    doc,
    query,  
    getDocs, 
    where,
    orderBy,
    onSnapshot,
    updateDoc
} from "firebase/firestore"; 
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "../firebase.config";
import Todos from './Todos';
import AddTodo from './AddTodo';
import { LegendToggleTwoTone } from "@mui/icons-material";
import { zodResolver } from '@hookform/resolvers/zod';
import { boolean, object, string, TypeOf } from 'zod';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import '../global';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from "@mui/material/AppBar";
import Stack from '@mui/material/Stack';

const main = '#e040fb';

const appBar = {
    background: main,
    color: '#FFF',
    padding: '20px',
    position: "static",
    width: '100%',
};

const Dashboard = () => {

    const todosSchema = object({
        id: string()
    });
    
    type ITodos = TypeOf<typeof todosSchema>;
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const [openAddModal, setOpenAddModal] = useState(false);
    const [todos, setTodos] = useState<any[]>([]);
    const [isTodoChecked, setIsTodoChecked] = useState(false);
    const [todoId, setTodoId] = useState("");
    const [completedTaskList, setCompletedTaskList] = useState<any[]>([]);
    const [todaysDate, setTodaysDate] = useState("");
    const [todaysTodos, setTodaysTodos] = useState<any[]>([]);
    let todoArr: any[] = [];
    let todaysTodosArr: any[] = [];
    
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

    const fetchAllTodos = async () => {
        try {
            const q = query(collection(db, 'todos'), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            if (doc.empty) {
                console.log("You do not have any todo items")
            }
            todoArr = doc.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            }))
              setTodos(todoArr);
        } catch (err) {
            console.log(err);
        }
    }

    const fetchTodaysTodos = async () => {
        var today = new Date();
        var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();

        try {
            const q = query(collection(db, 'todos'), where("uid", "==", user?.uid), where("todoDate", "==", date.toString()));
            const doc = await getDocs(q);
            if (doc.empty) {
                console.log("You do not have any todo items today")
            }
            todaysTodosArr = doc.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            }))
              setTodaysTodos(todaysTodosArr);
              console.log(todaysTodos);
        } catch (err) {
            console.log(err);
        }
    }

    const handleToggle = async(e: { target: { value: string; }; } ) => {
        console.log("Id of selected task: " + todoId);
        const taskDocRef = doc(db, 'todos', todoId);
        const id = e?.target.value;

        setTodoId(id);
        setIsTodoChecked(isTodoChecked!);
        console.log(`${id} is ${isTodoChecked}`);

        const completedItems = completedTaskList;
        //const completedTaskDocRef = doc(db, 'todos', id);
        
        try{
          await updateDoc(taskDocRef, {
            completed: isTodoChecked
          })
        } catch (err) {
          alert(err)
        }
      }

      const checkValue = async(e: { target: { value: string; }; }) => {
        var value = e.target.value;
        console.log("You selected " + value);
        const taskDocRef = doc(db, 'todos', value);
        setIsTodoChecked(!isTodoChecked);
        try{
          await updateDoc(taskDocRef, {
            completed: isTodoChecked
          }) 
          
        } catch (err) {
          alert(err)
        }
       fetchAllTodos();
      }

      const handleChange = async() => {
        setIsTodoChecked(!isTodoChecked);
        console.log(`${todoId} is ${isTodoChecked}`);
        const todoDocRef = doc(db, 'todos', todoId)
        try{
          await updateDoc(todoDocRef, {
            completed: isTodoChecked
          })
        } catch (err) {
          alert(err)
        }
      }
    
  //const todos: { id: string; todoName: string; todoDate: string; completed: boolean; }[] = []; 
  /* function to get all tasks from firestore in realtime */ 
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchName();
    fetchAllTodos();
    fetchTodaysTodos();
  }, [user, loading]);

    return (
        <>
        <Container
            sx={{
                background: "#fcf8f8"
            }}>
            <AppBar sx={appBar}>
                <Container
                sx={{ 
                width: '100%',
                display: 'flex',
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                }}>
                    <Typography  
                        sx={{
                        marginLeft: '40px', 
                        fontSize: 30, 
                        fontWeight: 500
                        }}>
                     Hello, {name}
                    </Typography>
                    <Box
                        sx={{
                            float:'right'
                        }}
                    >
                        <Button onClick={() => logout()}>
                            <Typography sx={{ color: '#FFF' }}>Logout</Typography>
                        </Button>
                    </Box>
                </Container>
            </AppBar>
            <Container
                sx={{ 
                padding: '20px',
                width: '100%',
                display: 'flex',
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                }}>
                <Paper 
                    sx={{ 
                    padding: '20px',
                    display: 'flex', 
                    flexDirection: 'column' 
                    }}>
                    <Typography variant='h5' sx={{color: main}}>Today's Tasks</Typography>
                    <Table>
                            <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                    </TableRow>
                            </TableHead>
                            <TableBody>   
                                { todaysTodos.map((todo) => (
                                <TableRow id={todo.id} key={todo.id}>
                                    {/*<Checkbox 
                                        id={`checkbox-${todo.id}`} 
                                        name="todoItems"
                                        value={todo.id}
                                        checked={isTodoChecked} 
                                        onClick={() => setTodoId(todo.id)}
                                onChange={ handleChange } />*/}
                                    <TableCell>{todo.data.todoName}</TableCell>
                                </TableRow>
                        ))}
                            </TableBody>
                    </Table>
                </Paper>
            </Container>
            <Box sx={{ display: 'flex' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Container>
                        <Paper 
                            sx={{ p: 2, 
                            display: 'flex', 
                            flexDirection: 'column',
                            width: '80%'
                            }}
                        >
                        <Container
                            sx={{ 
                            display: 'flex',
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexDirection: "row",
                            }}>
                                    <Typography variant='h5' sx={{color: main}}>Upcoming Todos</Typography>
                                    <Button 
                                        sx={{
                                        float: 'right', 
                                        backgroundColor: '#e040fb',
                                        color: '#FFF'
                                        }} 
                                        onClick={() => setOpenAddModal(true)}
                                    >
                                        <AddIcon />
                                    </Button>
                                </Container>
                                <Container>
                                        <Todos todosData={todos} />
                                </Container>
                            
                        </Paper>
    
                        </Container>
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
