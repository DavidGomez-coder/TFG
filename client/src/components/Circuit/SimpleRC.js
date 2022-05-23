import React, { Component, useCallback } from 'react'
import ErrorComponent from '../Errors/ErrorComponent';

import "./SimpleCircuits.css"
import "./ResistorCSS.css"
import "./CellCSS.css"
import "./CapacitorCSS.css"
import "./ToogleSwitch.css"

import MetricsGraphics from 'react-metrics-graphics';
import NavBar from '../NavBar/NavBar.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';

import 'katex/dist/katex.min.css';
import Latex from 'react-latex';
import { MathJaxContext, MathJax } from 'better-react-mathjax';


class SimpleRC extends Component {

    constructor(props) {
        super(props);
        this.state = {
            circuit: [],
            simulation: undefined,
            simulationQ: [{}],
            simulationI: [{}],
            simulationVr: [{}],
            simulationVc: [{}],
            simulationE: [{}],
            errorOnData: "No data provided",
            //RESISTOR
            resistor_value: 0.1,
            resistor_multiplier: "x0.1",
            resistor_color_bands: [],
            max_resistor_value: 9,
            resistor_step: 0.1,
            //CAPACITOR
            capacitor_value: 0.1,
            capacitor_multiplier: "nanoF",
            //CELL
            cell_value: 0.1,
            cell_multiplier: "microV",
            //SWITCH
            switch_value: "On",
            //LIMITS
            qmax: 0,
            emax: 0,
            imax: 0,
            Vcmax: 0,
            Vrmax: 0,
            RC_time_markers: [{}],
            //OTROS
            showLegend: false,
            showMultipliers: false,
            showMarkers: false,
            componentsChange: false,
            done: false,
            //
        }
        //this.getExampleCircuit()
        this.getSimulationResults = this.getSimulationResults.bind(this);
        this.updateComponent = this.updateComponent.bind(this);
        this.change_show_legend = this.change_show_legend.bind(this);
        this.change_show_multipliers = this.change_show_multipliers.bind(this);
        this.change_show_markers = this.change_show_markers.bind(this);
    }

    refresh() {
        this.forceUpdate()
    }

    componentDidMount() {
        this.getExampleCircuit()
    }

    getComponent(component_type) {
        if (this.state.circuit !== []) {
            let i = 0;
            while (i < this.state.circuit.components.length && this.state.circuit.components[i].type !== component_type) {
                i++;
            }
            return this.state.circuit.components[i]

        }
        return undefined;
    }

    extractResults(sim) {
        let q = []
        let Vr = []
        let Vc = []
        let E = []
        let I = []
        let result = {}
        if (sim.length > 0) {
            sim.forEach((elem) => {
                let t = isNaN(elem.t) ? 0 : elem.t;
                let q_n = isNaN(elem.q) ? 0 : elem.q;
                let Vr_n = isNaN(elem.Vr) ? 0 : elem.Vr;
                let Vc_n = isNaN(elem.Vc) ? 0 : elem.Vc;
                let E_n = isNaN(elem.E) ? 0 : elem.E;
                let I_n = isNaN(elem.I) ? 0 : elem.I;
                q.push({ "t": t, "q": q_n });
                Vr.push({ "t": t, "Vr": Vr_n });
                Vc.push({ "t": t, "Vc": Vc_n });
                E.push({ "t": t, "E": E_n });
                I.push({ "t": t, "I": I_n });
            });
            result = {
                "q": q,
                "Vr": Vr,
                "Vc": Vc,
                "E": E,
                "I": I
            }
        }
        return result;
    }

    limit_format(num) {
        return num.toExponential(2)
    }

    change_show_legend() {
        let legenCheck = !this.state.showLegend;
        this.setState({
            showLegend: legenCheck
        })
    }

    change_show_multipliers() {
        let multCheck = !this.state.showMultipliers;
        this.setState({
            showMultipliers: multCheck
        })
    }

    change_show_markers() {
        let showMarkers = !this.state.showMarkers;
        this.setState({
            showMarkers: showMarkers
        })
    }

