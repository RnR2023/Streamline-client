import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from "moment";
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export default function GraphT1(props) {
    const [data, setData] = useState([])
    const [locations, setLocations] = useState(new Set())
    useEffect(() => {


        let tubes = props.graphData
        let toDate = moment(props.toDate).format('YYYY-MM-DD')
        let fromDate = moment(props.fromDate).format('YYYY-MM-DD')
        if (props.toDate && props.fromDate && props.locationId && moment(props.fromDate).isBefore(moment(props.toDate))) {
            let tubesFilteredByDates = []

            tubes.forEach(obj => {
                let date = moment(obj.sampleId.time).format('YYYY-MM-DD')
                if (moment(date).isSameOrBefore(moment(toDate)) &&
                    moment(date).isSameOrAfter(moment(fromDate))) {
                    tubesFilteredByDates.push(obj)
                }
            })
            tubes = tubesFilteredByDates

        let sortedTubesByDate = tubes.sort((a, b) => new moment(a.sampleId.time).format('YYYYMMDD') - new moment(b.sampleId.time).format('YYYYMMDD'))
        let datesArr = []
        
        const newArray = sortedTubesByDate.map(obj => {
            if (obj.type == props.type.id && obj.sampleId.location == props.locationId) {
                if (obj && obj.sampleId && obj.sampleId.time) {
                    let date = moment(obj.sampleId.time).format('DD/MM/YYYY')
                    if (date) {
                        let datesArrObj = datesArr.find(d => d.date === date)
                        if (!datesArrObj) {
                            let arr = [obj.value]
                            datesArr.push({
                                date,
                                arr
                            })
                        } else {
                            datesArrObj.arr.push(obj.value)
                        }
                    }
                }
            }
        });

        let data = []
        datesArr.forEach((d) => {
            if (d.arr) {
                let sum = 0
                
                d.arr.forEach(v => {

                    sum = sum + v
                })
                let average = sum
                if(d.arr.length > 0) {
                 average = sum / (d.arr.length)
                }
                data.push({ name: d.date, [props.type.name]: average })
            }


        })
        setData(data)
    }
    }, [props.toDate,props.fromDate,props.locationId])



    return <div>
        <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis dataKey={props.type.name} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={props.type.name} stroke={getRandomColor()} />
        </LineChart>

    </div>
}