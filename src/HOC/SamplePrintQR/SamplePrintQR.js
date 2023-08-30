
import React from "react";
import './SamplePrintQR.css';
import {QRCodeSVG} from 'qrcode.react';


function SampleDetails() {
  return (
    <div className="App">
      <div className='QR_container'>
        <QRCodeSVG value="https://reactjs.org/" />
      </div>
      <div className='inputs_container'>
      <div>
      <div>Select Size:</div>
      <div className='flex'><input type="radio" value="Large" name="size" /><div>Large</div> </div>
      <div className='flex'><input type="radio" value="Female" name="size" /> <div>Small</div></div>
      </div>
      <div>
      <div>Quantity:</div>
      <div><input type="number" id="points" name="points" min="0" max="20" />
      </div>
      </div>
      </div>
      <div className='btn_container'>
      <button className='save_button'>Print</button>
      </div>
    </div>
  );
}

export default SampleDetails;
