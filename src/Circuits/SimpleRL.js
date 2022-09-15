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
import "./SimpleRL.css"

// otras
import ley_ohm_1 from "../assets/formula/ley_ohm_1.png";
import ley_ohm_2 from "../assets/formula/ley_ohm_2.png";
import varepsilon from "../assets/formula/varepsilon.png";


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

                    } else if (this.state.selected_stop_condition === I_VALUE && this.state.i_0 >= this.state.value_stop_condition) {
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
                            i_data: [...oldIData, { "t": t_a, "I(t)": instant_values.I }],
                            vr_data: [...oldVrData, { "t": t_a, "Vr(t)": instant_values.Vr }],
                            vl_data: [...oldVlData, { "t": t_a, "Vl(t)": instant_values.Vl }],
                            e_data: [...oldEData, { "t": t_a, "E(t)": instant_values.E }],
                            phi_data: [...oldPhiData, { "t": t_a, "PHI(t)": instant_values.PHI }],
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
        switch (this.state.inductorCharging) {

            case true:
                if (!this.state.running) {
                    return rl_charge_background;
                }

                if (this.state.i_percent == 100) {
                    return rl_charge_100;
                }

                if (this.state.i_percent <= 63.2) {
                    return rl_charge_0_63;
                } else if (this.state.i_percent > 63.2 && this.state.i_percent <= 80) {
                    return rl_charge_63_80;
                } else if (this.state.i_percent > 80 && this.state.i_percent <= 90) {
                    return rl_charge_80_90;
                } else if (this.state.i_percent > 90 && this.state.i_percent < 100) {
                    return rl_charge_90_99;
                }

                return rl_charge_background;
            //break;
            default:

                if (!this.state.running) {
                    return rl_discharge_background;
                }
                if (this.state.i_percent == 100 || !this.state.running) {
                    return rl_discharge_100;
                }

                if (this.state.i_percent <= 10) {
                    return rl_discharge_90_99;
                } else if (this.state.i_percent > 10 && this.state.i_percent <= 20) {
                    return rl_discharge_80_90;
                } else if (this.state.i_percent > 20 && this.state.i_percent <= 37.7) {
                    return rl_discharge_63_80;
                } else if (this.state.i_percent > 37.7 && this.state.i_percent < 100) {
                    return rl_discharge_0_63;
                }
                return rl_discharge_background;

            //break;
        }
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
                                            }} onClick={(ev) => {this.turnOnCanvas(I_CURRENT_CANVAS)}} className="chart-hover">
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '0',
                                                    left: '0',
                                                    width: '100%',
                                                    height: '100%'
                                                }} className="chart-hover">
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
                                                            <YAxis type="number" tick={true} />
            
                                                            <Tooltip />
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
                                            }} onClick={(ev) => {this.turnOnCanvas(VL_CANVAS)}} className="chart-hover">
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
                                                            <XAxis dataKey="t" tick={false} />
                                                            <YAxis type="number" />
            
                                                            <Tooltip />
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
                                            }} onClick={(ev) => {this.turnOnCanvas(VR_CANVAS)}} className="chart-hover">
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
                                            }} onClick={(ev) => {this.turnOnCanvas(ENERGY_CANVAS)}} className="chart-hover">
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
                                                            <XAxis dataKey="t" tick={false} />
                                                            <YAxis type="number" />
            
                                                            <Tooltip />
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
                                            }} onClick={(ev) => {this.turnOnCanvas(PHI_CANVAS)}} className="chart-hover">
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
                                                            <XAxis dataKey="t" tick={false} />
                                                            <YAxis type="number" />
            
                                                            <Tooltip />
                                                            <Legend verticalAlign="top" align="right" iconType="circle" margin={{ top: 0, left: 0, right: 0, bottom: 10 }} />
                                                            <Line type="monotone" dataKey="PHI(t)" stroke="red" strokeWidth={3} dot={false} isAnimationActive={false} />
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
                                                <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}>
                                                    <strong>Precisión:</strong>
                                                    <Form.Select onChange={(ev) => { this.updateSimulationStepMultiplier(parseFloat(ev.target.value)) }}>
                                                        <option defaultValue={true} value="1">Normal</option>
                                                        <option value="100">Demasiado baja</option>
                                                        <option value="10">Muy baja</option>
                                                        <option value="5">Baja</option>
                                                        <option value="0.05">Alta</option>
                                                        <option value="0.001">Muy alta</option>
                                                        <option value="0.000001">Demasiado alta</option>
                                                    </Form.Select>
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
                                                                    <div className="label_current">{Number.parseFloat(this.state.i_0).toFixed(3)} A</div>
                                                                )
                                                            }
                                                        })()
                                                    }
                                                    
                                                    {
                                                            (() => {
                                                                if (this.state.i_percent > 0) {
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
                                                    <input type="range" className="form-range" min="0.1" max="99" step="0.1"
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
                                <Offcanvas show={this.state.showCanvas} onHide={(ev) => {this.turnOffCanvas()}} backdrop="static" placement="end" >
                                             <Offcanvas.Header closeButton>
                                                <Offcanvas.Title>
                                                    <h1>Circuito RL</h1>
                                                </Offcanvas.Title> 
                                            </Offcanvas.Header>
                                            <Offcanvas.Body>
                                            {
                                                (() => {
                                                    if (this.state.currentCanvas === AUTOINDUCCION_CANVAS) {
                                                           /* TEORIA CARGA CONDENSADOR */
                                                            return (
                                                                <>
                                                                    <h4>Fenómeno de autoinducción</h4>
                                                                </>
                                                            )
                                                            
                                                    }else if (this.state.currentCanvas === ENERGY_CANVAS){
                                                         /* TEORIA ENERGÍA ALMACENADA */
                                                        return (
                                                            <>
                                                            <h4>Energía almacenada</h4>
                                                           
                                                            </>        
                                                        )
            
                                                    }else if (this.state.currentCanvas === I_CURRENT_CANVAS){
                                                        /* TEORIA INTENSIDAD DE CORRIENTE*/
                                                        return (
                                                            <>
                                                                <h4>Intensidad de corriente</h4>
                                                                
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
                                                                    <img alt="varepsilon" src={varepsilon} style={{"width" : "5%"}}></img>
                                                                </div>
                                                                <br/>
            
                                                            </>
                                                        )
                                                    }else if (this.state.currentCanvas === PHI_CANVAS) {
                                                         /* TEORIA CAPACIDAD CONDUCTOR */
                                                        return (
                                                            <>
                                                                <h4>Flujo magnético</h4>
                                                               
                                                            </>
                                                        )
                                                    }else if (this.state.currentCanvas === VR_CANVAS){
                                                        return (
                                                            <>
                                                                <h4>Diferencia de potencial en la resistencia</h4>
                                                                
                                                            </>
                                                        )
                                                    }else if (this.state.currentCanvas === VL_CANVAS){
                                                        return (
                                                            <>
                                                                <h4>Diferencia de potencial en el inductor</h4>
            
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