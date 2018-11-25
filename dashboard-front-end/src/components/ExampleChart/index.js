import React from 'react';
import {
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  LineSeries,
  AreaSeries,
} from 'react-vis';

const ExampleChart = (props) => {
  const { myData, color } = props;
  const axisStyle = {fill:'#d8d9da'};
  // const BarSeries = VerticalBarSeries;
  const yDomainMax = props.maxValue;

  return (
    <div className='grid-container'>
      <FlexibleWidthXYPlot
        height={300}
        margin={{left: 75}}
        xType="time"
        yDomain={[0, yDomainMax]}
      >
        <AreaSeries
          curve={null}
          data={myData}
          opacity={0.4}
          strokeStyle="solid"
          color={color}
          style={{}}
        />
        <LineSeries
          curve={null}
          data={myData}
          opacity={1}
          stroke={color}
          strokeStyle="solid"
          color={color}
          style={{fill: "none"}}
        />
        <XAxis style={axisStyle}/>
        <YAxis style={axisStyle}/>
      </FlexibleWidthXYPlot>
    </div>
  )
}

export default ExampleChart;