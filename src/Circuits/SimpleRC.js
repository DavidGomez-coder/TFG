import React, { Component } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import './SimpleRC.css'
import './Resistor/ResistorCSS.css'
import './Capacitor/CapacitorCSS.css'
import './Cell/CellCSS.css'
import './ToogleSwitch/ToogleSwitch.css'
import Offcanvas from 'react-bootstrap/Offcanvas';


import { EXACT_TIME, MAX_DATA, PERCENT_Q, QUESTION_ICON, Q_VALUE, SIMULATION_EXEC, SIMULATION_STEP, WITHOUT_RESTRICTIONS } from "../Utils/Utils";

import { Row, Col, Container, Alert, Button, OverlayTrigger, Form, Tooltip as ToolTipReact, FormControl } from "react-bootstrap";




// functions
import { getChargeInstant, getDischargeInstant } from "../Utils/RCFormulas";
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



//OTRAS
import balance_energetico from "../assets/formula/balance_energetico.PNG";
import definicion_potencia_2 from "../assets/formula/definicion_potencia_2.png";
import definicion_potencia_3 from "../assets/formula/definicion_potencia_3.png";
import capacidad_condensador_1 from "../assets/formula/capacidad_condensador_1.png";
import capacidad_condensador_2 from "../assets/formula/capacidad_condensador_2.png";
import intensidad_capacidad_condensador from "../assets/formula/intensidad_capacidad_condensador.png";
import eq_diff_energia from "../assets/formula/eq_diff_energia.png";
import eq_energia_condensador from "../assets/formula/eq_energia_condensador.png";
import eq_diff_balance from "../assets/formula/eq_diff_balance.png";
import carga_condensador_en_carga from "../assets/formula/carga_condensador_en_carga.png";
import carga_condensador_en_descarga from "../assets/formula/carga_condensador_en_descarga.png";
import definicion_intensidad_corriente from "../assets/formula/definicion_intensidad_corriente.png";
import intensidad_condensador_en_carga from "../assets/formula/intensidad_condensador_en_carga.png";
import intensidad_condensador_en_descarga from "../assets/formula/intensidad_condensador_en_descarga.png"; 

import ley_ohm_1 from "../assets/formula/ley_ohm_1.png";
import ley_ohm_2 from "../assets/formula/ley_ohm_2.png";
import varepsilon from "../assets/formula/varepsilon.png";
import vr_carga_condensador from "../assets/formula/vr_carga_condensador.png";
import vr_descarga_condensador from "../assets/formula/vr_descarga_condensador.png";
import vc_carga_condensador from "../assets/formula/vc_carga_condensador.png";
import vc_descarga_condensador from "../assets/formula/vc_descarga_condensador.png";


// OFF- CANVAS
const ENERGY_CANVAS = 1;
const CHARGE_CANVAS = 2;
const CURRENT_I_CANVAS = 3;
const LEY_OHM_CANVAS = 4;
const CAPACIDAD_CONDUCTOR_CANVAS = 5;
const FEM_CANVAS = 6;
const VR_CANVAS = 7;
const VC_CANVAS = 8;


