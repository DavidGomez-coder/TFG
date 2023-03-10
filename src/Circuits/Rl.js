import React, { Component } from "react";

// boostrap
import { Row, Col, Container, Alert, Button, OverlayTrigger, Form, Tooltip as ToolTipReact, FormControl, ListGroup, Card } from "react-bootstrap";
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import './SimpleRC.css'
import './Resistor/ResistorCSS.css'
import './Capacitor/CapacitorCSS.css'
import './Cell/CellCSS.css'
import './ToogleSwitch/ToogleSwitch.css'
import Offcanvas from 'react-bootstrap/Offcanvas';

// recharts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

// stop conditions
import { EXACT_TIME, I_VALUE, MAX_DATA, PERCENT_I, SIMULATION_EXEC, SIMULATION_STEP, WITHOUT_RESTRICTIONS } from "../Utils/Utils";

// functions
import { getChargeInstant, getDischargeInstant } from "../Utils/RLFormulas";
import { getInductorMult } from "./Inductor/InductorData";
import { calculateColorBands, valueOfMultiplier } from "./Resistor/Resistor";
import { getCellMultiplier } from "./Cell/Cell";
import { QUESTION_ICON } from "../Utils/Utils";


// inductor on charge animations
import rl_charge_0_63 from "../assets/animations/rl-charge/rl_charge_0_63.gif";
import rl_charge_63_80 from "../assets/animations/rl-charge/rl_charge_63_80.gif";
import rl_charge_80_90 from "../assets/animations/rl-charge/rl_charge_80_90.gif";
import rl_charge_90_99 from "../assets/animations/rl-charge/rl_charge_90_99.gif";
import rl_charge_100 from "../assets/animations/rl-charge/rl_charge_100.png";
import rl_charge_background from "../assets/animations/rl-charge/rl_charge_background.png";

// inductor on discharge animations
import rl_discharge_0_63 from "../assets/animations/rl-discharge/rl_discharge_0_63.gif";
import rl_discharge_63_80 from "../assets/animations/rl-discharge/rl_discharge_63_80.gif";
import rl_discharge_80_90 from "../assets/animations/rl-discharge/rl_discharge_80_90.gif";
import rl_discharge_90_99 from "../assets/animations/rl-discharge/rl_discharge_90_99.gif";
import rl_discharge_100 from "../assets/animations/rl-discharge/rl_discharge_100.png";
import rl_discharge_background from "../assets/animations/rl-discharge/rl_discharge_background.png";

import "./Inductor/InductorCSS.css";
import "./SimpleRL.css";

// others
import ley_ohm_1 from "../assets/formula/ley_ohm_1.png";
import ley_ohm_2 from "../assets/formula/ley_ohm_2.png";
import varepsilon from "../assets/formula/varepsilon.png";
import faraday_lenz from "../assets/formula/faraday_lenz.png";
import coeficiente_autoinduccion from "../assets/formula/coeficiente_autoinduccion.png";
import definicion_intensidad_corriente from "../assets/formula/definicion_intensidad_corriente.png";
import eq_diff_intensidad_rl from "../assets/formula/eq_diff_intensidad_rl.png";
import intensidad_rl_1 from "../assets/formula/intensidad_rl_1.png";
import intensidad_rl_2 from "../assets/formula/intensidad_rl_2.png";
import balance_energetico_rl from "../assets/formula/balance_energetico_rl.png";
import ddp_resistencia_rl_1 from "../assets/formula/ddp_resistencia_rl_1.png";
import ddp_resistencia_rl_2 from "../assets/formula/ddp_resistencia_rl_2.png";
import ddp_inductor from "../assets/formula/ddp_inductor.png";
import ddp_inductor_1 from "../assets/formula/ddp_inductor_1.png";
import ddp_inductor_2 from "../assets/formula/ddp_inductor_2.png";
import def_flujo_magnetico from "../assets/formula/def_flujo_magnetico.png";
import flujo_magnetico from "../assets/formula/flujo_magnetico.png";
import potencia_consumida_inductor from "../assets/formula/potencia_consumida_inductor.png";
import energia_consumida from "../assets/formula/energia_consumida.png";
import energia_ec_diff from "../assets/formula/energia_ec_diff.png";
import energia_almacenada_rl from "../assets/formula/energia_almacenada_rl.png";

// screen min width
const MAX_WIDTH = 1280;
const MEGA = 1000000;
const KILO = 1000;

//canvas
const I_CANVAS = 1;
const VL_CANVAS = 2;
const VR_CANVAS = 3;
const ENERGY_CANVAS = 4;
const PHI_CANVAS = 5;