    buildTimeMarkers(time_markers) {
        if (time_markers.length > 0) {
            let result = time_markers.map((t_value) => {
                let alertFunc = function () {
                    alert("OK")
                }
                return ({ 't': t_value, 'label': '', 'click': alertFunc })
            })
            return result;
        }
        return [{}]
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
            if (element.id === componentId) {
                if (element.type === "Switch") {
                    if (element.value === 0) {
                        element.value = 1;
                    } else {
                        element.value = 0;
                    }
                } else {
                    element.value = value;
                }



                element.multiplier = multiplier;
            }
        });
        let ciph_circuit = btoa(JSON.stringify(old_components))
        await fetch(`${process.env.REACT_APP_API_SERVER}/circuit/update?circuit=${ciph_circuit}`)
            .then(result => result.json())
            .then(response => {
                this.setState({
                    circuit: response,
                    done: true
                })
            });
        this.setState({
            componentsChange: true
        })
    }

    async updateColorBands(resistor_value, resistor_multiplier) {
        await fetch(`${process.env.REACT_APP_API_SERVER}/colorBands?resistor_value=${resistor_value}&resistor_multiplier=${resistor_multiplier}`)
            .then(result => result.json())
            .then(response => {
                this.setState({
                    resistor_color_bands: response
                })
            })
    }

    async getExampleCircuit() {
        await fetch(`${process.env.REACT_APP_API_SERVER}/circuit/create/simpleRC`)
            .then(result => result.json())
            .then(response => {
                this.setState({
                    circuit: response,
                    done: true
                })
            })

            .catch(() => console.error("ERROR"))
        let resistor = this.getComponent("Resistor");
        let capacitor = this.getComponent("Capacitor");
        let cell = this.getComponent("Cell");
        let swi = this.getComponent("Switch")
        this.setState({
            resistor_value: resistor.value,
            resistor_multiplier: resistor.multiplier,
            resistor_color_bands: resistor.colorBands,
            capacitor_value: capacitor.value,
            capacitor_multiplier: capacitor.multiplier,
            cell_value: cell.value,
            cell_multiplier: cell.multiplier,
            switch_value: (swi.value === 1) ? "On" : "Off"
        })
    }

    async getSimulationResults() {
        let circuit_components_json = JSON.stringify(this.state.circuit)
        let ciph_circuit = btoa(circuit_components_json)
        await fetch(`${process.env.REACT_APP_API_SERVER}/circuit/sim/simpleRc?circuit=${ciph_circuit}`)
            .then(result => result.json())
            .then(response => {
                this.setState({
                    simulation: response.simulation,
                    simulationQ: this.extractResults(response.simulation).q,
                    simulationI: this.extractResults(response.simulation).I,
                    simulationVr: this.extractResults(response.simulation).Vr,
                    simulationVc: this.extractResults(response.simulation).Vc,
                    simulationE: this.extractResults(response.simulation).E,
                    qmax: response.limits.qmax,
                    emax: response.limits.emax,
                    Vrmax: response.limits.Vrmax,
                    Vcmax: response.limits.Vcmax,
                    imax: response.limits.imax,
                    RC_time_markers: this.buildTimeMarkers(response.limits.RC_time_markers),
                    componentsChange: false,
                    done: true
                });
            })

            .catch(() => console.error("ERROR"));

    }


    /* *************************************************************** */
    /*                      VISTA                                      */
    /* *************************************************************** */
    render() {
        if (this.state.done) {
            return (

                <div >

                    <div className='row'>
                        <div className='col-6 col-lg-6'>
                            <div className='container'>
                                <div className='row'>
                                    <br></br> <br />
                                    {/*******************************************************/}
                                    {/*                LEFT PANEL                           */}
                                    {/*******************************************************/}
                                    <div className='d-md-flex h-md-100 align-items-center'>
                                        {/***************************************************/}
                                        {/*                 RESULTADOS                      */}
                                        {/***************************************************/}
                                        <div className='col-12 col-lg-12'>
                                            {
                                                (() => {
                                                    if (true) {
                                                        return (
                                                            <div className='row'>
                                                                {/*Q*/}
                                                                <div className='col-6 col-lg-6'>
                                                                    <MetricsGraphics
                                                                        subtitle="Q(t)"
                                                                        data={this.state.simulationQ}
                                                                        x_accessor="t"
                                                                        y_accessor="q"
                                                                        colors="#fcce02"
                                                                        full_width={true}
                                                                        animate_on_load={true}
                                                                        transition_on_update={true}
                                                                        show_rollover_text={this.state.simulation !== undefined && this.state.showLegend}
                                                                        x_label={this.state.simulation !== undefined ? "q(t)" : ""}
                                                                        y_axis={true}
                                                                        xax_count={3}
                                                                        decimals={6}
                                                                        linked={true}
                                                                        yax_tick_length={0}
                                                                        markers={this.state.showMarkers ? this.state.RC_time_markers : []}
                                                                    />
                                                                </div>
                                                                {/*I*/}
                                                                <div className='col-6 col-lg-6'>
                                                                    <MetricsGraphics
                                                                        data={this.state.simulationI}
                                                                        x_accessor="t"
                                                                        y_accessor="I"
                                                                        full_width={true}
                                                                        colors="#0882b2"
                                                                        animate_on_load={true}
                                                                        transition_on_update={true}
                                                                        show_rollover_text={this.state.simulation !== undefined && this.state.showLegend}
                                                                        x_label={this.state.simulation !== undefined ? "I(t)" : ""}
                                                                        y_axis={true}
                                                                        xax_count={3}
                                                                        decimals={6}
                                                                        linked={true}
                                                                        yax_tick_length={0}
                                                                        markers={this.state.showMarkers ? this.state.RC_time_markers : []}
                                                                    />
                                                                </div>
                                                                {/*VR*/}
                                                                <div className='col-6 col-lg-6'>
                                                                    <MetricsGraphics
                                                                        data={this.state.simulationVr}
                                                                        x_accessor="t"
                                                                        y_accessor="Vr"
                                                                        full_width={true}
                                                                        colors="#2ab208"
                                                                        animate_on_load={true}
                                                                        transition_on_update={true}
                                                                        show_rollover_text={this.state.simulation !== undefined && this.state.showLegend}
                                                                        x_label={this.state.simulation !== undefined ? "Vr(t)" : ""}
                                                                        y_axis={true}
                                                                        xax_count={3}
                                                                        decimals={6}
                                                                        linked={true}
                                                                        yax_tick_length={0}
                                                                        markers={this.state.showMarkers ? this.state.RC_time_markers : []}
                                                                    />
                                                                </div>
                                                                {/*VC*/}
                                                                <div className='col-6 col-lg-6'>
                                                                    <MetricsGraphics
                                                                        data={this.state.simulationVc}
                                                                        x_accessor="t"
                                                                        y_accessor="Vc"
                                                                        full_width={true}
                                                                        colors="#e50000"
                                                                        animate_on_load={true}
                                                                        transition_on_update={true}
                                                                        show_rollover_text={this.state.simulation !== undefined && this.state.showLegend}
                                                                        x_label={this.state.simulation !== undefined ? "Vc(t)" : ""}
                                                                        y_axis={true}
                                                                        xax_count={3}
                                                                        decimals={6}
                                                                        linked={true}
                                                                        yax_tick_length={0}
                                                                        markers={this.state.showMarkers ? this.state.RC_time_markers : []}
                                                                    />
                                                                </div>
                                                                {/*E*/}
                                                                <div className='col-6 col-lg-6'>
                                                                    <MetricsGraphics
                                                                        data={this.state.simulationE}
                                                                        x_accessor="t"
                                                                        y_accessor="E"
                                                                        full_width={true}
                                                                        colors="#f47f11"
                                                                        animate_on_load={true}
                                                                        transition_on_update={true}
                                                                        show_rollover_text={this.state.simulation !== undefined && this.state.showLegend}
                                                                        x_label={this.state.simulation !== undefined ? "E(t)" : ""}
                                                                        y_axis={true}
                                                                        xax_count={3}
                                                                        decimals={6}
                                                                        linked={true}
                                                                        yax_tick_length={0}
                                                                        markers={this.state.showMarkers ? this.state.RC_time_markers : []}
                                                                    />
                                                                </div>
                                                                <div className='col-3 col-lg-3'>
                                                                    { /*  OPTIONS  */}
                                                                    <div className='options-box'>
                                                                        <div className="form-check">
                                                                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault1" onChange={this.change_show_legend} />
                                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                                Rollover Info.
                                                                            </label>
                                                                        </div>
                                                                        <div className="form-check">
                                                                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault2" onChange={this.change_show_multipliers} />
                                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                                Multiplicadores
                                                                            </label>
                                                                        </div>
                                                                        <div className="form-check">
                                                                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault3" onChange={this.change_show_markers} />
                                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                                Marcadores const. <Latex >$$\tau$$</Latex>
                                                                            </label>
                                                                        </div>
                                                                        <br />
                                                                        <br />
                                                                        <button type="button" className={this.state.componentsChange ? "btn btn-warning" : "btn btn-success"} onClick={this.getSimulationResults} style={{ "width": "75%" }}>
                                                                            SIM <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-repeat" viewBox="0 0 16 16">
                                                                                <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                                                                                <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" />
                                                                            </svg>
                                                                        </button>
                                                                        <p><strong>Estado: </strong> {this.state.switch_value === "On" ? "Carga" : "Descarga"}</p>
                                                                    </div>
                                                                </div>
                                                                <div className='col-3 col-lg-3'>

                                                                    <div className='limits-text-box'>
                                                                        <p> <strong>Carga máx.</strong> : {this.limit_format(this.state.qmax)} C</p>
                                                                        <p> <strong>Energía máx.</strong> : {this.limit_format(this.state.emax)} J</p>
                                                                        <p><strong>I. máx.</strong> : {this.limit_format(this.state.imax)} A</p>
                                                                        <p><strong>Vc. máx.</strong> : {this.limit_format(this.state.Vcmax)} V</p>
                                                                        <p><strong>Vr. max.</strong> : {this.limit_format(this.state.Vrmax)} V</p>
                                                                        <br />

                                                                    </div>

                                                                </div>
                                                            </div>

                                                        )
                                                    } else {
                                                        return (
                                                            <div>
                                                                <div className='waiting_content_box'>

                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })()
                                            }

                                        </div>
                                    </div>
                                    <div className="w-100 d-none d-md-block"></div>
                                    <div className='row'>
                                        <div className='col-12 col-lg-12'>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-6 col-lg-6 bg-warning'>
                            <br />
                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                <strong>NOTA: </strong>Prueba a modificar los componentes para obtener diferentes resultados.
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>

                        <div className='row'>
                            {/**********************************************************************/}
                            {/*                 CONTROLADOR DE LA RESISTENCIA                      */}
                            {/**********************************************************************/}
                            <div className='col-3 col-lg-3'>
                                <div className='container'>
                                    <div className='row'>
                                        <div className='col-12 col-lg-12'>
                                            <div className='row'>
                                                <div className='col-12 col-lg-12'>
                                                    <input type="range" className="form-range" min="1" max="99" step="0.1"
                                                        onChange={(ev) => {
                                                            this.state.resistor_value = ev.target.value;
                                                            this.updateColorBands(ev.target.value, this.state.resistor_multiplier);
                                                            this.updateComponent("R0", this.state.resistor_value, this.state.resistor_multiplier)
                                                        }}
                                                    />
                                                </div>
                                                <div className='col-12 col-lg-12'>
                                                    <select className="form-select component-value" aria-label="Default select example" onChange={(ev) => {
                                                        this.state.resistor_multiplier = ev.target.value;
                                                        this.updateColorBands(this.state.resistor_value, ev.target.value)
                                                        this.updateComponent("R0", this.state.resistor_value, this.state.resistor_multiplier)
                                                    }} disabled={this.state.showMultipliers === false}>
                                                        <option value="x1">{Number.parseFloat(this.state.resistor_value).toFixed(2)} Ω </option>
                                                        <option value="x0.1">{Number.parseFloat(this.state.resistor_value * 0.1).toFixed(2)} Ω</option>
                                                        <option value="x10">{Number.parseFloat(this.state.resistor_value * 10).toFixed(2)} Ω</option>
                                                        <option value="x100">{Number.parseFloat(this.state.resistor_value * 100).toFixed(2)} Ω</option>
                                                    </select>
                                                </div>
                                                <div className='col-12 col-lg-12'>
                                                    <div className='resistor-box'>
                                                        <div className='resistor-band-1' style={{ "background": this.state.resistor_color_bands[0] }}></div>
                                                        <div className='resistor-band-2' style={{ "background": this.state.resistor_color_bands[1] }}></div>
                                                        <div className='resistor-band-3' style={{ "background": this.state.resistor_color_bands[2] }}></div>
                                                        <div className='resistor-band-4' style={{ "background": this.state.resistor_color_bands[3] }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/**********************************************************************/}
                            {/*                 CONTROLADOR DEL CONDENSADOR                        */}
                            {/**********************************************************************/}
                            <div className='col-3 col-lg-3'>

                                <div className='row'>
                                    <div className='col-12 col-lg-12'>
                                        <div className='row justify-content-center'>
                                            <div className='col-12 col-lg-12'>
                                                <input type="range" className="form-range" min="1" max="99" step="0.1"
                                                    onChange={(ev) => {
                                                        this.state.capacitor_value = ev.target.value;
                                                        this.updateComponent("C0", this.state.capacitor_value, this.state.capacitor_multiplier)
                                                    }}
                                                />
                                            </div>
                                            <div className='col-12 col-lg-12'>
                                                <select className="form-select component-value" aria-label="Default select example" onChange={(ev) => {
                                                    this.state.capacitor_multiplier = ev.target.value;
                                                    this.updateComponent("C0", this.state.capacitor_value, this.state.capacitor_multiplier)
                                                }} disabled={this.state.showMultipliers === false}>
                                                    <option value="nanoF">{this.state.capacitor_value} nanoF</option>
                                                    <option value="microF">{this.state.capacitor_value} microF</option>
                                                    <option value="miliF">{this.state.capacitor_value} miliF</option>
                                                </select>

                                            </div>
                                            <div className='col-12 col-lg-12'>
                                                <div className={this.state.switch_value === "On" ? "capacitorOnCharge" : "capacitorOnDisCharge"}></div>
                                            </div>
                                        </div>
                                        <div className="w-100 d-none d-md-block"></div>

                                    </div>
                                </div>
                            </div>
                            {/**********************************************************************/}
                            {/*                 CONTROLADOR DE LA FUENTE                           */}
                            {/**********************************************************************/}
                            <div className='col-3 col-lg-3'>
                                <div className='row'>
                                    <div className='col-12 col-lg-12'>
                                        <input type="range" className="form-range" min="1" max="99" step="0.1"
                                            onChange={(ev) => {
                                                this.state.cell_value = ev.target.value;
                                                this.updateComponent("V0", this.state.cell_value, this.state.cell_multiplier)
                                            }}
                                        />
                                    </div>
                                    <div className='col-12 col-lg-12'>
                                        <select className="form-select component-value" aria-label="Default select example" onChange={(ev) => {
                                            this.state.cell_multiplier = ev.target.value;
                                            this.updateComponent("V0", this.state.cell_value, this.state.cell_multiplier)
                                        }} disabled={this.state.showMultipliers === false}>
                                            <option value="V">{this.state.cell_value} V</option>
                                            <option value="microV">{this.state.cell_value} microV</option>
                                            <option value="miliV">{this.state.cell_value} miliV</option>
                                        </select>
                                        <div className='cell-box'>
                                            <div className='cell-box-shadow'>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            {/**********************************************************************/}
                            {/*                 CONTROLADOR DEL INTERRUPTOR                        */}
                            {/**********************************************************************/}
                            <div className='col-3 col-lg-3'>
                                <div className='row'>
                                    <div className='col-12 col-lg-12'>
                                        <div className='row'>
                                            <div className='col-12 col-lg-12'>
                                                <label className="switch">
                                                    <input type="checkbox" onClick={(ev) => {
                                                        if (this.state.switch_value === "On") {
                                                            this.state.switch_value = "Off"
                                                        } else {
                                                            this.state.switch_value = "On"
                                                        }
                                                        this.updateComponent("S0", this.state.switch_value === "On" ? 1 : 0, "*")
                                                    }} />
                                                    <span className="slider"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <ErrorComponent err_type="CIRCUIT_NOT_FOUND"></ErrorComponent>
                </div>

            )
        }
    }
}

export default SimpleRC;
