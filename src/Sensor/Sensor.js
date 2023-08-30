import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography, selectClasses } from '@mui/material';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import moment from 'moment';
import axios from 'axios';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function Sensor() {
    const [waterLevel, setWaterLevel] = useState(null);
    const [graphdata, setgraphData] = useState(null)
    const [graphdata2, setgraphData2] = useState(null)
    const [graphdata3, setgraphData3] = useState(null)
    const [graphdata4, setgraphData4] = useState(null)

    const [filterDate, setfilterDate] = useState(null)
    const db = getDatabase();

    useEffect(() => {
        const waterLevelHistoryRef = ref(db, 'WaterLevel/2-pushJSON');
        onValue(waterLevelHistoryRef, (snapshot) => {
            let objEntries = Object.entries(snapshot.val())
            let arr = []
            objEntries.forEach(element => {
                if(element[1]){
                    arr.push({
                      value:  Math.round(element[1].X / 5) * 5,
                       date: new Date(element[1].ts)
                    })
                }
            });
            if(filterDate != null) {
                arr = arr.filter(f=> moment(f.date).isSame(filterDate, 'day'))
                   setgraphData(arr)
                   let graph2DataArr = []
                   let graph3DataArr = []
                   let graph4DataArr = []

                   arr.forEach(item => {
                    graph2DataArr.push({
                        value:  item.value + 3,
                        date : item.date
                    })
                    graph3DataArr.push({
                        value:  item.value + 7,
                        date : item.date
                    })
                    graph4DataArr.push({
                        value: item.value > 10 ? item.value - 10 :  item.value + 5,
                        date : item.date
                    })
                   })
                   setgraphData2(graph2DataArr)
                   setgraphData3(graph3DataArr)
                   setgraphData4(graph4DataArr)

            }

        })
        const waterLevelRef = ref(db, 'WaterLevel/1-setFloat/X');
        return onValue(waterLevelRef, (snapshot) => {
            const data = snapshot.val();
            if (data >= 80) {
                fetch(`${process.env.REACT_APP_BACKEND_ROUTE}/waterLevelWarning`)
                .catch(err => console.error(err))
            }
            setWaterLevel(data);
        });
    }, [filterDate])
    
    var randomNumber = Math.floor(Math.random() * 6);
    return <div>
       <Typography variant='h3' mb={4} align='center' marginTop={10}>Sensor Monitoring</Typography>

        <div style={{ margin: '0 auto', textAlign: 'left', marginLeft:'40%', marginTop: '100px', fontSize:'18px'}}>
          Maccabiah Village -  Water Level: {waterLevel} %
          <br/>
          Vinter Stadium -  Water Level: {waterLevel + randomNumber} %
          <br/>
          Safari -  Water Level: {waterLevel + randomNumber +1} %
          <br/>
          Shikon Tzanhanim -  Water Level: {waterLevel > 10  ? waterLevel - 10 : waterLevel + 5} %
            </div>

        <Typography variant='h6' mb={4} align='center' marginTop={10}>Choose date:</Typography>
        <div  style={{ margin: '0 auto', textAlign: 'center', marginBottom: '100px'}}>
        <input type="date" value={filterDate} onChange={(e)=> setfilterDate(e.target.value)}/>
        </div>

        <Typography variant='h6' mb={4} align='center' marginTop={10}>Maccabiah Village Sensor</Typography>
        <LineChart
      width={800}
      height={400}
      data={graphdata}
      style={{ margin: '0 auto', textAlign: 'center'}}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 10
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis tick={false} hide  dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone"  dataKey="value" stroke="#82ca9d" />
    </LineChart>

    <Typography variant='h6' mb={4} align='center' marginTop={10}>Vinter Stadium Sensor</Typography>
    <LineChart
    
      width={800}
      height={400}
      data={graphdata2}
      style={{ margin: '0 auto', textAlign: 'center'}}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 10
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis tick={false} hide  dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone"  dataKey="value" stroke="#82ca9d" />
    </LineChart>
    <Typography variant='h6' mb={4} align='center' marginTop={10}>Safari Sensor</Typography>
    <LineChart
      width={800}
      height={400}
      data={graphdata3}
      style={{ margin: '0 auto', textAlign: 'center'}}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 10
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis tick={false} hide  dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone"  dataKey="value" stroke="#82ca9d" />
    </LineChart>
    <Typography variant='h6' mb={4} align='center' marginTop={10}>Shikon Tzanhanim Sensor</Typography>
    <LineChart
      width={800}
      height={400}
      data={graphdata4}
      style={{ margin: '0 auto', textAlign: 'center'}}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 10
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis tick={false} hide  dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone"  dataKey="value" stroke="#82ca9d" />
    </LineChart>
        </div>
}