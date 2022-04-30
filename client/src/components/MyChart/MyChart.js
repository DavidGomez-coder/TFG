import React, {Component} from 'react'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

class MyChart extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: props.data,
            title: props.title
        }
    }

    render() {
        return (
            <div>
            <Line
              type="line"
              width={160}
              height={60}
              options={{
                plugins : {
                  legend : {
                    display: false
                  },
                  title : {
                    text: this.state.title,
                    display: true,
                    position: "top",
                    align: 'center'
                  } 
                },
                 
              }}
              data={this.state.data}
            />
            </div>
            
          );
    }
}

export default MyChart;