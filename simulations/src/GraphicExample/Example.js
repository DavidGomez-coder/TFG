import React, { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';



var timeInterval = 100;

export default class Example extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      //time
      t_i: 0,
      t_a: 0,
      //capacitor charge
      //data: name: "", tag: value
      q_data: [],
      q_0: 0,
      //current
      i_data: [],
      //components
      C: 0,
      R: 0,
      V: 0,
      //data
      capacitorCharging: true,
      running: true,
      data_length: 0,
      //interval
      intervalId: 0
    }

    this.changeCapacitorState = this.changeCapacitorState.bind(this);
    this.changeRunning = this.changeRunning.bind(this);
  }

  componentDidMount() {
    const newInterval = setInterval(() => {

      if (this.state.running) {
        let oldQData = this.state.q_data;
        let oldIData = this.state.i_data;
        if (oldQData.length >= 50) {

          let newQData = oldQData.shift();
          let newIData = oldIData.shift();
        }

        this.setState(prevState => {
          if (this.state.running) {
            return {
              ...prevState,
              q_data: [...oldQData, { "name": prevState.t_a, "q(t)": prevState.capacitorCharging ? this.getQ_charge() : this.getQ_discharge() }],
              i_data: [...oldIData, { "name": prevState.t_a, "i(t)": prevState.capacitorCharging ? this.getI_charge() : this.getI_discharge() }],
              t_i: timeInterval + prevState.t_i,
              t_a: timeInterval + prevState.t_a,
              q_0: prevState.capacitorCharging ? this.getQ_charge() : this.getQ_discharge(),
              data_length: prevState.data_length + 1
            }
          }


        });
      }


    }, timeInterval);



    //reset new interval
    this.setState(prevState => {
      return {
        ...prevState,
        intervalId: newInterval
      }
    })
  }

  changeCapacitorState() {
    this.setState(prevState => {
      return {
        ...prevState,
        capacitorCharging: !prevState.capacitorCharging,
        t_i: 0
      }
      timeInterval = this.state.C * 1000
    })
  }

  setCapacitorValue(c) {
    this.setState({
      C: c
    })
  }

  changeRunning() {
    this.setState(prevState => {
      return {
        ...prevState,
        running: !prevState.running
      }
    })
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }



  // *******************************************************************************
  //                        EXPRESSIONS
  // *******************************************************************************

  getQ_charge() {
    return this.state.C * this.state.V * (1 - Math.pow(Math.E, (-this.state.t_i) / (this.state.R * this.state.C)));
  }

  getQ_discharge() {
    return this.state.q_0 * Math.pow(Math.E, (-this.state.t_i) / (this.state.R * this.state.C));
  }

  getI_charge() {
    return this.state.V / this.state.R * (Math.pow(Math.E, (-this.state.t_i) / (this.state.R * this.state.C)));
  }

  getI_discharge() {
    return (-this.state.q_0 / (this.state.R * this.state.C)) * (Math.pow(Math.E, (-this.state.t_i) / (this.state.R * this.state.C)));
  }

  render() {
    return (
      <div>
        <div className='container'>
          <div className='row'>
            {/* GRAFICAS */}
            <div className='row'>
              <div className='col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6'>
                <LineChart
                  width={500}
                  height={300}
                  data={this.state.q_data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="0" />
                  <XAxis dataKey="name" tick={false} />
                  <YAxis type="number" domain={[0, this.state.q_data[this.state.q_data.length - 1] + 10]} />

                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="q(t)" stroke="orange" strokeWidth={3} dot={false} isAnimationActive={false} />
                </LineChart>"
              </div>
              <div className='col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6'>
                <LineChart
                  width={500}
                  height={300}
                  data={this.state.i_data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="0" />
                  <XAxis dataKey="name" tick={false} />
                  <YAxis type="number" domain={[-this.state.i_data[this.state.i_data.length - 1], this.state.i_data[this.state.i_data.length - 1]]} />

                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="i(t)" stroke="#3003fc" strokeWidth={3} dot={false} isAnimationActive={false} />
                </LineChart>

              </div>
            </div>

            {/* CIRCUITO */}
            
          </div>

          <div className='row'>

          </div>
        </div>

        <button onClick={this.changeRunning}>{this.state.running ? "STOP" : "RESUME"}</button>
        <button onClick={this.changeCapacitorState}>{this.state.capacitorCharging ? "Charging" : "Discharging"}</button>
        <input type="number" min="0" max="99" onChange={(ev) => {
          this.setCapacitorValue(parseInt(ev.target.value))
        }}></input>
      </div>
    );
  }
}
