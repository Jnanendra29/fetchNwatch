import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS, // Import ChartJS
  CategoryScale, // Import CategoryScale
  LinearScale, // Import LinearScale
  BarElement, // Import BarElement
  Title, // Import Title
  Tooltip, // Import Tooltip
  Legend, // Import Legend
} from "chart.js";
import { Link } from "react-router-dom";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = (props) => {
  const { month } = props;
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [options, setOptions] = useState(null);
  useEffect(() => {
    const getRequest = async (url) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
      } catch (error) {
        console.log(error);
        return;
      }
    };

    const response = getRequest(`http://localhost:8060/barchart/${month}`);
    response
      .then((data) => {
        // console.log(data);
        setData(data);
      })
      .catch((error) => {
        console.log("error in useEffect chart", error);
      });
  }, [month]);

  useEffect(() => {
    if (data != null) {
      console.log(data);

      const priceRanges = [
        { range: "0-100", min: 0, max: 100 },
        { range: "101-200", min: 101, max: 200 },
        { range: "201-300", min: 201, max: 300 },
        { range: "301-400", min: 301, max: 400 },
        { range: "401-500", min: 401, max: 500 },
        { range: "501-600", min: 501, max: 600 },
        { range: "601-700", min: 601, max: 700 },
        { range: "701-800", min: 701, max: 800 },
        { range: "801-900", min: 801, max: 900 },
        { range: "901-above", min: 901, max: Infinity },
      ];

      const itemCounts = priceRanges.map((range) => {
        return Object.values(data)
          .flat()
          .filter((item) => item.price >= range.min && item.price <= range.max)
          .length;
      });

      setChartData({
        labels: priceRanges.map((range) => range.range),
        datasets: [
          {
            label: "Number of Items",
            backgroundColor: "rgba(75,192,192,0.6)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(75,192,192,0.8)",
            hoverBorderColor: "rgba(75,192,192,1)",
            data: itemCounts,
          },
        ],
      });

      setOptions({
        scales: {
          y: {
            beginAtZero: true,
            max: Math.max(...itemCounts) + 1,
          },
        },
      });
    }
  }, [data]);

  return (
    <div className="chartContainer">
      <h2>Bar Chart Stats - {month}</h2>
      <div className="chart">
        {/* {JSON.stringify(data)} */}
        {/* {JSON.stringify(chartData)} */}
        {chartData && options && <Bar data={chartData} options={options}/>}
      </div>
      <p><Link to="/">Back to Table Content</Link></p>
    </div>
  );
};

export default Chart;
