// PropertyChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const PropertyChart = ({ properties }) => {
    const propertyTypeCounts = properties.reduce((acc, property) => {
        const type = property.propertyType || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const labels = Object.keys(propertyTypeCounts);
    const data = Object.values(propertyTypeCounts);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Number of Properties by Type',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Properties by type',
          },
        },
      };


    return <Bar data={chartData} options={chartOptions} />;
};

export default PropertyChart;