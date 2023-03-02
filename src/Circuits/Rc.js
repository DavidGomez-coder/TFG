import { Component } from "react";

// boostrap
import { Row, Col, Container, Alert, Button, OverlayTrigger, Form, Tooltip as ToolTipReact, FormControl, ListGroup, Card } from "react-bootstrap";
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
import { EXACT_TIME, MAX_DATA, PERCENT_Q, QUESTION_ICON, Q_VALUE, SIMULATION_EXEC, SIMULATION_STEP, WITHOUT_RESTRICTIONS } from "../Utils/Utils";

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
import { Carousel } from "bootstrap/dist/js/bootstrap";

// screen max width
const MAX_WIDTH = 1280;

// max values allowed
const MAX_CHARGE_ALLOWED = 0.000009 * 6;
const MAX_VC_ALLOWED = 6;
const MAX_VR_ALLOWED = 6;
const MAX_CU_ALLOWED = 6 / 1000; //max. current reached with minimum resistor value
const MAX_E_ALLOWED = (1 / 2) * 0.000009 * Math.pow(6, 2);

// canvas
const ENERGY_CANVAS = 1;
const CHARGE_CANVAS = 2;
const CURRENT_I_CANVAS = 3;
const LEY_OHM_CANVAS = 4;
const CAPACIDAD_CONDUCTOR_CANVAS = 5;
const FEM_CANVAS = 6;
const VR_CANVAS = 7;
const VC_CANVAS = 8;

