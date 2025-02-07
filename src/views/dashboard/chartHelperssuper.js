// chartHelpers.js
import React from 'react';
import * as d3 from 'd3';

export const generateSparkLineSVG = (dataPoints, width, height, color) => {
    const data = dataPoints.map((value, index) => ({ index, value }));

    const x = d3.scaleLinear().domain([0, data.length - 1]).range([0, width]);
    const y = d3.scaleLinear().domain([Math.min(...dataPoints), Math.max(...dataPoints)])
                    .range([height, 0]); // Range is reversed for SVG y-coordinates

    const line = d3.line()
        .x(d => x(d.index))
        .y(d => y(d.value));

    const barWidth = width / data.length;

    return (
        <svg width={width} height={height}>
            <path d={line(data)} stroke={color} strokeWidth="2" fill="none" />
        </svg>
    );
};


export const generateBarChartSVG = (dataPoints, barWidthRatio, color) => {
  const width = dataPoints.length * 20; // Adjust width as needed
  const height = 30;
  const barWidth = 20 * barWidthRatio; // Width of each bar

  const maxDataPoint = Math.max(...dataPoints);
  const y = d3.scaleLinear().domain([0, maxDataPoint]).range([0, height]);

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      {dataPoints.map((value, index) => (
        <rect
          key={index}
          x={index * 20 + (20 * (1-barWidthRatio) / 2)} // Position each bar, and center it in its 20px slot
          y={height - y(value)} // Position from the bottom
          width={barWidth}
          height={y(value)}
          fill={color}
        />
      ))}
    </svg>
  );
};