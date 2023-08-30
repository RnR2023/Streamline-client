import React from 'react'
import { firestore } from "../firebase.js"
import './Tubes.css';
import { addDoc, getDocs, collection, doc, setDoc } from "@firebase/firestore"
import { Component } from 'react';
import { TubeTypes } from '../Consts/TubesTypes.js'
import { Col, Row, Form, Button, Card, Container } from 'react-bootstrap';
import axios from 'axios'
import moment from 'moment'
import fileDownload from 'js-file-download'
import { BsFillTrashFill } from 'react-icons/bs';
import { MdOutlineAddBox } from 'react-icons/md';
import { BiExport } from 'react-icons/bi';
import { IoTrashBin } from 'react-icons/io5';
import { AiFillPlusSquare } from 'react-icons/ai';
import { Typography } from '@mui/material';




class Tubes extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSaving = this.handleSaving.bind(this);
    this.duplicateTube = this.duplicateTube.bind(this);
    this.deleteTube = this.deleteTube.bind(this);
    this.rearrangeTubes = this.rearrangeTubes.bind(this)
    this.excelHandler = this.excelHandler.bind(this);
    this.state = {
      tubes: [],
      dbId: null,
      locations: [],
      locationName: '',
      name: '',
      time: '',
      note: '',
      sortedTubes: {},
      sampleId: null
    };
  }

  async componentDidMount() {
    const url = window.location.href;
    let splitUrl = url.split('/')
    let lastIndex = splitUrl.length - 2;
    if (splitUrl) {
      let id = splitUrl[lastIndex]

      axios.get(`${process.env.REACT_APP_BACKEND_ROUTE}/locations`).then((res) => {
        this.setState({ locations: res.data.res })
      })

      axios.get(`${process.env.REACT_APP_BACKEND_ROUTE}/samples/${id}/tubes`).then((res) => {

        this.setState({ sampleId: id })
        axios.get(`${process.env.REACT_APP_BACKEND_ROUTE}/samples/existance/${id}`).then((res) => {
          if (res.data && res.data.sample) {

            let sample = res.data.sample
            let timeToString = moment(sample.time).format('DD/MM/yy HH:mm ')
            let location = this.state.locations.find(l => l.id == sample.location)
            let locationName = location ? location.name : ''
            this.setState({ locationName: locationName, name: res.data.userName, time: timeToString, note: sample.note })
          }
        })

        this.setState({ dbId: id, tubes: res.data.vm })
        this.rearrangeTubes(res.data.vm)
      })

    }
  }

  componentWillUnmount() {
  }
  excelHandler() {
    axios.get(`${process.env.REACT_APP_BACKEND_ROUTE}/tubes/excel/${this.state.sampleId}`, { responseType: 'blob' })
      .then((res) => {
        var blob = new Blob([res.data], {
          type: res.headers["content-type"],
          name: 'test.xlsx'
        });
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'tubes.xlsx');
        document.body.appendChild(link);
        link.download = `${this.state.time}.xlsx`
        link.click();
        document.body.removeChild(link);

      });
  }
  rearrangeTubes(tubes) {
    let newTubesObject = {}
    tubes.forEach(element => {
      if (newTubesObject[element.typeName]) {
        newTubesObject[element.typeName].tubes.push(element)
      } else {
        newTubesObject[element.typeName] = {
          tubes: []
        }
        newTubesObject[element.typeName].tubes.push(element)
      }
    });
    this.setState({ sortedTubes: newTubesObject })
    console.log(newTubesObject)
  }
  duplicateTube(tube) {
    let newTubes = this.state.tubes
    newTubes.push({ ...tube, value: 0, id: Math.random(0, 9999) })
    this.setState({ tubes: newTubes })
    this.rearrangeTubes(newTubes)
  }
  deleteTube(tube) {
    let newTubesList = this.state.tubes.filter(t => tube.id !== t.id)
    this.setState({ tubes: newTubesList })
    this.rearrangeTubes(newTubesList)
  }
  async handleSaving() {

    let id = this.state.dbId
    if (id) {
      axios.post(`${process.env.REACT_APP_BACKEND_ROUTE}/samples/${id}/tubes`, { tubes: this.state.tubes }).then((res) => {
        axios.get(`${process.env.REACT_APP_BACKEND_ROUTE}/samples/${id}/tubes`).then((res) => {
          this.setState({ tubes: res.data.vm })
        })
      })

      alert('Thank You! ')
      window.location.href = '/dashboard/samples'
    }


  }

  handleInputChange(event) {
    let tubeIndex = this.state.tubes.findIndex(e => e.id == event.target.name)
    if (this.state.tubes[tubeIndex]) {
      let tubes = [...this.state.tubes]
      // spesificly handaling Total Hardness to show A value instead if the number gets from the formula.
      if (event.target.name == "64886cb7090902b5f485822d") {
        this.state.tubes[tubeIndex].value *= 50;
      } else {
        tubes[tubeIndex].value = event.target.value
      }
      this.setState({ tubes: tubes })
    }
  }

  renderTube = (tube) => {
    if (tube.id == "64886cb7090902b5f485822d") {
      tube.value /= 50;
    }
    return (
      <>
        <Col xs lg="1">
          <Form.Control
            step="0.01"
            min={tube.hasMinMaxValues ? tube.min : 0}
            max={tube.hasMinMaxValues ? tube.max : 100}
            className="input_width number-input"
            size="LG"
            type="number"
            name={tube.id}
            value={tube.value}
            onChange={this.handleInputChange} />
        </Col>
        <Col style={{ display: 'flex', padding: '0px', flex: '0', alignItems: 'center', justifyContent: 'flex-start' }}>
          <span>mg\l</span>
        </Col>
        <Col xs lg="1" style={{ padding: '0px', flex: '0' }}>
          <AiFillPlusSquare onClick={() => this.duplicateTube(tube)} style={{ cursor: 'pointer', color: '006e8c', fontSize: '24px' }} />
        </Col>
        <Col xs lg="1" style={{ padding: '0px', flex: '0' }}>
          <IoTrashBin onClick={() => this.deleteTube(tube)} style={{ cursor: 'pointer', color: '006e8c', fontSize: '24px' }} />
        </Col>
      </>
    )
  }

  renderInput = (tubes, i) => {
    if (!tubes[0])
      return
    else
      return (
        <>
          <Container>
            <Row style={{ marginBottom: 0 }}>
              <Col style={{ textAlign: 'start', color: "#006e8c", fontSize: '1.5rem' }}>{tubes[0].typeName}</Col>
            </Row>
            <Row key={tubes[0].typeId} style={{ columnGap: '8px' }}>{tubes.map(t => this.renderTube(t))}</Row>
          </Container>
        </>
      )
  }

  render() {
    return (
      <div>

        <Typography variant='h3' mb={4} align='center' marginTop={10} marginBottom={-10}>Sample Results</Typography>
        <Container>
          <Row>
            <Col>
              <div className='sample_details'>
                <h2>Sample Details</h2>
                <div className='sample_ct_details'>
                  <div>
                    <b>Time: </b>{this.state.time}
                  </div>
                  <div>
                    <b>Taken By: </b> {this.state.name}
                  </div>
                  <div>
                    <b>Location: </b>{this.state.locationName}
                  </div>
                </div>
                <div style={{ width: '700px', textAlign: 'left', marginLeft: '45px' }}>
                  <b>Note: </b>{this.state.note}
                </div>
              </div>
            </Col>
            <Col onClick={() => this.excelHandler()} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', cursor: 'pointer' }}>
                <BiExport size={20} /> <b>Export To Excel</b>
              </div>
            </Col>
          </Row>
        </Container>
        <div className='container'>
          {

            Object.keys(this.state.sortedTubes).map(prop => {
              console.log(this.state.sortedTubes[prop])
              return this.renderInput(this.state.sortedTubes[prop].tubes)
            })
          }

        </div>
        <div className='footer'>
          <div class="form-group">
            <label for="exampleFormControlTextarea1">Notes: </label>
            <textarea class="form-control" id="exampleFormControlTextarea1" rows="4"></textarea>
          </div>
          <Button onClick={() => this.handleSaving()} style={{ position: 'fixed', right: '0', bottom: '0', margin: '40px', paddingLeft: '40px', paddingRight: '40px' }}>Save</Button>
        </div>
      </div>
    );
  }
}

export default Tubes;
