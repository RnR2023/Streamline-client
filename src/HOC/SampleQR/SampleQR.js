import React from "react";
import './SampleQR.css';
import {QRCodeSVG} from 'qrcode.react';

function SampleDetails() {
  return (
    <div className="App">
        <div className='qr_container'>
        <div>Sample QR:</div>
        <div className='QR_container'>
            <QRCodeSVG value="https://reactjs.org/" />
            <div>Sample ID: </div>
        </div>

        <div className='btn_container'>
        <button className='save_button'>Print</button>
        </div>
        </div>
    </div>
  );
}

export default SampleDetails;
