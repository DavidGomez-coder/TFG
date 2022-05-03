import React, {Component} from 'react'
import ErrorComponent from '../Errors/ErrorComponent';
import NavBar from '../NavBar/NavBar';
import "./SimpleCircuits.css"

import  MetricsGraphics  from 'react-metrics-graphics';
import 'bootstrap/dist/css/bootstrap.min.css';

import resistor_img from "../../assets/img/resistor.png"




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
        this.updateComponent = this.updateComponent.bind(this);
        this.resistor_value = 0.1;
        this.resistor_multiplier = "x0.1";
        this.resistor_color_bands = [];
    }

    componentDidMount(){
        this.getExampleCircuit()
    }

    getQ(sim) {
        if (sim.length > 0){     
            let result = [] 
            for (let i=0;i<sim.length; i++){
                let elem = sim[i];
                
                result.push({
                    "t" : isNaN(elem.t) ? 0 : elem.t,
                    "q" : isNaN(elem.q) ? 0 : elem.q
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
                    "t" : isNaN(elem.t) ? 0 : elem.t,
                    "I" : isNaN(elem.I) ? 0 : elem.I
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
                    "t" : isNaN(elem.t) ? 0 : elem.t,
                    "Vr" : isNaN(elem.Vr) ? 0 : elem.Vr
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
                    "t" : isNaN(elem.t) ? 0 : elem.t,
                    "Vc" : isNaN(elem.Vc) ? 0 : elem.Vc
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
                    "t" : isNaN(elem.t) ? 0 : elem.t,
                    "E" : isNaN(elem.E) ? 0 : elem.E
                })
            }      
            return result   
        }
        return []
    }

    /* *************************************************************** */
    /*                       PETICIONES A LA API                       */
    /* *************************************************************** */
    /**
     * Este petición actualiza el circuito actual con los cambios realizados en la interfaz. Cada vez que se 
     * actualiza un componente, se obtiene los resultados de dicha simulación con el componente actualizado.
     * En caso de que el componente sea un interruptor (switch) se cambiará entre 0 y 1 cada vez que se llame
     * a este método.
     * @param {string} componentId 
     * @param {number} value 
     * @param {string} multiplier 
     */
    async updateComponent(componentId, value, multiplier) {
        let old_components = this.state.circuit;
        // buscamos el componente
        old_components.components.forEach(element => {
            if (element.id === componentId){
                if (element.type === "Switch") {
                    if (element.value === 0){
                        element.value = 1;
                    }else {
                        element.value = 0;
                    }
                }else{
                    element.value = value;
                }

                if (element.type === "Resistor") {
                    this.resistor_color_bands = element.colorBands;
                }
                
                element.multiplier = multiplier;
            }
        });
        console.log(old_components)
        let ciph_circuit = btoa(JSON.stringify(old_components))
        await fetch(`http://localhost:8080/circuit/update?circuit=${ciph_circuit}`)
        .then(result => result.json())
        .then(response => {
            this.setState({
                circuit: response,
                done: true
            })
        })
       await this.getSimulationResults()
    }

    async getExampleCircuit () {
        await fetch("http://localhost:8080/circuit/create/simpleRC")
        .then(result => result.json())
        .then(response => {
            this.setState({
                circuit: response,
                done: true
            })
        })
        .catch(()=> console.error("ERROR"))
    }

    async getSimulationResults () {
        console.log(this.state.circuit)
        let circuit_components_json = JSON.stringify(this.state.circuit)
        let ciph_circuit = btoa(circuit_components_json)
        await fetch(`http://localhost:8080/circuit/sim/simpleRc?circuit=${ciph_circuit}`)
        .then(result => result.json())
        .then(response => {
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

    /* *************************************************************** */
    /*                      CONTROL DE COMPONENTES                      */
    /* *************************************************************** */    
    

    render () {
        if (this.state.done){
            return(
                <div>
                    <NavBar /> 
                    <div className='d-md-flex h-md-100 align-items-center'>
                    {/*********************************************************************/}
                    {/*                  RESULTADOS DE LA SIMULACION                      */}
                    {/*********************************************************************/}
                        <div className='vertical-scrollable'>
                                <div className='row'>
                                            <div className='col-md-12'>    
                                            <MetricsGraphics 
                                                title="Q(t)"
                                                data={ this.state.simulationQ }
                                                x_accessor="t"
                                                y_accessor="q"
                                                full_width={true}
                                                colors="#fcce02"
                                                linked={true}
                                                animate_on_load={true}
                                                transition_on_update={true}
                                            /> 
                                            </div>
                                            <div className="w-100 d-none d-md-block"></div>
                                            <div className='col-md-12'>    
                                                <MetricsGraphics 
                                                    title="I(t)"
                                                    data={ this.state.simulationI }
                                                    x_accessor="t"
                                                    y_accessor="I"
                                                    full_width={true}
                                                    colors="#0882b2"
                                                    linked={true}
                                                    animate_on_load={true}
                                                    transition_on_update={true}
                                                />
                                            </div>
                                            <div className="w-100 d-none d-md-block"></div>
                                            <div className='col-md-12'>    
                                                <MetricsGraphics 
                                                    title="Vr(t)"
                                                    data={ this.state.simulationVr }
                                                    x_accessor="t"
                                                    y_accessor="Vr"
                                                    full_width={true}
                                                    colors="#2ab208"
                                                    linked={true}
                                                    animate_on_load={true}
                                                    transition_on_update={true}
                                                />
                                            </div>
                                            <div className="w-100 d-none d-md-block"></div>
                                            <div className='col-md-12'>    
                                                <MetricsGraphics 
                                                    title="Vc(t)"
                                                    data={ this.state.simulationVc }
                                                    x_accessor="t"
                                                    y_accessor="Vc"
                                                    full_width={true}
                                                    colors="#e50000"
                                                    linked={true}
                                                    animate_on_load={true}
                                                    transition_on_update={true}
                                                />
                                            </div>
                                            <div className="w-100 d-none d-md-block"></div>
                                            <div className='col-md-12'>    
                                                <MetricsGraphics 
                                                    title="E(t)"
                                                    data={ this.state.simulationE }
                                                    x_accessor="t"
                                                    y_accessor="E"
                                                    full_width={true}
                                                    colors="#f47f11"
                                                    linked={true}
                                                    animate_on_load={true}
                                                    transition_on_update={true}
                                                />
                                            </div>     
                                        </div>
                                    
                        </div>

                        <div className='control-circuit-panel'>
                            <div className='row align-items-bottom justify-content-md-center'>
                                {/*********************************************************************/}
                                {/*                           CIRCUITO                                */}
                                {/*********************************************************************/}
                                <div className='col'>
                                    CIRCUITO
                                </div>
                                <div className="w-100 d-none d-md-block"></div>
                                <div className="w-100 d-none d-md-block"></div>
                                <div className="w-100 d-none d-md-block"></div>
                                <div className="w-100 d-none d-md-block"></div>
                                {/*********************************************************************/}
                                {/*                  CAMBIO DE COMPONENTES                            */}
                                {/*********************************************************************/}   
                                <div className='col'>
                                    <div className='row align-items-bottom justify-content-md-center' >
                                        {/*********************************************************************/}
                                        {/*                  CONTROLADOR DE LA RESISTENCIA                         */}
                                        {/*********************************************************************/}   
                                        <div className='col'>
                                                <div className="w-50">
                                                    <div className="d-flex flex-column align-items-center">                                                     
                                                        <div className="form-label resistor-value">
                                                            <label htmlFor="range" >{this.resistor_value} Ω </label>
                                                        </div>
                                                        <div className="row ">
                                                            <div className='d-flex flex-row align-items-center'>
                                                                <input type="range" className="form-range" min="0.1" max="99" step="0.1" value={this.resistor_value} 
                                                                    onChange={(ev) => {
                                                                    this.resistor_value = ev.target.value;
                                                                    this.updateComponent("R0", this.resistor_value, this.resistor_multiplier);
                                                                }}/>
                                                            </div>
                                                            
                                                            <div className="w-100 d-none d-md-block"></div>
                                                            <select className="form-select" aria-label="Default select example" onChange={(ev) => {
                                                                    this.resistor_multiplier = ev.target.value;
                                                                    this.updateComponent("R0", this.resistor_value, this.resistor_multiplier);
                                                                }}>
                                                                <option value="x0.1">x0.1</option>
                                                                <option value="x1">x1</option>
                                                                <option value="x10">x10</option>
                                                                <option value="x100">x100</option>
                                                                <option value="x1K">x1K</option>
                                                            </select>
                                                        </div>
                                                        
                                                           
                                                        <div className='row justify-content-center '>
                                                            <div className='resistor-view'>
                                                                <div className='resistor-band1' style={{"background" : this.resistor_color_bands[0]}}></div>  
                                                                <div className='resistor-band2' style={{"background" : this.resistor_color_bands[1]}}></div> 
                                                                <div className='resistor-band3' style={{"background" : this.resistor_color_bands[2]}}></div> 
                                                                <div className='resistor-band4' style={{"background" : this.resistor_color_bands[3]}}></div> 
                                                            </div>
                                                        </div>                                                   
                                                        
                                                        
                                                    </div>
                                            </div>
                                        </div>
                                        {/*********************************************************************/}
                                        {/*                  CONTROLADOR DE LA FUENTE                         */}
                                        {/*********************************************************************/}   
                                        <div className='col'>
                                            FUENTE
                                        </div>
                                        {/*********************************************************************/}
                                        {/*                  CONTROLADOR DEL CONDENSADOR                      */}
                                        {/*********************************************************************/}   
                                        <div className='col'>
                                            CONDENSADOR
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    {/*<input type="button" className='run-button' value="RUN" onClick={this.getSimulationResults}/>*/}                   
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