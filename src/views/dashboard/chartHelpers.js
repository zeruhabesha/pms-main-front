import { css } from 'styled-components';

export const generateBarChartSVG = (data, maxValue, color = 'white') => {
    const barHeight = 8;
    const chartWidth = 50;
    const maxBarWidth = chartWidth;
    const barData = data.map((value) => {
        return  (value/maxValue) * maxBarWidth
    })


    return (
        <svg width={chartWidth} height={barHeight * data.length} viewBox={`0 0 ${chartWidth} ${barHeight * data.length}`}>

            {barData.map((width, index) => (
                <rect
                  key={index}
                  x="0"
                  y={index * barHeight}
                  width={width}
                  height={barHeight -1}
                  fill={color}
                 />
              ))}

         </svg>
    );
};

export  const generateSparkLineSVG = (data, width = 60, height = 20, color = 'white') => {
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