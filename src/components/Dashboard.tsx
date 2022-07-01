import React, { useEffect, useState } from "react";
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
    let todoArr: any[] = [];
    
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

    const fetchTodos = async () => {
        try {
            const q = query(collection(db, 'todos'), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            todoArr = doc.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            }))
              setTodos(todoArr);
        } catch (err) {
            console.log(err);
        }
    }

    /*
    const handleChange = async({props}: {props: string}) => {
        const taskDocRef = doc(db, 'todos', id);
        setIsTodoChecked(!isTodoChecked);
        try{
          await updateDoc(taskDocRef, {
            completed: isTodoChecked
          })
        } catch (err) {
          alert(err)
        }
      }
      */

      const checkValue = async(e: { target: { value: any; }; }) => {
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
       fetchTodos();
      }
    
  //const todos: { id: string; todoName: string; todoDate: string; completed: boolean; }[] = []; 
  /* function to get all tasks from firestore in realtime */ 
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchName();
    fetchTodos();
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
                        <Container>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell>Task</TableCell>
                                        <TableCell>Date</TableCell>
                                    </TableRow>
                                </TableHead>
                              <TableBody>   
                                { todos.map((todo) => (
                                <TableRow id={todo.id} key={todo.id}>
                                    <Checkbox 
                                        id={`checkbox-${todo.id}`} 
                                        name="checkbox" 
                                        onChange={() => setTodoId(todo.id)}
                                        value={todo.id}
                                        checked={todo.data.completed} />
                                    <TableCell>{todo.data.todoName}</TableCell>
                                    <TableCell>{todo.data.todoDate}</TableCell>
                                </TableRow>
                        ))}
                            </TableBody>
                        </Table>
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