export default class Rl extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //windows width
            width: document.documentElement.clientWidth,
            //time controller
            t_i: 0,
            t_a: 0,
            simulation_step_multiplier: 1,
            //stop conditions
            selected_stop_condition: WITHOUT_RESTRICTIONS,
            value_stop_condition: undefined,
            condition_complete: false,
            // max data allowed
            max_cu_allowed: 0,
            max_vr_allowed: 0,
            max_vl_allowed: 0,
            max_e_allowed: 0,
            max_phi_allowed: 0,
            //data arrays
            i_data: [],
            vl_data: [],
            vr_data: [],
            e_data: [],
            phi_data: [],
            //initial current percent
            i_percent: 0,
            // components  values
            L: 1,
            R: 1000,
            R_color_bands: [],
            V: 6,
            //components initial values and multipliers
            L_v: 1,
            L_m: 1,
            R_v: 1,
            R_m: 1000,
            V_v: 6,
            V_m: 1,
            // circuit state
            inductorCharging: true,
            data_length: 0,
            // simulation state
            running: false,
            //time interval id
            intervalId: 0,
            //reset on component change
            reset_on_component_change: false,
            //references lines (RL murkup)
            referenced_lines: [],
            show_reference_lines: true,
            //canvas
            showCanvas: false,
            currentCanvas: I_CANVAS
        }

        this.updateCharging = this.updateCharging.bind(this);
        this.updateRunning = this.updateRunning.bind(this);
        this.updateReferenceLine = this.updateReferenceLine.bind(this);
    }

    // *********************************
    //          DIMENSIONS
    // *********************************
    updateDimensions() {
        this.setState(prevState => {
            return {
                ...prevState,
                width: document.documentElement.clientWidth
            }
        });
    }

    // *************************************
    //      COMPONENT DID MOUNT
    // *************************************
    componentDidMount() {
        //update dimensions
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));

        //controller
        this.updateColorBands(this.state.R_v, this.state.R_m);
        
        const newInterval = setInterval(() => {
            this.updateMaxValues()
            this.updateMaxDataAllowed();

            

            this.updateMaxValues();
            if (this.state.running) {
                let oldIData = this.state.i_data;
                let oldEData = this.state.e_data;
                let oldVrData = this.state.vr_data;
                let oldVlData = this.state.vl_data;
                let oldPhiData = this.state.phi_data;

                //shift data
                if (this.state.data_length >= MAX_DATA) {
                    oldIData.shift();
                    oldEData.shift();
                    oldVrData.shift();
                    oldVlData.shift();
                    oldPhiData.shift();
                }
                let t_i = this.state.t_i;
                let t_a = this.state.t_a;

                //new values
                let instant_values = this.state.inductorCharging ? getChargeInstant(t_i, this.state.i_max, this.state.V, this.state.L, this.state.R) :
                    getDischargeInstant(t_i, this.state.i_max, this.state.V, this.state.L, this.state.R);

                //condiciones más restrictivas
                if (this.state.value_stop_condition !== undefined) {
                    if ((this.state.selected_stop_condition === PERCENT_I && this.state.inductorCharging && this.state.value_stop_condition >= 100) ||
                        (this.state.selected_stop_condition === PERCENT_I && !this.state.inductorCharging && this.state.value_stop_condition <= 0)) {
                        this.updateConditionValue(100);
                        this.updateConditionState(true);

                    } else if ((this.state.selected_stop_condition === PERCENT_I && this.state.inductorCharging && this.state.value_stop_condition <= this.state.i_percent) ||
                        (this.state.selected_stop_condition === PERCENT_I && !this.state.inductorCharging && this.state.value_stop_condition >= this.state.i_percent)) {
                        this.updateRunning();
                        this.updateConditionState(true);

                    } else if (this.state.selected_stop_condition === EXACT_TIME && this.state.value_stop_condition <= t_i) {
                        this.updateRunning();
                        this.updateConditionState(true);

                    } else if ((this.state.inductorCharging && this.state.selected_stop_condition === I_VALUE && this.state.i_0 >= this.state.value_stop_condition) ||
                        (!this.state.inductorCharging && this.state.selected_stop_condition === I_VALUE && this.state.i_0 <= this.state.value_stop_condition)) {
                        this.updateRunning();
                        this.updateConditionState(true);

                    } else {
                        this.updateConditionState(false);
                    }
                }

                //auto stop simulation
                if (this.state.inductorCharging && this.state.i_percent == 100) {
                    this.updateRunning();
                    this.updateConditionState(true);
                    this.setState((prevState) => {
                        return {
                            ...prevState,
                            i_0: prevState.i_max
                        }
                    });
                }

                if (!this.state.inductorCharging && this.state.i_percent <= 0.00) {
                    this.updateRunning();
                    this.updateConditionState(true);
                    this.setState((prevState) => {
                        return {
                            ...prevState,
                            i_0: 0
                        }
                    });
                }

                if (!this.state.condition_complete) {
                    //let nt_i = t_i + ((SIMULATION_STEP * this.state.simulation_step_multiplier) / 1000);
                    //let nt_a = t_a + ((SIMULATION_STEP * this.state.simulation_step_multiplier) / 1000);

                    let nt_i = t_i +  1e-5;
                    let nt_a = t_a +  1e-5;

                    this.setState(prevState => {
                        return {
                            ...prevState,
                            i_data: [...oldIData, { "t": Number.parseFloat(t_a).toExponential(4), "I(t)": instant_values.I }],
                            vr_data: [...oldVrData, { "t": Number.parseFloat(t_a).toExponential(4), "Vr(t)": instant_values.Vr }],
                            vl_data: [...oldVlData, { "t": Number.parseFloat(t_a).toExponential(4), "Vl(t)": instant_values.Vl }],
                            e_data: [...oldEData, { "t": Number.parseFloat(t_a).toExponential(4), "E(t)": instant_values.E }],
                            phi_data: [...oldPhiData, { "t": Number.parseFloat(t_a).toExponential(4), "Φ(t)": instant_values.PHI }],
                            //time update
                            t_i: nt_i,
                            t_a: nt_a,
                            //current i max update
                            i_0: instant_values.I,
                            i_percent: Number.parseFloat((instant_values.I / prevState.i_max) * 100).toFixed(2),
                            //data length update
                            data_length: prevState.data_length + 1
                        }
                    });
                }


            }
        });
        
        

        //update time interval id
        this.setState(prevState => {
            return {
                ...prevState,
                intervalId: newInterval
            }
        });
    }

    // ****************************************
    //      COMPONENT WILL UNMOUNT
    // ****************************************
    componentWillUnmount() {
        // clear function 
        clearInterval(this.state.intervalId);
        // remove window size event 
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    // ****************************************
    //      UPDATE SIMULATION STEP
    // ****************************************
    setSimulationStepMultiplier(val) {
        this.setState(prevState =>  {
            return {
                ...prevState,
                simulation_step_multiplier: val
            }
        });
    }

    // ************************************
    //      REFERENCE LINE 
    // ************************************
    addReferenceLine(t) {
        this.setState(prevState => {
            return {
                ...prevState,
                referenced_lines: [...prevState.referenced_lines, t]
            }
        });
    }

    updateReferenceLine() {
        this.setState(prevState => {
            return {
                ...prevState,
                show_reference_lines: !prevState.show_reference_lines
            }
        })
    }

    // ***********************************
    //      GET CURRENT ANIMATION
    // ***********************************
    getCurrentAnimation() {
        switch (this.state.inductorCharging) {
            case true:

                if (!this.state.running && this.state.i_percent == 100)
                    return rl_charge_0_63;

                if (this.state.i_percent > 0 && this.state.i_percent <= 63.2)
                    return rl_charge_90_99;
                else if (this.state.i_percent > 63.2 && this.state.i_percent <= 80)
                    return rl_charge_80_90;
                else if (this.state.i_percent > 80 && this.state.i_percent <= 90)
                    return rl_charge_63_80;
                else if (this.state.i_percent > 90 && this.state.i_percent <= 100)
                    return rl_charge_0_63;

                return rl_charge_background;

            case false:

                if (this.state.i_percent > 0 && this.state.i_percent <= 10)
                    return rl_discharge_90_99;
                else if (this.state.i_percent > 10 && this.state.i_percent <= 20)
                    return rl_discharge_80_90;
                else if (this.state.i_percent > 20 && this.state.i_percent <= 37.7)
                    return rl_discharge_63_80;
                else if (this.state.i_percent > 37.7 && this.state.i_percent <= 100)
                    return rl_discharge_0_63;

                return rl_discharge_background;
        }

        //return undefined;
    }

    // ************************************
    //      UPDATE CHARGING
    // ************************************
    updateCharging() {
        this.setState(prevState => {
            return {
                ...prevState,
                inductorCharging: !prevState.inductorCharging,
                t_i: 0,
                t_a: 0,
                i_data: [],
                vl_data: [],
                vr_data: [],
                e_data: [],
                phi_data: [],
                data_length: 0,
                running: true,
                i_percent: !prevState.inductorCharging ? 0 : 100,
                condition_complete: false,
            }
        });
    }


    // ******************************
    //          RESET ARRAY DATA
    // *******************************
    resetArrayData() {
        this.setState(prevState => {
            return {
                ...prevState,
                i_data: [],
                vl_data: [],
                vr_data: [],
                e_data: [],
                phi_data: [],
                data_length: 0,
                t_i: 0,
                t_a: 0,
                running: true,
                i_percent: this.state.inductorCharging ? 0 : 100,
                condition_complete: false,
                referenced_lines: []
            }
        });
    }

    // **********************************
    // RESET TIMES
    // **********************************
    resetTimes() {
        this.setState(prevState => {
            return {
                ...prevState,
                t_i: 0,
                t_a: 0
            }
        });
    }

    resetAbsoluteTime() {
        this.setState(prevState => {
            return {
                ...prevState,
                t_a: 0,
            }
        });
    }



    // *****************************
    //      UPDATE CONDITION STATE
    // ******************************
    updateConditionState(cState) {
        this.setState(prevState => {
            return {
                ...prevState,
                condition_complete: cState,
            }
        });
    }

    // ******************************
    //  UPDATE RUNNING
    // ******************************
    updateRunning() {
        if (!this.state.condition_complete) {
            this.setState(prevState => {
                return {
                    ...prevState,
                    running: !this.state.running,
                    condition_complete: false
                }
            });
        }
    }

    // **************************************
    //          CANVAS
    // **************************************
    turnOnCanvas(canvas) {
        if (this.state.running)
            this.updateRunning()

        this.setState(prevState => {
            return {
                ...prevState,
                showCanvas: true,
                currentCanvas: canvas
            }
        });
    }

    turnOffCanvas() {
        this.setState(prevState => {
            return {
                ...prevState,
                showCanvas: false
            }
        });
    }

    // **************************************
    //      UPDATE MAX. VALUES
    // **************************************
    updateMaxValues() {
        this.setState(prevState => {
            return {
                ...prevState,
                i_max: prevState.V / prevState.R
            }
        });
    }

    // ****************************************
    //      UPDATE MAX DATA ALLOWED
    // *****************************************
    updateMaxDataAllowed() {
        this.setState(prevState => {
            return {
                ...prevState,
                max_cu_allowed : prevState.V / (1 * prevState.R_m),
                max_vr_allowed : prevState.V,
                max_vl_allowed : prevState.V,
                max_e_allowed  : (1/2) * 1 * Math.pow(prevState.V / (1 * prevState.R_m),2),
                max_phi_allowed: 1 * prevState.V / (1 * prevState.R_m)

            }
        })
    }

    // **********************************
    //      SELECTED CONDITION
    // **********************************
    updateSelectedCondition(nCondition) {
        this.setState(prevState => {
            return {
                ...prevState,
                selected_stop_condition: nCondition
            }
        });
    }

    updateConditionValue(nConditionValue) {
        this.setState(prevState => {
            return {
                ...prevState,
                value_stop_condition: nConditionValue
            }
        })
    }

    // *************************************
    //      RESISTOR CONTROLLER
    // *************************************
    updateResistorValue(value) {
        this.setState(prevState => {
            return {
                ...prevState,
                R_v: parseFloat(value),
                R: parseFloat(value) * prevState.R_m,
                t_i: 0,
            }
        });

        //this.resetArrayData();
        this.updateMaxValues();
    }

    updateResistorMultiplier(multiplier) {
        this.setState(prevState => {
            return {
                ...prevState,
                R_m: valueOfMultiplier(multiplier),
                R: prevState.R_v * valueOfMultiplier(multiplier),
                t_i: 0,
            }
        });

        //this.resetArrayData();
        this.updateMaxValues();
    }

    updateColorBands(value, multiplier) {
        this.setState(prevState => {
            return {
                ...prevState,
                R_color_bands: calculateColorBands(parseFloat(value), multiplier),
            }
        });

        this.updateMaxValues();
    }

    // *************************************
    //      INDUCTOR CONTROLLER
    // *************************************
    updateInductorValue(value) {
        this.setState(prevState => {
            return {
                ...prevState,
                L_v: parseFloat(value),
                L: parseFloat(value) * prevState.L_m,
                t_i: 0
            }
        });
        //this.resetArrayData();
        this.updateMaxValues();
    }

    updateInductorMultiplier(multiplier) {
        this.setState(prevState => {
            return {
                ...prevState,
                L_m: getInductorMult(multiplier),
                L: prevState.L_v * getInductorMult(multiplier),
                t_i: 0
            }
        });
        //this.resetArrayData();
        this.updateMaxValues();
    }

    // *************************************
    //                  RENDER
    // *************************************
    render() {
        return this.state.width >= MAX_WIDTH ? (
            /*  MAIN */
            <div style={{ 'marginLeft': '1%', 'marginRight': '1%' }}>
                {/*  */}
                <Row style={{ 'marginTop': '0.5%' }}>
                    <Col xs={7} sm={7} md={7} lg={7} xl={7} xxl={7} style={{ 'marginTop': '5%' }}>
                        <Carousel variant="dark" interval={null} controls={true} style={{ 'padding': '5%' }} slide={false}>
                            {/*  CURRENT */}
                            <Carousel.Item>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                    <div style={{
                                        paddingBottom: '50%', /* 16:9 */
                                        position: 'relative',
                                        height: 0
                                    }} >
                                        <div style={{
                                            position: 'absolute',
                                            top: '0',
                                            left: '7%',
                                            width: '100%',
                                            height: '100%'
                                        }}>
                                            <ResponsiveContainer width="85%" height="100%">
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
                                                    <XAxis dataKey="t" tick={false} label={{ 'value': 'Tiempo (s)', 'position': 'insideRight' }} />
                                                    <YAxis type="number" tick={false} label={{ 'value': 'I (amperios)', 'angle': '-90' }} 
                                                      domain={[0,this.state.max_cu_allowed]}/>
                                                    {
                                                        (() => {
                                                            if (!this.state.running) {
                                                                return (
                                                                    <Tooltip formatter={(value, name, props) => {
                                                                        return [`${Number.parseFloat(value).toExponential(3)} A`, 'I(t)']
                                                                    }}
                                                                        cursor={false} />
                                                                )
                                                            }
                                                        })()
                                                    }

                                                    <Legend verticalAlign="top" align="right" iconType="circle" margin={{ top: 0, left: 0, right: 0, bottom: 10 }} />
                                                    <Line type="monotone" dataKey="I(t)" stroke="orange" strokeWidth={3} dot={false} isAnimationActive={false} />
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
                                <br /> <br /> <br />
                                <Carousel.Caption>
                                    <Button variant="outline-secondary" onClick={(ev) => {this.turnOnCanvas(I_CANVAS)}}>Intensidad de corriente</Button>
                                </Carousel.Caption>
                            </Carousel.Item>

                            {/* VL AND VR GRAPHS*/}
                            <Carousel.Item>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                    <div style={{
                                        paddingBottom: '50%', /* 16:9 */
                                        position: 'relative',
                                        height: 0
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: '0',
                                            left: '7%',
                                            width: '50%',
                                            height: '100%'
                                        }}>
                                            <ResponsiveContainer width="85%" height="100%">
                                                <LineChart
                                                    width={400}
                                                    height={250}
                                                    data={this.state.vl_data}
                                                    margin={{
                                                        top: 5,
                                                        right: 30,
                                                        left: 20,
                                                        bottom: 5,
                                                    }}

                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="t" tick={false} label={{ 'value': 'Tiempo (s)', 'position': 'insideRight' }} />
                                                    <YAxis type="number" tick={false} label={this.state.inductorCharging ? { 'value': 'Vl (voltios)', 'angle': '-90' } : { 'value': '- Vl (voltios)', 'angle': '-90' }} 
                                                     domain={this.state.inductorCharging ? [0, this.state.max_vl_allowed] : [-this.state.max_vl_allowed, 0]}/>

                                                    {
                                                        (() => {
                                                            if (!this.state.running) {
                                                                return (
                                                                    <Tooltip formatter={(value, name, props) => {
                                                                        return [`${Number.parseFloat(value).toExponential(3)} V`, 'Vl(t)']
                                                                    }}
                                                                        cursor={false} />
                                                                )
                                                            }
                                                        })()
                                                    }


                                                    <Legend verticalAlign="top" align="right" iconType="circle" margin={{ top: 0, left: 0, right: 0, bottom: 10 }} />
                                                    <Line type="monotone" dataKey="Vl(t)" stroke="blue" strokeWidth={3} dot={false} isAnimationActive={false} />
                                                    {
                                                        this.state.show_reference_lines ?
                                                            this.state.referenced_lines.map((r_line) => {
                                                                return (
                                                                    <ReferenceLine key={`vl_${this.state.t_a}_${Math.random() * 10 + this.state.t_a}`} x={r_line} stroke="black" strokeWidth={1} strokeDasharray="3 3" />
                                                                )
                                                            }) : "reference_line not showed"
                                                    }
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div style={{
                                            position: 'absolute',
                                            top: '0',
                                            left: '50%',
                                            width: '50%',
                                            height: '100%'
                                        }}>
                                            <ResponsiveContainer width="85%" height="100%">
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
                                                    <XAxis dataKey="t" tick={false} label={{ 'value': 'Tiempo (s)', 'position': 'insideRight' }} />
                                                    <YAxis type="number" tick={false} label={{ 'value': 'Vr (voltios)', 'angle': '-90' }} 
                                                     domain={[0, this.state.max_vr_allowed]}/>

                                                    {
                                                        (() => {
                                                            if (!this.state.running) {
                                                                return (
                                                                    <Tooltip formatter={(value, name, props) => {
                                                                        return [`${Number.parseFloat(value).toExponential(3)} V`, 'Vr(t)']
                                                                    }}
                                                                        cursor={false} />
                                                                )
                                                            }
                                                        })()
                                                    }


                                                    <Legend verticalAlign="top" align="right" iconType="circle" margin={{ top: 0, left: 0, right: 0, bottom: 10 }} />
                                                    <Line type="monotone" dataKey="Vr(t)" stroke="green" strokeWidth={3} dot={false} isAnimationActive={false} />
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
                                <br /> <br /> <br />
                                <Carousel.Caption>
                                <Row>
                                        <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}>
                                            <Button variant="outline-secondary" onClick={(ev) => { this.turnOnCanvas(VL_CANVAS) }}>DDP Inductor</Button>
                                        </Col>
                                        <Col></Col>
                                        <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}>
                                            <Button variant="outline-secondary" onClick={(ev) => { this.turnOnCanvas(VR_CANVAS) }}>DDP Resistencia</Button>
                                        </Col>
                                    </Row>
                                </Carousel.Caption>
                            </Carousel.Item>

                            
                            {/* ENERGY AND PHI GRAPHS*/}
                            <Carousel.Item>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                    <div style={{
                                        paddingBottom: '50%', /* 16:9 */
                                        position: 'relative',
                                        height: 0
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: '0',
                                            left: '7%',
                                            width: '50%',
                                            height: '100%'
                                        }} >
                                            <ResponsiveContainer width="85%" height="100%">
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
                                                    <XAxis dataKey="t" tick={false} label={{ 'value': 'Tiempo (s)', 'position': 'insideRight' }} />
                                                    <YAxis type="number" tick={false} label={{ 'value': 'Em (julios)', 'angle': '-90' }} 
                                                     domain={[0, this.state.max_e_allowed]}/>
                                                    {
                                                        (() => {
                                                            if (!this.state.running) {
                                                                return (
                                                                    <Tooltip formatter={(value, name, props) => {
                                                                        return [`${Number.parseFloat(value).toExponential(3)} J`, 'E(t)']
                                                                    }}
                                                                        cursor={false} />
                                                                )
                                                            }
                                                        })()
                                                    }

                                                    <Legend verticalAlign="top" align="right" iconType="circle" margin={{ top: 0, left: 0, right: 0, bottom: 10 }} />
                                                    <Line type="monotone" dataKey="E(t)" stroke="#eb3474" strokeWidth={3} dot={false} isAnimationActive={false} />
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

                                        <div style={{
                                            position: 'absolute',
                                            top: '0',
                                            left: '50%',
                                            width: '50%',
                                            height: '100%'
                                        }}>
                                            <ResponsiveContainer width="85%" height="100%">
                                                <LineChart
                                                    width={400}
                                                    height={250}
                                                    data={this.state.phi_data}
                                                    margin={{
                                                        top: 5,
                                                        right: 30,
                                                        left: 20,
                                                        bottom: 5,
                                                    }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="t" tick={false} label={{ 'value': 'Tiempo (s)', 'position': 'insideRight' }} />
                                                    <YAxis type="number" tick={false} label={{ 'value': 'Φ (weber)', 'angle': '-90' }} 
                                                     domain={[0, this.state.max_phi_allowed]}/>
                                                    {
                                                        (() => {
                                                            if (!this.state.running) {
                                                                return (
                                                                    <Tooltip formatter={(value, name, props) => {
                                                                        return [`${Number.parseFloat(value).toExponential(3)} Wb`, 'Φ(t)']
                                                                    }}
                                                                        cursor={false} />
                                                                )

                                                            }
                                                        })()
                                                    }

                                                    <Legend verticalAlign="top" align="right" iconType="circle" margin={{ top: 0, left: 0, right: 0, bottom: 10 }} />
                                                    <Line type="monotone" dataKey="Φ(t)" stroke="red" strokeWidth={3} dot={false} isAnimationActive={false} />
                                                    {
                                                        this.state.show_reference_lines ?
                                                            this.state.referenced_lines.map((r_line) => {
                                                                return (
                                                                    <ReferenceLine key={`phi_${this.state.t_a}_${Math.random() * 10 + this.state.t_a}`} x={r_line} stroke="black" strokeWidth={1} strokeDasharray="3 3" />
                                                                )
                                                            }) : "reference_line not showed"
                                                    }
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </Col>
                                <br /> <br /> <br />
                                <Carousel.Caption>
                                <Row>
                                        <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}>
                                            <Button variant="outline-secondary" onClick={(ev) => { this.turnOnCanvas(ENERGY_CANVAS) }}>Energía Mag. almacenada</Button>
                                        </Col>
                                        <Col></Col>
                                        <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}>
                                            <Button variant="outline-secondary" onClick={(ev) => { this.turnOnCanvas(PHI_CANVAS) }}>Flujo magnético</Button>
                                        </Col>
                                    </Row>
                                </Carousel.Caption>
                            </Carousel.Item>

                                                </Carousel>
                    </Col>

                    <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}>
                        {/* CIRCUIT PICTURE */}
                        <img alt="circuit_animation" src={this.getCurrentAnimation()} className="w-100"></img>
                        <label className="switch">
                            <input type="checkbox" onClick={(ev) => {
                                this.updateCharging();
                            }} />
                            <span className="slider"></span>
                        </label>

                        {/* BUTTONS CONTROLLER */}
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <Row>
                                <strong style={{ "textAlign": "left" }}>
                                    <OverlayTrigger
                                        key="top"
                                        placement="top"
                                        overlay={
                                            <ToolTipReact id={`tooltip-top-3`}>
                                                El tiempo de la simulación podrá no ajustarse al tiempo real del experimento debido a
                                                la escala utilizada en la generación de los datos. Concretamente, los datos son representados cada
                                                <strong> 1 ms</strong>, por lo que utilizar un circuito con una constante de tiempo muy grande
                                                puede ralentizar la obtención de resultados. Todo esto influye directamente en la pausa de la simulación
                                                si se utilizan las condiciones de parada.
                                            </ToolTipReact>
                                        }>

                                        {QUESTION_ICON}

                                    </OverlayTrigger> Condiciones de parada: </strong>
                                <Col xs={3} sm={3} md={3} lg={3} xl={3} xxl={3}>
                                    <Form.Select onChange={(ev) => {
                                        this.updateSelectedCondition(ev.target.value);
                                        this.updateConditionState(false);
                                    }} disabled={this.state.running}>
                                        <option defaultValue={true} value={WITHOUT_RESTRICTIONS}>Ninguna</option>
                                        <option value={EXACT_TIME}>Tiempo de simulación (s)</option>
                                    </Form.Select>
                                </Col>

                                <Col xs={3} sm={3} md={3} lg={3} xl={3} xxl={3}>
                                    <FormControl type="number" disabled={this.state.selected_stop_condition === WITHOUT_RESTRICTIONS || this.state.running}
                                        min={this.state.inductorCharging ? (this.state.selected_stop_condition === PERCENT_I ? (Number.parseFloat(this.state.i_percent)) : (this.state.selected_stop_condition === EXACT_TIME ? this.state.t_i : "")) : 0}
                                        max={this.state.inductorCharging ? (this.state.selected_stop_condition === PERCENT_I ? 100 : (this.state.selected_stop_condition === EXACT_TIME ? "" : "")) : (Number.parseFloat(this.state.i_percent))}
                                        onChange={(ev) => {
                                            this.updateConditionState(false);
                                            let nVal = this.state.selected_stop_condition === PERCENT_I ? Number.parseFloat(ev.target.value) :
                                                this.state.selected_stop_condition === EXACT_TIME ? Number.parseFloat(ev.target.value) :
                                                    this.state.selected_stop_condition === I_VALUE ? Number.parseFloat(ev.target.value) :
                                                        undefined;
                                            this.updateConditionValue(nVal);
                                        }}
                                    ></FormControl>
                                </Col>

                                <Col xs={3} sm={3} md={3} lg={3} xl={3} xxl={3}>
                                    {/* RUN/STOP BUTTON */}
                                    <div className="d-grid gap-2">
                                        <Button disabled={this.state.condition_complete} variant={this.state.running ? "danger" :
                                            (!this.state.condition_complete ? "outline-warning" : "secondary")}
                                            onClick={this.updateRunning} size="xs" >{this.state.running ? "STOP" : "RESUME"}</Button>
                                    </div>
                                </Col>
                                <Col xs={3} sm={3} md={3} lg={3} xl={3} xxl={3}>
                                    {/* RELOAD BUTTON */}
                                    <div className="d-grid gap-2">
                                        <Button variant={"outline-info"} onClick={(ev) => {
                                            this.resetArrayData();
                                            this.resetTimes();
                                            this.updateMaxValues();
                                        }} size="xs" >RELOAD</Button>
                                    </div>

                                </Col>
                            </Row>
                            <br></br>
                            <Row></Row>
                        </Col>

                        {/* CIRCUIT CONTROLLERS */}
                        <Row className="justify-content-center">
                            {/*  INDUCTOR CONTROLLER */}
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                <Row>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <Row>
                                            <Col sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <input type="range" className="form-range" min="0.01" max={this.state.L_m === 1 ? 1 : 100} step="0.01"
                                                    onChange={(ev) => {
                                                        this.updateInductorValue(ev.target.value);

                                                    }}
                                                />
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <select className="form-select component-value" aria-label="Default select example" onChange={(ev) => {
                                                    this.updateInductorMultiplier(ev.target.value)
                                                }} disabled={this.state.showMultipliers === false}>
                                                    <option defaultValue={true} value="H">{this.state.L_v} H </option>
                                                    <option value="miliH">{this.state.L_v} miliH</option>
                                                </select>

                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <div className="wire-box">
                                                    <div className="lines-content-box">
                                                        <div className="hr-1"></div>
                                                        <div className="hr-2"></div>
                                                        <div className="hr-1"></div>
                                                        <div className="hr-2"></div>
                                                        <div className="hr-1"></div>
                                                        <div className="hr-2"></div>
                                                        <div className="hr-1"></div>
                                                        <div className="hr-2"></div>
                                                        <div className="hr-1"></div>

                                                        {
                                                            (() => {
                                                                if (this.state.width >= 1100) {
                                                                    return (
                                                                        <div className="label_current">{Number.parseFloat(this.state.i_0).toExponential(3)} A</div>
                                                                    )
                                                                }
                                                            })()
                                                        }

                                                        {
                                                            (() => {
                                                                if (this.state.i_percent > 0 && this.state.running) {
                                                                    return (
                                                                        <div className="arrow-box">
                                                                            <div className="arrow">
                                                                                <span></span>
                                                                                <span></span>
                                                                                <span></span>
                                                                                <span></span>
                                                                                <span></span>
                                                                                <span></span>
                                                                            </div>
                                                                        </div>
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
                            
                            {/* RESISTOR CONTROLLER */}
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                <Row>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <Row>
                                            <Col sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <input type="range" className="form-range" min="1" max="9" step="0.01"
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
                                                    <option defaultValue={true} value="x1K">{Number.parseFloat(this.state.R_v).toFixed(2)} KΩ</option>
                                                    <option value="x1M">  {Number.parseFloat(this.state.R_v).toFixed(2)} MΩ</option>
                                                </select>

                                            </Col>
                                            <Container>
                                                <Row>
                                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} >
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
                        </Row>
                    </Col>
                </Row>
                {/* THEORY CANVAS */}
                <Offcanvas show={this.state.showCanvas} onHide={(ev)=> {this.turnOffCanvas()}} placement="end">
                                                <Offcanvas.Header closeButton>
                                                    <Offcanvas.Title>
                                                        <h1>Circuito RL</h1>
                                                    </Offcanvas.Title>
                                                </Offcanvas.Header>
                                                <Offcanvas.Body>
                                                    {
                                                        (() => {
                                                            if (this.state.currentCanvas === I_CANVAS){
                                                                /* INDUCTOR CURRENT THEORY */
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
                                                                        En este caso, calcularemos la función de la intensidad de corriente utilizando la <strong>ley de Ohm</strong> junto a la <strong>ley de Lenz</strong>, aplicadas a la expresión resultante de realizar un balance energético del circuito, 
                                                                        <br /> <br/>
                                                                        <div style={{"textAlign" : "center"}}>
                                                                            <img alt="balance_energetico_rl" src={balance_energetico_rl} style={{"width" : "45%"}}></img>
                                                                        </div>
                                                                        <br />
                                                                        
                                                                        quedando planteada la siguiente ecuación diferencial.
                                                                        <br /> <br/>
                                                                        <div style={{"textAlign" : "center"}}>
                                                                            <img alt="eq_diff_intensidad_rl" src={eq_diff_intensidad_rl} style={{"width" : "45%"}}></img>
                                                                        </div>
                                                                        <br />
                                                                        Para resolverla, supondremos los siguientes casos iniciales dependiendo del estado en el que estemos:
                                                                        <ul>
                                                                            <li>
                                                                                Durante el <strong>almacenamiento</strong> de energía en la bobina, consideraremos que inicialmente la intensidad de corriente que 
                                                                                circula por el circuito es nula, obteniendo el siguiente resultado.
                                                                                <br /> <br/>
                                                                                <div style={{"textAlign" : "center"}}>
                                                                                    <img alt="intensidad_rl_1" src={intensidad_rl_1} style={{"width" : "45%"}}></img>
                                                                                </div>
                                                                                <br />
                                                                            </li>
                                                                            <li>
                                                                                Por otro lado, durante el estado de <strong>disipación</strong> de energía, el valor de la fuente es cero y comenzaremos suponiendo que inicialmente 
                                                                                la intensidad de corriente es máxima, es decir, que el inductor se encuentra almacenando toda la energía posible. La expresión que modela la intensidad de corriente 
                                                                                en estado de disipación es:
                                                                                <br /> <br/>
                                                                                <div style={{"textAlign" : "center"}}>
                                                                                    <img alt="intensidad_rl_2" src={intensidad_rl_2} style={{"width" : "40%"}}></img>
                                                                                </div>
                                                                            </li>
                                                                        </ul>
                                                                        
        
                                                                        
                                                                    </>
                                                                )
                                                            }else if (this.state.currentCanvas === VR_CANVAS) {
                                                                /* VR THEORY */
                                                                return (
                                                                    <>
                                                                        <h4>Diferencia de potencial en la resistencia</h4>
                                                                        Utilizando la <i>Ley de Ohm</i> podemos obtener cuál es la diferencia de potencial entre los bornes 
                                                                        de la resistencia. Este dato, junto a la <i>ddp</i> en la bobina, pueden ser de utilidad para comprobar que el 
                                                                        principio de conservación de la energía se cumple en el circuito. Se muestran a continuación, las expresiones que 
                                                                        modelan el comportamiento de este parámetro,
                                                                        <br /> <br/>
                                                                        <div style={{"textAlign" : "center"}}>
                                                                            <img alt="ddp_resistencia_rl_1" src={ddp_resistencia_rl_1} style={{"width" : "45%"}}></img>
                                                                        </div>
                                                                        <br />
                                                                        <div style={{"textAlign" : "center"}}>
                                                                            <img alt="ddp_resistencia_rl_2" src={ddp_resistencia_rl_2} style={{"width" : "40%"}}></img>
                                                                        </div>
                                                                        <br />.
                                                                        para los estados de <strong>almacenamiento</strong> y <strong>disipación</strong> de energía respectivamente.
                                                                    </>
                                                                )
                                                            }else if (this.state.currentCanvas === VL_CANVAS) {
                                                                /* VL THEORY */
                                                                return (
                                                                    <>
                                                                        <h4>Diferencia de potencial en el inductor</h4>
                                                                        De igual manera que es posible obtener la diferencia de potencial en la resistencia, también podemos hallar esta <i>ddp</i> en los 
                                                                        bornes de la bobina. La evolución de este parámetro puede ser de utilidad si se quiere comprobar que efectivamente el principio de conservación 
                                                                        de la energía se cumple. Utilizando la definición de fuerza electromotriz dada por la <strong>Ley de Lenz</strong>, 
                                                                        <br /> <br/>
                                                                        <div style={{"textAlign" : "center"}}>
                                                                            <img alt="ddp_inductor" src={ddp_inductor} style={{"width" : "40%"}}></img>
                                                                        </div>
                                                                        <br />
                                                                        Aplicando las diferentes expresiones obtenidas de la intensidad de corriente, concluimos que la diferencia de potencial en el inductor durante  
                                                                        el <strong>almacenamiento</strong> y <strong> disipación</strong> de energía son, respectivamente:
                                                                        <br /> <br/>
                                                                        <div style={{"textAlign" : "center"}}>
                                                                            <img alt="ddp_inductor_1" src={ddp_inductor_1} style={{"width" : "40%"}}></img>
                                                                        </div>
                                                                        <br />
                                                                        <div style={{"textAlign" : "center"}}>
                                                                            <img alt="ddp_inductor_2" src={ddp_inductor_2} style={{"width" : "40%"}}></img>
                                                                        </div>
                                                                        <br />
                                                                    </>
                                                                )
                                                            }else if (this.state.currentCanvas === ENERGY_CANVAS) {
                                                                /* ENERGY THEORY */
                                                                return (
                                                                    <>
                                                                    <h4>Energía almacenada</h4>
                                                                    Hallamos la energía almacenada en el campo magnético del inductor aplicando el concepto de <strong>potencia consumida</strong> en 
                                                                    este dispositivo
                                                                    <br /> <br/>
                                                                        <div style={{"textAlign" : "center"}}>
                                                                            <img alt="potencia_consumida_inductor" src={potencia_consumida_inductor} style={{"width" : "40%"}}></img>
                                                                        </div>
                                                                        <br />
                                                                    Y por definición, la energía almacenada es la potencia por unidad de tiempo
                                                                    <br /> <br/>
                                                                        <div style={{"textAlign" : "center"}}>
                                                                            <img alt="energia_consumida" src={energia_consumida} style={{"width" : "40%"}}></img>
                                                                        </div>
                                                                        <br />
                                                                    Dónde obtenemos la siguiente ecuación diferencial a resolver
                                                                    <br /> <br/>
                                                                        <div style={{"textAlign" : "center"}}>
                                                                            <img alt="energia_ec_diff" src={energia_ec_diff} style={{"width" : "45%"}}></img>
                                                                        </div>
                                                                        <br />
                                                                    Partiendo de un circuito en el que la corriente eléctrica que circula es nula y dónde la energía almacenada 
                                                                    por el inductor también lo es (inicialmente supondremos un estado de equilibrio), la expresión que modela la energía 
                                                                    almacenada es:
                                                                    <br /> <br/>
                                                                        <div style={{"textAlign" : "center"}}>
                                                                            <img alt="energia_almacenada_rl" src={energia_almacenada_rl} style={{"width" : "50%"}}></img>
                                                                        </div>
                                                                        <br />
                                                                    </>        
                                                                )
                                                            }else if (this.state.currentCanvas === PHI_CANVAS) {
                                                                /* MAGNETIC FLUX THEORY */
                                                                return (
                                                                    <>
                                                                        <h4>Flujo magnético</h4>
                                                                       Se define <strong>flujo magnético</strong>, como la cantidad de <i>campo magnético</i> que atraviesa una superficie.
                                                                       <br />
                                                                       Según esta definición, su expresión es:
                                                                       <br /> <br/>
                                                                        <div style={{"textAlign" : "center"}}>
                                                                            <img alt="def_flujo_magnetico" src={def_flujo_magnetico} style={{"width" : "25%"}}></img>
                                                                        </div>
                                                                        <br/>
                                                                        , aunque la expresión que modela este parámetro en función del tiempo puede obtenerse utilizando la <strong>ley de Lenz</strong>, 
                                                                        sabiendo que esta es directamente proporcional con la intensidad de corriente y que, a esta constante, es 
                                                                        el <strong>coeficiente de autoinducción</strong> del inductor.
                                                                        <br /> <br/>
                                                                        <div style={{"textAlign" : "center"}}>
                                                                            <img alt="flujo_magnetico" src={flujo_magnetico} style={{"width" : "30%"}}></img>
                                                                        </div>
                                                                        <br/>
                                                                    </>
                                                                )
                                                            }else {
                                                                return (
                                                                    <h2>ERROR</h2>
                                                                )
                                                            }
                                                        })()
                                                    }
                                                </Offcanvas.Body>
                </Offcanvas>
            </div>
        ) : (
            <div style={{ 'margin': '1%' }}>
                <Alert variant="danger">
                    <Alert.Heading>La simulación del circuito RC no puede mostrarse</Alert.Heading>
                    <p>Actualmente esta aplicación no se encuentra adaptada a todos los dispositivos. Para aquellos con un ancho de pantalla menor a
                        <strong> {MAX_WIDTH}</strong> o con dimensiones inferiores a <strong>10''</strong> los componentes no son mostrados adecuadamente.
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