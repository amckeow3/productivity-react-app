import React, { useState, useEffect  } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { 
    doc, 
    updateDoc, 
    deleteDoc
} from "firebase/firestore"; 
import { db } from '../firebase.config';
import { useTheme } from '@mui/material/styles';

interface ITodo {
    [id: string]: any; 
    todoName: string;
    todoDate: number;
    completed: boolean;
    uid: string;
}

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement>,
      newPage: number,
    ) => void;
  }

const TablePaginationActions = (paginationProps: TablePaginationActionsProps) => {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = paginationProps;

    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
      ) => {
        onPageChange(event, 0);
      };
    
      const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
      };
    
      const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
      };
    
      const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
      };
      
      return (
        <>
            <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
            </Box>
        </>
      )
}

const Todos = ({todosData} : {todosData: Array<ITodo>})  => {
    const [isChecked, setChecked] = useState(false);
    const [todoId, setTodoId] = useState("");
    const [isTodoChecked, setIsTodoChecked] = useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - todosData.length) : 0;

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

const handleChangeRowsPerPage = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};



    
    const setTodos = () => {
        console.log(todosData);
    }

    const handleChange = async () => {
        setIsTodoChecked(isTodoChecked!);
        const taskDocRef = doc(db, 'todos', todoId)
        console.log(`${todoId} is ${isTodoChecked}`);
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
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Task</TableCell>
                        <TableCell>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {(rowsPerPage > 0 ? todosData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) 
                    : todosData)
                    .map((todo) => (
                        <TableRow id={todo.id} key={todo.id}> 
                        {
                        /*<Checkbox 
                            id={`checkbox-${todo.id}`} 
                            name="todoItems"
                            value={todo.id}
                            checked={isTodoChecked} 
                            onClick={() => setTodoId(todo.id)}
                            onChange={ handleChange } 
                        /> Need to go below todosData.map!!*/
                        }   
                        <TableCell sx={{fontSize:"11px"}}>{todo.data.todoName}</TableCell>
                        <TableCell sx={{fontSize:"11px"}}>{todo.data.todoDate}</TableCell>
                    </TableRow>
                    ))}
                    {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={todosData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
        </Table>    
    </TableContainer>            
    </>
    )
}

export default Todos;