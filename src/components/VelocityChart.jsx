import { Line } from "react-chartjs-2";
import "../shared/stringExtensions";
import React from "react";

const chartData = (distance, velocity) => {
  return {
    labels: distance,
    datasets: [
      {
        label: "meters per second",
        borderColor: "#3f51b5",
        borderWidth: 1,
        data: velocity
      }
    ]
  };
};

const options = {
  responsive: true,
  /*legend: {
    position: "bottom"
  },*/
  scales: {
    yAxes: [
      {
        display: true,
        ticks: {
          callback: function(label) {
            return label === 0 ? "" : (1000 / label).toString().toHHMMSS();
          }
        }
      }
    ],
    xAxes: [
      {
        gridLines: {
          display: true
        }
      }
    ]
  }
};

const VelocityChart = props => {
  const { distance, velocity } = props;
  return <Line data={chartData(distance, velocity)} options={options} height="50vh"/>;
};

export { VelocityChart };
