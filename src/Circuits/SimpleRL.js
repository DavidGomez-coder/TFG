import React, { Component } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import Offcanvas from 'react-bootstrap/Offcanvas';


import { EXACT_TIME, I_VALUE, MAX_DATA, PERCENT_I, SIMULATION_EXEC, SIMULATION_STEP, WITHOUT_RESTRICTIONS } from "../Utils/Utils";

// functions
import { getChargeInstant, getDischargeInstant } from "../Utils/RLFormulas";
import { getInductorMult } from "./Inductor/InductorData";
import { calculateColorBands, valueOfMultiplier } from "./Resistor/Resistor";
import { getCellMultiplier } from "./Cell/Cell";

import { QUESTION_ICON } from "../Utils/Utils";
import { Row, Col, Container, Alert, Button, OverlayTrigger, Form, Tooltip as ToolTipReact, FormControl } from "react-bootstrap";

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

// otras
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


// OFF- CANVAS
const I_CURRENT_CANVAS = 1;
const VL_CANVAS = 2;
const VR_CANVAS = 3;
const ENERGY_CANVAS = 4;
const PHI_CANVAS = 5;
const LEY_OHM_CANVAS = 6; //resistance
const FEM_CANVAS = 7; //cell
const AUTOINDUCCION_CANVAS = 8;


