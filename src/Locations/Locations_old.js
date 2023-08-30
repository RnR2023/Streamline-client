import React from 'react'
import  { Component }  from 'react';
import {Table, Button, Container} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import './Locations.css';


class Locations extends Component {
    
    constructor(props) {
      super(props);
      this.setAddInput = this.setAddInput.bind(this);
      this.handleAdd = this.handleAdd.bind(this);
      this.handleDelete = this.handleDelete.bind(this);

      this.state = {
        locations:[],
        name: ''
      };
    }

   async  componentDidMount() {
    this.fetchData()
    }
    
    componentWillUnmount() {
    }
    fetchData() {
        axios.get(`${process.env.REACT_APP_BACKEND_ROUTE}/locations`).then((res) => {
            this.setState({locations: res.data.res})
        })
    }
    setAddInput(value) {
        this.setState({name: value})
    }
     handleAdd() {
        if(this.state.name) {

        
        axios.post(`${process.env.REACT_APP_BACKEND_ROUTE}/locations`,({name: this.state.name})).then(() => {
            this.fetchData()
            this.setState({name: ''})

        })
    } else {
        alert('Please fill Input')
    }
      }

    handleDelete(id) {
        axios.delete(`${process.env.REACT_APP_BACKEND_ROUTE}/locations/${id}`).then((res) => {
        this.fetchData()
        })
     }  
  
    
     renderTr = (location, i) => {
        return(<tr><td>{i + 1}</td><td>{location.name}</td>
        <td>-</td>
        {/* <td><Button onClick={() => this.handleDelete(location.id)}> Delete </Button></td> */}
        </tr>)
    }

    render() {

        return (
            <div style={{textAlign: 'center'}}>
            <div class="locations_title">Locations</div>

            <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
            {this.state.locations.map(this.renderTr)}
            <tr><td></td><td><Form.Control value={this.state.name}  onChange={e => this.setAddInput(e.target.value)}/></td><td><Button onClick={() => this.handleAdd()}>Add</Button></td></tr>
      </tbody>
    </Table>

       </div>
          );
        }
  }

  export default Locations;
