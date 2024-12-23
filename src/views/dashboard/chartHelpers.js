export const generateBarChartSVG = (data, maxValue) => {
    const barHeight = 8;
    const chartWidth = 50;
    const maxBarWidth = chartWidth;
     const barData = data.map((value) => {
       return  (value/maxValue) * maxBarWidth
     })


    return (
      <svg width={chartWidth} height={barHeight * data.length} >

         {barData.map((width, index) => (
              <rect
                key={index}
                x="0"
                y={index * barHeight}
                width={width}
                height={barHeight -1}
                fill="#fff"
               />
            ))}

         </svg>
    );
};

export  const generateSparkLineSVG = (data, width = 60, height = 20) => {
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
        <svg width={width} height={height} >
            <polyline points={points}
                fill="none"
                stroke="#fff"
                strokeWidth="1"
            />
        </svg>
      )
  };