import React, { Component } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import './SimpleRC.css'
import './Resistor/ResistorCSS.css'
import './Capacitor/CapacitorCSS.css'
import './Cell/CellCSS.css'
import './ToogleSwitch/ToogleSwitch.css'


import { EXACT_TIME, MAX_DATA, PERCENT_Q, QUESTION_ICON, SIMULATION_EXEC, SIMULATION_STEP, WITHOUT_RESTRICTIONS } from "../Utils/Utils";
import { getChargeInstant, getDischargeInstant } from "../Utils/RCFormulas";
import { Row, Col, Container, Alert, Button, OverlayTrigger, Form, Tooltip as ToolTipReact, FormControl } from "react-bootstrap";




// resistor functions
import { calculateColorBands, valueOfMultiplier } from "./Resistor/Resistor";
import { getCapacitorMult } from "./Capacitor/CapacitorData";
import { getCellMultiplier } from "./Cell/Cell";

//capacitor on charge animations
import rc_charge_0_63 from "../assets/animations/rc-charge/rc_charge_0_63.gif";
import rc_charge_63_80 from "../assets/animations/rc-charge/rc_charge_63_80.gif";
import rc_charge_80_90 from "../assets/animations/rc-charge/rc_charge_80_90.gif";
import rc_charge_90_99 from "../assets/animations/rc-charge/rc_charge_90_99.gif";
import rc_charge_100 from "../assets/animations/rc-charge/rc_charge_100.png";
import rc_charge_background from "../assets/animations/rc-charge/rc_charge_background.png";

//capacitor on discharge animations
import rc_discharge_0_63 from "../assets/animations/rc-discharge/rc_discharge_0_63.gif";
import rc_discharge_63_80 from "../assets/animations/rc-discharge/rc_discharge_63_80.gif";
import rc_discharge_80_90 from "../assets/animations/rc-discharge/rc_discharge_80_90.gif";
import rc_discharge_90_99 from "../assets/animations/rc-discharge/rc_discharge_90_99.gif";
import rc_discharge_100 from "../assets/animations/rc-discharge/rc_discharge_100.png";
import rc_discharge_background from "../assets/animations/rc-discharge/rc_discharge_background.png";


