import React, { useState, useEffect  } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { 
    doc, 
    updateDoc, 
    deleteDoc
} from "firebase/firestore"; 
import { db } from '../firebase.config';

interface ITodo {
    [id: string]: any; 
    todoName: string;
    todoDate: number;
    completed: boolean;
    uid: string;
}

const Todos = ({todosData} : {todosData: Array<ITodo>})  => {
    const [isChecked, setChecked] = useState(false);
    const [todoId, setTodoId] = useState("");

    const setTodos = () => {
        console.log(todosData);
    }

    const handleChange = async () => {
        const taskDocRef = doc(db, 'todos', todoId)
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

    useEffect(() => {
       setTodos();
      }, []);

    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Task</TableCell>
                        <TableCell>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/*<Checkbox 
                    id={`checkbox-${todo.id}`} 
                    name="todoItems"
                    value={todo.id}
                    checked={isTodoChecked} 
                    onClick={() => setTodoId(todo.id)}
                    onChange={ handleChange } /> Need to go below todosData.map!!*/}   
                    { todosData.map((todo) => (
                    <TableRow id={todo.id} key={todo.id}>
                        <TableCell>{todo.data.todoName}</TableCell>
                        <TableCell>{todo.data.todoDate}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>                 
        </>
    )
}

export default Todos;