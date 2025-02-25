import React from 'react';
import { CChartDoughnut } from '@coreui/react-chartjs';
import styled from 'styled-components';

const ChartContainer = styled.div`
    height: 300px; /* Adjust as needed */
    position: relative;
`;

const DoughnutChartComponent = ({ data, loading, error }) => {
    return (
        <ChartContainer>
            {loading && <div>Loading data...</div>}
            {error && <div>Error: {error}</div>}
            {!loading && !error && data && data.labels && data.labels.length > 0 ? (
                <CChartDoughnut
                    data={data}
                    options={{
                        plugins: {
                            legend: { position: 'bottom' },
                        },
                        animation: {
                            animateScale: true,
                            animateRotate: true,
                        },
                        maintainAspectRatio: false,
                        responsive: true,
                    }}
                    height={300}
                />
            ) : (
                <div>No data available to display.</div>
            )}
        </ChartContainer>
    );
};

export default DoughnutChartComponent;