export default class SimpleRC extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //time controller
            t_i: 0,
            //stop conditions
            selected_stop_condition: WITHOUT_RESTRICTIONS,
            value_stop_condition: undefined,
            condition_complete: false,
            //precision multiplier
            simulation_step_multiplier: 1,
            //data arrays
            q_data: [],
            i_data: [],
            vc_data: [],
            vr_data: [],
            e_data: [],
            //components value
            C: 10,
            R: 3,
            V: 5,
            q_0: 0,
            //others
            R_v: 3,
            R_m: 1,
            R_color_bands: [],
            C_v: 10,
            C_m: 1,
            V_v: 5,
            V_m: 1,
            //carga maxima
            q_max: 10 * 5,
            q_percent: 0,
            //circuit state
            capacitorCharging: true,
            data_length: 0,
            //simulation state
            running: true,
            //time interval Id
            intervalId: 0,
            //reset on component change
            reset_on_component_change: false
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
        this.updateColorBands(this.state.R_v, this.state.R_m)
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
                let instant_values = this.state.capacitorCharging ? getChargeInstant(t_i, this.state.q_max, this.state.V, this.state.C, this.state.R) :
                    getDischargeInstant(t_i, this.state.q_max, this.state.V, this.state.C, this.state.R);

                //condiciones más restrictivas
                if (this.state.value_stop_condition !== undefined) {
                    if ((this.state.selected_stop_condition === PERCENT_Q && this.state.capacitorCharging && this.state.value_stop_condition >= 100) ||
                        this.state.selected_stop_condition === PERCENT_Q && !this.state.capacitorCharging && this.state.value_stop_condition <= 0) {
                        this.updateConditionValue(100);
                        this.updateConditionState(true);

                    } else if ((this.state.selected_stop_condition === PERCENT_Q && this.state.capacitorCharging && this.state.value_stop_condition <= this.state.q_percent) ||
                        (this.state.selected_stop_condition === PERCENT_Q && !this.state.capacitorCharging && this.state.value_stop_condition >= this.state.q_percent)) {
                        this.updateRunning();
                        this.updateConditionState(true);
                    } else if (this.state.selected_stop_condition === EXACT_TIME && this.state.value_stop_condition <= t_i) {
                        this.updateRunning();
                        this.updateConditionState(true);
                    } else {
                        this.updateConditionState(false);
                    }
                }


                if (!this.state.condition_complete) {
                    this.setState(prevState => {

                        return {
                            ...prevState,
                            q_data: [...oldQData, { "t": t_i, "Q(t)": instant_values.Q }],
                            i_data: [...oldIData, { "t": t_i, "I(t)": instant_values.I }],
                            vr_data: [...oldVrData, { "t": t_i, "Vr(t)": instant_values.Vr }],
                            vc_data: [...oldVcData, { "t": t_i, "Vc(t)": instant_values.Vc }],
                            e_data: [...oldEData, { "t": t_i, "E(t)": instant_values.E }],
                            //time update
                            t_i: t_i + ((SIMULATION_STEP * prevState.simulation_step_multiplier) / 1000),

                            //current capacitor charge update
                            q_0: instant_values.Q,
                            q_percent: Number.parseFloat((instant_values.Q / prevState.q_max) * 100).toFixed(2),
                            //data length update
                            data_length: prevState.data_length + 1

                        }
                    });
                }



                if (this.state.capacitorCharging && this.state.q_percent == 100 && this.state.q_0 == this.state.q_max) {
                    this.updateRunning();
                }

                if (!this.state.capacitorCharging && this.state.q_percent == 0 && this.state.q_0 == 0) {
                    this.updateRunning();
                }
            }


        }, SIMULATION_EXEC);


        //update time interval id
        this.setState(prevState => {
            return {
                ...prevState,
                intervalId: newInterval,
            }
        });
    }

    /**
     * Método usado para terminar la ejecución del time interval
     */
    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    /**
     * Función que muestra la animación correspondiente, dependiendo del porcentaje de carga del condensador así como 
     * del estado del circuito
     * @returns img_src : undefined
     */
    getCurrentAnimation() {

        switch (this.state.capacitorCharging) {

            case true:
                if (!this.state.running) {
                    return rc_charge_background;
                }

                if (this.state.q_percent == 100) {
                    return rc_charge_100;
                }

                if (this.state.q_percent <= 63.2) {
                    return rc_charge_0_63;
                } else if (this.state.q_percent > 63.2 && this.state.q_percent <= 80) {
                    return rc_charge_63_80;
                } else if (this.state.q_percent > 80 && this.state.q_percent <= 90) {
                    return rc_charge_80_90;
                } else if (this.state.q_percent > 90 && this.state.q_percent < 100) {
                    return rc_charge_90_99;
                }
                break;
            default:

                if (!this.state.running) {
                    return rc_discharge_background;
                }
                if (this.state.q_percent == 100 || !this.state.running) {
                    return rc_discharge_100;
                }

                if (this.state.q_percent <= 10) {
                    return rc_discharge_90_99;
                } else if (this.state.q_percent > 10 && this.state.q_percent <= 20) {
                    return rc_discharge_80_90;
                } else if (this.state.q_percent > 20 && this.state.q_percent <= 37.7) {
                    return rc_discharge_63_80;
                } else if (this.state.q_percent > 37.7 && this.state.q_percent < 100) {
                    return rc_discharge_0_63;
                }
                break;
        }
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
                data_length: 0,
                running: false,
                q_percent: !prevState.capacitorCharging ? 0 : 100

            }
        })
    }

    /**
     * Método que indica si ha sido cambiada alguna condición de parada del circuito
     * @param {*} cState 
     */
    updateConditionState(cState) {
        this.setState(prevState => {
            return {
                ...prevState,
                condition_complete: cState
            }
        });
    }

    /**
     * Método utilizado para alternar entre "pause" y "resume" del circuito.
     */
    updateRunning() {
        if (!this.state.condition_complete) {
            this.setState(prevState => {
                return {
                    ...prevState,
                    running: !this.state.running,
                    condition_complete: false,
                }
            });
        }
    }

    /**
     * Método usado para actualizar los valores máximos que pueden obtener cada uno de los parámetros a 
     * estudiar.
     */
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

    /**
     * Método encargado de actualizar la condición de parada de la simulación
     * @param {*} nCondition 
     */
    updateSelectedCondition(nCondition) {
        this.setState(prevState => {
            return {
                ...prevState,
                selected_stop_condition: nCondition
            }
        });
    }

    /**
     * Método encargado de actualizar el valor de la condición de parada de la simulación
     * @param {*} nConditionValue 
     */
    updateConditionValue(nConditionValue) {
        this.setState(prevState => {
            return {
                ...prevState,
                value_stop_condition: nConditionValue
            }

        })
    }

    updateResetData() {
        this.setState(prevState => {
            return {
                ...prevState,
                reset_on_component_change: !prevState.reset_on_component_change
            }
        })
    }

    /**
     * RELOAD
     */
    resetDataArray() {
        this.setState(prevState => {
            return {
                ...prevState,
                q_data: [],
                i_data: [],
                vc_data: [],
                vr_data: [],
                e_data: [],
                data_length: 0,
                t_i: 0,
                running: true,
                q_percent: this.state.capacitorCharging ? 0 : 100,
                condition_complete: false
            }
        });
    }

    /**
     * Cambiar precisión de la simulación
     * @param {*} multiplier 
     */
    updateSimulationStepMultiplier(multiplier) {
        this.setState(prevState => {
            return {
                ...prevState,
                simulation_step_multiplier: multiplier
            }
        });
        if (this.state.reset_on_component_change)
            this.resetDataArray();
        this.updateMaxValues();
    }

    /** RESISTOR CONTROLLER */
    updateResistorValue(value) {
        this.setState(prevState => {
            return {
                ...prevState,
                R_v: parseFloat(value),
                R: parseFloat(value) * prevState.R_m
            }
        })

        if (this.state.reset_on_component_change)
            this.resetDataArray();
        this.updateMaxValues();

    }

    updateResistorMultiplier(multiplier) {
        this.setState(prevState => {
            return {
                ...prevState,
                R_m: valueOfMultiplier(multiplier),
                R: prevState.R_v * valueOfMultiplier(multiplier)
            }
        })
        if (this.state.reset_on_component_change)
            this.resetDataArray();
        this.updateMaxValues();

    }

    updateColorBands(value, multiplier) {
        this.setState({
            R_color_bands: calculateColorBands(parseFloat(value), multiplier)
        });
        if (this.state.reset_on_component_change)
            this.resetDataArray();
        this.updateMaxValues();

    }

    /** CAPACITOR CONTROLLER */
    updateCapacitorMultiplier(multiplier) {
        this.setState(prevState => {
            return {
                ...prevState,
                C_m: getCapacitorMult(multiplier),
                C: prevState.C_v * getCapacitorMult(multiplier)
            }
        })

        if (this.state.reset_on_component_change)
            this.resetDataArray();
        this.updateMaxValues();
    }

    updateCapacitorValue(value) {
        this.setState(prevState => {
            return {
                ...prevState,
                C_v: parseFloat(value),
                C: parseFloat(value) * prevState.C_m
            }
        })
        if (this.state.reset_on_component_change)
            this.resetDataArray();
        this.updateMaxValues();
    }


    /** CELL CONTROLLER */
    updateCellValue(value) {
        this.setState(prevState => {
            return {
                ...prevState,
                V_v: parseFloat(value),
                V: parseFloat(value) * prevState.C_m
            }
        })

        if (this.state.reset_on_component_change)
            this.resetDataArray();
        this.updateMaxValues();
    }

    updateCellMultiplier(multiplier) {
        this.setState(prevState => {
            return {
                ...prevState,
                V_m: getCellMultiplier(multiplier),
                V: prevState.V_v * getCellMultiplier(multiplier)
            }
        })
        if (this.state.reset_on_component_change)
            this.resetDataArray();
        this.updateMaxValues();

    }


    render() {
        return (

            <div style={{ "paddingLeft": "1%", "paddingRight": "1%" }}>
                {/* UP ROW */}
                <Row>
                    {/* DATA CHARTS */}
                    <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} >
                        <Row className="d-flex p-15">
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                <div style={{
                                    paddingBottom: '50%', /* 16:9 */
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
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="t" tick={false} />
                                                <YAxis type="number" tick={true} />

                                                <Tooltip />
                                                <Legend verticalAlign="top" align="right" iconType="circle" margin={{ top: 0, left: 0, right: 0, bottom: 10 }} />
                                                <Line type="monotone" dataKey="Q(t)" stroke="orange" strokeWidth={3} dot={false} isAnimationActive={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>


                            </Col>

                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                <div style={{
                                    paddingBottom: '50%', /* 16:9 */
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
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="t" tick={false} />
                                                <YAxis type="number" />

                                                <Tooltip />
                                                <Legend verticalAlign="top" align="right" iconType="circle" margin={{ top: 0, left: 0, right: 0, bottom: 10 }} />
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
                                    paddingBottom: '50%', /* 16:9 */
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
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="t" tick={false} />
                                                <YAxis type="number" />

                                                <Tooltip />
                                                <Legend verticalAlign="top" align="right" iconType="circle" margin={{ top: 0, left: 0, right: 0, bottom: 10 }} />
                                                <Line type="monotone" dataKey="Vc(t)" stroke="green" strokeWidth={3} dot={false} isAnimationActive={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>

                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                <div style={{
                                    paddingBottom: '50%', /* 16:9 */
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
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="t" tick={false} />
                                                <YAxis type="number" />

                                                <Tooltip />
                                                <Legend verticalAlign="top" align="right" iconType="circle" margin={{ top: 0, left: 0, right: 0, bottom: 10 }} />
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
                                    paddingBottom: '50%', /* 16:9 */
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
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="t" tick={false} />
                                                <YAxis type="number" />

                                                <Tooltip />
                                                <Legend verticalAlign="top" align="right" iconType="circle" margin={{ top: 0, left: 0, right: 0, bottom: 10 }} />
                                                <Line type="monotone" dataKey="E(t)" stroke="red" strokeWidth={3} dot={false} isAnimationActive={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>

                            {/* BUTTONS CONTROLLER */}
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>



                                <Row>
                                    <strong style={{ "textAlign": "left" }}>
                                        <OverlayTrigger
                                            key="top"
                                            placement="top"
                                            overlay={
                                                <ToolTipReact id={`tooltip-top-3`}>
                                                    Los resultados obtenidos dependerán de la <strong>precisión</strong> utilizada.
                                                </ToolTipReact>
                                            }>

                                            {QUESTION_ICON}

                                        </OverlayTrigger> Condiciones de parada (aprox.): </strong>
                                    <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                        <Form.Select onChange={(ev) => {
                                            this.updateSelectedCondition(ev.target.value);
                                            this.updateConditionState(false);
                                        }} disabled={this.state.running}>
                                            <option defaultValue={true} value={WITHOUT_RESTRICTIONS}>Ninguna</option>
                                            <option value={PERCENT_Q}>Porcentaje de carga</option>
                                            <option value={EXACT_TIME}>Tiempo de simulación (s)</option>
                                        </Form.Select>

                                    </Col>

                                    <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}>
                                        <FormControl type="number" disabled={this.state.selected_stop_condition === WITHOUT_RESTRICTIONS || this.state.running}
                                            min={
                                                this.state.capacitorCharging ? (this.state.selected_stop_condition === PERCENT_Q ? (Number.parseFloat(this.state.q_percent)) : (this.state.selected_stop_condition === EXACT_TIME ? this.state.t_i : "")) : 0}
                                            max={this.state.capacitorCharging ? (this.state.selected_stop_condition === PERCENT_Q ? 100 : (this.state.selected_stop_condition === EXACT_TIME ? "" : "")) : (Number.parseFloat(this.state.q_percent))
                                            }
                                            onChange={(ev) => {
                                                this.updateConditionState(false);
                                                let nVal = this.state.selected_stop_condition === PERCENT_Q ? Number.parseFloat(ev.target.value) : (this.state.selected_stop_condition === EXACT_TIME ? (Number.parseFloat(ev.target.value) * 1000) : undefined);
                                                this.updateConditionValue(Number.parseFloat(ev.target.value));
                                            }}></FormControl>
                                    </Col>
                                </Row>
                                <br></br>
                                <br></br>
                                <Row>
                                    <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}>
                                        <strong>Precisión:</strong>
                                        <Form>
                                            <Form.Select onChange={(ev) => { this.updateSimulationStepMultiplier(parseFloat(ev.target.value)) }}>
                                                <option defaultValue={true} value="1">Normal</option>
                                                <option value="100">Demasiado baja</option>
                                                <option value="10">Muy baja</option>
                                                <option value="5">Baja</option>
                                                <option value="0.05">Alta</option>
                                                <option value="0.001">Muy alta</option>
                                                <option value="0.000001">Demasiado alta</option>
                                            </Form.Select>
                                        </Form>

                                    </Col>
                                    <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}>
                                    </Col>
                                    <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}>
                                        
                                    </Col>
                                </Row>
                                <br></br>
                                <Row>
                                    <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}>
                                        {/* RUN/STOP BUTTON */}
                                        <div className="d-grid gap-2">
                                            <Button variant={this.state.running ? "danger" : "outline-warning"} onClick={this.updateRunning} size="xs" >{this.state.running ? "STOP" : "RESUME"}</Button>
                                        </div>
                                    </Col>

                                    <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}>
                                        {/* RELOAD BUTTON */}
                                        <div className="d-grid gap-2">
                                            <Button variant={"outline-info"} onClick={(ev) => {
                                                this.resetDataArray();
                                                this.updateMaxValues();
                                            }} size="xs" >RELOAD</Button>
                                        </div>

                                    </Col>
                                </Row>


                            </Col>
                        </Row>
                    </Col>

                    {/* CIRCUIT ANIMATION */}
                    <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                        <img src={this.getCurrentAnimation()} className="w-100"></img>
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
                                        <input type="range" className="form-range" min="1" max="99" step="0.1"
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

                                    </Col>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <div className={this.state.running ? "charge" : (this.state.q_percent == 0 ? "charge_discharge_complete" : "charge_charge_complete")} style={{ "background": this.state.capacitorCharging ? "#569c02" : "#c94f1e" }}>
                                            <p className="percent_charge">{this.state.q_percent}%</p>
                                        </div>

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
                                    <Container>
                                        <Row>
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <div className='resistor-box'>
                                                    <div className='resistor-band-1' style={{ "background": this.state.R_color_bands[0] }}></div>
                                                    <div className='resistor-band-2' style={{ "background": this.state.R_color_bands[1] }}></div>
                                                    <div className='resistor-band-3' style={{ "background": this.state.R_color_bands[2] }}></div>
                                                    <div className='resistor-band-4' style={{ "background": this.state.R_color_bands[3] }}></div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Container>


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
                    <Col xs={3} sm={3} md={3} lg={3} xl={3} xxl={3}>
                        <OverlayTrigger
                            key="top"
                            placement="top"
                            overlay={
                                <ToolTipReact id={`tooltip-top-2`}>
                                    Pulsa sobre el interruptor para <strong>{this.state.capacitorCharging ? "descargar" : "cargar"}</strong> el condensador
                                </ToolTipReact>
                            }>
                            <label className="switch">
                                < input type="checkbox" onClick={(ev) => {
                                    this.updateCharging()
                                }} />
                                <span className="slider"></span>
                            </label>
                        </OverlayTrigger>
                    </Col>
                </Row>
            </div>
        )
    }
}