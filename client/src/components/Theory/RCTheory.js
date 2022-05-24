import React, { Component } from 'react'
import Latex from 'react-latex';
import { MathJaxContext, MathJax } from 'better-react-mathjax';

import "./RCTheory.css"
import 'katex/dist/katex.min.css';

import rc_circuit from "../../assets/img/rc-circuit.png"
import rc_circuit_example from "../../assets/img/rc-circuit-example.png"
import { toHaveDisplayValue } from '@testing-library/jest-dom/dist/matchers';

class RCTheory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            introduction_text: [],
            time_constant_def: [],
            capacitor_on_charge: [],
            capacitor_on_discharge: [],
            energy: [],
            example: [],
            //EXPRESIONES
            charge_init_conditions: {},
            discharge_init_conditions: {},
            time_constant: {},
            kirkchoff_law: {},
            ohm_law: {},
            vc_relation: {},
            i_def: {},
            charge_diff_equation: {},
            discharge_diff_equation: {},
            //RESOLUCIÓN ECUACIÓN DIFERENCIAL
            charge_diff_solution: [],
            discharge_diff_solution: [],
            energy_diff_solution: [],
            // EXPRESIONES CARGA CONDENSADOR
            q_charge: {},
            vc_t: {},
            i_t: {},
            vr_t: {},
            // EXPRESIONES DESCARGA CONDENSADOR
            q_discharge: {},
            vc_discharge: {},
            i_discharge: {},
            vr_discharge: {},
            // ENERGÍA EN EL CONDENSADOR
            energy_form: {}
        }

        this.config = {
            loader: { load: ["input/asciimath"] }
        }

    }

    componentDidMount() {
        this.readFile()
    }
    async readFile() {

        await fetch(`${process.env.REACT_APP_API_SERVER}/file/RCTheory`)
            .then(result => result.json())
            .then(response => {
                let json_file = JSON.parse(response.file)
                this.setState({
                    charge_init_conditions: json_file.formulas.charge_init_conditions,
                    discharge_init_conditions: json_file.formulas.discharge_init_conditions,
                    energy: json_file.theory.plain_text.energy,
                    introduction_text: json_file.theory.plain_text.introduction,
                    time_constant_def: json_file.theory.plain_text.time_constant_def,
                    capacitor_on_charge: json_file.theory.plain_text.capacitor_on_charge,
                    capacitor_on_discharge: json_file.theory.plain_text.capacitor_on_discharge,
                    time_constant: json_file.formulas.RC_ConstantTime,
                    kirkchoff_law: json_file.formulas.RC_KirckchoffLaw,
                    ohm_law: json_file.formulas.Ohm_law,
                    vc_relation: json_file.formulas.RC_Vcrelation,
                    i_def: json_file.formulas.I_definition,
                    charge_diff_equation: json_file.formulas.charge_diff_equation,
                    discharge_diff_equation: json_file.formulas.discharge_diff_equation,
                    example: json_file.theory.plain_text.example,
                    //RESOLUCIÓN ECUACIÓN DIFERENCIAL
                    charge_diff_solution: json_file.math_resolution.RC_diff_equation,
                    discharge_diff_solution: json_file.math_resolution.RC_dis_diff_equation,
                    energy_diff_solution: json_file.math_resolution.RC_energy_diff_solution,
                    //EXPRESIONES CARGA DEL CONDENSADOR
                    q_charge: json_file.formulas.q_charge,
                    vc_t: json_file.formulas.vc_t,
                    i_t: json_file.formulas.i_t,
                    vr_t: json_file.formulas.vr_t,
                    //EXPRESIONES DESCARGA DEL CONDENSADOR
                    q_discharge: json_file.formulas.q_discharge,
                    vc_discharge: json_file.formulas.vc_discharge,
                    i_discharge: json_file.formulas.i_discharge,
                    vr_discharge: json_file.formulas.vr_discharge,
                    //ENERGÍA EN EL CONDENSADOR
                    energy_form: json_file.formulas.energy
                })
            });
    }

    createLatexFormula(string_formula, formula_name, side_expression) {
        return (
            <div className='row'>
                <div className={side_expression ? 'col-2 col-lg-2' : ''}></div>
                <div className={side_expression ? 'col-8 col-lg-8' : 'col-12 col-lg-12'}>
                    <div id={formula_name} className="formula-content-box center-text justify-content-center">
                        <br />
                        <ul className='list-group list-group-flush'>
                            <li className='list-group-item disabled'>
                                {formula_name}
                            </li>

                            <li className='list-group-item'>
                                <div>
                                    {!Array.isArray(string_formula) ? <Latex >{string_formula}</Latex> : (string_formula.map((formula) => {
                                        return (<div> <Latex id={formula}>{formula}</Latex><br /><br /></div>)
                                    }))
                                    }
                                </div>

                            </li>
                        </ul>
                        <br />
                    </div>
                </div>
                <div className={side_expression ? 'col-2 col-lg-2' : ''}></div>
            </div>



        )
    }

    render() {
        return (
            <div className='row'>
                <div className='col-2 col-lg-2 sticky-top'>
                    <div className='sticky-top left-menu-theory '>
                        <div className="dropdown-menu-left">
                            <h6 className="dropdown-header">Índice</h6>
                            <a className="dropdown-item" href="#introduccion">Introducción</a>
                            <a className="dropdown-item" href="#carga-del-condensador">Carga del condensador</a>
                            <a className="dropdown-item" href="#descarga-del-condensador">Descarga del condensador</a>
                            <a className="dropdown-item" href="#energia-del-condensador">Enegía almacenada</a>
                            <a className="dropdown-item" href="#ejemplo">Ejemplo teórico</a>
                        </div>
                    </div>
                </div>
                <div className='col-6 col-lg-6'>
                    <MathJaxContext config={this.config}>
                        <div className='center-text'>
                            <h2 id="introduccion" className='title'>Introducción</h2>
                            <br />
                            {this.state.introduction_text.map((text) => {
                                return (
                                    <div id={text}>{text}<br /></div>
                                )
                            })}
                            <br />
                            {
                                this.state.time_constant_def.map((text) => {
                                    return (
                                        <div> {text}<br /></div>
                                    )
                                })
                            }
                            < br />
                            <div style={{ "textAlign": "center" }}>
                                <img src={rc_circuit} alt="Imagen circuito RC" width={400}></img>
                            </div>

                            < br />
                            <h2 id="carga-del-condensador" className='title'>Carga del condensador</h2>
                            <br />
                            <div>{this.state.capacitor_on_charge[0]}</div>
                            <br />
                            {this.createLatexFormula(this.state.charge_diff_equation.formula, this.state.charge_diff_equation.name, false)}
                            {this.createLatexFormula(this.state.charge_init_conditions.formula, this.state.charge_init_conditions.name, false)}

                            <br />
                            <div id="charge_diff_resolution">
                                <div className="card">
                                    <div className="card-header" id="charge_diff_resolution">
                                        <h5 className="mb-0">
                                            <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                                Solución paso a paso de la ecuación diferencial
                                            </button>
                                        </h5>
                                    </div>

                                    <div id="collapseOne" className="collapse" aria-labelledby="charge_diff_resolution" data-parent="#charge_diff_resolution">
                                        <div className="card-body">
                                            {this.createLatexFormula(this.state.charge_diff_solution, "", false)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <div>{this.state.capacitor_on_charge[1]}</div>
                            <br />
                            {this.createLatexFormula(this.state.q_charge.formula, this.state.q_charge.name, false)}
                            <div>{this.state.capacitor_on_charge[2]}</div>
                            {this.createLatexFormula(this.state.vc_t.formula, this.state.vc_t.name, false)}
                            {this.createLatexFormula(this.state.vr_t.formula, this.state.vr_t.name, false)}
                            {this.createLatexFormula(this.state.i_t.formula, this.state.i_t.name, false)}
                            <br />
                            <h2 id="descarga-del-condensador" className='title'>Descarga del condensador</h2>
                            <br />
                            <div>{this.state.capacitor_on_discharge[0]}</div>
                            <br />
                            {this.createLatexFormula(this.state.discharge_init_conditions.formula, this.state.discharge_init_conditions.name, false)}
                            <br />
                            <div>{this.state.capacitor_on_discharge[1]}</div>
                            <br />
                            {this.createLatexFormula(this.state.discharge_diff_equation.formula, this.state.discharge_diff_equation.name, false)}
                            <br />
                            <div id="discharge_diff_resolution">
                                <div className="card">
                                    <div className="card-header" id="discharge_diff_resolution">
                                        <h5 className="mb-0">
                                            <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseOne2" aria-expanded="false" aria-controls="collapseOne2">
                                                Solución paso a paso de la ecuación diferencial
                                            </button>
                                        </h5>
                                    </div>

                                    <div id="collapseOne2" className="collapse" aria-labelledby="discharge_diff_resolution" data-parent="#discharge_diff_resolution">
                                        <div className="card-body">
                                            {this.createLatexFormula(this.state.discharge_diff_solution, "", false)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <div>{this.state.capacitor_on_discharge[2]}</div>
                            <br />
                            {this.createLatexFormula(this.state.q_discharge.formula, this.state.q_discharge.name, false)}
                            <br />
                            <div>{this.state.capacitor_on_discharge[3]}</div>
                            <br />
                            {this.createLatexFormula(this.state.vc_discharge.formula, this.state.vc_discharge.name, false)}
                            {this.createLatexFormula(this.state.vr_discharge.formula, this.state.vr_discharge.name, false)}
                            {this.createLatexFormula(this.state.i_discharge.formula, this.state.i_discharge.name, false)}
                            <h2 id="energia-del-condensador">Energía almacenada</h2>
                            <br />

                            <div>{this.state.energy[0]}</div>
                            <br />
                            <div id="energy_diff_solution">
                                <div className="card">
                                    <div className="card-header" id="energy_diff_solution">
                                        <h5 className="mb-0">
                                            <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseOne3" aria-expanded="false" aria-controls="collapseOne3">
                                                Obtención paso a paso de la expresión E(t)
                                            </button>
                                        </h5>
                                    </div>

                                    <div id="collapseOne3" className="collapse" aria-labelledby="energy_diff_solution" data-parent="#energy_diff_solution">
                                        <div className="card-body">
                                            {this.createLatexFormula(this.state.energy_diff_solution, "", false)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {this.createLatexFormula(this.state.energy_form.formula, this.state.energy_form.name, false)}
                            <br />
                            <div>{this.state.energy[1]}</div>
                            <br />
                            <h2 id="ejemplo">Ejemplo teórico</h2>
                            <br />
                        </div>
                        <p>(<strong>NOTA</strong>: Se recomienda visitar el siguiente <a href='/RCSim'>simulador</a> si se desea conocer más sobre este fenómeno)</p>
                        <p>{this.state.example[0]}</p>
                        <div style={{ "textAlign": "center" }}>
                            <img src={rc_circuit_example} alt="Ejemplo circuito RC" width={400}></img>
                        </div>
                        <p>{this.state.example[1]}</p>
                        {this.createLatexFormula(this.state.example[2], "Expresiones correspondientes al modelo (Carga del condensador)")}
                        {this.createLatexFormula(this.state.example[3], "Expresiones correspondientes al modelo (Descarga del condensador)")}
                        {this.createLatexFormula(this.state.example[4], "")}
                        
                    </MathJaxContext>

                </div>

                <div className='col-4 col-lg-4 position-sticky' >
                    <div className='center-text'>
                        <h2 style={{ "textAlign": "center", "margiTop": "2%" }} className="title" >Conceptos</h2>
                        <MathJaxContext config={this.config}>
                            {this.createLatexFormula(this.state.time_constant.formula, this.state.time_constant.name, true)}
                            {this.createLatexFormula(this.state.kirkchoff_law.formula, this.state.kirkchoff_law.name, true)}
                            {this.createLatexFormula(this.state.ohm_law.formula, this.state.ohm_law.name, true)}
                            {this.createLatexFormula(this.state.vc_relation.formula, this.state.vc_relation.name, true)}
                            {this.createLatexFormula(this.state.i_def.formula, this.state.i_def.name, true)}
                        </MathJaxContext>
                    </div>

                </div>

            </div>
        )
    }
}

export default RCTheory;