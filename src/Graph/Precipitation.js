import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment'
export default function Precipitation(props) {
    const [data, setData] = useState([])
    

    useEffect(() => {
        let toDate = moment(props.toDate).format('YYYY-MM-DD')
        let fromDate = moment(props.fromDate).format('YYYY-MM-DD')
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/RAMAT%20GAN/${fromDate}/${toDate}?unitGroup=metric&include=days&key=44F6GPW8MTWN477NV5GHVT3ZW&contentType=json`
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const p = data.days.map((d) => {
                    return { name: d.datetime, precipitation: d.precip }
                })
                setData(p)
            })
            .catch(err => console.error(err))
    }, [props.fromDate,props.toDate])
    return (
        <ResponsiveContainer height={400}>
            <LineChart
                width={500}
                height={100}
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
                <Line type="monotone" dataKey="precipitation" stroke="#8884d8" />
            </LineChart>
        </ResponsiveContainer>
    )
}