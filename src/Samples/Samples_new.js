import React, { useEffect, useState } from "react";
import {
  FormControl,
  MenuItem,
  TextField,
  Box,
  Container,
  IconButton,
  Collapse,
  Typography,
  Modal,
  Select,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { styled } from "@mui/styles";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import dayjs from "dayjs";
import { AiFillPrinter } from "react-icons/ai";
import { TbReportAnalytics } from "react-icons/tb";
import { Link } from "react-router-dom";
import CreateQR from "../Dashboard/Items/CreateQR";

const TIME_RANGE_OPTIONS = {
  1: "Today",
  2: "This Week",
  3: "This Month",
};
export default function Samples(params) {
  const [samples, setSamples] = useState([]);
  const [rows, setRows] = useState([]);
  const [timeRange, setTimeRange] = useState(null);
  const [from, setFrom] = useState(null);
  const [untill, setUntill] = useState(null);
  const [name, setName] = useState(null);
  const [location, setLocation] = useState(null);
  const [visible, setVisible] = useState(false); // This is for showing the modal
  const [qr, setQr] = useState(null); // Here I will store the selected qr id to show in the modal

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_ROUTE}/samples`)
      .then((res) => res.json())
      .then((res) => res.vm)
      .then((res) => {
        setRows(res);
        setSamples(res);
      });
  }, []);

  useEffect(() => {
    const rows = samples.filter((s) => {
      let dates = true;
      const sampleDate = moment(s.date);
      if (timeRange) {
        switch (timeRange) {
          case TIME_RANGE_OPTIONS[1]:
            dates = sampleDate == moment(new Date(), "day");
            break;
          case TIME_RANGE_OPTIONS[2]:
            dates =
              sampleDate >= moment().startOf("week") &&
              sampleDate <= moment().endOf("week");
            break;
          case TIME_RANGE_OPTIONS[3]:
            dates =
              sampleDate >= moment().startOf("month") &&
              sampleDate <= moment().endOf("month");
            break;
          default:
            break;
        }
      } else {
        if (from) {
          dates &= sampleDate >= moment(from);
        }
        if (untill) {
          dates &= sampleDate < moment(untill);
        }
      }
      return (
        dates &&
        (name ? s.user.includes(name) : true) &&
        (location ? s.location == location : true)
      );
    });
    setRows(rows);
  }, [timeRange, from, untill, name, location]);

  const locations = [...new Set(samples.map((item) => item.location))];

  const handleQrClick = (id) => {
    setVisible(true);
    setQr(id);
  };

  return (
    <Container>
      <Typography variant={"h3"} paddingY={8} align={"center"}>
        Samples
      </Typography>
      <FormControl
        fullWidth
        sx={{ flexDirection: "row", justifyContent: "space-between" }}
      >
        <TextField
          label="Time Range"
          variant="outlined"
          style={{ width: "200px" }}
          select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <MenuItem>All</MenuItem>
          {Object.entries(TIME_RANGE_OPTIONS).map(([key, value]) => (
            <MenuItem key={key} value={value}>
              {value}
            </MenuItem>
          ))}
        </TextField>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="From"
            format="DD/MM/YYYY"
            value={from}
            onChange={(e) => setFrom(moment(e.toDate()))}
          />
          <DatePicker
            label="Untill"
            format="DD/MM/YYYY"
            value={untill}
            onChange={(e) => setUntill(moment(e.toDate()))}
          />
        </LocalizationProvider>
        <TextField
          variant="outlined"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          select
          label="Location"
          variant="outlined"
          style={{ width: "200px" }}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <MenuItem value={null}>All</MenuItem>
          {locations.map((location) => (
            <MenuItem value={location}>{location}</MenuItem>
          ))}
        </TextField>
      </FormControl>
      <TableContainer>
        <Table>
          <SamplesTableHead />
          <SamplesTableBody rows={rows} onQrClick={handleQrClick} />
        </Table>
      </TableContainer>
      <SampleQrModal
        open={visible}
        handleClose={() => setVisible(false)}
        qrId={qr}
      />
    </Container>
  );
}

function SamplesTableHead() {
  const columns = [
    { id: "name", label: "Name" },
    { id: "date", label: "Date" },
    { id: "location", label: "Location" },
    { id: "tubeqr", label: "Print Tube QR" },
    { id: "tubes", label: "Test Result" },
  ];
  return (
    <TableHead>
      <TableRow>
        {columns.map((col) => (
          <TableCell>{col.label}</TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function SamplesTableBody({ rows, onQrClick }) {
  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow hover>
          <TableCell>{row.name}</TableCell>
          <TableCell>{moment(row.date).format("DD/MM/YYYY")}</TableCell>
          <TableCell>{row.location}</TableCell>
          <TableCell>
            <IconButton onClick={() => onQrClick(row.id)}>
              <AiFillPrinter />
            </IconButton>
          </TableCell>
          <TableCell>
            <Link to={`${row.id}/tubes`}>
              <IconButton>
                <TbReportAnalytics />
              </IconButton>
            </Link>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

function SampleQrModal({ open, handleClose, qrId }) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <CreateQR style={{ overflowY: "auto" }} id={qrId} tube={true} />
      </Box>
    </Modal>
  );
}