export default class Rc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //windows width
            width: document.documentElement.clientWidth,
            // time controller
            t_i: 0,
            t_a: 0,
            simulation_step_multiplier: 0.001,
            //stop conditions
            selected_stop_condition: WITHOUT_RESTRICTIONS,
            value_stop_condition: undefined,
            condition_complete: false,
            //data arrays
            q_data: [],
            i_data: [],
            vc_data: [],
            vr_data: [],
            e_data: [],
            //components values
            C: 0.000001,
            R: 1000,
            R_color_bands: [],
            V: 6,
            //initial capacitor charge
            q_0: 0,
            //components initial values and multipliers
            C_v: 1,
            C_m: 0.000001,
            R_v: 1,
            R_m: 1000,
            V_v: 6,
            V_m: 1,
            //maximum charge
            q_max: 0.000001 * 6,
            q_percent: 0,
            //circuit state
            capacitorCharging: true,
            data_length: 0,
            //simulation state
            running: false,
            //time interval Id
            intervalId: 0,
            //reset_on_component_change
            reset_on_component_change: false,
            // references lines (RC markup)
            referenced_lines: [],
            show_reference_lines: true,
            //canvas
            showCanvas: false,
            currentCanvas: ENERGY_CANVAS

        }

        this.updateCharging = this.updateCharging.bind(this);
        this.updateRunning = this.updateRunning.bind(this);
        this.updateReferenceLine = this.updateReferenceLine.bind(this);
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
                        (this.state.selected_stop_condition === PERCENT_Q && !this.state.capacitorCharging && this.state.value_stop_condition <= 0)) {
                        this.updateConditionValue(100);
                        this.updateConditionState(true);

                    } else if ((this.state.selected_stop_condition === PERCENT_Q && this.state.capacitorCharging && this.state.value_stop_condition <= this.state.q_percent) ||
                        (this.state.selected_stop_condition === PERCENT_Q && !this.state.capacitorCharging && this.state.value_stop_condition >= this.state.q_percent)) {
                        this.updateRunning();
                        this.updateConditionState(true);
                    } else if (this.state.selected_stop_condition === EXACT_TIME && this.state.value_stop_condition <= t_i) {
                        this.updateRunning();
                        this.updateConditionState(true);
                    } else if ((this.state.capacitorCharging && this.state.selected_stop_condition === Q_VALUE && this.state.q_0 >= this.state.value_stop_condition) ||
                        (!this.state.capacitorCharging && this.state.selected_stop_condition === Q_VALUE && this.state.q_0 <= this.state.value_stop_condition)) {
                        this.updateRunning();
                        this.updateConditionState(true);
                    } else {
                        this.updateConditionState(false);
                    }
                }

                if (this.state.capacitorCharging && this.state.q_percent == 100) {
                    this.updateRunning();
                    this.updateConditionState(true);
                }

                if (!this.state.capacitorCharging && this.state.q_percent <= 0.001) {
                    this.updateRunning();
                    this.updateConditionState(true);
                }



                if (!this.state.condition_complete) {
                    let nt_i = t_i + ((SIMULATION_STEP * this.state.simulation_step_multiplier) / 1000);
                    let nt_a = t_a + ((SIMULATION_STEP * this.state.simulation_step_multiplier) / 1000);

                    this.setState(prevState => {
                        return {
                            ...prevState,
                            q_data: [...oldQData, { "t": Number.parseFloat(t_a).toExponential(4), "Q(t)": instant_values.Q }],
                            i_data: [...oldIData, { "t": Number.parseFloat(t_a).toExponential(4), "I(t)": instant_values.I }],
                            vr_data: [...oldVrData, { "t": Number.parseFloat(t_a).toExponential(4), "Vr(t)": instant_values.Vr }],
                            vc_data: [...oldVcData, { "t": Number.parseFloat(t_a).toExponential(4), "Vc(t)": instant_values.Vc }],
                            e_data: [...oldEData, { "t": Number.parseFloat(t_a).toExponential(4), "E(t)": instant_values.E }],
                            //time update
                            t_i: nt_i,
                            t_a: nt_a,

                            //current capacitor charge update
                            q_0: instant_values.Q,
                            q_percent: Number.parseFloat((instant_values.Q / prevState.q_max) * 100).toFixed(2),
                            //data length update
                            data_length: prevState.data_length + 1

                        }
                    });



                }




            }
        }, (SIMULATION_EXEC));

        //update time interval id
        this.setState(prevState => {
            return {
                ...prevState,
                intervalId: newInterval
            }
        })

    }

    // ****************************************
    //      COMPONENT WILL UNMOUNT
    // ****************************************
    componentWillUnmount() {
        //clear window size
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }


    // *********************************
    //          DIMENSIONS
    // *********************************
    updateDimensions() {
        this.setState({
            width: document.documentElement.clientWidth
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
                    return rc_discharge_0_63;
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

    // ************************************
    //      UPDATE CHARGING
    // ************************************
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

    // ******************************
    //          RESET ARRAY DATA
    // *******************************
    resetArrayData() {
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
                condition_complete: cState
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
            })
        }
    }

    // **************************************
    //       SET RC CONSTANT
    // **************************************
    setRcConstant(val) {
        this.setState(prevState => {
            return {
                ...prevState,
                rc_constant_added: val
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
                q_max: prevState.C * prevState.V,
                i_max: prevState.V / prevState.R,
                vc_max: prevState.V,
                vr_max: prevState.V,
                e_max: (1 / 2) * prevState.C * Math.pow(prevState.V, 2),
                q_0: !prevState.capacitorCharging ? 0 : 100,
            }
        });
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

    // ******************************
    //      CAPACITOR CONTROLLER
    // *******************************
    updateCapacitorValue(value) {
        this.setState(prevState => {
            return {
                ...prevState,
                C_v: parseFloat(value),
                C: parseFloat(value) * prevState.C_m,
                t_i: 0,
            }
        });

        //this.resetArrayData();
        this.updateMaxValues();
    }

    updateCapacitorMultiplier(multiplier) {
        this.setState(prevState => {
            return {
                ...prevState,
                C_m: getCapacitorMult(multiplier),
                C: prevState.C_v * getCapacitorMult(multiplier),
                t_i: 0
            }
        });

        //this.resetArrayData();
        this.updateMaxValues();
    }

    render() {
        return this.state.width >= MAX_WIDTH ? (
            /* MAIN */
            <div style={{ 'paddinglef': '1%', 'paddingRight': '1%' }}>
                {/* */}
                <Row style={{ 'marginTop': '1%' }}>
                    <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                        {/* DATA CHARTS */}
                        <Row className="d-flex p-15">
                            {/* CHARGE */}
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} onClick={(ev) => { this.turnOnCanvas(CHARGE_CANVAS) }}>
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
                                                <XAxis dataKey="t" tick={false} label={{ 'value': 'Tiempo (s)', 'position': 'insideRight' }} />
                                                <YAxis type="number" tick={false} label={{ 'value': 'Q (culombios)', 'angle': '-90' }} domain={[0, MAX_CHARGE_ALLOWED]} />
                                                <ReferenceLine x={this.state.C * this.state.R} label="Max" stroke="red" strokeDasharray="3 3" />

                                                {
                                                    (() => {
                                                        if (!this.state.running) {
                                                            return (
                                                                <Tooltip formatter={(value, name, props) => {
                                                                    return [`${Number.parseFloat(value).toExponential(3)} C`, 'q(t)']
                                                                }}
                                                                    cursor={false} />
                                                            )
                                                        }
                                                    })()
                                                }

                                                <Legend verticalAlign="top" align="right" iconType="circle" margin={{ top: 0, left: 0, right: 0, bottom: 10 }} />
                                                <Line type="monotone" dataKey="Q(t)" stroke="orange" strokeWidth={3} dot={false} isAnimationActive={false} />

                                                {
                                                    this.state.show_reference_lines ?
                                                        this.state.referenced_lines.map((r_line) => {
                                                            return (
                                                                <ReferenceLine key={`q_${this.state.t_a}_${Math.random() * 1000 + this.state.t_a}`} x={r_line} stroke="black" strokeWidth={1} strokeDasharray="3 3" />
                                                            )
                                                        }) : "reference_line not showed"
                                                }
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>


                            </Col>
                            {/* CURRENT */}
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} onClick={(ev) => { this.turnOnCanvas(CURRENT_I_CANVAS) }}>
                                <div style={{
                                    paddingBottom: '50%', /* 16:9 */
                                    position: 'relative',
                                    height: 0
                                }}>
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
                                                <XAxis dataKey="t" tick={false} label={{ 'value': 'Tiempo (s)', 'position': 'insideRight' }} />
                                                <YAxis type="number" tick={false} label={this.state.capacitorCharging ? { 'value': 'I (amperios)', 'angle': '-90' } : { 'value': '- I (amperios)', 'angle': '-90' }}
                                                    domain={[0, MAX_CU_ALLOWED]} />

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
                            {/* VC */}
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} onClick={(ev) => { this.turnOnCanvas(VC_CANVAS) }}>
                                <div style={{
                                    paddingBottom: '50%', /* 16:9 */
                                    position: 'relative',
                                    height: 0
                                }}>
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
                                                <XAxis dataKey="t" tick={false} label={{ 'value': 'Tiempo (s)', 'position': 'insideRight' }} />
                                                <YAxis type="number" tick={false} label={{ 'value': 'Vc (voltios)', 'angle': '-90' }} domain={[0, MAX_VC_ALLOWED]} />

                                                {
                                                    (() => {
                                                        if (!this.state.running) {
                                                            return (<Tooltip formatter={(value, name, props) => {
                                                                return [`${Number.parseFloat(value).toExponential(3)} V`, 'Vc(t)']
                                                            }}
                                                                cursor={false} />)
                                                        }
                                                    })()
                                                }

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

                            {/* VR */}
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} onClick={(ev) => { this.turnOnCanvas(VR_CANVAS) }}>
                                <div style={{
                                    paddingBottom: '50%', /* 16:9 */
                                    position: 'relative',
                                    height: 0
                                }}>
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
                                                <XAxis dataKey="t" tick={false} label={{ 'value': 'Tiempo (s)', 'position': 'insideRight' }} />
                                                <YAxis type="number" tick={false} label={this.state.capacitorCharging ? { 'value': 'Vr (voltios)', 'angle': '-90' } : { 'value': '- Vr (voltios)', 'angle': '-90' }}
                                                    domain={[0, MAX_VR_ALLOWED]} />

                                                {
                                                    (() => {
                                                        if (!this.state.running) {
                                                            return (<Tooltip formatter={(value, name, props) => {
                                                                return [`${Number.parseFloat(value).toExponential(3)} V`, 'Vr(t)']
                                                            }}
                                                                cursor={false} />)
                                                        }
                                                    })()
                                                }


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
                            {/* Theory menu */}
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                {/* TO - DO*/}
                            </Col>
                            {/* ENERGY */}
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} onClick={(ev) => { this.turnOnCanvas(ENERGY_CANVAS) }}>
                                <div style={{
                                    paddingBottom: '50%', /* 16:9 */
                                    position: 'relative',
                                    height: 0
                                }}>
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
                                                <XAxis dataKey="t" tick={false} label={{ 'value': 'Tiempo (s)', 'position': 'insideRight' }} />
                                                <YAxis type="number" tick={false} label={{ 'value': 'Ee (julios)', 'angle': '-90' }} domain={[0, MAX_E_ALLOWED]} />

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
                        </Row>
                    </Col>

                    <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                        { /*  CIRCUIT PICTURE */}
                        <img alt="circuit_animation" src={this.getCurrentAnimation()} className="w-100"></img>
                        <label className="switch">
                            < input type="checkbox" onClick={(ev) => {
                                this.updateCharging()
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
                                                Los resultados obtenidos dependerán de la <strong>escala de tiempo</strong> utilizada.
                                            </ToolTipReact>
                                        }>

                                        {QUESTION_ICON}

                                    </OverlayTrigger> Condiciones de parada (aprox.): </strong>
                                <Col xs={3} sm={3} md={3} lg={3} xl={3} xxl={3}>
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

                                <Col xs={3} sm={3} md={3} lg={3} xl={3} xxl={3}>
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
                                            this.setRcConstant(false);
                                        }} size="xs" >RELOAD</Button>
                                    </div>

                                </Col>

                            </Row>
                            <br></br>
                            <Row>



                            </Row>


                        </Col>
                        { /*  CIRCUIT CONTROLLERS  */}
                        <Row className="justify-content-center">
                            {/* CAPACITOR CONTROLLER */}
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                <Row>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <Row>
                                            { /* CAPACITOR VALUE */}
                                            <Col sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <input type="range" className="form-range" min="1" max="9" step="0.01"
                                                    onChange={(ev) => {
                                                        this.updateCapacitorValue(ev.target.value);

                                                    }}
                                                />
                                            </Col>
                                            { /* CAPACITOR MULTIPLIER */}
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <select className="form-select component-value" aria-label="Default select example" onChange={(ev) => {
                                                    this.updateCapacitorMultiplier(ev.target.value)
                                                }} disabled={this.state.showMultipliers === false}>
                                                    <option value="microF">{this.state.C_v} microF</option>
                                                </select>

                                            </Col>

                                            {/* CAPACITOR ANIMATION */}
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <div className="charge-box">
                                                    <div className={this.state.running ? "charge" : (this.state.q_percent == 0 ? "charge_discharge_complete" : "charge_charge_complete")} style={{ "background": this.state.capacitorCharging ? "#569c02" : "#c94f1e" }}
                                                        onClick={(ev) => { this.turnOnCanvas(CAPACIDAD_CONDUCTOR_CANVAS) }}>
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
                                                        <div className='resistor-box' onClick={(ev) => { this.turnOnCanvas(LEY_OHM_CANVAS) }}>
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
                            <Col s={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                            </Col>


                        </Row>
                    </Col>
                </Row>
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