export default class SimpleRC extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //time controller
            t_i: 0,
            t_a: 0,
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
            running: false,
            //time interval Id
            intervalId: 0,
            //reset on component change
            reset_on_component_change: false,
            //referenced lines (changes between data values)
            referenced_lines: [],
            show_reference_lines: false,
            width: document.documentElement.clientWidth,
            //show of canvas
            showCanvas: false,
            currentCanvas: ENERGY_CANVAS
        }

        this.updateCharging = this.updateCharging.bind(this);
        this.updateRunning = this.updateRunning.bind(this);
        this.updateReferenceLine = this.updateReferenceLine.bind(this);

    }

    updateDimensions() {
        this.setState({
            width: document.documentElement.clientWidth
        })
    }

    /**
     * Método utilizado para la actualización de los datos a lo 
     * largo de la simulación. Para ello, se hace uso de la función predefinida
     * de setInterval, y obtener datos y mostrarlos cada cierto tiempo
     */
    componentDidMount() {
        //update dimensions
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));

        //controller
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
                let t_a = this.state.t_a;

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
                    } else if (this.state.selected_stop_condition === Q_VALUE && this.state.q_0 >= this.state.value_stop_condition) {
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
                            q_data: [...oldQData, { "t": t_a, "Q(t)": instant_values.Q }],
                            i_data: [...oldIData, { "t": t_a, "I(t)": instant_values.I }],
                            vr_data: [...oldVrData, { "t": t_a, "Vr(t)": instant_values.Vr }],
                            vc_data: [...oldVcData, { "t": t_a, "Vc(t)": instant_values.Vc }],
                            e_data: [...oldEData, { "t": t_a, "E(t)": instant_values.E }],
                            //time update
                            t_i: t_i + ((SIMULATION_STEP * prevState.simulation_step_multiplier) / 1000),
                            t_a: t_a + ((SIMULATION_STEP * prevState.simulation_step_multiplier) / 1000),

                            //current capacitor charge update
                            q_0: instant_values.Q,
                            q_percent: Number.parseFloat((instant_values.Q / prevState.q_max) * 100).toFixed(2),
                            //data length update
                            data_length: prevState.data_length + 1

                        }
                    });
                }



                if (this.state.capacitorCharging && this.state.q_percent == 100) {
                    this.updateRunning();
                    this.updateConditionState(true);
                }

                if (!this.state.capacitorCharging && this.state.q_percent <= 0.001) {
                    this.updateRunning();
                    this.updateConditionState(true);
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
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    addReferenceLine(t) {
        this.setState(prevState => {
            return {
                ...prevState,
                referenced_lines: [...prevState.referenced_lines, t]
            }
        })
    }

    updateReferenceLine() {
        this.setState(prevState => {
            return {
                ...prevState,
                show_reference_lines: !prevState.show_reference_lines
            }
        });
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
                t_a: 0,
                q_data: [],
                i_data: [],
                vr_data: [],
                vc_data: [],
                e_data: [],
                data_length: 0,
                running: true,
                condition_complete: false,
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
                reset_on_component_change: !prevState.reset_on_component_change,

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
                t_a: 0,
                running: true,
                q_percent: this.state.capacitorCharging ? 0 : 100,
                condition_complete: false,
                referenced_lines: []
            }
        });
    }

    resetAbsoluteTime() {
        this.setState(prevState => {
            return {
                ...prevState,
                t_a: 0,
                referenced_lines: []
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
                simulation_step_multiplier: multiplier,
                t_i: 0,
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
                R: parseFloat(value) * prevState.R_m,
                t_i: 0,
            }
        })

        if (this.state.reset_on_component_change)
            this.resetDataArray();
        this.updateMaxValues();
        this.addReferenceLine(this.state.t_a);
    }

    updateResistorMultiplier(multiplier) {
        this.setState(prevState => {
            return {
                ...prevState,
                R_m: valueOfMultiplier(multiplier),
                R: prevState.R_v * valueOfMultiplier(multiplier),
                t_i: 0,
            }
        })
        if (this.state.reset_on_component_change)
            this.resetDataArray();
        this.updateMaxValues();
        this.addReferenceLine(this.state.t_a);

    }

    updateColorBands(value, multiplier) {
        this.setState({
            R_color_bands: calculateColorBands(parseFloat(value), multiplier)
        });
        if (this.state.reset_on_component_change)
            this.resetDataArray();
        this.updateMaxValues();
        this.addReferenceLine(this.state.t_a);

    }

    /** CAPACITOR CONTROLLER */
    updateCapacitorMultiplier(multiplier) {
        this.setState(prevState => {
            return {
                ...prevState,
                C_m: getCapacitorMult(multiplier),
                C: prevState.C_v * getCapacitorMult(multiplier),
                t_i: 0,
            }
        })

        if (this.state.reset_on_component_change)
            this.resetDataArray();
        this.updateMaxValues();
        this.addReferenceLine(this.state.t_a);
    }

    updateCapacitorValue(value) {
        this.setState(prevState => {
            return {
                ...prevState,
                C_v: parseFloat(value),
                C: parseFloat(value) * prevState.C_m,
                t_i: 0,
            }
        })
        if (this.state.reset_on_component_change)
            this.resetDataArray();
        this.updateMaxValues();
        this.addReferenceLine(this.state.t_a);
    }


    /** CELL CONTROLLER */
    updateCellValue(value) {
        this.setState(prevState => {
            return {
                ...prevState,
                V_v: parseFloat(value),
                V: parseFloat(value) * prevState.C_m,
                t_i: 0,
            }
        })

        if (this.state.reset_on_component_change)
            this.resetDataArray();
        this.updateMaxValues();
        this.addReferenceLine(this.state.t_a);
    }

    updateCellMultiplier(multiplier) {
        this.setState(prevState => {
            return {
                ...prevState,
                V_m: getCellMultiplier(multiplier),
                V: prevState.V_v * getCellMultiplier(multiplier),
                t_i: 0,
            }
        })
        if (this.state.reset_on_component_change)
            this.resetDataArray();
        this.updateMaxValues();
        this.addReferenceLine(this.state.t_a);

    }

    turnOnCanvas (canvas){
        if (this.state.running)
            this.updateRunning();

        this.setState((prevState) => {
            return {
                ...prevState,
                showCanvas: true,
                currentCanvas: canvas
            }
        });
        
    }

    turnOffCanvas(){
        this.setState((prevState) => {
            return {
                ...prevState,
                showCanvas: false
            }
        });
    }


    render() {
        return this.state.width >= 1280 ? (

            <div style={{ "paddingLeft": "1%", "paddingRight": "1%" }}>
                {/* UP ROW */}
                <Row style={{"marginTop" : "1%"}}>
                    {/* DATA CHARTS */}
                    <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} >
                        <Row className="d-flex p-15">
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} onClick={(ev) => {this.turnOnCanvas(CHARGE_CANVAS)}}>
                                <div style={{
                                    paddingBottom: '50%', /* 16:9 */
                                    position: 'relative',
                                    height: 0
                                }} className="chart-hover">
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

                                                {
                                                    this.state.show_reference_lines ?
                                                        this.state.referenced_lines.map((r_line) => {
                                                            return (
                                                                <ReferenceLine key={`q_${this.state.t_a}_${Math.random() * 10 + this.state.t_a}`} x={r_line} stroke="black" strokeWidth={1} strokeDasharray="3 3" />
                                                            )
                                                        }) : "reference_line not showed"
                                                }
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>


                            </Col>

                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} onClick={(ev) => {this.turnOnCanvas(CURRENT_I_CANVAS)}}>
                                <div style={{
                                    paddingBottom: '50%', /* 16:9 */
                                    position: 'relative',
                                    height: 0
                                }} className="chart-hover">
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
                                                {
                                                    this.state.show_reference_lines ?
                                                        this.state.referenced_lines.map((r_line) => {
                                                            return (
                                                                <ReferenceLine key={`i_${this.state.t_a}_${Math.random() * 10 + this.state.t_a}`} x={r_line} stroke="black" strokeWidth={1} strokeDasharray="3 3" />
                                                            )
                                                        }) : "reference_line not showed"
                                                }
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>


                            </Col>
                        </Row>

                        <Row>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} onClick={(ev) => {this.turnOnCanvas(VC_CANVAS)}}>
                                <div style={{
                                    paddingBottom: '50%', /* 16:9 */
                                    position: 'relative',
                                    height: 0
                                }} className="chart-hover">
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
                                                {
                                                    this.state.show_reference_lines ?
                                                        this.state.referenced_lines.map((r_line) => {
                                                            return (
                                                                <ReferenceLine key={`vc_${this.state.t_a}_${Math.random() * 10 + this.state.t_a}`} x={r_line} stroke="black" strokeWidth={1} strokeDasharray="3 3" />
                                                            )
                                                        }) : "reference_line not showed"
                                                }
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>

                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} onClick={(ev) => {this.turnOnCanvas(VR_CANVAS)}}>
                                <div style={{
                                    paddingBottom: '50%', /* 16:9 */
                                    position: 'relative',
                                    height: 0
                                }} className="chart-hover">
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
                                                {
                                                    this.state.show_reference_lines ?
                                                        this.state.referenced_lines.map((r_line) => {
                                                            return (
                                                                <ReferenceLine key={`vr_${this.state.t_a}_${Math.random() * 10 + this.state.t_a}`} x={r_line} stroke="black" strokeWidth={1} strokeDasharray="3 3" />
                                                            )
                                                        }) : "reference_line not showed"
                                                }
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>

                        </Row>

                        <Row>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} onClick={(ev) => {this.turnOnCanvas(ENERGY_CANVAS)}}>
                                <div style={{
                                    paddingBottom: '50%', /* 16:9 */
                                    position: 'relative',
                                    height: 0
                                }} className="chart-hover">
                                    <div style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        width: '100%',
                                        height: '100%'
                                    }} onClick={this.setEnergyCanvas}>
                                        <ResponsiveContainer width="100%" height="98%" >
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
                                                <Legend verticalAlign="top" align="right" iconType="circle" margin={{ top: 0, left: 0, right: 0, bottom: 10 }}  />
                                                <Line type="monotone" dataKey="E(t)" stroke="red" strokeWidth={3} dot={false} isAnimationActive={false} />
                                                {
                                                    this.state.show_reference_lines ?
                                                        this.state.referenced_lines.map((r_line) => {
                                                            return (
                                                                <ReferenceLine key={`e_${this.state.t_a}_${Math.random() * 10 + this.state.t_a}`} x={r_line} stroke="black" strokeWidth={1} strokeDasharray="3 3" />
                                                            )
                                                        }) : "reference_line not showed"
                                                }
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
                                            <option value={PERCENT_Q}>Carga del condensador (%)</option>
                                            <option value={Q_VALUE}>Carga del condensador (C)</option>
                                            <option value={EXACT_TIME}>Tiempo de simulación (s)</option>
                                        </Form.Select>

                                    </Col>

                                    <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}>
                                        <FormControl type="number" disabled={this.state.selected_stop_condition === WITHOUT_RESTRICTIONS || this.state.running}
                                            min={
                                                this.state.capacitorCharging ? (this.state.selected_stop_condition === PERCENT_Q ? (Number.parseFloat(this.state.q_percent)) : (this.state.selected_stop_condition === EXACT_TIME ? this.state.t_i : "")) : 0}
                                            max={
                                                this.state.capacitorCharging ? (this.state.selected_stop_condition === PERCENT_Q ? 100 : (this.state.selected_stop_condition === EXACT_TIME ? "" : "")) : (Number.parseFloat(this.state.q_percent))
                                            }
                                            onChange={(ev) => {
                                                this.updateConditionState(false);
                                                let nVal = this.state.selected_stop_condition === PERCENT_Q ? Number.parseFloat(ev.target.value) :
                                                    this.state.selected_stop_condition === EXACT_TIME ? Number.parseFloat(ev.target.value) :
                                                        this.state.selected_stop_condition === Q_VALUE ? Number.parseFloat(ev.target.value) : undefined;

                                                this.updateConditionValue(nVal);

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
                                        <Form.Check
                                            inline
                                            type="checkbox"
                                            onChange={this.updateReferenceLine}
                                            name="update_show_reference_line"
                                            label="Marcadores"
                                        />
                                    </Col>
                                    <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}>

                                    </Col>
                                </Row>
                                <br></br>
                                <Row>
                                    <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}>
                                        {/* RUN/STOP BUTTON */}
                                        <div className="d-grid gap-2">
                                            <Button disabled={this.state.condition_complete} variant={this.state.running ? "danger" :
                                                (!this.state.condition_complete ? "outline-warning" : "secondary")}
                                                onClick={this.updateRunning} size="xs" >{this.state.running ? "STOP" : "RESUME"}</Button>
                                        </div>
                                    </Col>

                                    <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}>
                                        {/* RELOAD BUTTON */}
                                        <div className="d-grid gap-2">
                                            <Button variant={"outline-info"} onClick={(ev) => {
                                                this.resetDataArray();
                                                this.updateMaxValues();
                                                this.resetAbsoluteTime();
                                            }} size="xs" >RELOAD</Button>
                                        </div>

                                    </Col>

                                </Row>


                            </Col>
                        </Row>
                    </Col>

                    {/* CIRCUIT ANIMATION */}
                    
                    <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                        <img alt="circuit_animatino" src={this.getCurrentAnimation()} className="w-100"></img>
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
                                        <div className="charge-box">
                                            <div className={this.state.running ? "charge" : (this.state.q_percent == 0 ? "charge_discharge_complete" : "charge_charge_complete")} style={{ "background": this.state.capacitorCharging ? "#569c02" : "#c94f1e" }}
                                                onClick={(ev) => {this.turnOnCanvas(CAPACIDAD_CONDUCTOR_CANVAS)}}>
                                                {
                                                    (() => {
                                                        if (this.state.width >= 1100) {
                                                            return (
                                                                <p className="percent_charge">{this.state.q_percent}%</p>
                                                            )
                                                        }
                                                    })()
                                                }

                                            </div>
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
                                                this.updateColorBands(Number.parseFloat(ev.target.value), this.state.R_m);
                                            }}
                                        />
                                    </Col>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <select className="form-select component-value" aria-label="Default select example" onChange={(ev) => {
                                            this.updateResistorMultiplier(ev.target.value)
                                            this.updateColorBands(this.state.R_v, valueOfMultiplier(ev.target.value));
                                        }} disabled={this.state.showMultipliers === false}>
                                            <option defaultValue={true} value="x1">{Number.parseFloat(this.state.R_v).toFixed(2)} Ω </option>
                                            <option value="x0.1">{Number.parseFloat(this.state.R_v * 0.1).toFixed(2)} Ω</option>
                                            <option value="x10">{Number.parseFloat(this.state.R_v * 10).toFixed(2)} Ω</option>
                                            <option value="x100">{Number.parseFloat(this.state.R_v * 100).toFixed(2)} Ω</option>
                                        </select>

                                    </Col>
                                    <Container>
                                        <Row>
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} >
                                                <div className='resistor-box' onClick={(ev) => {this.turnOnCanvas(LEY_OHM_CANVAS)}}>
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
                                <div className='cell-box' onClick={(ev) => {this.turnOnCanvas(FEM_CANVAS)}}>
                                    <div className='cell-box-shadow'>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>


                    {/* Switch controller */}
                    <Col xs={3} sm={3} md={3} lg={3} xl={3} xxl={3}>

                        <label className="switch">
                            < input type="checkbox" onClick={(ev) => {
                                this.updateCharging()
                            }} />
                            <span className="slider"></span>
                        </label>

                    </Col>

                    {/* INFO CANVAS */}
                    <Offcanvas show={this.state.showCanvas} onHide={(ev) => {this.turnOffCanvas()}} backdrop="static" placement="end" >
                                 <Offcanvas.Header closeButton>
                                    <Offcanvas.Title>
                                        <h1>Circuito RC</h1>
                                    </Offcanvas.Title> 
                                </Offcanvas.Header>
                                <Offcanvas.Body>
                                {
                                    (() => {
                                        if (this.state.currentCanvas === CHARGE_CANVAS) {
                                               /* TEORIA CARGA CONDENSADOR */
                                                return (
                                                    <>
                                                        <h4>Carga del condensador</h4>
                                                        <br />
                                                        Para hallar una expresión que modele la carga del condensador realizaremos un <strong>balance energético</strong> de los componentes del circuito, es decir,
                                                        la diferencia de potencial suministrada por la pila debe de ser equivalente a la consumida por los componentes pasivos (la resistencia y el condensador).
                                                        <br /><br />
                                                        <div style={{"textAlign" : "center"}}>
                                                            <img alt="balance_energetico" src={balance_energetico} style={{"width" : "50%"}}></img>
                                                        </div>
                                                        <br />
                                                        Así que por definición de <strong>capacidad de un condensador</strong>, de <strong>intensidad de corriente</strong> y la <strong>Ley de Ohm</strong>
                                                        ,sustituimos en la expresión resultante de realizar el balance energético y nos queda la siguiente ecuación diferencial a resolver:
                                                        <br /><br />
                                                        <div style={{"textAlign" : "center"}}>
                                                            <img alt="eq_diff_balance" src={eq_diff_balance} style={{"width" : "50%"}}></img>
                                                        </div>
                                                        <br />
                                                        Para resolverla, supondremos los siguientes casos iniciales dependiendo del estado en el que nos encontremos:
                                                        <br />
                                                        <ul>
                                                            <li>Durante la <strong>carga</strong> del condensador, supondremos inicialmente que este está vacío (carga en el instante cero es nula).
                                                                <br /><br />
                                                                <div style={{"textAlign" : "center"}}>
                                                                    <img alt="carga_condensador_en_carga" src={carga_condensador_en_carga} style={{"width" : "50%"}}></img>
                                                                </div>
                                                                <br />
                                                            </li>
                                                            <li>Por otro lado, en el caso de <strong>descarga</strong>, comenzaremos con una carga máxima. Es decir, puesto que esta depende del valor de la fuente y de la capcidad del condensador, 
                                                            dicha <i>carga máxima</i> será la multiplicación de ambas.
                                                                <br /><br />
                                                                    <div style={{"textAlign" : "center"}}>
                                                                        <img alt="carga_condensador_en_descarga" src={carga_condensador_en_descarga} style={{"width" : "40%"}}></img>
                                                                    </div>
                                                                <br />
                                                            </li>
                                                        </ul>
                                                    </>
                                                    
                                                )
                                                
                                        }else if (this.state.currentCanvas === ENERGY_CANVAS){
                                             /* TEORIA ENERGÍA ALMACENADA */
                                            return (
                                                <>
                                                <h4>Energía almacenada</h4>
                                                <br />
                                                Para hallar la energía que almacena un condensador, tenemos que aplicar el concepto de <strong>potencia en un conductor</strong>. Definimos
                                                como potencia al trabajo realizado por el <i>campo eléctrico</i> aplicado sobre un conductor para trasladar una carga entre dos puntos del mismo, entre 
                                                los cuales existe una diferencia de potencial. Considerando esta cantidad de energía por unidad de tiempo:
                                                <br /> <br />
                                                <div style={{"textAlign" : "center"}}>
                                                    <img alt="definicion_potencia_2" src={definicion_potencia_2} style={{"width" : "40%"}}></img>
                                                </div>
                                                <br />
                                                Otra forma de escribir esta expresión en función del tiempo es:
                                                <br /> <br />
                                                <div style={{"textAlign" : "center"}}>
                                                    <img alt="definicion_potencia_3" src={definicion_potencia_3} style={{"width" : "40%"}}></img>
                                                </div>
                                                <br />
                                                Por las definiciones de <strong>capacidad de un condensador</strong> y de <strong>intensidad de corriente</strong>,
                                                se nos queda planteada entonces la siguiente ecuación diferencial
                                                <br /> <br />
                                                <div style={{"textAlign" : "center"}}>
                                                    <img alt="eq_diff_energia" src={eq_diff_energia} style={{"width" : "70%"}}></img>
                                                </div>
                                                <br />
                                                , la cuál si resolvemos, obtenemos que la energía almacenada en el condensador a lo largo del tiempo
                                                sigue la expresión
                                                <br /> <br />
                                                <div style={{"textAlign" : "center"}}>
                                                    <img alt="eq_energia_condensador" src={eq_energia_condensador} style={{"width" : "50%"}}></img>
                                                </div>
                                                <br /> <br />
                                                </>        
                                            )

                                        }else if (this.state.currentCanvas === CURRENT_I_CANVAS){
                                            /* TEORIA INTENSIDAD DE CORRIENTE*/
                                            return (
                                                <>
                                                    <h4>Intensidad de corriente</h4>
                                                    <br />
                                                    Definimos <strong>intensidad de corriente</strong> como la cantidad de carga eléctrica que circula
                                                    por unidad de tiempo a través de un conductor.
                                                    <br /> <br/>
                                                    <div style={{"textAlign" : "center"}}>
                                                        <img alt="definicion_intensidad_corriente" src={definicion_intensidad_corriente} style={{"width" : "35%"}}></img>
                                                    </div>
                                                    <br />
                                                    Aplicando la expresión de carga del condensador dependiendo de si su estado está en almacenamiento o disipación
                                                    de energía, obtenemos que: <br/>
                                                    <ul>
                                                        <li>Durante la <strong>carga</strong> del condensador, la expresión que modela el comportamiento de la intensidad de corriente es
                                                            <br /> <br/>
                                                            <div style={{"textAlign" : "center"}}>
                                                                <img alt="intensidad_condensador_en_carga" src={intensidad_condensador_en_carga} style={{"width" : "35%"}}></img>
                                                            </div>
                                                            <br/>
                                                        </li>
                                                        <li>
                                                            Mientras que durante su <strong>descarga</strong>
                                                            <br /> <br/>
                                                            <div style={{"textAlign" : "center"}}>
                                                                <img alt="intensidad_condensador_en_descarga" src={intensidad_condensador_en_descarga} style={{"width" : "35%"}}></img>
                                                            </div>
                                                            <br/>   
                                                        </li>
                                                    </ul>
                                                </>
                                            )

                                        }else if (this.state.currentCanvas === LEY_OHM_CANVAS){
                                             /* TEORIA LEY DE OHM */
                                            return (
                                                <>
                                                    <h4>Ley de Ohm</h4>
                                                    La circulación de corriente eléctrica se debe principalmente a la presencia de un <i>campo eléctrico</i> en un conductor. Este, ocasiona una <i>densidad de corriente</i> cuyo
                                                    valor depende de las propiedades del conductor. A esta relación existente entre <i>densidad de corriente</i> y <i>campo eléctrico</i> se conoce como <strong>Ley de Ohm</strong> y 
                                                    define una constante llamada <strong>conductividad eléctrica</strong>.
                                                    <br /> <br/>
                                                    <div style={{"textAlign" : "center"}}>
                                                        <img alt="ley_ohm_1" src={ley_ohm_1} style={{"width" : "30%"}}></img>
                                                    </div>
                                                    <br/>
                                                    Generalmente esta conductividad no depende del campo eléctrico generado. Sin embargo, la <i>Ley de Ohm</i> no es una ley que podamos encontrar en la naturaleza, sino que se trata 
                                                    de una descripción experimental de una propiedad que presentan la mayoría de los materiales metálicos y algunos otros (también llamados <i>conductores lineales</i>).
                                                    <br></br>
                                                    Si un material posee una conductividad constante a lo largo del tiempo y la sección de este conductor es uniforme, entonces es posible obtener una expresión
                                                    simplificada a esta ley, que relaciona la <i>intensidad de corriente</i> y la <i>diferencia de potencial</i> entre dos puntos del conductor. A esta relación se le conoce 
                                                    como <i>resistencia eléctrica del conductor</i>.
                                                    <br /> <br/>
                                                    <div style={{"textAlign" : "center"}}>
                                                        <img alt="ley_ohm_2" src={ley_ohm_2} style={{"width" : "30%"}}></img>
                                                    </div>
                                                    <br/>
                                                </>
                                            )
                                        }else if (this.state.currentCanvas === FEM_CANVAS) {
                                             /* TEORIA FEM*/
                                            return (
                                                <>
                                                    <h4>Fuerza electromotriz (F.E.M)</h4>
                                                    <br/>
                                                    Por el <i>efecto Joule</i>, los vectores de carga que se encuentran circulando a través del 
                                                    material conductor transforman toda su energía cinética en calor debido a que estas partículas chocan 
                                                    con sus paredes, parando así en algún momento del tiempo la circulación de corriente. Por otro lado, si lo que 
                                                    queremos es mantener esta corriente, entonces debemos de utilizar una <i>fuente de fuerza electromotriz</i>.
                                                    <br />
                                                    <br />
                                                    Este tipo de generadores, pueden transformar cualquier tipo de energía en energía eléctrica. Por ejemplo en una pila convencional, 
                                                    las reacciones químicas que ocurren en los electrodos positivo y negativo, hace que en el electrodo positivo absorbe electrones mientras que, en 
                                                    el negativo se liberan, dando resultado así una corriente.
                                                    <br />
                                                    <br />
                                                    Puesto que utilizamos una fuente que genera una <i>corriente eléctrica continua</i>, denotaremos al valor de esta fuerza electromotriz al valor en voltios de 
                                                    la pila.
                                                    <br /> <br/>
                                                    <div style={{"textAlign" : "center"}}>
                                                        <img alt="varepsilon_img" src={varepsilon} style={{"width" : "5%"}}></img>
                                                    </div>
                                                    <br/>

                                                </>
                                            )
                                        }else if (this.state.currentCanvas === CAPACIDAD_CONDUCTOR_CANVAS) {
                                             /* TEORIA CAPACIDAD CONDUCTOR */
                                            return (
                                                <>
                                                    <h4>Capacidad de un condensador</h4>
                                                    <br />
                                                    Actualmente, sabemos que existen tres tipos materiales dependiendo de capacidad que tienen
                                                    para la transimisión de energía eléctrica <br/>
                                                    <ul>
                                                        <li><strong>Conductores</strong>. Algunos de sus electrones son libres, por lo tienen libertad para 
                                                        desplazarse por el material</li>
                                                        <li><strong>Aislantes</strong>. Al contrario que los conductores, todos los electrones de los átomos que conforman este 
                                                        tipo de materiales no pueden desplazarse, ya que se encuentran fuertemente unidos a ellos.</li>
                                                        <li><strong>Semiconductores</strong>. Es una mezcla entre los dos grupos anteriores. La movilidad de sus electrones depende de la cantidad 
                                                        de átomos añadidos.</li>
                                                    </ul>
                                                    <br />
                                                    Imaginemos entonces dos materiales conductores (como por ejemplo aluminio) sin carga eléctrica y aislados entre ellos y del exterior. Si conseguimos pasar 
                                                    una carga desde una de las placas hasta la otra, una de estas armaduras queda cargada positivamente y, puesto que estas placas se encuentran aisladas entre sí, 
                                                    conseguimos un <i>equilibrio electroestático</i> ocasionando una diferencia de potencial entre ambas placas. A esto se le conoce como condensador.
                                                    <br />
                                                    Entonces, la capacidad de un condensador, depende linealmente de la diferencia de potencial entre las placas y de la carga de una de ellas, tal y como se muestra 
                                                    en la siguiente expresión:
                                                    <br /> <br/>
                                                    <div style={{"textAlign" : "center"}}>
                                                        <img alt="capacidad_condensador_2" src={capacidad_condensador_2} style={{"width" : "50%"}}></img>
                                                    </div>
                                                    <br/>
                                                    Otra manera de escribir esta expresión en función de la carga del condensador a lo largo del tiempo, (puesto que la capacidad es constante) tenemos que:
                                                    <br /> <br/>
                                                    <div style={{"textAlign" : "center"}}>
                                                        <img alt="capacidad_condensador_1" src={capacidad_condensador_1} style={{"width" : "40%"}}></img>
                                                    </div>
                                                    <br/>
                                                </>
                                            )
                                        }else if (this.state.currentCanvas === VR_CANVAS){
                                            /* DDP RESISTENCIA */
                                            return (
                                                <>
                                                    <h4>Diferencia de potencial en la resistencia</h4>
                                                    <br></br>
                                                    Utilizando la <i>Ley de Ohm</i>, podemos obtener cuál es la diferencia de potencial en los bornes 
                                                    de la resistencia. Este dato, junto a la ddp en el condensador, puede llegar a ser de utilidad para comprobar que, 
                                                    efectivamente, se cumple la propiedad de conservación de energía en el circuito
                                                    <br /> <br/>
                                                    <div style={{"textAlign" : "center"}}>
                                                        <img alt="vr_carga_condensador" src={vr_carga_condensador} style={{"width" : "40%"}}></img>
                                                    </div>
                                                    <br /> <br/>
                                                    <div style={{"textAlign" : "center"}}>
                                                        <img alt= "vr_descarga_condensador" src={vr_descarga_condensador} style={{"width" : "40%"}}></img>
                                                    </div>
                                                    <br/>
                                                    , durante la <strong>carga</strong> y <strong>descarga</strong> del condensador respectivamente.
                                                </>
                                            )
                                        }else if (this.state.currentCanvas === VC_CANVAS){
                                            /* DDP CONDENSADOR */
                                            return (
                                                <>
                                                    <h4>Diferencia de potencial en el condensador</h4>
                                                    <br></br>
                                                    Para obtener la diferencia de potencial que existe entre los bornes del condensador, basta con aplicar la definición de <strong>capacidad del condensador</strong>. Este
                                                    parámetro al igual que la ddp en la resistencia, es de utilidad para comprobar que realmente se cumple la conservación de energía en el circuito. Dependiendo de si el condensador 
                                                    se encuentra en estado de <strong>carga</strong> o <strong>descarga</strong> obtenemos las siguientes expresiones respectivamente:
                                                    <br /> <br/>
                                                    <div style={{"textAlign" : "center"}}>
                                                        <img alt="vc_carga_condensador" src={vc_carga_condensador} style={{"width" : "40%"}}></img>
                                                    </div>
                                                    <br /> <br/>
                                                    <div style={{"textAlign" : "center"}}>
                                                        <img alt="vc_descarga_condensador" src={vc_descarga_condensador} style={{"width" : "40%"}}></img>
                                                    </div>

                                                    <br/>

                                                </>
                                            )
                                        }
                                        else {
                                            return (
                                                <h2>ERROR</h2>
                                            )
                                        }
                                    })()
                                }
                                </Offcanvas.Body>        
                    </Offcanvas>
                </Row>
            </div>
        ) :  (
            <div style={{'margin' : '1%'}}>
                <Alert variant="danger">
                <Alert.Heading>La simulación del circuito RC no puede mostrarse</Alert.Heading>
                <p>Actualmente esta aplicación no se encuentra adaptada a todos los dispositivos. Para aquellos con un ancho de pantalla menor a  
                    <strong> 1280px</strong> o con dimensiones inferiores a <strong>10''</strong> los componentes no son mostrados adecuadamente. 
                    El ancho de su pantalla actual es de <strong>{this.state.width} px</strong>.</p>
                    <hr />
                    <p className="mb-0">
                        Pruebe con otro dispositivo.
                    </p>
            </Alert>
            </div>
            
        )
    }



}