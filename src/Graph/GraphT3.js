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

export default function GraphT3(props) {
    const [data, setData] = useState([])
    useEffect(() => {
        setData([])
        if(props.fromDate) {
        let locations = props.locations
        let tubeTypes = props.tubeTypes
        let tubes = props.graphData
        let toDate = moment(props.toDate).format('YYYY-MM-DD')
        let fromDate = moment(props.fromDate).format('YYYY-MM-DD')
        if (props.fromDate) {
            let tubesFilteredByDates = []
            tubes.forEach(obj => {
                let date = moment(obj.sampleId.time).format('YYYY-MM-DD')
                if (moment(date).isSame(moment(fromDate))) {
                    tubesFilteredByDates.push(obj)
                }
            })
            
            tubes = tubesFilteredByDates
        }

        let dataObject = []

        locations.forEach(location => {
           let newObj = {
                name: location.name
                
            } 
            let locationTubes = tubes.filter(t=> t.sampleId.location == location.id)
            tubeTypes.forEach(t=> {
                let allTubeValues = locationTubes.filter(x=>x.type == t.id)
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
                newObj[t.name] = Math.round(val)
            })

            dataObject.push(newObj)
            
        })
         setData(dataObject)
        }
    }, [props.tubeType, props.toDate, props.fromDate])



    return (
        <div>
                <BarChart
                    width={1200}
                    height={600}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                    }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis type="number"  domain={[0, 300]}/>
                    <Tooltip />
                    <Legend />
                    {Array.from(props.tubeTypes).map((l) => {
                        return <Bar barSize={40}  dataKey={l.name} fill={getRandomColor()} />
                    })}
                </BarChart>
                
        </div>
    )
}