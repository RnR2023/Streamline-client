import React from "react";
import "./Dashboard.css";
import { Component } from "react";
import { Link, Outlet } from "react-router-dom";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import StreamLineLogo from "../images/stream_line.png";
import { AiFillHome, AiFillFileAdd } from "react-icons/ai";
import {
  BiBarcodeReader,
  BiLogOut,
  BiQrScan,
  BiTestTube,
} from "react-icons/bi";
import { FaHome, FaFlask, FaMapMarkerAlt } from "react-icons/fa";
import {
  BsFileBarGraphFill,
  GiConsoleController,
  GiCorkedTube,
  GiDrippingTube,
  GiTestTubes,
  MdOutlineSettingsApplications,
  MdSensors,
} from "react-icons/all";
import axios from "axios";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { Button, Typography, selectClasses } from "@mui/material";

import moment from "moment";

class Dashbaord extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.Logout = this.Logout.bind(this);
    this.showPosition = this.showPosition.bind(this);
    const selectedItemId = localStorage.getItem("selectedItemId") || 0;
    this.state = {
      user: null,
      date: "",
      temperature: "",
      icon: "",
      temperatureText: "",
      selectedItemId: parseInt(selectedItemId),
      items: {
        General: [
          {
            id: 0,
            name: "Home",
            route: "/dashboard/home",
            icon: <FaHome />,
          },
        ],
        "Pre Sampeling": [
          {
            id: 2,
            name: "Create Sample QR",
            route: "/dashboard/qr-creation",
            icon: <BiQrScan />,
          },
          {
            id: 5,
            name: "Default Locations",
            route: "/dashboard/locations",
            icon: <FaMapMarkerAlt />,
          },
          {
            id: 6,
            name: "Default Tests",
            route: "/dashboard/tube/types",
            icon: <GiCorkedTube />,
          },
        ],
        "Post Sampeling": [
          {
            id: 3,
            name: "Samples",
            route: "/dashboard/samples",
            icon: <GiTestTubes />,
          },
          {
            id: 1,
            name: "Dashboard",
            route: "/dashboard/overview",
            icon: <BsFileBarGraphFill />,
          },
          {
            id: 7,
            name: "Sensor",
            route: "/dashboard/sensor",
            icon: <MdSensors />,
          },
        ],
      },
    };
  }
  componentDidUpdate() {
    // update selectedId
    Object.entries(this.state.items).map(([section, items]) => {
      items.map((item) => {
        if (window.location.href.includes(item.route)) {
          localStorage.setItem("selectedItemId", item.id.toString());
          return;
        }
      });
    });
  }

  componentDidMount() {
    this.getLocation();
    // Subscribe to changes
    let d = new Date();
    let formattedDate = moment(d).format("DD/MM/YYYY");
    this.setState({ date: formattedDate });
    let user = localStorage.getItem("user");
    localStorage.setItem(
      "selectedItemId",
      this.state.selectedItemId.toString()
    );
    if (user) {
      this.setState({ user: JSON.parse(user) });
    } else {
      window.location.href = "/";
    }
  }
  Logout() {
    localStorage.removeItem("user");
    window.location.href = "/";
  }
  componentWillUnmount() {
    // Clean up listener
  }
  getLocation() {
    if (navigator.geolocation) {
      let x = navigator.geolocation.getCurrentPosition(this.showPosition);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  showPosition(position) {
    let key = "8074823d4a0695d0cfaaa796dd6985dd";
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${key}&units=metric`
      )
      .then((res) => {
        let text = `Temperature is ${res.data.main.temp} but feels like ${res.data.main.feels_like}.
      the humidity is ${res.data.main.humidity}.`;

        this.setState({
          temperature: res.data.main.temp,
          temperatureText: text,
        });
      });
  }

  handleChange(itemId) {
    // Update the current selected nav item
    this.setState({ selectedItemId: itemId }, () => {
      // Save the selectedItemId to localStorage after state update
      localStorage.setItem("selectedItemId", itemId.toString());
    });
  }

  render() {
    const popover = (
      <Popover id="popover-basic">
        <Popover.Header as="h3">Temperature</Popover.Header>
        <Popover.Body>{this.state.temperatureText}</Popover.Body>
      </Popover>
    );
    return (
      <Row className="row_limit">
        <Col
          className="col_ct"
          sm={2}
          style={{ display: "flex", textAlign: "center" }}
        >
          <div className="navbar_ct">
            <Link to={"./home"} onClick={() => this.handleChange(0)}>
              <img src={StreamLineLogo} className="dashboard_logo" />
            </Link>
            <div className="navbar">
              <span>
                Welcome, {this.state && this.state.user && this.state.user.name}
              </span>
              {this.state.user && (
                <div className="welcome">
                  <div>{this.state.temperature}&#8451;</div>
                </div>
              )}
            </div>
            {Object.entries(this.state.items).map(([section, items]) => (
              <>
                <div
                  style={{
                    color: "white",
                    textAlign: "start",
                    fontWeight: "bold",
                  }}
                >
                  {section}
                </div>
                <Row>
                  <Col>
                    {items.map((navitem) => (
                      <Link className="nostyle" to={navitem.route}>
                        <div className="tab_ct">
                          <div
                            className={
                              this.state.selectedItemId == navitem.id
                                ? "tab_route selected"
                                : "tab_route"
                            }
                            onClick={() => this.handleChange(navitem.id)}
                          >
                            <div className="icon_ct">{navitem.icon}</div>
                            <div className="content_ct">{navitem.name}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </Col>
                </Row>
              </>
            ))}
            <hr style={{ color: "white" }} />
            <div className="tab_route">
              <div className="icon_ct">
                <MdOutlineSettingsApplications />
              </div>
              <div className="content_ct" style={{ color: "white" }}>
                Settings
              </div>
            </div>
            <div className="tab_route">
              <div className="icon_ct">
                <BiLogOut />
              </div>
              <div style={{ color: "white" }}>
                <div
                  className="content_ct"
                  onClick={() => this.Logout()}
                  style={{ color: "white" }}
                >
                  Log out
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col sm={10}>
          <Outlet />
        </Col>
      </Row>
    );
  }
}

export default Dashbaord;
