import { css } from 'styled-components';

export const generateBarChartSVG = (data, barHeight, color) => {
    if (!data || data.length === 0) {
        return '';
    }

      const maxVal = Math.max(...data);
      const width = 50;
        const barWidth = width / data.length;
       const bars = data.map((value, index) => {
            const height = (value / maxVal) * barHeight; // Scale the height
          const x = index * barWidth;
             const y = barHeight - height; // position from the bottom
          return `<rect x="${x}" y="${y}" width="${barWidth -2}" height="${height}" fill="${color}" />`;
         }).join('');
  
      return `<svg width="${width}" height="${barHeight}" >
         ${bars}
      </svg>`
  };

export const generateSparkLineSVG = (data, width = 60, height = 20, color = 'white') => {
    if (!data || data.length < 2) {
        return null;
    }
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = range === 0 ? height / 2 : height - ((value - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <polyline points={points}
                      fill="none"
                      stroke={color}
                      strokeWidth="1"
            />
        </svg>
    )
};

export const generateLineChartSVG = (data, width = 100, height = 40, color = 'white') => {
    if (!data || data.length < 2) {
        return null;
    }

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
         const y = range === 0 ? height / 2 : height - ((value - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <polyline points={points}
                      fill="none"
                      stroke={color}
                      strokeWidth="1.5"
            />
        </svg>
    );
};