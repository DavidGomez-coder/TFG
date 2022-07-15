import React, {Component} from "react";
import './Theory.css'

import rl_circuit from "../assets/img/rl-circuit.png";
import MathJax from "react-mathjax";
import { DIFF_EQ_IND_CHARGE, VL_DEFINITION, WRITE_FORMULA } from "./TheoryFormulas";
import { Accordion } from "react-bootstrap";

export default class RLTheory extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div id="rl-theory" className="scrool_section">
                <h1 id="introduccion-rl" style={{ "textAlign": "center" }}>Simulación de un circuito RL</h1>
                
                <h2>Introducción</h2>
                Definimos a los circuitos RL, a aquellos que están compuestos por resistencias e inductores, alimentados por una fuente. 
                En este, caso vamos a estudiar los más simples, es decir, aquellos formados por una pila, un inductor y una sola resistencia. El circuito a estudiar
                será el mostrado en la siguiente figura:
                <br />
                <div style={{"textAlign" : "center"}}>
                    <img src={rl_circuit} width="40%" height="40%"></img>
                </div>
                <br />
                Antes de continuar con el estudio del comportamiento del circuito, es conveniente revisar los conceptos previos que se muestran <a href="#concepts">aquí</a>. Una vez comprendidos,
                continuamos con la carga del inductor.
                <br />
                <br />
                <h2 id="carga-del-inductor">Carga de un inductor</h2>
                Volvemos a aplicar el balance de energías de los componentes del circuito (segunda ley de Kirchhoff) de la única malla de este.
                {WRITE_FORMULA("\\varepsilon = V_R(t) + V_L(t)", false)}
                , dónde {WRITE_FORMULA("\\varepsilon", true)}  es el valor de la fuente, {WRITE_FORMULA("V_R(t)", true)}  la diferencia de potencial
                entre los bornes de la resistencia y {WRITE_FORMULA("V_L(t)", true)} la diferencia de potencial en el inductor, que por definición, esta diferencia de potencial en los bornes 
                del inductor a lo largo del tiempo puede obtenerse utilizando la siguiente expresión: 
                
                {WRITE_FORMULA(VL_DEFINITION, false)}
                , donde la ecuación diferencial que queda planteada es la siguiente:
                {WRITE_FORMULA(DIFF_EQ_IND_CHARGE, false)}

                El siguiente paso, es resolver esta ecuación diferencial utilizando para ello el método de separación de variables:
                <br />
                <br />
                <Accordion>
                    <Accordion.Item eventKey="rl-0">
                        <Accordion.Header><strong>Resolución ec. diferencial para la carga de un inductor</strong></Accordion.Header>
                        <Accordion.Body>
                            Despejamos, a cada lado de la ecuación separando cada una de las variables.
                            {WRITE_FORMULA("L \\cdot \\frac{\\partial I(t)}{\\partial t} = \\varepsilon - R \\cdot I(t)", false)}
                            {WRITE_FORMULA("\\frac{L}{R}\\frac{\\partial I(t)}{\\partial t} = \\frac{\\varepsilon -  R \\cdot I(t)}{R} = \\frac{\\varepsilon}{R} - I(t)", false)}
                            Quedando
                            {WRITE_FORMULA("\\frac{\\partial I(t)}{\\frac{\\varepsilon}{R} - I(t)} = \\frac{R}{L} \\partial t", false)}
                            Integramos a ambos lados. Suponiendo, que el instante inicial cuando se aplica una diferencia de potencial al circuito, no había corriente previa, la intensidad de corriente es nula {WRITE_FORMULA("I(0) = 0",true)}:
                            {WRITE_FORMULA("\\int_{0}^{I(t)} \\frac{\\partial I(t)}{\\frac{\\varepsilon}{R} - I(t)} = \\int_{0}^{t} \\frac{R}{L} \\partial t", false)}
                            Resolvemos las integrales a ambos lados
                            {WRITE_FORMULA("\\left[ -\\ln \\left( \\frac{\\varepsilon}{R} - I(t) \\right)\\right]_{0}^{I(t)} = \\frac{R}{L} \\left[ t \\right]_{0}^{t}", false)}
                        </Accordion.Body>
                    </Accordion.Item>   
                </Accordion>

                <br />
                <br />
            </div>
        )
    }
}