export default class SimpleRl extends Component {

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
            i_data: [],
            vl_data: [],
            vr_data: [],
            e_data: [],
            phi_data: [],
            //components value
            L: 10,
            R: 3,
            V: 5,
            i_0: 0,
            //others
            R_v: 3,
            R_m: 1,
            R_color_bands: [],
            L_v: 10,
            L_m: 1,
            V_v: 5,
            V_m: 1,
            //itensidad maxima
            i_max: 10 / 5,
            i_percent: 0,
            //circuit state
            inductorCharging: true,
            data_length: 0,
            //simulation state
            running: false,
            //time interval id
            intervalId: 0,
            //reset on component change
            reset_on_component_change: false,
            //referenced lines (changes between data values)
            referenced_lines: [],
            show_reference_lines: false,
            width: document.documentElement.clientWidth

        }

        this.updateCharging = this.updateCharging.bind(this);
        this.updateRunning = this.updateRunning.bind(this);
        this.updateReferenceLine = this.updateReferenceLine.bind(this);
    }

    updateDimensions() {
        this.setState({
            width : document.documentElement.clientWidth
        })
    }

    componentDidMount() {
        //update dimensions
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));

        //controller
        this.updateColorBands(this.state.R_v, this.state.R_m);
        const newInterval = setInterval(() => {
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
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            i_data: [...oldIData, { "t": Number.parseFloat(t_a).toExponential(4), "I(t)": instant_values.I }],
                            vr_data: [...oldVrData, { "t": Number.parseFloat(t_a).toExponential(4), "Vr(t)": instant_values.Vr }],
                            vl_data: [...oldVlData, { "t": Number.parseFloat(t_a).toExponential(4), "Vl(t)": instant_values.Vl }],
                            e_data: [...oldEData, { "t": Number.parseFloat(t_a).toExponential(4), "E(t)": instant_values.E }],
                            phi_data: [...oldPhiData, { "t": Number.parseFloat(t_a).toExponential(4), "Φ(t)": instant_values.PHI }],
                            //time update
                            t_i: t_i + ((SIMULATION_STEP * prevState.simulation_step_multiplier) / 1000),
                            t_a: t_a + ((SIMULATION_STEP * prevState.simulation_step_multiplier) / 1000),
                            //current i max update
                            i_0: instant_values.I,
                            i_percent: Number.parseFloat((instant_values.I / prevState.i_max) * 100).toFixed(2),
                            //data length update
                            data_length: prevState.data_length + 1
                        }
                    });
                }

                
            }
        }, SIMULATION_EXEC);

        //update time interval id
        this.setState(prevState => {
            return {
                ...prevState,
                intervalId: newInterval
            }
        });
    }

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

    getCurrentAnimation() {

        switch(this.state.inductorCharging) {
            case true:

                if (!this.state.running)
                    return rl_charge_background;
                
                if (this.state.i_percent <= 63.2)
                    return rl_charge_90_99;
                else if (this.state.i_percent > 63.2 && this.state.i_percent <= 80)
                    return rl_charge_80_90;
                else if (this.state.i_percent > 80 && this.state.i_percent <= 90)
                    return rl_charge_63_80;
                else if (this.state.i_percent > 90 && this.state.i_percent <= 100)
                    return rl_charge_0_63;


                return rl_charge_background;

                case false:
                    if (!this.state.running)
                        return rl_discharge_background;
                    
                    if (this.state.i_percent <= 10) 
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
        })
    }

    updateConditionState(cState) {
        this.setState(prevState => {
            return {
                ...prevState,
                condition_complete: cState
            }
        });
    }

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

    updateMaxValues() {
        this.setState(prevState => {
            return {
                ...prevState,
                i_max: prevState.V / prevState.R,
                vr_max: prevState.V,
                vl_max: prevState.R * prevState.V,
                e_max: (1 / 2) * prevState.L * Math.pow(prevState.V / prevState.R, 2),
                phi_max: prevState.L * (prevState.V / prevState.R)
            }
        });
    }

    updateSelectedCondition(nCondition) {
        this.setState(prevState => {
            return {
                ...prevState,
                selected_stop_condition: nCondition
            }
        })
    }

    updateConditionValue(nConditionValue) {
        this.setState(prevState => {
            return {
                ...prevState,
                value_stop_condition: nConditionValue
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

    resetAbsoluteTime() {
        this.setState(prevState => {
            return {
                ...prevState,
                t_a: 0,
                referenced_lines: []
            }
        });
    }

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

    /**
     * RESISTOR CONTROLLER
     */
    updateResistorValue(value) {
        this.setState(prevState => {
            return {
                ...prevState,
                R_v: parseFloat(value),
                R: parseFloat(value) * prevState.R_m,
                t_i: 0,
            }
        });

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
        });

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



    /**
     * INDUCTOR CONTROLLER
     */
    updateInductorMultiplier(multiplier) {
        this.setState(prevState => {
            return {
                ...prevState,
                L_m: getInductorMult(multiplier),
                L: prevState.L_v * getInductorMult(multiplier),
                t_i: 0,
            }
        });

        if (this.state.reset_on_component_change)
            this.resetDataArray();
        this.updateMaxValues();
        this.addReferenceLine(this.state.t_a);
    }

    updateInductorValue(value) {
        this.setState(prevState => {
            return {
                ...prevState,
                L_v: parseFloat(value),
                L: parseFloat(value) * prevState.L_m,
                t_i: 0,
            }
        });

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
                V: parseFloat(value) * prevState.V_m,
                t_i: 0,
            }
        });

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
        });

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
        return this.state.width >= 1280 ? 
                (
                        <div style={{ "paddingLeft": "1%", "paddingRight": "1%" }}>
                            {/* UP ROW */}
                            <Row style={{"marginTop" : "1%"}}>
                                {/* DATA CHARTS */}
            
                                <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                    
                                    <Row className="d-flex p-15">
                                        {/* I */}
                                        <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                            <div style={{
                                                paddingBottom: '50%', /* 16:9 */
                                                position: 'relative',
                                                height: 0
                                            }} onClick={(ev) => {this.turnOnCanvas(I_CURRENT_CANVAS)}}>
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
                                                            <XAxis dataKey="t" tick={false} label={{'value': 'Tiempo (s)', 'position' : 'insideRight'}}/>
                                                            <YAxis type="number" tick={false} label={{'value' : 'I (amperios)', 'angle' : '-90'}}/>
                                                            {
                                                                (() => {
                                                                    if (!this.state.running) {
                                                                        return (
                                                                            <Tooltip formatter={(value, name, props) =>{ 
                                                                                return [`${Number.parseFloat(value).toExponential(3)} A`,'I(t)' ]
                                                                            }}
                                                                            cursor={false}/>
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

                                        {/* VL */}
                                        <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                            <div style={{
                                                paddingBottom: '50%', /* 16:9 */
                                                position: 'relative',
                                                height: 0
                                            }} onClick={(ev) => {this.turnOnCanvas(VL_CANVAS)}}>
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
                                                            data={this.state.vl_data}
                                                            margin={{
                                                                top: 5,
                                                                right: 30,
                                                                left: 20,
                                                                bottom: 5,
                                                            }}
            
                                                        >
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="t" tick={false} label={{'value': 'Tiempo (s)', 'position' : 'insideRight'}}/>
                                                            <YAxis type="number" tick={false} label={this.state.inductorCharging ? {'value' : 'Vl (voltios)', 'angle' : '-90'} : {'value' : '- Vl (voltios)', 'angle' : '-90'}}/>
                                                            
                                                            {
                                                                (() => {
                                                                    if (!this.state.running) {
                                                                        return (
                                                                            <Tooltip formatter={(value, name, props) =>{ 
                                                                                return [`${Number.parseFloat(value).toExponential(3)} V`,'Vl(t)' ]
                                                                            }}
                                                                            cursor={false}/>
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
                                            </div>
            
            
                                        </Col>
                                    </Row>
            
                                    <Row>
                                        {/* VR*/}
                                        <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                            <div style={{
                                                paddingBottom: '50%', /* 16:9 */
                                                position: 'relative',
                                                height: 0
                                            }} onClick={(ev) => {this.turnOnCanvas(VR_CANVAS)}}>
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
                                                            <XAxis dataKey="t" tick={false} label={{'value': 'Tiempo (s)', 'position' : 'insideRight'}}/>
                                                            <YAxis type="number" tick={false} label={{'value' : 'Vr (voltios)', 'angle' : '-90'}}/>
                                                            
                                                            {
                                                                (() => {
                                                                    if (!this.state.running) {
                                                                        return (
                                                                            <Tooltip formatter={(value, name, props) =>{ 
                                                                                return [`${Number.parseFloat(value).toExponential(3)} V`,'Vr(t)' ]
                                                                            }}
                                                                            cursor={false}/>
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
                                        
                                        {/* ENERGY */}
                                        <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                            <div style={{
                                                paddingBottom: '50%', /* 16:9 */
                                                position: 'relative',
                                                height: 0
                                            }} onClick={(ev) => {this.turnOnCanvas(ENERGY_CANVAS)}}>
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '0',
                                                    left: '0',
                                                    width: '100%',
                                                    height: '100%'
                                                }} >
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
                                                            <XAxis dataKey="t" tick={false} label={{'value': 'Tiempo (s)', 'position' : 'insideRight'}}/>
                                                            <YAxis type="number" tick={false} label={{'value' : 'E (julios)', 'angle' : '-90'}}/>
                                                            {
                                                                (() => {
                                                                    if (!this.state.running) {
                                                                        return (
                                                                            <Tooltip formatter={(value, name, props) =>{ 
                                                                                return [`${Number.parseFloat(value).toExponential(3)} J`,'E(t)' ]
                                                                            }}
                                                                            cursor={false}/>
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
                                            </div>
                                        </Col>
            
                                    </Row>
                                    { /* PHI */}
                                    <Row>
                                        <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                            <div style={{
                                                paddingBottom: '50%', /* 16:9 */
                                                position: 'relative',
                                                height: 0
                                            }} onClick={(ev) => {this.turnOnCanvas(PHI_CANVAS)}}>
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
                                                            data={this.state.phi_data}
                                                            margin={{
                                                                top: 5,
                                                                right: 30,
                                                                left: 20,
                                                                bottom: 5,
                                                            }}
                                                        >
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="t" tick={false} label={{'value': 'Tiempo (s)', 'position' : 'insideRight'}}/>
                                                            <YAxis type="number" tick={false} label={{'value' : 'Φ (weber)', 'angle' : '-90'}}/>
                                                            {
                                                                (() => {
                                                                    if (!this.state.running) {
                                                                        return (
                                                                            <Tooltip formatter={(value, name, props) =>{ 
                                                                                return [`${Number.parseFloat(value).toExponential(3)} Wb`,'Φ(t)' ]
                                                                            }}
                                                                        cursor={false}/>
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
            
                                        {/* BUTTONS CONTROLLER */}
                                        <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
            
            
            
                                            <Row>
                                                <strong style={{ "textAlign": "left" }}>
                                                    <OverlayTrigger
                                                        key="top"
                                                        placement="top"
                                                        overlay={
                                                            <ToolTipReact id={`tooltip-top-3`}>
                                                                Los resultados obtenidos dependerán de la <strong>escala de tiempo</strong> utilizada.
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
                                                        <option value={PERCENT_I}>Intensidad de corriente (%)</option>
                                                        <option value={I_VALUE}>Intensidad de corriente (A)</option>
                                                        <option value={EXACT_TIME}>Tiempo de simulación (s)</option>
                                                    </Form.Select>
            
                                                </Col>
            
                                                <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}>
                                                    <FormControl type="number" disabled={this.state.selected_stop_condition === WITHOUT_RESTRICTIONS || this.state.running}
                                                        min={
                                                            this.state.inductorCharging ? (this.state.selected_stop_condition === PERCENT_I ? (Number.parseFloat(this.state.i_percent)) : (this.state.selected_stop_condition === EXACT_TIME ? this.state.t_i : "")) : 0}
                                                        max={this.state.inductorCharging ? (this.state.selected_stop_condition === PERCENT_I ? 100 : (this.state.selected_stop_condition === EXACT_TIME ? "" : "")) : (Number.parseFloat(this.state.i_percent))
                                                        }
                                                        onChange={(ev) => {
                                                            this.updateConditionState(false);
                                                            let nVal = this.state.selected_stop_condition === PERCENT_I ? Number.parseFloat(ev.target.value) :
                                                                this.state.selected_stop_condition === EXACT_TIME ? Number.parseFloat(ev.target.value) :
                                                                    this.state.selected_stop_condition === I_VALUE ? Number.parseFloat(ev.target.value) :
                                                                        undefined;
                                                            this.updateConditionValue(nVal);
                                                        }}></FormControl>
                                                </Col>
                                            </Row>
                                            <br></br>
                                            <br></br>
                                            <Row>
                                                <Col xs={7} sm={7} md={7} lg={7} xl={7} xxl={7}>
                                                    <strong>Escala de tiempo</strong>
                                                    <Form.Select onChange={(ev) => { this.updateSimulationStepMultiplier(parseFloat(ev.target.value)) }}>
                                                    <option defaultValue={true} value="1">s (segundos)</option>
                                                    <option value="360">h (horas)</option>
                                                    <option value="60">min (minutos)</option>
                                                    <option value="0.001">ms (milisegundos)</option>
                                                    <option value="0.000001">μs (microsegundos)</option>
                                                    <option value="0.000000001">ns (nanosegundos)</option>
                                                    <option value="0.000000000001">ps (picosegundos)</option>
                                                    </Form.Select>
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
                                    <img alt="current_animation" src={this.getCurrentAnimation()} className="w-100"></img>
                                </Col>
                            </Row>
                            {/* CONTROLLERS ROW */}
                            <Row className="justify-content-md-center">

                                {/* INDUCTOR controller */}
                                <Col xs={3} sm={3} md={3} lg={3} xl={3} xxl={3}>
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                            <Row>
                                                <Col sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                    <input type="range" className="form-range" min="1" max="99" step="0.1"
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
                                                        <option value="nanoH">{this.state.L_v} nanoH</option>
                                                        <option value="microH">{this.state.L_v} microH</option>
                                                        <option value="miliH">{this.state.L_v} miliH</option>
                                                    </select>
            
                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                    <div className="wire-box" onClick={(ev) => {this.turnOnCanvas(AUTOINDUCCION_CANVAS)}}>
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
            
                                {/* Resistor controller */}
                                <Col xs={3} sm={3} md={3} lg={3} xl={3} xxl={3}>
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                            <Row>
                                                <Col sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                    <input type="range" className="form-range" min="0.01" max="9" step="0.01"
                                                        onChange={(ev) => {
                                                            this.updateResistorValue(ev.target.value);
                                                            this.updateColorBands(Number.parseFloat(ev.target.value), this.state.R_m);
                                                        }}
                                                    />
                                                </Col>
                                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                    <select className="form-select component-value" aria-label="Default select example" onChange={(ev) => {
                                                        this.updateResistorMultiplier(ev.target.value);
                                                        this.updateColorBands(this.state.R_v, valueOfMultiplier(ev.target.value));
                                                    }} disabled={this.state.showMultipliers === false}>
                                                        <option defaultValue={true} value="x1">{Number.parseFloat(this.state.R_v).toFixed(2)} Ω </option>
                                                        <option value="x0.1">{Number.parseFloat(this.state.R_v * 0.1).toFixed(2)} Ω</option>
                                                        <option value="x10">{Number.parseFloat(this.state.R_v * 10).toFixed(2)} Ω</option>
                                                        <option value="x100">{Number.parseFloat(this.state.R_v * 100).toFixed(2)} Ω</option>
                                                        <option value="x1K">{Number.parseFloat(this.state.R_v).toFixed(2)} KΩ</option>
                                                        <option value="x10K">{Number.parseFloat(this.state.R_v * 10).toFixed(2)} KΩ</option>
                                                        <option value="x100K">{Number.parseFloat(this.state.R_v * 100).toFixed(2)} KΩ</option>
                                                        <option value="x1M">  {Number.parseFloat(this.state.R_v ).toFixed(2)} MΩ</option>
                                                    </select>
            
                                                </Col>
                                                <Container>
                                                    <Row>
                                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
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
                                <Offcanvas show={this.state.showCanvas} onHide={(ev) => {this.turnOffCanvas()}} placement="end" >
                                             <Offcanvas.Header closeButton>
                                                <Offcanvas.Title>
                                                    <h1>Circuito RL</h1>
                                                </Offcanvas.Title> 
                                            </Offcanvas.Header>
                                            <Offcanvas.Body>
                                            {
                                                (() => {
                                                    if (this.state.currentCanvas === AUTOINDUCCION_CANVAS) {
                                                           /* TEORIA FENÓMENO DE AUTOINDUCCION */
                                                            return (
                                                                <>
                                                                    <h4>Fenómeno de autoinducción</h4>
                                                                    En la naturaleza, podemos encontrar regiones del espacio las cuáles se encuentran alteradas por <i>perturbaciones</i>. Estas, por ejemplo, 
                                                                    pueden ocurrir cuando una partícula en movimiento, la circulación de corriente eléctrica o un imán, se encuentran en presencia de objetos 
                                                                    con una naturaleza similar. A la irregularidad presentada por estas situaciones, se le conoce como <i>campo magnético</i>.
                                                                    <br /> 
                                                                    <br />
                                                                    Para aplicar este fenómeno, haremos uso de una <b>bobina</b>. Se trata de un dispositivo que consta de un material conductor enrollado alrededor de un núcleo, 
                                                                    normalmente de aire o de algún material ferroso que, al ser atravesado por una corriente eléctrica, crea un campo magnético.
                                                                    <br />
                                                                    <br />
                                                                    Si hacemos variar esta intensidad de corriente, también aumentamos o disminuimos el campo magnético creado por el inductor que, al mismo tiempo, produce una variación 
                                                                    en el flujo magnético de la bobina, produciendo así una <i>F.E.M autoinducida</i>. Según la <i>Ley de Faraday-Lenz</i>, la F.E.M inducida es directamente proporcional 
                                                                    a la variación del flujo magnético.
                                                                    <br /> <br />
                                                                    <div style={{"textAlign" : "center"}}>
                                                                        <img alt="faraday_lenz" src={faraday_lenz} style={{"width" : "50%"}}></img>
                                                                    </div>
                                                                    <br />
                                                                    A este parámetro que relaciona el flujo magnético con la F.E.M autoinducida, se le conoce como <i>coeficiente de autoinduccion</i>, 
                                                                    el cuál depende del medio y de la geometría de la bobina. Su unidad en el Sistema Internacional es el <i>Henrio</i>.
                                                                    <br /> <br />
                                                                    <div style={{"textAlign" : "center"}}>
                                                                        <img alt="coeficiente_autoinduccion" src={coeficiente_autoinduccion} style={{"width" : "30%"}}></img>
                                                                    </div>
                                                                    <br />
                                                                </>
                                                            )
                                                            
                                                    }else if (this.state.currentCanvas === ENERGY_CANVAS){
                                                         /* TEORIA ENERGÍA ALMACENADA */
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
            
                                                    }else if (this.state.currentCanvas === I_CURRENT_CANVAS){
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
            
                                                    }else if (this.state.currentCanvas === LEY_OHM_CANVAS){
                                                         /* TEORIA LEY DE OHM */
                                                         return (
                                                            <>
                                                                <h4>Ley de Ohm</h4>
                                                                La circulación de corriente eléctrica se debe principalmente a la presencia de un <i>campo eléctrico</i> en un conductor. Este, ocasiona una <i>densidad de corriente</i> cuyo
                                                                valor depende de las propiedades del conductor. Esta relación entre <i>densidad de corriente</i> y <i>campo eléctrico</i> se conoce como <strong>Ley de Ohm</strong> y 
                                                                ambas establecen una relación directamente proporcional mediante una constante a la que llamaremos <strong>conductividad eléctrica</strong>.
                                                                <br /> <br/>
                                                                <div style={{"textAlign" : "center"}}>
                                                                    <img alt="ley_ohm_1" src={ley_ohm_1} style={{"width" : "20%"}}></img>
                                                                </div>
                                                                <br/>
                                                                Generalmente esta conductividad no depende del campo eléctrico generado. Sin embargo, la <i>Ley de Ohm</i> no es una ley que podamos encontrar en la naturaleza, sino que se trata 
                                                                de una descripción experimental de una propiedad que presentan la mayoría de los materiales metálicos y algunos otros (también llamados <i>conductores lineales</i>).
                                                                <br></br> <br></br>
                                                                Si un material posee una conductividad constante a lo largo del tiempo y la sección de este conductor es uniforme, entonces es posible obtener una expresión
                                                                simplificada a esta ley, que relaciona la <i>intensidad de corriente</i> y la <i>diferencia de potencial</i> entre dos puntos del conductor. A esta relación se le conoce 
                                                                como <i>resistencia eléctrica del conductor</i>. Podemos expresar entonces la Ley de Ohm de la siguiente manera: 
                                                                <br /> <br/>
                                                                <div style={{"textAlign" : "center"}}>
                                                                    <img alt="ley_ohm_2" src={ley_ohm_2} style={{"width" : "20%"}}></img>
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
                                                                las reacciones químicas que ocurren en los electrodos positivo y negativo, hace que en el electrodo positivo absorba electrones mientras que, en 
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
                                                    }else if (this.state.currentCanvas === PHI_CANVAS) {
                                                         /* TEORIA FLUJO MAGNÉTICO */
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
                                                    }else if (this.state.currentCanvas === VR_CANVAS){
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
                                                    }else if (this.state.currentCanvas === VL_CANVAS){
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
                ) : (
                    <div style={{'margin' : '1%'}}>
                        <Alert variant="danger">
                        <Alert.Heading>La simulación del circuito RL no puede mostrarse</Alert.Heading>
                        <p>Actualmente esta aplicación no se encuentra adaptada a todos los dispositivos. Para aquellos con un ancho de pantalla menor a  
                            <strong> 1280px</strong> o con dimensiones inferiores a <strong>10''</strong> los componentes no son mostrados adecuadamente. 
                            El ancho de su pantalla actual es de <strong>{this.state.width} px.</strong></p>
                            <hr />
                            <p className="mb-0">
                                Pruebe con otro dispositivo.
                            </p>
                    </Alert>
                    </div>
                    
                )

    }
}