import React from 'react'
import './CreateSample.css';
import { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import { Link } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import { MdLocationOn, MdSensors } from 'react-icons/md'
import { FormControl, FormGroup, IconButton, MenuItem, TextField } from '@mui/material';


class CreateSample extends Component {
  constructor(props) {
    super(props);
    this.handleSaving = this.handleSaving.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      id: undefined,
      locations: [],
      temperature: 20,
      name: '',
      locationId: 0,
      time: new Date(),
      timeToString: new Date().toISOString().substring(0, 10),
      isUpdate: false,
      dbId: undefined,
      note: '',
      isSaved: false
    };
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  async handleSaving() {
    if (this.state.locationId == 0) {
      alert('you must fill all fields')
      return
    }
    if (this.state.isUpdate && this.state.dbId) {
      axios.put(`${process.env.REACT_APP_BACKEND_ROUTE}/samples/${this.state.dbId}`, ({ locationId: this.state.locationId, note: this.state.note })).then(() => {
        alert('Thank You! ')
        window.location.href = '/dashboard/samples'

      })
    } else {
      axios.post(`${process.env.REACT_APP_BACKEND_ROUTE}/samples`, ({ locationId: this.state.locationId, qr: this.state.id, note: this.state.note, user: this.state.user.email })).then(() => {
        this.setState({ isSaved: true })
      })
    }

  }

  async componentDidMount() {
    let date = this.state.time
    this.setState({ timeToString: moment(date).format('DD/MM/yy HH:mm ') })
    axios.get(`${process.env.REACT_APP_BACKEND_ROUTE}/locations`).then((res) => {
      this.setState({ locations: res.data.res })
    }).catch((err) => console.log('err=', err))

    let user = localStorage.getItem('user')
    if (user) {
      this.setState({ user: JSON.parse(user) })
    } else {
      window.location.href = '/'

    }
    const url = window.location.href;
    let splitUrl = url.split('/')
    let lastIndex = splitUrl.length - 1;
    if (splitUrl) {
      let id = splitUrl[lastIndex]
      axios.get(`${process.env.REACT_APP_BACKEND_ROUTE}/samples/existance/${id}`).then((res) => {
        if (res.data && res.data.sample) {
          let sample = res.data.sample
          let timeToString = moment(sample.time).format('DD/MM/yy HH:mm ')
          this.setState({ isUpdate: true, dbId: sample._id, qr: sample.qr, locationId: sample.location, note: sample.note, name: sample.user, timeToString: timeToString })
        }
      })
      this.setState({ id: id })
    }

    // React current user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          this.setState({ error: error.message });
        }
      );
    } else {
      this.setState({ error: 'Geolocation is not supported by this browser.' });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    // Goes to the next page if the sample has been saved 
    if (this.state.isSaved) {
      window.location.href = '/dashboard/samples'
    }
  }

  componentWillUnmount() {
    // Clean up listener
  }

  addLocation(e) {
    e.preventDefault()
    const location = e.target[0].value
    axios.post(`${process.env.REACT_APP_BACKEND_ROUTE}/locations`, { name: location })
      .then((res) => {
        const location = res.data.res
        console.log(this.state.locations);
        this.setState({ locations: [...this.state.locations, {id: location._id, name: location.name}] })
      })
      .catch((err) => {
        console.error(err);
      })
  }


  render() {
    let select = "";
    if (this.state && this.state.locations.length > 0) {
      select =
        <TextField select name="locationId" value={this.state.locationId} onChange={(e) => this.handleInputChange(e)}>
          <MenuItem value="0"> None</MenuItem>
          {this.state.locations.map(location => {
            return <MenuItem key={location.id} value={location.id}>{location.name}</MenuItem>
          })}
          <FormControl component={'form'} fullWidth onSubmit={(e) => this.addLocation(e)}>
            <TextField
              fullWidth
              label="Add New Location"
              variant='filled'
              InputProps={{ endAdornment: <IconButton type='submit'><AddIcon /></IconButton> }} />
          </FormControl>
        </TextField>
    }

    // Error while reading current location 
    if (this.state.error) {
      return <div>{this.state.error}</div>;
    }
    return (
      <div className='container_create_sample'>
        <div className="create_title">{this.state.isUpdate ? 'Update' : 'Create'}  New Sample</div>
        <div className='sampler_date_container'>{this.state.timeToString}</div>
        <div className='column'>
          <div className="form_container">
            <FormGroup sx={{ marginBottom: '20px' }}>
              <div>Sampler Name</div>
              <TextField variant="filled" disabled onChange={(e) => this.handleInputChange(e)} name="name" value={this.state.user ? this.state.user.name : ''} />
            </FormGroup>
            <FormGroup sx={{ marginBottom: '20px' }}>
              <div>Sampling point</div>
              {select}
            </FormGroup>
            <FormGroup sx={{ marginBottom: '20px' }}>
              <div>Location</div>
              {(this.state.latitude === null || this.state.longitude === null) ? (<div>Loading...</div>) : (
                <div>
                  <div>Latitude: {this.state.latitude}</div>
                  <div>Longitude: {this.state.longitude}</div>
                </div>
              )}
            </FormGroup>
            <div>Note</div>
            <div>
              <Form.Control as="textarea" name="note" value={this.state.note} onChange={(e) => this.handleInputChange(e)} />
            </div>
            <div className='create_btn_container'>
              <Button style={{ backgroundColor: '#004e63', outline: 'none' }} type="button" onClick={() => this.handleSaving()}>{this.state.isUpdate ? 'Update' : 'Create'}</Button>
            </div>
            <div className='phone_nav'>
              <Link to="/dashboard/locations"> <MdLocationOn color='white'></MdLocationOn> </Link>
              <Link to="/dashboard/sensor"> <MdSensors color='white' ></MdSensors></Link>
            </div>
            {this.state.isSaved ? <Alert severity='success'>Sample has been saved successfully</Alert> : null}
          </div>
        </div>
      </div>
    );
  }
}

export default CreateSample;
