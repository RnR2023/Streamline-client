import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from "moment";
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export default function GraphT4(props) {
    const [data, setData] = useState([])
    useEffect(() => {
        setData([])
        let locations = props.locations
        let tubeTypes = props.tubeTypes
        let tubes = props.graphData
        let fromDate = moment(props.fromDate).format('YYYY-MM-DD')
        if (props.fromDate && props.tubeType) {
            let tubesFilteredByDates = []
            tubes.forEach(obj => {
                let date = moment(obj.sampleId.time).format('YYYY-MM-DD')
                if (moment(date).isSame(moment(fromDate))) {
                    tubesFilteredByDates.push(obj)
                }
            })

            tubes = tubesFilteredByDates
        

        let dataObject = []

        locations.forEach(location => {
           
            let locationTubes = tubes.filter(t=> t.sampleId.location == location.id)
            let allTubeValues = locationTubes.filter(x=>x.type == props.tubeType)
            let val = 0
            if(allTubeValues) {
            allTubeValues.forEach(at => {
                val = val + at.value
            })
            if(allTubeValues.length === 0) {
                val = 0
            } else {
            val = val / allTubeValues.length
            }
        }
          dataObject.push({[location.name]: Math.round(val)})
        })
         setData(dataObject)
    }
    }, [props.tubeType, props.toDate, props.fromDate])



    return (
        <div>
                <BarChart
                    width={1200}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                    }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 50]} />
                    <Tooltip />
                    <Legend />
                    {Array.from(props.locations).map((l) => {
                        return <Bar barSize={40}  dataKey={l.name} fill={getRandomColor()} />
                    })}
                </BarChart>
                
        </div>
    )
}