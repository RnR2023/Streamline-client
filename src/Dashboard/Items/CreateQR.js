import React, { useEffect, useRef, useState } from "react";
import "./CreateQR.css";
import { QRCodeSVG } from "qrcode.react";
import { v4 as uuidv4 } from "uuid";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { Form } from "react-bootstrap";
import { Button, Typography, selectClasses } from "@mui/material";
import MultiSelect from "../../MultiSelect/MultiSelect";
import PlusMinusInput from "./PlusMinusInput/PlusMinusInput";

function CreateQR(props) {
  const [value, setValue] = useState(1);
  const [uniqeQr, setUniqeQr] = useState(1);
  const [selectOption, setSelectOption] = useState(0);
  const [selected, setSelected] = useState([]);
  const [tubeTypes, setTubeTypes] = useState([]);
  const qrRef = useRef();
  let x = props.id ? props.id : uuidv4();
  function handleSelect(isChecked, name) {
    if (!isChecked) {
      const updatedSelect = selected.filter((element) => name != element);
      setSelected(updatedSelect);
    } else {
      setSelected([...selected, name]);
    }
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_ROUTE}/tubes/types`)
      .then((response) => response.json())
      .then((response) => {
        setTubeTypes(response.res);
      });
  }, []);

  const PrintElem = () => {
    let mywindow = window.open("", "PRINT", "height=400,width=600");
    let elem = document.getElementById("QR");
    mywindow.document.write("<html>");
    mywindow.document.write("<body >");
    if (props.tube) {
      selected.forEach((t) => {
        mywindow.document.write(t);
        mywindow.document.write("<br/>" + elem.innerHTML + "<br/>");
        mywindow.document.write("<br/>");
        mywindow.document.write(x);
        mywindow.document.write("<br/>" + "<br/>");
      });
    } else
      for (let index = 0; index < uniqeQr; index++) {
        mywindow.document.write('<div style="page-break-after: always;">');
        for (let i = 0; i < value; i++) {
          mywindow.document.write("<div>");
          mywindow.document.write(`<h3>Location ${index + 1}:</h3>`);
          mywindow.document.write(qrRef.current.innerHTML);
          mywindow.document.write("<br/>");
          mywindow.document.write("<span>Spot Name:</span>");
          mywindow.document.write("<br/>");
          mywindow.document.write("<span>Date:</span>");
          mywindow.document.write("<br/>" + "<br/>");
          mywindow.document.write("</div>");
        }
        mywindow.document.write("</div>");
        x = uuidv4();
      }

    mywindow.document.write("</body></html>");
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    mywindow.print();
  };
  let string =
    props.tube === true
      ? `${process.env.REACT_APP_FRONT_ROUTE}/dashboard/samples/${x}/tubes`
      : `${process.env.REACT_APP_FRONT_ROUTE}/dashboard/create-sample/${x}`;
  return (
    <>
      <Typography variant="h3" mb={4} align="center" marginTop={10}>
        Create QR
      </Typography>
      <div className="qr_creation_container">
        <Card className="card_cont border-0" style={{ width: "18rem" }}>
          <div ref={qrRef} className="qr_container" id="QR">
            <QRCodeSVG value={string} />
          </div>
          {!props.tube ? (
            <ListGroup className="list-group-flush">
              <ListGroup.Item>
                Choose a number of sampling points:{" "}
                <PlusMinusInput
                  onMinus={() => setUniqeQr((prev) => prev - 1)}
                  onPlus={() => setUniqeQr((prev) => prev + 1)}
                  value={uniqeQr}
                />
              </ListGroup.Item>
            </ListGroup>
          ) : null}
          {!props.tube ? (
            <ListGroup className="list-group-flush">
              <ListGroup.Item>
                Select a QR amount for each point:{" "}
                <PlusMinusInput
                  onMinus={() => setValue((prev) => prev - 1)}
                  onPlus={() => setValue((prev) => prev + 1)}
                  value={value}
                />
              </ListGroup.Item>
            </ListGroup>
          ) : null}
          {props.tube ? (
            <Form style={{ overflowY: "auto", maxHeight: "200px" }}>
              {tubeTypes.map((tube) => {
                return (
                  <Form.Check
                    type="checkbox"
                    key={tube.id}
                    label={tube.name}
                    onChange={(e) => handleSelect(e.target.checked, tube.name)}
                  />
                );
              })}
            </Form>
          ) : null}

          <Card.Body>
            <Button variant="contained" onClick={() => PrintElem()}>
              Print
            </Button>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default CreateQR;
