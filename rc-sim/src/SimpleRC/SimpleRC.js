import React, { Component } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import './SimpleRC.css'
import './Resistor/ResistorCSS.css'
import './Capacitor/CapacitorCSS.css'
import './Cell/CellCSS.css'


import { MAX_DATA, SIMULATION_SPEED } from "../Utils/Utils";
import { getChargeInstant, getDischargeInstant } from "../Utils/RCFormulas";
import { Row, Col, Container } from "react-bootstrap";
// resistor functions
import { calculateColorBands, valueOfMultiplier } from "./Resistor/Resistor";
import { getCapacitorMult } from "./Capacitor/CapacitorData";
import { getCellMultiplier } from "./Cell/Cell";



var timeInterval = SIMULATION_SPEED; //time interval ms
var simulationSpeed = 1;

export default class SimpleRC extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //time controller
            t_i: 0,
            //data arrays
            q_data: [],
            i_data: [],
            vc_data: [],
            vr_data: [],
            e_data: [],
            //components value
            C: 0,
            R: 0,
            V: 0,
            q_0: 0,
            //others
            R_v: 0,
            R_m: 1,
            R_color_bands: [],
            C_v: 0,
            C_m: 1,
            V_v: 0,
            V_m: 1,
            //circuit state
            capacitorCharging: true,
            data_length: 0,
            //simulation state
            running: false,
            //time interval Id
            intervalId: 0,
            lineCharts: []

        }

        this.updateCharging = this.updateCharging.bind(this);
        this.updateRunning = this.updateRunning.bind(this);
    }

    /**
     * Método utilizado para la actualización de los datos a lo 
     * largo de la simulación. Para ello, se hace uso de la función predefinida
     * de setInterval, y obtener datos y mostrarlos cada cierto tiempo
     */
    componentDidMount() {
        const newInterval = setInterval(() => {

            this.updateMaxValues();
            if (this.state.running) {
                let oldQData = this.state.q_data;
                let oldIData = this.state.i_data;
                let oldEData = this.state.e_data;
                let oldVrData = this.state.vr_data;
                let oldVcData = this.state.vc_data;

                // shift
                if (this.state.data_length >= MAX_DATA) {
                    oldQData.shift();
                    oldIData.shift();
                    oldEData.shift();
                    oldVrData.shift();
                    oldVcData.shift();
                }
                let t_i = this.state.t_i;
                //new values
                let instant_values = this.state.capacitorCharging ? getChargeInstant(t_i, this.state.q_0, this.state.V, this.state.C, this.state.R) :
                    getDischargeInstant(t_i, this.state.q_0, this.state.V, this.state.C, this.state.R);
                this.setState(prevState => {

                    return {
                        ...prevState,
                        q_data: [...oldQData, { "t": t_i, "Q(t)": instant_values.Q }],
                        i_data: [...oldIData, { "t": t_i, "I(t)": instant_values.I }],
                        vr_data: [...oldVrData, { "t": t_i, "Vr(t)": instant_values.Vr }],
                        vc_data: [...oldVcData, { "t": t_i, "Vc(t)": instant_values.Vc }],
                        e_data: [...oldEData, { "t": t_i, "E(t)": instant_values.E }],
                        //time update
                        t_i: t_i + timeInterval / 1000,

                        //current capacitor charge update
                        q_0: instant_values.Q,
                        //data length update
                        data_length: prevState.data_length + 1

                    }
                });
            }
            this.render()

        }, timeInterval);


        //update time interval id
        this.setState(prevState => {
            return {
                ...prevState,
                intervalId: newInterval
            }
        });
    }

    /**
     * Método usado para terminar la ejecución del time interval
     */
    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    updateCharging() {
        this.setState(prevState => {
            return {
                ...prevState,
                capacitorCharging: !prevState.capacitorCharging,
                t_i: 0,
                q_data: [],
                i_data: [],
                vr_data: [],
                vc_data: [],
                e_data: [],
                data_length: 0

            }
        })
    }

    updateRunning() {
        this.setState(prevState => {
            return {
                ...prevState,
                running: !prevState.running,
            }
        });

    }

    updateMaxValues() {
        this.setState(prevState => {
            return {
                ...prevState,
                q_max: prevState.C * prevState.V,
                i_max: prevState.V / prevState.R,
                vc_max: prevState.V,
                vr_max: prevState.V,
                e_max: (1 / 2) * prevState.C * Math.pow(prevState.V, 2)
            }
        });
    }

    resetDataArray() {
        this.setState({
            q_data: [],
            i_data: [],
            vc_data: [],
            vr_data: [],
            e_data: [],
            data_length: 0,
            t_i: 0
        })
    }

    /** RESISTOR CONTROLLER */
    updateResistorValue(value) {
        this.setState({
            R_v: parseFloat(value),
            R: parseFloat(value) * this.state.R_m,
        });
        this.resetDataArray();
        this.updateMaxValues();
    }

    updateResistorMultiplier(multiplier) {

        this.setState({
            R_m: valueOfMultiplier(multiplier),
            R: this.state.R_v * valueOfMultiplier(multiplier)
        });
        this.resetDataArray();
        this.updateMaxValues();

    }

    updateColorBands(value, multiplier) {
        this.setState({
            R_color_bands: calculateColorBands(parseFloat(value), multiplier)
        });
        this.resetDataArray();
        this.updateMaxValues();

    }

    updateCapacitorMultiplier(multiplier) {
        this.setState({
            C_m: getCapacitorMult(multiplier),
            C: parseFloat(this.state.C_v) * getCapacitorMult(multiplier)
        });
        this.resetDataArray();
        this.updateMaxValues();
    }

    updateCapacitorValue(value) {
        this.setState({
            C_v: parseFloat(value),
            C: parseFloat(value) * this.state.C_m
        });
        this.resetDataArray();
        this.updateMaxValues();
    }


    updateCellValue(value) {
        this.setState({
            V_v: parseFloat(value),
            V: parseFloat(value) * this.state.C_m
        });
        this.resetDataArray();
        this.updateMaxValues();
    }

    updateCellMultiplier(multiplier) {
        this.setState({
            V_m: getCellMultiplier(multiplier),
            V: parseFloat(this.state.V_v) * getCellMultiplier(multiplier)
        });
        this.resetDataArray();
        this.updateMaxValues();

    }


    render() {

        return (

            <div >
                {/* UP ROW */}
                <Row>
                    {/* DATA CHARTS */}
                    <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} >
                        <Row className="d-flex p-15">
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                <div style={{
                                    paddingBottom: '56.25%', /* 16:9 */
                                    position: 'relative',
                                    height: 0
                                }} >
                                    <div style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        width: '100%',
                                        height: '100%'
                                    }}>
                                        <ResponsiveContainer width="100%" height="98%">
                                            <LineChart
                                                width={400}
                                                height={250}
                                                data={this.state.q_data}
                                                margin={{
                                                    top: 5,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                                key="q_t"
                                            >
                                                <CartesianGrid strokeDasharray="3 3 3 3" />
                                                <XAxis dataKey="t" tick={false} />
                                                <YAxis type="number" tick={true} interval={0} />

                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="Q(t)" stroke="orange" strokeWidth={3} dot={false} isAnimationActive={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>


                            </Col>

                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                <div style={{
                                    paddingBottom: '56.25%', /* 16:9 */
                                    position: 'relative',
                                    height: 0
                                }} >
                                    <div style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        width: '100%',
                                        height: '100%'
                                    }}>
                                        <ResponsiveContainer width="100%" height="98%">
                                            <LineChart
                                                width={400}
                                                height={250}
                                                data={this.state.i_data}
                                                margin={{
                                                    top: 5,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}

                                            >
                                                <CartesianGrid strokeDasharray="0" />
                                                <XAxis dataKey="t" tick={false} />
                                                <YAxis type="number" />

                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="I(t)" stroke="blue" strokeWidth={3} dot={false} isAnimationActive={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>


                            </Col>
                        </Row>

                        <Row>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                <div style={{
                                    paddingBottom: '56.25%', /* 16:9 */
                                    position: 'relative',
                                    height: 0
                                }} >
                                    <div style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        width: '100%',
                                        height: '100%'
                                    }}>
                                        <ResponsiveContainer width="100%" height="98%">
                                            <LineChart
                                                width={400}
                                                height={250}
                                                data={this.state.vc_data}
                                                margin={{
                                                    top: 5,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="0" />
                                                <XAxis dataKey="t" tick={false} />
                                                <YAxis type="number" />

                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="Vc(t)" stroke="green" strokeWidth={3} dot={false} isAnimationActive={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>

                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                <div style={{
                                    paddingBottom: '56.25%', /* 16:9 */
                                    position: 'relative',
                                    height: 0
                                }} >
                                    <div style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        width: '100%',
                                        height: '100%'
                                    }}>
                                        <ResponsiveContainer width="100%" height="98%">
                                            <LineChart
                                                width={400}
                                                height={250}
                                                data={this.state.vr_data}
                                                margin={{
                                                    top: 5,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="0" />
                                                <XAxis dataKey="t" tick={false} />
                                                <YAxis type="number" />

                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="Vr(t)" stroke="#eb3474" strokeWidth={3} dot={false} isAnimationActive={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>

                        </Row>

                        <Row>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                <div style={{
                                    paddingBottom: '56.25%', /* 16:9 */
                                    position: 'relative',
                                    height: 0
                                }} >
                                    <div style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        width: '100%',
                                        height: '100%'
                                    }}>
                                        <ResponsiveContainer width="100%" height="98%">
                                            <LineChart
                                                width={400}
                                                height={250}
                                                data={this.state.e_data}
                                                margin={{
                                                    top: 5,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="0" />
                                                <XAxis dataKey="t" tick={false} />
                                                <YAxis type="number" />

                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="E(t)" stroke="red" strokeWidth={3} dot={false} isAnimationActive={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col >

                            {/* BUTTONS CONTROLLER */}
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                <button onClick={this.updateRunning}>{this.state.running ? "STOP" : "RESUME"}</button>
                                <button onClick={this.updateCharging}>{this.state.capacitorCharging ? "DISCHARGE" : "CHARGE"}</button>.

                                <p>Q: {this.state.q_0}</p>
                            </Col>
                        </Row>
                    </Col>

                    {/* CIRCUIT ANIMATION */}
                    <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                        <div className="square"></div>
                    </Col>
                </Row>
                {/* CONTROLLERS ROW */}
                <Row className="justify-content-md-center"> 
                    {/* Capacitor controller */}
                    <Col xs={3} sm={3} md={3} lg={3} xl={3} xxl={3}>
                            <Row>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                    <Row>
                                        <Col sm={12} md={12} lg={12} xl={12} xxl={12}>
                                            <input type="range" className="form-range" min="0" max="99" step="0.1"
                                                onChange={(ev) => {
                                                    this.updateCapacitorValue(ev.target.value);

                                                }}
                                            />
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                            <select className="form-select component-value" aria-label="Default select example" onChange={(ev) => {
                                                this.updateCapacitorMultiplier(ev.target.value)
                                            }} disabled={this.state.showMultipliers === false}>
                                                <option defaultValue={true} value="F">{this.state.C_v} F </option>
                                                <option value="nanoF">{this.state.C_v} nanoF</option>
                                                <option value="microF">{this.state.C_v} microF</option>
                                                <option value="miliF">{this.state.C_v} miliF</option>
                                            </select>
                                            {
                                                (() => {
                                                    if (this.state.running) {
                                                        return (
                                                            <div className={this.state.capacitorCharging ? "capacitorOnCharge" : "capacitorOnDisCharge"}></div>
                                                        )
                                                    }
                                                })()
                                            }

                                        </Col>
                                       

                                    </Row>
                                </Col>
                            </Row>
                    </Col>

                    {/* Resistor controller */}
                    <Col xs={3} sm={3} md={3} lg={3} xl={3} xxl={3}>
                            <Row>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                    <Row>
                                        <Col sm={12} md={12} lg={12} xl={12} xxl={12}>
                                            <input type="range" className="form-range" min="0" max="99" step="0.1"
                                                onChange={(ev) => {
                                                    this.updateResistorValue(ev.target.value);
                                                    this.updateColorBands(this.state.R_v, this.state.R_m);
                                                }}
                                            />
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                            <select className="form-select component-value" aria-label="Default select example" onChange={(ev) => {
                                                this.updateResistorMultiplier(ev.target.value)
                                                this.updateColorBands(this.state.R_v, this.state.R_m)
                                            }} disabled={this.state.showMultipliers === false}>
                                                <option defaultValue={true} value="x1">{Number.parseFloat(this.state.R_v).toFixed(2)} Ω </option>
                                                <option value="x0.1">{Number.parseFloat(this.state.R_v * 0.1).toFixed(2)} Ω</option>
                                                <option value="x10">{Number.parseFloat(this.state.R_v * 10).toFixed(2)} Ω</option>
                                                <option value="x100">{Number.parseFloat(this.state.R_v * 100).toFixed(2)} Ω</option>
                                            </select>

                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                            <div className='resistor-box'>
                                                <div className='resistor-band-1' style={{ "background": this.state.R_color_bands[0] }}></div>
                                                <div className='resistor-band-2' style={{ "background": this.state.R_color_bands[1] }}></div>
                                                <div className='resistor-band-3' style={{ "background": this.state.R_color_bands[2] }}></div>
                                                <div className='resistor-band-4' style={{ "background": this.state.R_color_bands[3] }}></div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                    </Col>

                    {/* Cell controller */}
                    <Col xs={3} sm={3} md={3} lg={3} xl={3} xxl={3}>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                <input type="range" className="form-range" min="1" max="99" step="0.1"
                                    onChange={(ev) => {
                                        this.updateCellValue(ev.target.value)
                                    }}
                                />
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                <select className="form-select component-value" aria-label="Default select example" onChange={(ev) => {
                                    this.updateCellMultiplier(ev.target.value)
                                }} disabled={this.state.showMultipliers === false}>
                                    <option value="V">{this.state.V_v} V</option>
                                    <option value="microV">{this.state.V_v} microV</option>
                                    <option value="miliV">{this.state.V_v} miliV</option>
                                </select>
                                <div className='cell-box'>
                                            <div className='cell-box-shadow'>
                                            </div>
                                        </div>
                            </Col>
                        </Row>
                    </Col>


                    {/* Switch controller */}
                    <Col>
                    </Col>
                </Row>
            </div>
        )
    }
}