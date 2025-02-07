import React from 'react';

export const generateBarChartSVG = (data, barHeight = 30, color = 'white', barSpacing = 2) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return null; // Return null if data is invalid or empty, better for React conditional rendering
    }

    const maxVal = Math.max(...data);
    if (maxVal === 0) {
        // Handle the case where all data values are zero
        const width = data.length * (barSpacing + 8); // Calculate width based on number of bars and spacing
        const bars = data.map((_, index) => {
            const x = index * (barSpacing + 8);
            return `<rect x="${x}" y="${barHeight}" width="8" height="0" fill="${color}" />`; // Bars with zero height
        }).join('');

        return `<svg width="${width}" height="${barHeight}" >
           ${bars}
        </svg>`;
    }

    const width = data.length * (barSpacing + 8); // Calculate width based on number of bars and spacing
    const barWidth = 8; // Fixed bar width for consistency
    const bars = data.map((value, index) => {
        const height = (value / maxVal) * barHeight; // Scale the height
        const x = index * (barSpacing + barWidth); // Calculate x position with spacing
        const y = barHeight - height; // position from the bottom
        return `<rect x="${x}" y="${y}" width="${barWidth}" height="${height}" fill="${color}" />`;
    }).join('');

    return `<svg width="${width}" height="${barHeight}" >
       ${bars}
    </svg>`;
};

export const generateSparkLineSVG = (data, width = 60, height = 20, color = 'white', strokeWidth = 1) => {
    if (!data || !Array.isArray(data) || data.length < 2) {
        return null; // Return null if data is invalid or less than 2 points
    }
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width; // Calculate x position based on index and width
        const y = range === 0 ? height / 2 : height - ((value - min) / range) * height; // Calculate y, center if range is 0
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <polyline points={points}
                      fill="none"
                      stroke={color}
                      strokeWidth={strokeWidth} // Use configurable strokeWidth
            />
        </svg>
    );
};

export const generateLineChartSVG = (data, width = 100, height = 40, color = 'white', strokeWidth = 1.5) => {
    if (!data || !Array.isArray(data) || data.length < 2) {
        return null; // Return null if data is invalid or less than 2 points
    }

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width; // Calculate x position based on index and width
        const y = range === 0 ? height / 2 : height - ((value - min) / range) * height; // Calculate y, center if range is 0
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <polyline points={points}
                      fill="none"
                      stroke={color}
                      strokeWidth={strokeWidth} // Use configurable strokeWidth
            />
        </svg>
    );
};