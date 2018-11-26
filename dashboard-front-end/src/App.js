import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';
import StackedAreaChart from './components/StackedAreaChart';
import powerMap from './resources/map.png';
const getData = callback => fetch('http://localhost:3001/api/history', { mode: 'cors' }).then(response => response.json().then(callback));
const getParams = callback => fetch('http://localhost:3001/api/param', { mode: 'cors' }).then(response => response.json().then(callback));

class App extends Component {
  state = {
    appliances: [],
    heat: [],
    ev: [],
    balancing: [],
    maxLoad: 150
  }

  componentDidMount() {

    const createData = (dataPoint, key) => {
      return {
        id: dataPoint.time,
        x: new Date(dataPoint.time).getTime(),
        y: dataPoint[key]
      };
    };

    window.setInterval(function () {
      getData(data => {
        data = data.filter(d => new Date(d.time).getTime() > new Date(data[data.length - 1].time).getTime() - 24 * 60 * 60 * 1000)
        this.setState({
          appliances: data.map(d => createData(d, 'appliances')),
          heat: data.map(d => createData(d, 'heat')),
          ev: data.map(d => createData(d, 'ev')),
          balancingHeat: data.map(d => ({
            id: d.time,
            x: new Date(d.time).getTime(),
            y: d.balancingData.heat
          })),
          balancingEv: data.map(d => ({
            id: d.time,
            x: new Date(d.time).getTime(),
            y: d.balancingData.ev
          })),
        });
      });
    }.bind(this), 1000)

    window.setInterval(function () {
      getParams(params => {
        this.setState({maxLoad: params.maxLoad});
      });
    }.bind(this), 5000)
  }



  render() {
    const { appliances, heat, ev, balancingHeat, balancingEv, maxLoad } = this.state;
    const colors = {
      appliances: "#900c3f",
      heat: "#c70039",
      ev: "#ff5733",
      balancingEv: "#ffc305",
      balancingHeat: "#ffc305",
    }
    return (
      <div className="App">
        <Header />
        <Body>
          <div>
            <h4>Electrical Appliances</h4>
            <StackedAreaChart maxValue={maxLoad} dataSets={{appliances}} colors={colors} />
          </div>

          <div>
            <h4>Electrical Heating</h4>
            <StackedAreaChart maxValue={maxLoad} dataSets={{heat, balancingHeat}} colors={colors} />
          </div>
          <div>
            <h4>Electrical Vehicle Charging</h4>
            <StackedAreaChart maxValue={maxLoad} dataSets={{ev, balancingEv}} colors={colors} />
          </div>
          <div>
            <h4>Total Power</h4>
            <StackedAreaChart maxValue={maxLoad} dataSets={{appliances, heat, ev}} colors={colors} />
          </div>
          <div>
            <h4>Transformer Status</h4>
            <div className='map-container'>
              <img className='power-map' src={powerMap} alt="Power Grid Map"/>
            </div>
          </div>
        </Body>
        <Footer />
      </div>
    );
  }
}

export default App;
