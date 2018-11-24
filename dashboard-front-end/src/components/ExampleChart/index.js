import React from 'react';
import {
  FlexibleWidthXYPlot,
  XYPlot,
  XAxis,
  YAxis,
  VerticalBarSeries,
} from 'react-vis';

const ExampleChart = (props) => {
  const { myData } = props;
  const axisStyle = {fill:'#d8d9da'};
  const BarSeries = VerticalBarSeries;
  const yDomain = myData.reduce(
    (res, row) => {
      return {
        max: Math.max(res.max, row.y),
        min: Math.min(res.min, row.y)
      };
    },
    {max: -Infinity, min: Infinity}
  );
  return (
    <div className='grid-container'>
      <FlexibleWidthXYPlot
        height={300}
        margin={{left: 75}}
        xType="time"
        yDomain={[yDomain.min, yDomain.max]}
      >
        <BarSeries className="barChart" data={myData} />
        <XAxis style={axisStyle}/>
        <YAxis style={axisStyle}/>
      </FlexibleWidthXYPlot>
    </div>
  )
}

export default ExampleChart;