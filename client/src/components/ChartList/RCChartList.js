import React, {Component} from 'react'
import MyChart from '../MyChart/MyChart';
import "./RCChartList.css"

class RCChartList extends Component {
    constructor (props){
        super(props)
    }
    
    dataChart1() {
        return {
            labels: ["October", "November", "December"],
            datasets: [
              {
                data: [8137119, 9431691, 10266674],
                label: "Infected",
                borderColor: "#3333ff",
                fill: true,
                lineTension: 0.5
              },
              {
                data: [1216410, 1371390, 1477380],
                label: "Deaths",
                borderColor: "#ff3333",
                backgroundColor: "rgba(255, 0, 0, 0.5)",
                fill: true,
                lineTension: 0.5
              }
            ]
          };
    }

    dataChart2() {
        return {
            labels: ["October", "November", "December"],
            datasets: [
              {
                data: [1216410, 1371390, 1477380],
                label: "Deaths",
                borderColor: "#ff3333",
                backgroundColor: "rgba(255, 0, 0, 0.5)",
                fill: false,
                lineTension: 0.1
              }
            ]
          };
    }

    render (){
        return (
            <div className='vertical-scrollable'>
                <div className='row'>
                        <div className='col'>    
                            <MyChart data={this.dataChart1()} title="Q(t)"/>
                        </div>
                        <div className="w-100 d-none d-md-block"></div>
                        <div className='col'>    
                            <MyChart data={this.dataChart2()} title="I(t)"/>
                        </div>
                        <div className="w-100 d-none d-md-block"></div>
                        <div className='col'>    
                            <MyChart data={this.dataChart2()} title="Vc(t)"/>
                        </div>
                        <div className="w-100 d-none d-md-block"></div>
                        <div className='col'>    
                            <MyChart data={this.dataChart2()} title="Vr(t)"/>
                        </div>
                        <div className="w-100 d-none d-md-block"></div>
                        <div className='col'>    
                            <MyChart data={this.dataChart2()} title="E(t)"/>
                        </div>
                        <div className="w-100 d-none d-md-block"></div>
                        <div className='col'>    
                            <MyChart data={this.dataChart2()} title="E(t)"/>
                        </div>
                </div>
            </div>
        
        )
    }
}

export default RCChartList;