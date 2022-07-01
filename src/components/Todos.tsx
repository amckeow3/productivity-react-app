import React, { useState } from 'react';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useAuthState } from "react-firebase-hooks/auth";
import { 
    doc, 
    updateDoc, 
    deleteDoc,
    query,
    collection,
    getDocs,
    where
} from "firebase/firestore"; 
import { db, auth } from '../firebase.config';
import { TryOutlined } from '@mui/icons-material';

const Todos = ({ id, todoName, todoDate, completed }: { id: string, todoName: string, todoDate: string, completed: boolean })  => {
    const [user, loading, error] = useAuthState(auth);
    const [isChecked, setChecked] = useState(false);
    //const [todos, setTodos] = useState([]);
    const [taskName  , setTaskName] = useState("");
    const [taskDate , setTaskDate] = useState(""); 
    const [uid, setUid] = useState("");
    const [todoId, setTodoId] = useState("");

    const handleChange = async () => {
        const taskDocRef = doc(db, 'todos', id)
        try{
          await updateDoc(taskDocRef, {
            completed: isChecked
          })
        } catch (err) {
          alert(err)
        }
      }

      /* function to delete a document from firstore */ 
    const handleDelete = async () => {
        const taskDocRef = doc(db, 'todos', todoId)
        try{
            await deleteDoc(taskDocRef)
        } catch (err) {
            alert(err)
        }
    }

    const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
        console.log(isChecked);
    };
       

    return (
        <>
        <Container>
            <Checkbox 
                id={`checkbox-${id}`} 
                name="checkbox" 
                checked={isChecked}
                onChange={handleChange} />
            <label 
                htmlFor={`checkbox-${id}`} 
                onClick={() => setChecked(!isChecked)} >
            </label>
                                <TableCell>{todoName}</TableCell>
                                <TableCell>{todoDate.toString()}</TableCell>
                                <TableCell>{completed}</TableCell>
                            
        </Container>
    </>
    )
}

export default Todos;