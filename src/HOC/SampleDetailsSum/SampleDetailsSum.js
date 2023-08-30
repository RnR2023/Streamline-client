import React from "react";

import './SampleDetailsSum.css';
import {QRCodeSVG} from 'qrcode.react';
import SimpleMap from '../../LOC/Map/MapPOC.js'


function SampleDetails() {
  return (
    <div className="App">
      <input type="datetime-local"></input>


      <div>Sample Details:</div>
      <div className='details_name'>Sample Spot:
        <div className='details_inputs'> zoo</div>
      </div>
      <div className='details_name'>Sample ID:
        <div className='details_inputs'> 1234</div>
      </div>
      <div className='details_name'>Date:
        <div className='details_inputs'> dd/mm/yyyy</div>
      </div>
      <div className='details_name'>Weather:
        <div className='details_inputs'> 20</div>
      </div>
      <div className='details_name'>Location:
      </div>
      <div className='map_container'> <SimpleMap/></div>
      <div className='QR_container'>
      <QRCodeSVG value="https://reactjs.org/" />
      </div>

      <div className='btn_container'>
      <button className='save_button'>Print</button>
      </div>
    </div>
  );
}

export default SampleDetails;
