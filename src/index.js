import React from 'react'
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './HOC/Home/Home'
import SampleDetails from './HOC/SampleDetails/SampleDetails';
import SampleQR from './HOC/SampleQR/SampleQR';
import SampleDetailsSum from './HOC/SampleDetailsSum/SampleDetailsSum';
import SamplePrintQR from './HOC/SamplePrintQR/SamplePrintQR';
import Samples from './Samples/Samples.js'
import Samples_new from './Samples/Samples_new.js'
import Dashboard from './Dashboard/Dashboard.js'
import CreateQR from './Dashboard/Items/CreateQR.js'
import CreateSample from './CreateSample/CreateSample'
import Tubes from './Tubes/Tubes'
import TubesTypes from './Tubes/TubesTypes'
import Overview from './Overview/Overview'
import Locations from './Locations/Locations'

import HomePage from './HomePage/HomePage';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Scan from './Scan/Scan'
import Example from './Graph/Graph';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GraphT1 from './Graph/GraphT1';
import Sensor from './Sensor/Sensor';
import Precipitation from './Graph/Precipitation';
import GraphT3 from './Graph/GraphT3';
import RiverMap from './HOC/RiverMap/RiverMap';

const myData = [
    { country: 'France', population: 67000000 },
    { country: 'Spain', population: 47000000 },
    { country: 'Germany', population: 83000000 },
    { country: 'Italy', population: 60000000 },
];
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <Routes>
            <Route exact path='/' element={< Home />}></Route>
            <Route exact path='/scan' element={<Scan />}></Route>
            <Route exact path="/samples/:id/tubes" element={<Tubes />} />
            <Route path="create-sample/:id" element={<CreateSample />} />
            <Route path="/dashboard" element={<Dashboard />}>
                <Route path='home' element={<HomePage />} />
                <Route path="qr-creation" element={<CreateQR />}></Route>
                <Route path="overview" element={<Overview />}></Route>
                <Route exact path="s" element={<Samples />}></Route>
                <Route exact path="samples" element={<Samples_new />}></Route>
                <Route exact path="samples/:id/tubes" element={<Tubes />} />
                <Route path="create-sample/:id" element={<CreateSample />} />
                <Route exact path='tube/types' element={<TubesTypes />} />
                <Route exact path='locations' element={<Locations />} />
                <Route exact path='sensor' element={<Sensor />} />
                <Route exact path='riverMaps' element={<RiverMap />} />
            </Route>
            <Route exact path='/SampleDetails' element={< SampleDetails />}></Route>
            <Route exact path='/SampleQR' element={< SampleQR />}></Route>
            <Route exact path='/SampleDetailsSum' element={< SampleDetailsSum />}></Route>
            <Route exact path='/SamplePrintQR' element={< SamplePrintQR />}></Route>
        </Routes>
    </Router>
);

