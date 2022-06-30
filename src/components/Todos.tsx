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

const Todos = ({ id, todoName, todoDate, completed }: { id: string, todoName: string, todoDate: Date, completed: boolean })  => {
    const [user, loading, error] = useAuthState(auth);
    const [isChecked, setChecked] = useState(false);
    const [todos, setTodos] = useState([]);
    const [taskName  , setTaskName] = useState("");
    const [taskDate , setTaskDate] = useState(""); 
    const [uid, setUid] = useState("");

    const fetchUid = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setUid(data.uid);
        } catch (err) {
            console.log(err);
            alert("An error occured while fetching user data");
        }
    }

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
        const taskDocRef = doc(db, 'todos', id)
        try{
            await deleteDoc(taskDocRef)
        } catch (err) {
            alert(err)
        }
    }

    function todoData(
        uid: string,
        taskName: string,
        taskDate: string,
        isTaskCompleted: boolean,
      ) {
        return { uid, taskName, taskDate, isTaskCompleted };
      }
      
      const rows = [
        todoData(
            'MCxVR9B5RVzF6sfXMvYY',
            'Walk Lilo',
            'June 29, 2022',
            false
        ),
        todoData(
            'MCxVR9B5RVzF6sfXMvYY',
            'Clean bedroom and office',
            'June 30, 2022',
            false
        ), 
        todoData(
            'MCxVR9B5RVzF6sfXMvYY',
            'Present project',
            'June 30, 2022',
            false
        ),
        todoData(
            'MCxVR9B5RVzF6sfXMvYY',
            '30 minute meditation',
            'June 29, 2022',
            true
        ),
        todoData(
            'MCxVR9B5RVzF6sfXMvYY',
            '6am spin class',
            'June 29, 2022',
            true
        ),
      ];

    const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
        console.log(isChecked);
    };
       

    return (
        <>
        <Container>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Todos
            </Typography>
                <Table size="small" sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {[rows.length].map((todoData) => 
                {
                    return (
                    <>
                    <TableHead>
                            <TableRow>
                                <TableCell>Task</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Completed</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody> {rows.map((row) => (
                            <TableRow key={row.uid}>
                                <Checkbox
                                    checked={isChecked} onChange={handleToggle}
                                />
                                <TableCell>{row.taskName}</TableCell>
                                <TableCell>{row.taskDate}</TableCell>
                                <TableCell>{row.isTaskCompleted}</TableCell>
                            </TableRow>
                    ))}
                        </TableBody>
                    </>
            )})}
            </Table>
        </Container>
    </>
    )
}

export default Todos;