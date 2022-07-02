import React, { useState, useEffect} from 'react';
import { styled, Paper, Container, Grid, Box, Typography, Stack, TextField, Button, Modal, Dialog, DialogTitle  } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { db, auth } from '../firebase.config';
import { zodResolver } from '@hookform/resolvers/zod';
import { boolean, object, string, TypeOf } from 'zod';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import { useAuthState } from "react-firebase-hooks/auth";
import { 
    collection,
    addDoc, 
    query,  
    getDocs, 
    where } from "firebase/firestore"; 

const closeButton = {
    cursor:'pointer', 
    float:'right', 
    width: '40px'
};

const main = '#e040fb';

const todoSchema = object({
    uid: string(),
    todoName: string().min(1, 'A name is required').max(70),
    todoDate: string().min(1, 'A date is required').max(70)
      .min(8, 'Password must be more than 8 characters'),
    completed: boolean()
});

type ITodo = TypeOf<typeof todoSchema>;

const AddTodo = ({ onClose, open }: { onClose: any; open: boolean }) => {
    const defaultValues: ITodo = {
        uid: '',
        todoName: '',
        todoDate: '',
        completed: false
    };

    const [user, loading, error] = useAuthState(auth);
    const [uid, setUid] = useState("");
    const [todoName, setNewTodoName] = useState("");
    const [todoDate, setNewTodoDate] = useState("");
    const [completed, setTodoCompleted] = useState(false);
    //const [open, setOpen] = useState(false);
    //const handleOpen = () => setOpen(true);
    //const handleClose = () => setOpen(false);

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

    useEffect(() => {
        if (loading) return;
        if (!user) {
            alert("Error creating new todo task")
        }
        fetchUid();
      }, [user, loading]);
    

    //  Object containing all the methods returned by useForm
    const methods = useForm<ITodo>({
        resolver: zodResolver(todoSchema),
        defaultValues,
    });
    
        const handleSubmit = async (e: { preventDefault: () => void; }) => {
            e.preventDefault()
            try {
                await addDoc(collection(db, 'todos'), {
                    uid: uid,
                    todoName: todoName,
                    todoDate: todoDate,
                    completed: completed
                });
            onClose();
            } catch (err) {
                alert(err)
            }
        }

      return (
        <>
        <Dialog 
            open={ open }
            onClose={ onClose }>
            
                <DialogTitle>
                    <Stack display="flex" direction="row" spacing={4}>
                        <Typography variant="h4">New Todo</Typography>
                        <CloseIcon sx={closeButton} onClick={ onClose } />
                    </Stack>
                </DialogTitle>
        
            
            <FormProvider {...methods}>
                <Grid
                    container
                    justifyContent='center'
                    alignItems='center'
                    sx={{ 
                        width: '100%', 
                        height: '100%',
                        borderBottom: { sm: '20px solid #ffffff' },
                        borderLeft: { sm: '20px solid #ffffff' },
                        borderRight: { sm: '20px solid #ffffff' }
                    }}
                >
                    <Stack spacing={2}>
                    <TextField
                        id="todoName"
                        name="todoName"
                        placeholder="Todo Name"
                        type="text"
                        required
                        value={ todoName }
                        onChange={(e) => setNewTodoName(e.target.value)}
                    />
                    <TextField
                        id="todoDate"
                        name="todoDate"
                        placeholder="Todo Date"
                        type="string"
                        required
                        value={ todoDate }
                        onChange={(e) => setNewTodoDate(e.target.value)}
                    />
                    <LoadingButton
                        loading={false}
                        type='submit'
                        variant='contained'
                        onClick={handleSubmit}
                        sx={{
                            py: '2',
                            mt: 2,
                            marginBottom: 10,
                            marginInline: 'auto',
                        }}
                    > Add </LoadingButton>
                </Stack>
                </Grid>
            </FormProvider>
    </Dialog>
    </>
    )
}

export default AddTodo;