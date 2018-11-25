import React from 'react'
import {
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  AreaSeries,
} from 'react-vis';

const StackedAreaChart = (props) => {
  const { dataSets, colors } = props;
  const axisStyle = {fill:'#d8d9da'};
  const yDomainMax = props.maxValue;
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
            data={dataSets[key]}
            color={colors[key]}
            opacity={0.4}
          />
        )}

        {/* <AreaSeries
          data={heat}
          color={colors.heat}
          opacity={0.4}
        />
        <AreaSeries
          data={ev}
          color={colors.ev}
          opacity={0.4}
        /> */}
        <XAxis style={axisStyle}/>
        <YAxis style={axisStyle}/>
      </FlexibleWidthXYPlot>
    </div>
  )
}

export default StackedAreaChart;