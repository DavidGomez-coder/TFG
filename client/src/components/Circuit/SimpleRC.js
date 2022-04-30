import React, { useEffect, useState, Component} from 'react'
import ErrorComponent from '../Errors/ErrorComponent';
import NavBar from '../NavBar/NavBar';
import "./SimpleCircuits.css"
import MetricsGraphics from 'react-metrics-graphics';

class SimpleRC extends Component {
    constructor (props){
        super(props);
        this.state = {
            circuit: [],
            simulation: [{}],
            simulationQ: [{}],
            simulationI: [{}],
            simulationVr: [{}],
            simulationVc: [{}],
            simulationE : [{}],
            done: false
        }
        //this.getExampleCircuit()
        this.getSimulationResults = this.getSimulationResults.bind(this);
    }

    getQ(sim) {
        if (sim.length > 0){     
            let result = [] 
            for (let i=0;i<sim.length; i++){
                let elem = sim[i];
                
                result.push({
                    "t" : elem.t === NaN ? 0 : elem.t,
                    "q" : elem.q === NaN ? 0 : elem.q
                })
            }      
            return result   
        }
        return []
    }

    getI(sim){
        if (sim.length > 0){     
            let result = [] 
            for (let i=0;i<sim.length; i++){
                let elem = sim[i];
                
                result.push({
                    "t" : elem.t === NaN ? 0 : elem.t,
                    "I" : elem.I === NaN ? 0 : elem.I
                })
            }      
            return result   
        }
        return []
    }
    
    getVr(sim) {
        if (sim.length > 0){     
            let result = [] 
            for (let i=0;i<sim.length; i++){
                let elem = sim[i];
                
                result.push({
                    "t" : elem.t === NaN ? 0 : elem.t,
                    "Vr" : elem.Vr === NaN ? 0 : elem.Vr
                })
            }      
            return result   
        }
        return []
    }

    getVc(sim) {
        if (sim.length > 0){     
            let result = [] 
            for (let i=0;i<sim.length; i++){
                let elem = sim[i];
                
                result.push({
                    "t" : elem.t === NaN ? 0 : elem.t,
                    "Vc" : elem.Vc === NaN ? 0 : elem.Vc
                })
            }      
            return result   
        }
        return []
    }
    
    getE(sim) {
        if (sim.length > 0){     
            let result = [] 
            for (let i=0;i<sim.length; i++){
                let elem = sim[i];
                
                result.push({
                    "t" : elem.t === NaN ? 0 : elem.t,
                    "E" : elem.E === NaN ? 0 : elem.E
                })
            }      
            return result   
        }
        return []
    }
    

    componentDidMount(){
        this.getExampleCircuit()
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

    getSimulationResults () {
        let circuit_components_json = JSON.stringify(this.state.circuit)
        let ciph_circuit = btoa(circuit_components_json)
        fetch(`http://localhost:8080/circuit/sim/simpleRc?circuit=${ciph_circuit}`)
        .then(result => result.json())
        .then(response => {
            console.log(response)
            this.setState({
                simulation: response,
                simulationQ: this.getQ(response),
                simulationI: this.getI(response),
                simulationVr: this.getVr(response),
                simulationVc: this.getVc(response),
                simulationE : this.getE(response),
                done: true
            });
        })

        .catch(() => console.error("ERROR"));    
    }



    render () {
        let CHART_SIZE = 500;
        if (this.state.done){
            return(
                <div>
                    <NavBar /> 
                    {/*********************************************************************/}
                    {/*                  RESULTADOS DE LA SIMULACION                      */}
                    {/*********************************************************************/}
                    <div className='vertical-scrollable'>
                        <div className='row'>
                                    <div className='col'>    
                                    <MetricsGraphics 
                                        title="Q(t)"
                                        data={ this.state.simulationQ }
                                        x_accessor="t"
                                        y_accessor="q"
                                        width = {CHART_SIZE}
                                        height = {CHART_SIZE/2}
                                    /> 
                                    </div>
                                    <div className="w-100 d-none d-md-block"></div>
                                    <div className='col'>    
                                        <MetricsGraphics 
                                            title="I(t)"
                                            data={ this.state.simulationI }
                                            x_accessor="t"
                                            y_accessor="I"
                                            width = {CHART_SIZE}
                                        />
                                    </div>
                                    <div className="w-100 d-none d-md-block"></div>
                                    <div className='col'>    
                                        <MetricsGraphics 
                                            title="Vr(t)"
                                            data={ this.state.simulationVr }
                                            x_accessor="t"
                                            y_accessor="Vr"
                                            width = {CHART_SIZE}
                                        />
                                    </div>
                                    <div className="w-100 d-none d-md-block"></div>
                                    <div className='col'>    
                                        <MetricsGraphics 
                                            title="Vc(t)"
                                            data={ this.state.simulationVc }
                                            x_accessor="t"
                                            y_accessor="Vc"
                                            width = {CHART_SIZE}
                                        />
                                    </div>
                                    <div className="w-100 d-none d-md-block"></div>
                                    <div className='col'>    
                                        <MetricsGraphics 
                                            title="E(t)"
                                            data={ this.state.simulationE }
                                            x_accessor="t"
                                            y_accessor="E"
                                            width = {CHART_SIZE}
                                        />
                                    </div>     
                                </div>
                            

                    </div> 
                    {/****************************************************/}
                    {/*             EJECUTAR SIMULACIÓN                  */}
                    {/****************************************************/}
                    <input type="button" className='run-button' value="RUN" onClick={this.getSimulationResults}/>
                    <br></br>
                    
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