import React, { useState, useEffect, useRef } from "react";
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import { MdModeEdit } from 'react-icons/md'
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Typography, selectClasses } from '@mui/material';


import './Locations.css'
import { IconButton } from "@mui/material";

export default function Locations(params) {
    const [locations, setLocations] = useState([]);
    const [isAdding, setIsAdding] = React.useState(false);
    const newLocationRef = useRef()

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_ROUTE}/locations`)
            .then(response => response.json())
            .then(response => response.res)
            .then(_locations => setLocations(_locations))
            .catch(err => {
                console.error(err);
            })
    }, [locations]);

    const handleAdd = (name) => {
        fetch(`${process.env.REACT_APP_BACKEND_ROUTE}/locations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name }),
        })
            .then(() => {
                setLocations([])
                handleCloseAdding()
            })
    }
    const handleDelete = (id) => {
        fetch(`${process.env.REACT_APP_BACKEND_ROUTE}/locations/${id}`, {
            method: 'DELETE',
        })
    }

    const handleCloseAdding = () => {
        setIsAdding(false)
    }
    const handleOpenAdding = () => {
        setIsAdding(true)
    }
    console.log(locations);
    
    return (
        
        <>
            <Typography variant='h3' mb={4} align='center' marginTop={10}>Add Default Locations</Typography>
    <div style={{margin: '0 auto !important'}}>
            <TableContainer>
                <Table sx={{ maxWidth: 650, margin: '0 auto',textAlign: 'left'  }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {locations.map((location) => (
                            <TableRow
                                key={location.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>{location.name}</TableCell>
                                <TableCell>
                                    <IconButton onClick={console.log(location.name)}>
                                        <MdModeEdit />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            </div>
            <div className="w" style={{marginLeft: '100px'}}>
                <Fab onClick={handleOpenAdding} size="small" color="primary" aria-label="add">
                    <AddIcon />
                </Fab>
                <span>Add new location</span>
            </div>
            <Dialog open={isAdding} onClose={handleCloseAdding}>
                <DialogTitle>Add New Location</DialogTitle>
                <DialogContent>
                    <DialogContentText>Write here the name of the location</DialogContentText>
                    <TextField
                        inputRef={newLocationRef}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAdding}>Cancel</Button>
                    <Button onClick={() => { handleAdd(newLocationRef.current.value) }}>Add</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
