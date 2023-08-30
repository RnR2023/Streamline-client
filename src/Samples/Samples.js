import React from "react";
import { Component } from "react";
import "./Samples.css";
import { Button, Modal, Form } from "react-bootstrap";
import CreateQR from "../Dashboard/Items/CreateQR.js";
import axios from "axios";
import moment from "moment";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
} from "@material-ui/core";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-dates/lib/css/_datepicker.css";
import TextField from "@mui/material/TextField";

class Samples extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.state = {
      samples: undefined,
      show: false,
      id: undefined,
      options: [
        {
          id: 1,
          text: "Today",
          id: 2,
          text: "This Month",
          id: 3,
          text: "This Year",
        },
      ],
      rows: [],
      unfilteredRows: [],
      orderBy: "",
      order: "asc",
      startDate: null,
      endDate: null,
      tubesToPrint: [],
      name: undefined,
    };

    this.columns = [
      { id: "name", label: "Name" },
      { id: "date", label: "Date" },
      { id: "location", label: "Location" },
      { id: "tubes", label: "Tubes" },
      { id: "tubeqr", label: "Print Tube QR" },
    ];
  }
  async componentDidMount() {
    this.fetchData();
  }

  handleClose() {
    this.setState({ show: false });
  }
  handleSelectChange(e) {
    this.fetchData(e.target.value);
  }

  openDialog(id) {
    this.setState({ id: id, show: true });
  }

  fetchData(dateFilter) {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_ROUTE}/samples?dateFilter=${dateFilter}`
      )
      .then((res) => {
        const rows = res.data.vm.map((sample, i) => ({
          id: i + 1,
          name: sample.name ? sample.name : sample.user,
          date: moment(sample.date).format("DD/MM/yy"),
          location: sample.location,
          tubes: (
            <Button
              onClick={() => {
                window.location.href =
                  "/dashboard/samples/" + sample.id + "/tubes";
              }}
            >
              Tubes
            </Button>
          ),
          tubeqr: (
            <Button onClick={() => this.openDialog(sample.id)}>QR</Button>
          ),
        }));
        this.setState({
          unfilteredRows: rows,
          rows: rows,
          samples: res.data.vm,
        });
      });
  }
  componentWillUnmount() {}

  componentDidUpdate() {
    if (this.state.startDate) {
    }
  }

  handleSort = (property) => {
    const { orderBy, order } = this.state;
    const isAscending = orderBy === property && order === "asc";
    this.setState({
      orderBy: property,
      order: isAscending ? "desc" : "asc",
    });
  };

  handleClearDates = () => {
    this.setState({
      startDate: null,
      endDate: null,
      rows: this.state.unfilteredRows,
    });
  };

  handleStartDateFilter(startDate) {
    let rows = this.state.rows;
    const date = new Date(startDate);

    rows = rows.filter((row) => {
      const rowDate = new Date(
        row.date
          .split("/")
          .reverse()
          .join("-")
      );
      return rowDate >= date;
    });
    this.setState({ rows: rows });
  }

  handleEndDateFilter(endDate) {
    let rows = this.state.unfilteredRows;
    const date = new Date(endDate);

    rows = rows.filter((row) => {
      const rowDate = new Date(
        row.date
          .split("/")
          .reverse()
          .join("-")
      );
      return rowDate < date;
    });
    this.setState({ rows: rows });
  }

  handleDateRangeFilter(s, e) {
    const startDate = s ? new Date(s) : this.state.startDate;
    const endDate = e ? new Date(e) : this.state.endDate;
    let rows = this.state.unfilteredRows;

    if (startDate) {
      rows = rows.filter((row) => {
        const rowDate = new Date(
          row.date
            .split("/")
            .reverse()
            .join("-")
        );
        return rowDate >= startDate;
      });
    }
    if (endDate) {
      rows = rows.filter((row) => {
        const rowDate = new Date(
          row.date
            .split("/")
            .reverse()
            .join("-")
        );
        return rowDate < endDate;
      });
    }
    this.setState({ startDate: startDate, endDate: endDate, rows: rows });
  }

  handleNameFilter(name) {
    const rows = this.state.rows.filter((row) => row.name.includes(name));
    this.setState({ rows: rows });
  }

  render() {
    const orderBy = this.state.orderBy;
    const order = this.state.order;

    const sortedRows = this.state.rows.sort((a, b) => {
      const orderBy = this.state.orderBy;
      const order = this.state.order;
      const isAscending = order === "asc";
      // Case of sorting be date
      if (orderBy == "date") {
        const format = "DD/MM/YYYY";
        const aMoment = moment(a[orderBy], format);
        const bMoment = moment(b[orderBy], format);

        if (aMoment < bMoment) return isAscending ? -1 : 1;
        if (aMoment > bMoment) return isAscending ? 1 : -1;
      } else {
        if (a[orderBy] < b[orderBy]) return isAscending ? -1 : 1;
        if (a[orderBy] > b[orderBy]) return isAscending ? 1 : -1;
      }
      return 0;
    });
    console.log(this.state.samples);
    return (
      <div>
        <div className="title">Sample List</div>
        <Form>
          <Form.Group style={{ with: "300px !important" }}>
            <Form.Label> Sample List</Form.Label>
            <Form.Select
              class="form-select form-select-lg"
              defaultValue={1}
              onChange={(e) => this.handleSelectChange(e)}
            >
              <option value="1">Today</option>
              <option value="2">This Week</option>
              <option value="3">This Month</option>
            </Form.Select>
          </Form.Group>
          <Form.Group style={{ marginLeft: "20px" }}>
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              onChange={(e) => this.handleDateRangeFilter(e.target.value, null)}
            />
          </Form.Group>
          <Form.Group style={{ marginLeft: "20px" }}>
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              onChange={(e) => this.handleDateRangeFilter(null, e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Button
              style={{ marginTop: "30px", marginLeft: "20px" }}
              type="reset"
              onClick={this.handleClearDates}
            >
              Clear Dates
            </Button>
          </Form.Group>
          <TextField
            label="Name"
            variant="standard"
            value={this.state.name}
            onChange={(e) => this.handleNameFilter(e.target.value)}
          />
        </Form>
        {/* <Table className='table_margin' striped bordered hover>
            <thead className='tr' ><tr><th>#</th><th>Name</th><th>Time</th><th>Location</th><th>Edit</th><th>Tubes</th><th>Tube QR</th></tr></thead>
            <tbody>
              {
                this.state.samples.map((sample, i) => {
                  return <tr className='tr' key={sample.id}>
                    <td>{i + 1}</td>
                    <td>{sample.user}</td>
                    <td>{moment(sample.date).format('DD/MM/yy HH:mm')}</td>
                    <td>{sample.location}</td>
                    <td><Button onClick={() => { window.location.href = "/dashboard/create-sample/" + sample.id }}>Edit</Button></td>
                    <td><Button onClick={() => { window.location.href = "/dashboard/samples/" + sample.id + "/tubes" }}>Tubes</Button></td>
                    <td><Button onClick={() => this.openDialog(sample.id)}>QR</Button>
                    </td>
                  </tr>
                })
              }
            </tbody>
          </Table> */}
        <Table>
          <TableHead>
            <TableRow>
              {this.columns.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={() => this.handleSort(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.map((row) => (
              <TableRow key={row.id} hover>
                {this.columns.map((headCell) => (
                  <TableCell key={headCell.id}>{row[headCell.id]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Modal
          show={this.state.show}
          onHide={() => this.handleClose()}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Create Tube QR</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CreateQR
              id={this.state.id}
              tube={true}
              tubesToPrint={this.state.tubesToPrint}
            />
          </Modal.Body>
          <Modal.Footer>
            {this.state.id}

            <Button variant="secondary" onClick={() => this.handleClose()}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Samples;
