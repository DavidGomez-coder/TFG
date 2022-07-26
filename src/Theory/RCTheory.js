import Dropdown from 'react-bootstrap/Dropdown';
import React, { Component } from "react";
import MathJax from 'react-mathjax';
import { Container, Row, Col, ListGroup, Accordion } from "react-bootstrap";

import rc_circuit from "../assets/img/rc-circuit.png"
import { ECR_CAPACITOR_CHARGE, I_DEFINITION, RCI_ON_CHARGE, OHM_LAW, SCND_KIRKCHOFF, SUST_DEFINITION, SUST_DEFINITION2, VR_ON_CHARGE, VC_ON_CHARGE, SUST_DEFINITION3, RCI_ON_DISCHARGE, VR_ON_DISCHARGE, VC_ON_DISCHARGE, RC_ENERGY, WRITE_FORMULA } from './TheoryFormulas';



export default class RCTheory extends Component {



    render() {
        return (

            <div id="rc-theory" className="scrool_section">
                <br />
                <h1 id="introduccion-rc" style={{ "textAlign": "center" }}>Simulación de un circuito RC</h1>
                <h2 >Introducción</h2>
                Definimos los circuitos RC, como aquellos que están formados por resistencias y condensadores, alimentados por una fuente de corriente contínua o alterna. En este caso, estudiaremos
                el caso más simple de todos; es decir, aquellos formados por una pila, un solo condensador y una sola resistencia. El circuito a estudiar será el mostrado en la siguiente figura:
                <br />
                <div style={{ "textAlign": "center" }}>
                    <img src={rc_circuit} width="50%"></img>
                </div>
                <br />
                Antes de continuar con el estudio del comportamiento del circuito, hay que tener en cuenta los siguientes conceptos, los cuáles serán utilizados para entender y obtener las expresiones necesarias
                que nos ayudarán a entender este fenómeno.
                <br />
                <br />
                {/* ***************************************************************** */}
                {/*                 CONCEPTOS BÁSICOS                                 */}
                {/* ***************************************************************** */}
                <div id="concepts"></div>
                <Accordion defaultActiveKey={['k-0', 'k-1', 'k-2']} alwaysOpen>
                    <Accordion.Item eventKey='k-0'>
                        <Accordion.Header><strong>Segunda Ley de Kirchhoff</strong></Accordion.Header>
                        <Accordion.Body>
                            La segunda Ley de Kirchhoff, dice lo siguiente: <i>En cada una de las mallas que definen un circuito, la suma de las diferencias de potencial de cada uno de los elementos es cero. Es decir,
                                la suma de todas las tensiones suministradas es igual a la suma de todas las tensiones consumidas. <br />
                            </i>
                            {WRITE_FORMULA(SCND_KIRKCHOFF, false)}
                            
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey='k-1'>
                        <Accordion.Header><strong>Ley de Ohm</strong></Accordion.Header>
                        <Accordion.Body>
                            Se trata de una de las leyes más básicas en teoría de circuitos, la cuál viene dada por la siguiente expresión:
                            {WRITE_FORMULA(OHM_LAW, false)}
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey='k-2'>
                        <Accordion.Header><strong>Intensidad de corriente</strong></Accordion.Header>
                        <Accordion.Body>
                            Definiremos intensidad de corriente, como la cantidad de carga que atraviesa un circuito por unidad de tiempo. La expresión a utilizar será la siguiente:
                            {WRITE_FORMULA(I_DEFINITION, false)}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <br />
                {/* ***************************************************************** */}
                {/*                 CARGA DEL CONDENSADOR                             */}
                {/* ***************************************************************** */}
                <h2 id="carga-del-condensador">Carga del condensador</h2>
                Para comprender el funcionamiento del circuito, lo analizaremos en término de energías de sus componenentes. Para ello, haremos uso de la <i>Ley de Kirchhoff</i> presentada anteriormente, aplicando
                dicha ley sobre la malla de nuestro circuito.
                {WRITE_FORMULA("\\varepsilon = V_R(t) + V_C(t)",false)}

                , dónde {WRITE_FORMULA("\\varepsilon",true)} la diferencia de potencial
                entre los bornes de la resistencia y {WRITE_FORMULA("V_C(t)", true)} la diferencia de potencial en el condensador. Además, la carga del condensador a lo largo del tiempo puede determinarse
                utilizando la siguiente expresión:
                {WRITE_FORMULA("q(t) = V_C(t) \\cdot C", false)}
                Si hacemos uso de la expresión anterior, además de las definiciones de la <i>Ley de Ohm</i> e <i>Intensidad de corriente</i>, sustituimos en la primera ecuación planteada, quedando algo tal que así:
                {WRITE_FORMULA(SUST_DEFINITION, false)}
                , obeniendo el planteamiento de la siguiente ecuación diferencial:
                {WRITE_FORMULA(SUST_DEFINITION2, false)}
                A continuación, resolveremos la ecuación diferencial anterior por el método de separación de variables.
                <br />
                <br />
                <Accordion>
                    <Accordion.Item eventKey='rc-0'>
                        <Accordion.Header><strong>Resolución ec. diferencial para la carga del condensador</strong></Accordion.Header>
                        <Accordion.Body>
                            En primer lugar, lo que haremos será despejar a cada lado de la igualdad, los términos correspondientes de la ecuación diferencial obtenida:
                            {WRITE_FORMULA("R \\cdot C \\frac{\\partial q(t)}{\\partial t} = C \\cdot \\varepsilon - q(t)",false)}
                            {WRITE_FORMULA("\\frac{\\partial q(t)}{\\partial t} = \\frac{C \\cdot \\varepsilon - q(t)}{R \\cdot C}",false)}
                            {WRITE_FORMULA("\\frac{\\partial q(t)}{C \\cdot \\varepsilon - q(t)} = \\frac{\\partial t}{R \\cdot C}",false)}

                            A continuación, tenemos que definir los límites de integración. En un instante inicial, es decir, para
                            {WRITE_FORMULA("\\hspace{0.1cm} t=0",true)}, consideraremos que el condensador está completamente descargado, o lo que es lo mismo,
                            {WRITE_FORMULA("\\hspace{0.1cm} q(0) = 0",true)}. Integramos a ambos lados:
                            
                            {WRITE_FORMULA("\\int_{0}^{q(t)} \\frac{\\partial q(t)}{C \\cdot \\varepsilon - q(t)} = \\int_{0}^{t} \\frac{\\partial t}{R \\cdot C}",false)}

                            Resolvemos las integrales anteriores:
                            {WRITE_FORMULA("\\left[ \\ln{\\left(C \\cdot \\varepsilon - q(t)\\right)} \\right]_{0}^{q(t)} = \\frac{1}{R\\cdot C}\\left[ t \\right]_{0}^{t}",false)}
                            {WRITE_FORMULA("-\\ln{\\left( C \\cdot \\varepsilon - q(t) \\right)} + \\ln{\\left( C \\cdot \\varepsilon \\right)} = \\frac{t}{R\\cdot C}",false)}
                            {WRITE_FORMULA("\\mathcal{\\huge e}^{-\\ln{\\left( C \\cdot \\varepsilon - q(t) \\right)} + \\ln{\\left( C \\cdot \\varepsilon \\right)}} = \\mathcal{\\huge e}^{\\frac{t}{R\\cdot C}}",false)}
                            {WRITE_FORMULA("\\mathcal{\\huge e}^{-\\ln{\\left( C \\cdot \\varepsilon - q(t) \\right) }} \\cdot \\mathcal{\\huge e}^{\\ln{\\left( C \\cdot \\varepsilon \\right)}} = \\mathcal{\\huge e}^{\\frac{t}{R\\cdot C}}",false)}
                            {WRITE_FORMULA("\\frac{C \\cdot \\varepsilon}{C \\cdot \\varepsilon - q(t)} = \\mathcal{\\huge e}^{\\frac{t}{RC}}",false)}
  
                            Despejamos {WRITE_FORMULA("\\hspace{0.1cm} q(t)", true)}:
                            {WRITE_FORMULA("q(t) = C \\varepsilon \\left( 1 - \\mathcal{\\huge e}^{-\\frac{t}{R \\cdot C}}\\right)", false)}

                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <br />
                <br />
                Una vez resuelta, tenemos que la carga del condensador (mientras se encuentra en estado de carga), a partir de la cuál podremos deducir las siguientes expresiones:
                <br />
                <br />
                <div id="rc-on-charge-expressions">
                    <ListGroup>
                        <ListGroup.Item disabled>Carga del condensador</ListGroup.Item>
                        {WRITE_FORMULA("q(t) = C \\varepsilon \\left( 1 - \\mathcal{\\huge e}^{-\\frac{t}{R \\cdot C}}\\right)", false)}
                        
                        <ListGroup.Item disabled>Intensidad de corriente</ListGroup.Item>
                        <ListGroup.Item>
                            {WRITE_FORMULA(RCI_ON_CHARGE, false)}
                        </ListGroup.Item>
                        <ListGroup.Item disabled>Diferencia de potencial en la resistencia</ListGroup.Item>
                        <ListGroup.Item>
                            {WRITE_FORMULA(VR_ON_CHARGE, false)}
                        </ListGroup.Item>
                        <ListGroup.Item disabled>Diferencia de potencial en el condensador</ListGroup.Item>
                        <ListGroup.Item>
                            {WRITE_FORMULA(VC_ON_CHARGE, false)}
                        </ListGroup.Item>

                    </ListGroup>
                </div>
                <br />
                <br />
                En cuanto a la carga máxima posible en el condensador, bastaría solo calcular el límite de la función <MathJax.Provider><MathJax.Node inline formula="\\hspace{0.1cm} q(t)" /></MathJax.Provider>
                <br />
                <br />
                <div id="rc-on_charge_q_max">
                    <ListGroup>
                        <ListGroup.Item disabled>Carga máxima</ListGroup.Item>
                        <ListGroup.Item>
                            {WRITE_FORMULA("Q_{max} = \\lim_{t \\to \\infty} q(t) = \\lim_{t \\to \\infty} C \\varepsilon \\left( 1 - \\mathcal{\\huge e}^{-\\frac{t}{R \\cdot C}}\\right) = C \\cdot \\varepsilon ", false)}
                            Es decir, la carga máxima depende tanto de la capacidad del condensador como del valor de la fuente que estemos utilizando.
                        </ListGroup.Item>
                    </ListGroup>
                </div>
                <br />
                <br />
                {/* ***************************************************************** */}
                {/*                 DESCARGA DEL INDUCTOR                             */}
                {/* ***************************************************************** */}
                <h2 id="descarga-del-condensador">Descarga del condensador</h2>
                El siguiente estado a estudiar, es la descarga del condensador. Para que esto se produzca, no se debe de estar suministrando energía a los componentes del circuito, es decir, el valor de la fuente debe de ser
                {WRITE_FORMULA("\\hspace{0.1cm} \\varepsilon = 0", true)}. Consideraremos para la descarga, que en el instante inicial la carga almacenada en el condensador es la máxima
                {WRITE_FORMULA("\\hspace{0.1cm} q(0) = C \\cdot \\varepsilon", true)}, que denotaremos como {WRITE_FORMULA("\\hspace{0.1cm} q_0",true)}.
                <br />
                <br />
                Usaremos la segunda ley de Kirchhoff
                {WRITE_FORMULA("V_C(t) + V_R(t) = 0" ,false)}
                , y aplicando las definiciones correspondientes tenemos que
                {WRITE_FORMULA("\\frac{q(t)}{C} + R\\cdot I(t) = \\frac{q(t)}{C} + R\\frac{\\partial q(t)}{\\partial t} = 0",false)}
                Obteniendo la siguiente ecuación diferencial:
                {WRITE_FORMULA(SUST_DEFINITION3, false)}
                <br />
                <br />
                Resolvemos la ecuación diferencial anterior.
                <Accordion>
                    <Accordion.Item eventKey='rc-1'>
                        <Accordion.Header><strong>Resolución ec. diferencial para la descarga del condensador</strong></Accordion.Header>
                        <Accordion.Body>
                            En primer lugar, lo que haremos será despejar a cada lado de la igualdad, los términos correspondientes de la ecuación diferencial obtenida:
                            {WRITE_FORMULA("\\frac{-\\partial t}{C \\cdot R} = \\frac{\\partial q(t)}{q(t)}", false)}
                            Integramos a ambos lados, bajo los límites anteriores:
                            {WRITE_FORMULA("\\int_{q_0}^{q(t)} \\frac{-\\partial t}{C \\cdot R} = \\int_{0}^{t} \\frac{\\partial q(t)}{q(t)}", false)}
                            {WRITE_FORMULA("\\left[ \\ln q(t) \\right]_{q_0}^{q(t)} = \\frac{-1}{RC}\\left[ t\\right]_{0}^{t}", false)}
                            {WRITE_FORMULA("\\ln q(t) - \\ln q_0 = \\frac{-t}{RC}", false)}
                            {WRITE_FORMULA("\\mathcal{\\huge e}^{\\ln q(t) - \\ln q_0} = \\mathcal{\\huge e}^{\\frac{-t}{RC}}", false)}
                            {WRITE_FORMULA("\\mathcal{\\huge e}^{\\ln q(t)} \\cdot \\mathcal{\\huge e}^{-\\ln q_0} = \\mathcal{\\huge e}^{\\frac{-t}{RC}}", false)}
                            {WRITE_FORMULA("q(t)\\frac{1}{q_0} = \\mathcal{\\huge e}^{\\frac{-t}{RC}}", false)}
                    
                            Dónde
                            {WRITE_FORMULA("q(t) = q_0 \\cdot \\mathcal{\\huge e}^{\\frac{-t}{RC}}", false)}
                            
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <br />
                <br />
                Una vez resuelta la ecc. diferencial, obtenemos la carga del condensador (mientras se encuentra en estado de descarga), a partir de la cuál podremos deducir las siguientes expresiones:
                <br />
                <br />
                <div id="rc-on-discharge-expressions">
                    <ListGroup>
                        <ListGroup.Item disabled>Carga del condensador</ListGroup.Item>
                        <ListGroup.Item>
                            {WRITE_FORMULA("q(t) = q_0 \\cdot \\mathcal{\\huge e}^{\\frac{-t}{RC}}", false)}
                        </ListGroup.Item>
                        <ListGroup.Item disabled>Intensidad de corriente</ListGroup.Item>
                        <ListGroup.Item>
                            {WRITE_FORMULA(RCI_ON_CHARGE, false)}
                        </ListGroup.Item>
                        <ListGroup.Item disabled>Diferencia de potencial en la resistencia</ListGroup.Item>
                        <ListGroup.Item>
                            {WRITE_FORMULA(VR_ON_DISCHARGE, false)}
                        </ListGroup.Item>
                        <ListGroup.Item disabled>Diferencia de potencial en el condensador</ListGroup.Item>
                        <ListGroup.Item>
                            {WRITE_FORMULA(VC_ON_DISCHARGE, false)}
                        </ListGroup.Item>

                    </ListGroup>
                    <br />
                    <br />
                    En la descarga del condensador, tanto la intensidad de corriente como la diferencia de potencial en los bornes del condensador, tienen signo negativo. Esto indica que el sentido de
                    la corriente es al contrario.
                </div>
                <br />
                <br />
                {/* ***************************************************************** */}
                {/*                 ENERGÍA DEL CONDENSADOR                           */}
                {/* ***************************************************************** */}
                <h2 id="energia-del-condensador">Energía almacenada</h2>
                Por último, podemos estudiar la energía almacenada en el condensador. Esta, es energía potencial electroestática y por lo tanto, se encuentra relacionada tanto con el voltaje de la fuente como
                con la carga del condensador. Usamos para ello el concepto de potencia.
                <br />
                <br />
                <div id="potencia-definition">
                    <Accordion defaultActiveKey="rc-potencia" alwaysOpen>
                        <Accordion.Item eventKey='rc-potencia'>
                            <Accordion.Header>
                                <strong>Potencia</strong>
                            </Accordion.Header>
                            <Accordion.Body>
                                Definimos potencia, como la cantidad de trabajo que se realiza por unidad de tiempo. Por definición, sabemos que
                                {WRITE_FORMULA("\\hspace{0.1cm} q(t) = C \\cdot V_C(t)", true)}, luego podemos escribir que
                                {WRITE_FORMULA("I(t) = C \\frac{\\partial V_C(t)}{\\partial t}", false)}
                        
                                Si hablamos en términos de energía la potencia a lo largo del tiempo se escribe como
                                {WRITE_FORMULA("\\hspace{0.1cm} p(t) = \\frac{\\partial E(t)}{\\partial t}", true)}, y siendo la potencia consumida por el condensador
                                {WRITE_FORMULA("\\hspace{0.1cm} p(t) = V_C(t) \\cdot I(t) = V_C(t) \\cdot C \\cdot \\frac{\\partial V_C(t)}{\\partial t}",false)}
                                
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
                <br />
                <br />
                Luego, si despejamos la energía en la definición de potencia tenemos que
                {WRITE_FORMULA("\\hspace{0.1cm} \\partial E(t) = p(t) \\partial t",true)}.
                A continuación, sustituimos en la expresion de potencia obtenida para el condensador, tal que
                {WRITE_FORMULA("\\hspace{0.1cm} \\partial E(t) = V_C(t) \\cdot C \\partial V_C(t)",true)}
                <br />
                <br />
                <strong>NOTA: </strong> Al partir de un condensador descargado, la energía en su instante inicial es nula. Resolvemos la ecuación diferencial anterior, integrando a ambos lados.
                <br />
                <br />
                <Accordion>
                    <Accordion.Item eventKey='rc-energy'>
                        <Accordion.Header>
                            Energía en un condensador (Resolución de la ecuación diferencial)
                        </Accordion.Header>
                        <Accordion.Body>
                            {WRITE_FORMULA("\\partial E(t) = V_C(t) \\cdot C \\partial V_C(t)",false)}
                            {WRITE_FORMULA("\\int_{0}^{E(t)} \\partial E(t) = \\int_{0}^{V_C(t)} V_C(t) \\cdot C \\partial V_C(t)",false)}
                            {WRITE_FORMULA("E(t) = C \\int_{0}^{V_C(t)} V_C(t) \\partial V_C(t) = C \\left[ \\frac{V_C(t)^2}{2} \\right]_{0}^{V_C(t)}",false)}
                            {WRITE_FORMULA(RC_ENERGY, false)}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <br />
                <br />
                Una vez resuelta, obtenemos que la energía del condensador en un instante de tiempo equivale a
                {WRITE_FORMULA(RC_ENERGY, true)}, dónde {WRITE_FORMULA("\\hspace{0.1cm} V_C(t)", true)} corresponderá
                a alguna de las expresiones calculadas anteriormente, dependiendo de si el condensador se encuentra en estado de carga o descarga.
                <br />
                <br />
                Además, la energía máxima que puede llegar a almacenar el condensador viene dada por la expresión:
                <br />
                <br />
                <ListGroup>
                    <ListGroup.Item disabled>Energía máxima</ListGroup.Item>
                    <ListGroup.Item>
                        {WRITE_FORMULA("E_{max} = \\lim_{t \\to \\infty} E(t) = \\lim_{t \\to \\infty} \\frac{1}{2}CV_C(t)^2 = \\frac{1}{2}C \\varepsilon^2", false)}
                    </ListGroup.Item>
                </ListGroup>

            </div>
        )
    }
}