import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { MdModeEdit } from "react-icons/md";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";

export default function TubesTypes(params) {
  const [types, setTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);

  const [newType, setNewType] = useState({
    name: undefined,
    min: undefined,
    max: undefined,
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_ROUTE}/tubes/types`)
      .then((response) => response.json())
      .then((response) => response.res)
      .then((_types) => setTypes(_types))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleAdd = () => {
    fetch(`${process.env.REACT_APP_BACKEND_ROUTE}/tubes/types`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newType),
    })
      .then((res) => {
        setTypes((prev) => [...prev, newType]);
        setNewType({ name: undefined, min: undefined, max: undefined });
        closeModal();
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = () => {
    fetch(`${process.env.REACT_APP_BACKEND_ROUTE}/tubes/types/${newType.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newType),
    }).then(() => {
      const updatedTypes = types.map((obj) => {
        if (obj.id === newType.id) {
          return newType; // Replace the object with updatedObj
        }
        return obj; // Keep the original object
      });
      setTypes(updatedTypes);
      closeModal();
    });
  };
  const handleDelete = (id) => {
    fetch(`${process.env.REACT_APP_BACKEND_ROUTE}/tubes/types/${id}`, {
      method: "DELETE",
    });
  };

  const handleOpenAdding = () => {
    openModal();
    setIsEdit(false);
    setIsAdding(true);
  };

  const handleOpenEdit = (id) => {
    openModal();
    setIsEdit(true);
    setIsAdding(false);

    const type = types.filter((type) => type.id == id)[0];
    setNewType(type);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setNewType({ name: undefined, min: undefined, max: undefined });
  };
  return (
    <>
      <Typography variant="h3" align="center" paddingY={8}>
        Default Test type
      </Typography>
      <TableContainer>
        <Table
          sx={{ maxWidth: 650, margin: "0 auto", textAlign: "left" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Min</TableCell>
              <TableCell>Max</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {types.map((type) => (
              <TableRow
                key={type.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{type.name}</TableCell>
                <TableCell>{type.min}</TableCell>
                <TableCell>{type.max}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenEdit(type.id)}>
                    <MdModeEdit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="w" style={{ marginLeft: "100px" }}>
        <Fab
          onClick={handleOpenAdding}
          size="small"
          color="primary"
          aria-label="add"
        >
          <AddIcon />
        </Fab>
        <span>Add new tube type</span>
      </div>
      <Dialog open={isModalOpen} onClose={closeModal}>
        <DialogTitle>Add New tube type</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Write here the name of the tube type
          </DialogContentText>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <TextField
              autoFocus
              id="name"
              label="Name"
              type="text"
              variant="standard"
              value={newType.name}
              onChange={(e) =>
                setNewType((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />

            <TextField
              id="min"
              label="min"
              type="number"
              variant="standard"
              value={newType.min}
              onChange={(e) =>
                setNewType((prev) => ({
                  ...prev,
                  min: e.target.value,
                }))
              }
            />

            <TextField
              id="max"
              label="max"
              type="number"
              variant="standard"
              value={newType.max}
              onChange={(e) =>
                setNewType((prev) => ({
                  ...prev,
                  max: e.target.value,
                }))
              }
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          {isAdding ? (
            <Button onClick={handleAdd}>Add</Button>
          ) : (
            <Button onClick={handleEdit}>Update</Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
