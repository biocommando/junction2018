import React from 'react'
import {
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  AreaSeries,
} from 'react-vis';
import {timeFormat} from "d3-time-format";


const StackedAreaChart = (props) => {
  const { dataSets, colors } = props;
  const axisStyle = {fill:'#d8d9da', fontSize:'0.9em'};
  const yDomainMax = props.maxValue;
  const formatTime = timeFormat('%H:%M');
  return (
    <div className='grid-container'>
      <FlexibleWidthXYPlot
        stackBy="y"
        height={300}
        margin={{left: 75}}
        xType="time"
        yDomain={[0, yDomainMax]}
      >
        {Object.keys(dataSets).map(key =>
          <AreaSeries
            key={`key-dataSet-${key}`}
            data={dataSets[key]}
            color={colors[key]}
            opacity={0.4}
          />
        )}
        <XAxis
          style={axisStyle}
          tickFormat={function tickFormat(d){return formatTime(d)}}
        />
        <YAxis style={axisStyle}/>
      </FlexibleWidthXYPlot>
    </div>
  )
}

export default StackedAreaChart;