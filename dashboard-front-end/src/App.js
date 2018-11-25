import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';
import ExampleChart from './components/ExampleChart';
const getData = callback => fetch('http://localhost:3001/api/history', { mode: 'cors' }).then(response => response.json().then(callback));

class App extends Component {
  state = {
    appliances: [],
    heat: [],
    ev: [],
    balancing: []
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
          balancing: data.map(d => ({
            id: d.time,
            x: new Date(d.time).getTime(),
            y: d.balancingData.heat + d.balancingData.ev
          })),
        });
      });
    }.bind(this), 1000)
  }



  render() {
    const { appliances, heat, ev, balancing } = this.state;
    return (
      <div className="App">
        <Header />
        <Body>
          <div>
            <div>Electrical Appliances</div>
            <ExampleChart myData={appliances} />
          </div>

          <div>
            <div>Electrical Heating</div>
            <ExampleChart myData={heat} />
          </div>
          <div>
            <div>Electrical Vehicle Charging</div>
            <ExampleChart myData={ev} />
          </div>
          <div>
            <div>Balanced Power</div>
            <ExampleChart myData={balancing} />
          </div>
        </Body>
        <Footer />
      </div>
    );
  }
}

export default App;
