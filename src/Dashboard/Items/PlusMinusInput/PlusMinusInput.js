import React, { useState } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/all";
import "./PlusMinusInput.css";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Container,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

export default function PlusMinusInput(props) {
  return (
    <Box
      gap={2}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
      }}
      {...props}
    >
      <IconButton onClick={props.onMinus}>
        <RemoveIcon />
      </IconButton>
      <Typography>{props.value}</Typography>
      <IconButton onClick={props.onPlus}>
        <AddIcon />
      </IconButton>
    </Box>
  );
}
