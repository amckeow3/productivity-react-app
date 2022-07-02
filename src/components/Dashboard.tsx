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
import { boolean, object, string, TypeOf } from 'zod';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AppBar from "@mui/material/AppBar";
import Stack from '@mui/material/Stack';
import TrendsChart from './TrendsChart';
import Spending from './Spending';
import CircleIcon from '@mui/icons-material/Circle';
import TodayIcon from '@mui/icons-material/Today';

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
    const [todoId, setTodoId] = useState("");
    const [completedTaskList, setCompletedTaskList] = useState<any[]>([]);
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
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
              <Container>
                <Paper 
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column'
                    }}>
                        <Container
                            sx={{ 
                            display: 'flex',
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexDirection: "row"
                            }}>
                            <TodayIcon sx={{color: main}}/>
                            <Typography variant='h5' sx={{color: main}}>Today</Typography>
                        </Container>
                    <Table>
                            <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                    </TableRow>
                            </TableHead>
                            <TableBody>   
                                { todaysTodos.map((todo) => (
                                <TableRow id={todo.id} key={todo.id}>
                                    <TableCell>{todo.data.todoName}</TableCell>
                                </TableRow>
                        ))}
                            </TableBody>
                    </Table>
                </Paper>
                </Container>
              </Grid>
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
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
                </Grid>
              </Grid>
          </Container>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <TrendsChart />
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <Spending />
                </Paper>
              </Grid>
              </Grid>
          </Container>
        </Container>
    </>
    )
}

export default Dashboard;
