import React, {Component} from 'react'
import ErrorComponent from '../Errors/ErrorComponent';
import NavBar from '../NavBar/NavBar';
import "./SimpleCircuits.css"
import  MetricsGraphics  from 'react-metrics-graphics';
import 'bootstrap/dist/css/bootstrap.min.css';




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
                    {/*********************************************************************/}
                    {/*                  RESULTADOS DE LA SIMULACION                      */}
                    {/*********************************************************************/}
                    <div className='row'>
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
                    </div>
                    
                    {/****************************************************/}
                    {/*             EJECUTAR SIMULACIÓN                  */}
                    {/****************************************************/}
                    {/*<input type="button" className='run-button' value="RUN" onClick={this.getSimulationResults}/>*/}
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