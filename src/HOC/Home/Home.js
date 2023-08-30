import React, { useRef } from "react";
import "./Home.css";
import StreamLineLogo from "../../images/stream_line.png";
import StreamLineLogoBlue from "../../images/stream_line_blue.png";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Button, Row, Col, Container } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import { AiFillEye } from "react-icons/all";

function Home() {
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState({ data: "", error: "" });
  const [name, setName] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [register, setRegister] = useState(false);
  const [validated, setValidated] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const HandleClick = (event) => {
    event.preventDefault();
    if (register) {
      const form = event.target;
      if (!form.checkValidity()) {
        event.stopPropagation();
        email.error = "Please provide your email";
        setValidated(false);
      } else {
        setValidated(true);
        axios
          .post(`${process.env.REACT_APP_BACKEND_ROUTE}/register`, {
            email: email.data,
            password: password,
            name: name,
          })
          .then((res) => {
            setHasRegistered(true);
            setTimeout(() => {
              setHasRegistered(false);
              setRegister(false);
              setEmail({ data: "", error: "" });
              setPassword(null);
              setName(null);
            }, 1500);
          })
          .catch((e) => {
            email.error = "This email already exists";
            setValidated(false);
            localStorage.removeItem("user");
          });
      }
    } else {
      axios
        .post(`${process.env.REACT_APP_BACKEND_ROUTE}/login`, {
          email: email.data,
          password: password,
        })
        .then((res) => {
          localStorage.setItem("user", JSON.stringify(res.data));
          window.location.href = "/dashboard/home";
        })
        .catch((e) => {
          setErrorMessage("Incorrect username or password");
          localStorage.removeItem("user");
        });
    }
  };

  return (
    <div className="ct">
      <div className="input_containers">
        <img src={StreamLineLogo} className="stream_line_logo" />
      </div>
      <div className="col_inputs">
        <div className="text_header">
          {register ? "Register" : "Login"}
          <img src={StreamLineLogoBlue} className="stream_line_logo_blue" />
        </div>
        <Form noValidate validated={validated} onSubmit={(e) => HandleClick(e)}>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Email"
              aria-label="Email"
              className="input_home"
              value={email.data}
              onChange={(e) => setEmail({ data: e.target.value, error: "" })}
              isInvalid={!!email.data || !!email.error}
              aria-describedby="basic-addon1"
              required={true}
            />
            <Form.Control.Feedback type="invalid">
              {email.error}
            </Form.Control.Feedback>
          </InputGroup>

          <InputGroup
            style={{ display: register ? "" : "none" }}
            className="mb-3"
          >
            <Form.Control
              placeholder="Name"
              aria-label="Name"
              value={name}
              className="input_home"
              aria-describedby="basic-addon1"
              onChange={(e) => setName(e.target.value)}
              isInvalid={name == ""}
              type="text"
              required={true}
            />
            <Form.Control.Feedback type="invalid">
              Please provide your name.
            </Form.Control.Feedback>
          </InputGroup>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Password"
              aria-label="password"
              value={password ? password : ""}
              className="input_home"
              aria-describedby="basic-addon1"
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={password == ""}
              type={showPass ? "text" : "password"}
              required={true}
            ></Form.Control>
            <InputGroup.Text className="show-password">
              <AiFillEye onClick={() => setShowPass(!showPass)} />
            </InputGroup.Text>
            <Form.Control.Feedback type="invalid">
              Please provide password.
            </Form.Control.Feedback>
          </InputGroup>
          {register && hasRegistered && (
            <Alert severity="success">Registered Succeeded</Alert>
          )}
          {errorMessage && (
            <span className="error_message">{errorMessage}</span>
          )}
          <InputGroup className="mb-3">
            <div>
              {" "}
              Welcome To Streamline! Don't have a user?{" "}
              <span
                className="cursor"
                onClick={() => {
                  setRegister(true);
                  setEmail({ data: "", error: "" });
                  setPassword(null);
                }}
              >
                {" "}
                Register
              </span>{" "}
              Here
            </div>
          </InputGroup>
          <InputGroup className="mb-3">
            <Button
              type="submit"
              onSubmit={() => HandleClick()}
              className="btn_login"
            >
              {" "}
              {register ? "Register" : "Login"}
            </Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
}

export default Home;
