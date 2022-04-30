import React, { useEffect, useState, Component} from 'react'
import RCChartList from '../ChartList/RCChartList';
import ErrorComponent from '../Errors/ErrorComponent';
import NavBar from '../NavBar/NavBar';

class SimpleRC extends Component {
    constructor (){
        super();
        this.state = {
            circuit: [],
            simulation: []
        }
        this.getExampleCircuit()
        this.getSimulationResults()
    }

    getExampleCircuit () {
        fetch("http://localhost:8080/circuit/create/simpleRC")
        .then(result => result.json())
        .then(response => {
            this.setState({
                circuit: response,
                done: true
            })
        })
        .catch(()=> console.error("ERROR"))
    }

    getSimulationResults (circuit){    
        let jsonCircuit = JSON.stringify(circuit);
        let cipherCircuit = btoa(jsonCircuit)
        fetch(`http://localhost:8080/circuit/sim/simpleRc?circuit=${cipherCircuit}`)
        .then(result => result.json())
        .then(response => {
            this.setState({
                simulation: response,
                done: true
            })
        })
        .catch(()=> {console.error("ERROR")})
    }

    showCircuit (circuit){
        console.log(circuit)
    }

    

    render () {

        if (this.state.done){
            return(
                <div>
                    <NavBar />  
                    <RCChartList />
                </div>
            )
        } else{
            return (
                <div>
                    <ErrorComponent err_type="CIRCUIT_NOT_FOUND"></ErrorComponent>
                </div>
            )
        }
    }
}

export default SimpleRC;