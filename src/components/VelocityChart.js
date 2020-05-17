import {Line} from "react-chartjs-2";
import React from "react";
import "../shared/stringExtensions";

const chartData = (distance, velocity) => {
    return {
        labels: distance,
        datasets: [
            {
                label: 'meters per second',
                borderColor: '#3f51b5',
                borderWidth: 1,
                data: velocity
            }
        ]       
    };
}


const options =  {
    responsive: true,
    legend: {
        position: 'bottom',
    },
    scales: {
        yAxes: [{
            display: true,
            ticks: {
                callback: function(label) {
                    return label === 0
                        ? ""
                        : (1000 / label).toString().toHHMMSS()
                }
            }
        }],
        xAxes: [{
            gridLines: {
                display: true
            }
        }]
    }
}

export default function VelocityChart(props) {    
    const { distance, velocity } = props;
    
    return (
        <Line data={chartData(distance, velocity)} options={options}/>
    )
}