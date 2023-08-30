import React from "react";
import { Component } from "react";
import { Chart } from "react-google-charts";
import { Form, Button } from "react-bootstrap";
import "./Overview.css";
import axios from "axios";
import GraphT1 from "../Graph/GraphT1";
import GraphT2 from "../Graph/GraphT2";
import GraphT3 from "../Graph/GraphT3";
import GraphT4 from "../Graph/GraphT4";
import { Typography, selectClasses } from "@mui/material";

class Overview extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSpotChange = this.handleSpotChange.bind(this);
    this.changeFromDate = this.changeFromDate.bind(this);
    this.changeToDate = this.changeToDate.bind(this);

    this.state = {
      locationId: 0,
      locations: [],
      tubeTypes: [],
      toDate: null,
      fromDate: null,
      graphData: [],
      tubeTypeId: 0,
      data: [],
      options: {
        title: "Value For Date",
        curveType: "function",
        legend: { position: "bottom" },
      },
      graphType: 1,
    };
  }

  async orginaizeData() {
    if (
      this.state.locationId == 0 ||
      this.state.tubeTypeId == 0 ||
      this.state.toDate == null ||
      this.state.fromDate == null
    ) {
      return;
    }
    let newArray = [];
    newArray.push(["Date", "Value"]);
    var startFrom = new Date();
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_ROUTE}/overview/tubes/${this.state.locationId}/${this.state.tubeTypeId}/${this.state.fromDate}/${this.state.toDate}`
      )
      .then((res) => {
        res.data.forEach((e) => {
          newArray.push([e.date, e.value]);
        });

        this.setState({ data: newArray });
      });
  }

  async componentDidMount() {
    await axios
      .get(`${process.env.REACT_APP_BACKEND_ROUTE}/tubes/types`)
      .then((res) => {
        this.setState({ tubeTypes: res.data.res });
      });

    await axios
      .get(`${process.env.REACT_APP_BACKEND_ROUTE}/graph_t1`)
      .then((res) => {
        this.setState({ graphData: res.data });
      });

    await axios
      .get(`${process.env.REACT_APP_BACKEND_ROUTE}/locations`)
      .then((res) => {
        this.setState({ locations: res.data.res });
      });
    await this.orginaizeData();
  }

  componentWillUnmount() {
    // Clean up listener
  }

  async HandleTubeType(event) {
    if (event && event.target && event.target.value) {
      new Promise((resolve) => {
        this.setState({ tubeTypeId: event.target.value });
        resolve();
      }).then(async () => {
        await this.orginaizeData();
      });
    }
  }
  async handleSpotChange(event) {
    if (event && event.target && event.target.value) {
      new Promise((resolve) => {
        this.setState({ locationId: event.target.value });
        resolve();
      }).then(async () => {
        await this.orginaizeData();
      });
    }
  }
  async changeFromDate(event) {
    if (event && event.target && event.target.value) {
      new Promise((resolve) => {
        this.setState({ fromDate: event.target.value });
        resolve();
      }).then(async () => {});
    }
  }

  async changeToDate(event) {
    if (event && event.target && event.target.value) {
      new Promise((resolve) => {
        this.setState({ toDate: event.target.value });
        resolve();
      }).then(async () => {});
    }
  }
  async handleChange(event) {
    if (event && event.target && event.target.value) {
      this.setState({ tubeFilter: event.target.value });
      await this.orginaizeData();
    }
    // Update component state whenever the data source changes
  }

  changeGraphType(val) {
    console.log(val);
    this.changeFromDate(null);
    this.setState({ graphType: val });
  }

  render() {
    let locationSelect = "";
    let typeSelect = "";
    let graphs = "";
    let locationDiv = "";
    let fromToDiv = "";
    let todayDiv = "";
    let typeDiv = "";
    if (this.state.locations && this.state.locations.length > 0) {
      locationSelect = (
        <Form.Select
          className="select"
          name="locationId"
          value={this.state.locationId}
          onChange={(event) => this.handleSpotChange(event)}
        >
          <option value="0"> None</option>
          {this.state.locations.map((location) => {
            return (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            );
          })}
        </Form.Select>
      );
    }

    if (this.state.tubeTypes && this.state.tubeTypes.length > 0) {
      typeSelect = (
        <Form.Select
          className="select"
          name="tubeTypeId"
          value={this.state.tubeTypeId}
          onChange={(event) => this.HandleTubeType(event)}
        >
          <option value="0"> None</option>
          {this.state.tubeTypes.map((tubeType) => {
            return (
              <option key={tubeType.id} value={tubeType.id}>
                {tubeType.name}
              </option>
            );
          })}
        </Form.Select>
      );
    }

    if (this.state.graphType == 1) {
      if (
        this.state.tubeTypes &&
        this.state.graphData &&
        this.state.graphData.length > 0
      ) {
        graphs = (
          <div
            style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
          >
            {this.state.tubeTypes.map((ty, i) =>
              i % 2 == 0 ? (
                <div className="graph_item">
                  <GraphT1
                    locationId={this.state.locationId}
                    fromDate={this.state.fromDate}
                    toDate={this.state.toDate}
                    graphData={this.state.graphData}
                    type={ty}
                  />
                </div>
              ) : (
                <>
                  <div className="graph_item">
                    <GraphT1
                      locationId={this.state.locationId}
                      fromDate={this.state.fromDate}
                      toDate={this.state.toDate}
                      graphData={this.state.graphData}
                      type={ty}
                    />
                  </div>
                  <div style={{ flexBasis: "100%", height: 0 }}> </div>
                </>
              )
            )}
          </div>
        );
      }
    } else if (this.state.graphType == 2) {
      if (this.state.graphData.length > 0 && this.state.locations.length > 0) {
        graphs = (
          <GraphT2
            locations={this.state.locations}
            graphData={this.state.graphData}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
            tubeType={this.state.tubeTypeId}
          />
        );
      }
    } else if (this.state.graphType == 3) {
      if (this.state.graphData.length > 0 && this.state.locations.length > 0) {
        graphs = (
          <GraphT3
            locations={this.state.locations}
            graphData={this.state.graphData}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
            tubeTypes={this.state.tubeTypes}
          />
        );
      }
    } else if (this.state.graphType == 4) {
      if (this.state.graphData.length > 0 && this.state.locations.length > 0) {
        graphs = (
          <GraphT4
            locations={this.state.locations}
            graphData={this.state.graphData}
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
            tubeType={this.state.tubeTypeId}
          />
        );
      }
    }

    if (this.state.graphType == 1) {
      locationDiv = (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>Locations</div>
          <div>{locationSelect}</div>
        </div>
      );
    }

    if (this.state.graphType == 3 || this.state.graphType == 4) {
      todayDiv = (
        <div className="date_containers">
          <div>
            <div>Date</div>
            <input type="date" onChange={(e) => this.changeFromDate(e)}></input>
          </div>
        </div>
      );
    }

    if (this.state.graphType == 3 || this.state.graphType == 1) {
      typeDiv = "";
    } else {
      typeDiv = (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>Test Type</div>
          <div>{typeSelect}</div>
        </div>
      );
    }
    if (this.state.graphType == 2 || this.state.graphType == 1) {
      fromToDiv = (
        <div className="date_containers">
          <div>
            <div>From</div>
            <input type="date" onChange={(e) => this.changeFromDate(e)}></input>
          </div>
          <div>
            <div>To</div>
            <input onChange={(e) => this.changeToDate(e)} type="date"></input>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div
          className="overview_menu"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            margin: "0 auto",
          }}
        >
          <div
            style={{ color: this.state.graphType == 1 ? "#004e63" : "white" }}
            onClick={(e) => this.changeGraphType(1)}
          >
            Test Results Of A Selected Location{" "}
          </div>
          <div
            style={{ color: this.state.graphType == 2 ? "#004e63" : "white" }}
            onClick={(e) => this.changeGraphType(2)}
          >
            Test Results Of All Locations
          </div>
          <div
            style={{ color: this.state.graphType == 3 ? "#004e63" : "white" }}
            onClick={(e) => this.changeGraphType(3)}
          >
            Test Results Of All Locations Of A Selected Date
          </div>
          <div
            style={{ color: this.state.graphType == 4 ? "#004e63" : "white" }}
            onClick={(e) => this.changeGraphType(4)}
          >
            Selected Test Results Of All Locations At Selected Date
          </div>
        </div>
        <div
          className="date_containers"
          style={{ display: "flex", flexDirection: "column" }}
        >
          {typeDiv}
          {locationDiv}
          {fromToDiv}
          {todayDiv}
        </div>
        <div>{graphs}</div>
      </div>
    );
  }
}

export default Overview;
