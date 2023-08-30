import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from "moment";
import { AiOutlineConsoleSql } from "react-icons/ai";
import {Typography } from '@mui/material';
import Precipitation from "./Precipitation";
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export default function GraphT2(props) {
    const [data, setData] = useState([])
    useEffect(() => {
        setData([])
        if(props.toDate && props.fromDate) {
        let tubes = props.graphData
        let toDate = moment(props.toDate).format('YYYY-MM-DD')
        let fromDate = moment(props.fromDate).format('YYYY-MM-DD')
        if (props.toDate && props.fromDate && moment(props.fromDate).isBefore(moment(props.toDate))) {
            let tubesFilteredByDates = []

            tubes.forEach(obj => {
                let date = moment(obj.sampleId.time).format('YYYY-MM-DD')
                if (moment(date).isSameOrBefore(moment(toDate)) &&
                    moment(date).isSameOrAfter(moment(fromDate))) {
                    tubesFilteredByDates.push(obj)
                }
            })
            tubes = tubesFilteredByDates
        }
        let sortedTubesByDate = tubes.sort((a, b) => new moment(a.sampleId.time).format('YYYYMMDD') - new moment(b.sampleId.time).format('YYYYMMDD'))

        let datesArr = []
        const newArray = sortedTubesByDate.map(obj => {
            if (props.tubeType == 0 || obj.type == props.tubeType) {
                if (obj && obj.sampleId && obj.sampleId.time) {
                    let date = moment(obj.sampleId.time).format('DD/MM/YYYY')
                    if (date) {
                        let datesArrObj = datesArr.find(d => d.date === date)
                        if (!datesArrObj) {
                            let arr = [{ value: obj.value, location: obj.sampleId.location }]
                            datesArr.push({
                                date,
                                arr
                            })
                        } else {
                            datesArrObj.arr.push({ value: obj.value, location: obj.sampleId.location })
                        }
                    }
                }
            }
        });

        let data = []
        datesArr.forEach((d) => {
            let objToAdd = {
                name: d.date
            }
            if (d.arr) {
                props.locations.forEach(l => {
                    let sum = 0
                    let average = 0
                    let valueByLocaiton = d.arr.filter(a => a.location == l.id)
                    d.arr.filter(a => a.location == l.id).forEach(item => {

                        sum = sum + item.value
                    })
                    average = sum / (valueByLocaiton.length + 1)
                    objToAdd[l.name] = sum == 0 ? 0 : average
                })
                data.push(objToAdd)
            }
        })
        setData(data)
    }
    }, [props.tubeType, props.toDate, props.fromDate])



    return (
        <div>
            <ResponsiveContainer height={400}>
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
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Array.from(props.locations).map((l) => {
                        return <Line type="monotone" dataKey={l.name} stroke={getRandomColor()} />
                    })}
                </LineChart>
            </ResponsiveContainer>
            <Typography variant='h6' mb={4} align='center' marginTop={10}>Precipitations Graph</Typography>
            <Precipitation fromDate={props.fromDate} toDate={props.toDate} />
        </div>
    )
}