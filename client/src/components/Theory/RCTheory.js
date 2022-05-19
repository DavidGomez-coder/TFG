import React, { Component } from 'react'
import Latex from 'react-latex';
import { MathJaxContext, MathJax } from 'better-react-mathjax';

import "./RCTheory.css"
import 'katex/dist/katex.min.css';


class RCTheory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            introduction_text: [],
            time_constant_def: [],
            capacitor_on_charge: [],
            //EXPRESIONES
            charge_init_conditions: {},
            time_constant: {},
            kirkchoff_law: {},
            ohm_law: {},
            vc_relation: {},
            i_def: {},
            charge_diff_equation: {},
            // EXPRESIONES CARGA CONDENSADOR
            q_charge: {},
            vc_t: {},
            i_t: {},
            vr_t: {}
        }

        this.config = {
            loader: { load: ["input/asciimath"] }
        }
    }

    componentDidMount() {
        this.readFile()
    }

    async readFile() {
        await fetch(`${process.env.REACT_APP_API_SERVER}/RCTheory`)
            .then(result => result.json())
            .then(response => {
                let json_file = JSON.parse(response.file)

                console.log(json_file.formulas)
                this.setState({
                    charge_init_conditions: json_file.formulas.charge_init_conditions,
                    introduction_text: json_file.theory.plain_text.introduction,
                    time_constant_def: json_file.theory.plain_text.time_constant_def,
                    capacitor_on_charge: json_file.theory.plain_text.capacitor_on_charge,
                    time_constant: json_file.formulas.RC_ConstantTime,
                    kirkchoff_law: json_file.formulas.RC_KirckchoffLaw,
                    ohm_law: json_file.formulas.Ohm_law,
                    vc_relation: json_file.formulas.RC_Vcrelation,
                    i_def: json_file.formulas.I_definition,
                    charge_diff_equation: json_file.formulas.charge_diff_equation,
                    //EXPRESIONES CARGA DEL CONDENSADOR
                    q_charge: json_file.formulas.q_charge,
                    vc_t : json_file.formulas.vc_t,
                    i_t : json_file.formulas.i_t,
                    vr_t : json_file.formulas.vr_t
                })
            });

        return "texto"
    }

    createLatexFormula(string_formula, formula_name, side_expression) {
        return (
            <div className='row'>
                <div className={side_expression ? 'col-2 col-lg-2' : ''}></div>
                <div className={side_expression ? 'col-8 col-lg-8' : 'col-12 col-lg-12'}>
                    <div id={formula_name} className="formula-content-box center-text justify-content-center">
                        <br />
                        <ul className='list-group'>
                            <li className='list-group-item disabled'>
                                {formula_name}
                            </li>
                            <li className='list-group-item'>
                                <Latex >{string_formula}</Latex>
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
                <div className='col-2 col-lg-2'>
                    <div>
                        <div className="dropdown-menu-left">
                            <h6 className="dropdown-header">Índice</h6>
                            <a className="dropdown-item" href="#introduccion">Introducción</a>
                            <a className="dropdown-item" href="#carga-del-condensador">Carga del condensador</a>
                            <a className="dropdown-item" href="#descarga-del-condensador">Descarga del condensador</a>
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

                            <p> IMAGEN CIRCUITO RC!!!!</p>
                            < br />
                            <h2 id="carga-del-condensador" className='title'>Carga del condensador</h2>
                            <br />
                            <div>{this.state.capacitor_on_charge[0]}</div>
                            <br />
                            {this.createLatexFormula(this.state.charge_diff_equation.formula, this.state.charge_diff_equation.name,false)}
                            {this.createLatexFormula(this.state.charge_init_conditions.formula, this.state.charge_init_conditions.name, false)}
                            <br />
                            <div>{this.state.capacitor_on_charge[1]}</div>
                            {this.createLatexFormula(this.state.q_charge.formula, this.state.q_charge.name, false)}
                            <div>{this.state.capacitor_on_charge[2]}</div>
                            {this.createLatexFormula(this.state.vc_t.formula, this.state.vc_t.name, false)}
                            {this.createLatexFormula(this.state.vr_t.formula, this.state.vr_t.name, false)}
                            {this.createLatexFormula(this.state.i_t.formula, this.state.i_t.name, false)}

                        </div>


                    </MathJaxContext>

                </div>

                <div className='col-4 col-lg-4'>
                    <h2 style={{"textAlign" : "center", "margin-top" : "2%"}}>Conceptos</h2>
                    <MathJaxContext config={this.config}>
                        {this.createLatexFormula(this.state.time_constant.formula, this.state.time_constant.name, true)}
                        {this.createLatexFormula(this.state.kirkchoff_law.formula, this.state.kirkchoff_law.name, true)}
                        {this.createLatexFormula(this.state.ohm_law.formula, this.state.ohm_law.name, true)}
                        {this.createLatexFormula(this.state.vc_relation.formula, this.state.vc_relation.name, true)}
                        {this.createLatexFormula(this.state.i_def.formula, this.state.i_def.name,true)}

                    </MathJaxContext>
                </div>

            </div>
        )
    }
}

export default RCTheory;