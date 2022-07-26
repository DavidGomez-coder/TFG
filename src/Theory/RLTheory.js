import React, { Component } from "react";
import './Theory.css'

import rl_circuit from "../assets/img/rl-circuit.png";
import { BIOT_SAVART, DIFF_EQ_IND_CHARGE, PHI, PHI_MAX, RLI_ON_CHARGE, RLI_ON_DISCHARGE, RLVL_ON_CHARGE, RLVL_ON_DISCHARGE, RLVR_ON_CHARGE, RLVR_ON_DISCHARGE, RL_ENERGY, RL_FEM, RL_IMAX, VL_DEFINITION, WRITE_FORMULA } from "./TheoryFormulas";
import { Accordion, ListGroup } from "react-bootstrap";

export default class RLTheory extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="rl-theory" className="scrool_section">
                <h1 id="introduccion-rl" style={{ "textAlign": "center" }}>Simulación de un circuito RL</h1>

                <h2>Introducción</h2>
                Definimos a los circuitos RL, a aquellos que están compuestos por resistencias e inductores, alimentados por una fuente.
                En este, caso vamos a estudiar los más simples, es decir, aquellos formados por una pila, un inductor y una sola resistencia. El circuito a estudiar
                será el mostrado en la siguiente figura:
                <br />
                <div style={{ "textAlign": "center" }}>
                    <img src={rl_circuit} width="40%" height="40%"></img>
                </div>
                <br />
                Antes de continuar con el estudio del comportamiento del circuito, es conveniente revisar los conceptos previos que se muestran <a href="#concepts">aquí</a>. Una vez comprendidos,
                continuamos con la carga del inductor.
                <br />
                <br />
                {/* ***************************************************************** */}
                {/*                 CARGA DEL INDUCTOR                                */}
                {/* ***************************************************************** */}
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
                            Integramos a ambos lados. Suponiendo, que el instante inicial cuando se aplica una diferencia de potencial al circuito, no había corriente previa, la intensidad de corriente es nula {WRITE_FORMULA("I(0) = 0", true)}:
                            {WRITE_FORMULA("\\int_{0}^{I(t)} \\frac{\\partial I(t)}{\\frac{\\varepsilon}{R} - I(t)} = \\int_{0}^{t} \\frac{R}{L} \\partial t", false)}
                            Resolvemos las integrales a ambos lados
                            {WRITE_FORMULA("\\left[ -\\ln \\left( \\frac{\\varepsilon}{R} - I(t) \\right)\\right]_{0}^{I(t)} = \\frac{R}{L} \\left[ t \\right]_{0}^{t}", false)}
                            {WRITE_FORMULA("-\\ln {\\left( \\frac{\\varepsilon}{R} - I(t) \\right)} + \\ln{\\frac{\\varepsilon}{R}} = \\frac{R}{L}t", false)}
                            {WRITE_FORMULA("\\mathcal{\\huge e}^{-\\ln {\\left(\\frac{\\varepsilon}{R} - I(t)\\right)} + \\ln{\\frac{\\varepsilon}{R}}} = \\mathcal{\\huge e}^{\\frac{R}{L}t}", false)}
                            {WRITE_FORMULA("\\mathcal{\\huge e}^{-\\ln {\\left(\\frac{\\varepsilon}{R} - I(t)\\right)}} \\cdot \\mathcal{\\huge e}^{\\ln{\\frac{\\varepsilon}{R}}} = \\mathcal{\\huge e}^{\\frac{R}{L}t}", false)}
                            {WRITE_FORMULA("\\frac{\\varepsilon / R}{\\frac{\\varepsilon}{R} - I(t)} = \\mathcal{\\huge e}^{\\frac{Rt}{L}}", false)}
                            Despejamos {WRITE_FORMULA("\\hspace{0.1cm} I(t)", true)} y tenemos
                            {WRITE_FORMULA(RLI_ON_CHARGE, false)}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <br />
                <br />
                Una vez resuelta la ecuación diferencial, obtenemos el valor de la intensidad del circuito a lo largo del tiempo mientras el inductor se en cuentra en estado de almacenamiento de energía. Además, a partir de esta expresión
                podemos deducir las siguientes:
                <br />
                <br />
                <ListGroup>
                    <ListGroup.Item disabled>Intensidad de corriente</ListGroup.Item>
                    <ListGroup.Item>{WRITE_FORMULA(RLI_ON_CHARGE, false)}</ListGroup.Item>
                    <ListGroup.Item disabled>Diferencia de potencial en la resistencia</ListGroup.Item>
                    <ListGroup.Item>{WRITE_FORMULA(RLVR_ON_CHARGE, false)}</ListGroup.Item>
                    <ListGroup.Item disabled>Diferencia de potencial en el inductor</ListGroup.Item>
                    <ListGroup.Item>{WRITE_FORMULA(RLVL_ON_CHARGE, false)}</ListGroup.Item>
                </ListGroup>
                <br />
                <br />
                Además, podemos obtener la intensidad máxima de nuestro circuito
                <br />
                <br />
                <ListGroup>
                    <ListGroup.Item disabled>Intensidad máxima</ListGroup.Item>
                    <ListGroup.Item>{WRITE_FORMULA(RL_IMAX, false)}</ListGroup.Item>
                </ListGroup>
                <br />
                <br />
                {/* ***************************************************************** */}
                {/*                 DESCARGA DEL INDUCTOR                             */}
                {/* ***************************************************************** */}
                <h2 id="descarga-del-inductor">Descarga del inductor</h2>
                El siguiente estado a estudiar, es la disipación de energía (descarga) del inductor. Para que esto se produzca, no se debe de estar suministrando energía los componentes
                del circuito, es decir {WRITE_FORMULA("\\hspace{0.1cm} \\varepsilon = 0", true)}. Inicialmente, consideraremos que la intensidad del circuito en dicho instante es máxima.
                <br />
                <br />
                Usamos el mismo principio que en el apartado anterior, solo que ahora atendemos a que {WRITE_FORMULA("\\hspace{0.1cm} \\varepsilon = 0", true)}. Para la disipación de energía en el inductor,
                consideraremos que en el instante inicial, la itensidad que circula por el circuito es máxima, la cuál vamos a denotar como {WRITE_FORMULA("\\hspace{0.1cm} I_0", true)}.
                {WRITE_FORMULA("V_L(t) + V_R(t) = 0", false)}
                De la misma manera, sustituimos y resolvemos la ecuación diferencial.
                {WRITE_FORMULA("L\\frac{\\partial I(t)}{\\partial t} + R \\cdot I(t) = 0", false)}
                <br />
                <br />
                <Accordion>
                    <Accordion.Item eventKey="rl-1">
                        <Accordion.Header><strong>Resolución ec. diferencial para la descarga de un inductor</strong></Accordion.Header>
                        <Accordion.Body>
                            {WRITE_FORMULA("L \\frac{\\partial I(t)}{\\partial t} = -R \\cdot I(t)", false)}
                            {WRITE_FORMULA("\\frac{\\partial I(t)}{I(t)} = \\frac{-R}{L} \\partial t", false)}
                            Integramos a ambos lados, con los límites descritos anteriormente
                            {WRITE_FORMULA("\\int_{I_0}^{I(t)} \\frac{\\partial I(t)}{I(t)} = \\int_{0}^{t} \\frac{-R}{L} \\partial t", false)}
                            {WRITE_FORMULA("\\left[ \\ln I(t) \\right]_{I_0}^{I(t)} = \\frac{-R}{L}\\left[ t \\right]_{0}^{t}", false)}
                            {WRITE_FORMULA("\\ln I(t) - \\ln I_0 = \\frac{-R}{L}t", false)}
                            {WRITE_FORMULA("\\mathcal{\\huge e}^{\\ln I(t) - \\ln I_0} = \\mathcal{\\huge e}^{\\frac{-R}{L}t}", false)}
                            {WRITE_FORMULA("\\mathcal{\\huge e}^{\\ln I(t)} \\cdot \\mathcal{\\huge e}^{- \\ln I_0} = \\mathcal{\\huge e}^{\\frac{-R}{L}t}", false)}
                            Despejamos {WRITE_FORMULA("\\hspace{0.1cm} I(t)", true)} de la expresión anterior y nos queda que, la intensidad de corriente que circula duante el proceso de
                            disipación de energía es:
                            {WRITE_FORMULA(RLI_ON_DISCHARGE, false)}

                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <br />
                <br />
                Una vez resuelta la ecuación diferencial anterior, obtenemos la expresión que modela el comportamiento de la intensidad de corriente a lo largo del tiempo
                en el circuito mientras el inductor se encuentra disipando energía. Además, podemos deducir a partir de ella las siguientes expresiones:
                <br />
                <br />
                <ListGroup>
                    <ListGroup.Item disabled>Intensidad de corriente</ListGroup.Item>
                    <ListGroup.Item>{WRITE_FORMULA(RLI_ON_DISCHARGE, false)}</ListGroup.Item>
                    <ListGroup.Item disabled>Diferencia de potencial en la resistencia</ListGroup.Item>
                    <ListGroup.Item>{WRITE_FORMULA(RLVR_ON_DISCHARGE, false)}</ListGroup.Item>
                    <ListGroup.Item disabled>Diferencia de potencial en el inductor</ListGroup.Item>
                    <ListGroup.Item>{WRITE_FORMULA(RLVL_ON_DISCHARGE, false)}</ListGroup.Item>
                </ListGroup>
                <br />
                <br />
                Sabiendo que, {WRITE_FORMULA("\\hspace{0.1cm} I_0", true)} hace referencia a la intensidad máxima que puede llegar a circular por el circuito.
                
                <br />
                <br />
                <h2 id="energia-del-inductor">Enegía almacenada en el inductor</h2>
                Por otro lado, también podemos conocer la energía que se encuentra almacenada en el inductor a lo largo del tiempo. Para ello, atenderemos al uso del concepto de 
                <a href="#potencia-definition"> potencia</a> visto para un el circuito RC. Sin embargo, en este caso tenemos que adaptar dicha definición al inductor utilizado. Es decir, ahora la potencia de la bobina se 
                rige por 
                {WRITE_FORMULA("p(t) = V_L(t) \\cdot I(t)", false)}
                Si reescribimos esta expresión utilizando la definición de diferencia de potencial en los bornes del inductor, nos queda que
                {WRITE_FORMULA("p(t) =  L \\frac{\\partial I(t)}{\\partial t} \\cdot I(t)", false)}
                Entonces, si por definición sabemos que {WRITE_FORMULA("\\hspace{0.1cm} p(t) = \\frac{\\partial E(t)}{\\partial t}", true)}, realizamos las sustituciones adecuadas con respecto a la potencia en el inductor y tenemos que, la energía 
                de este se define cómo
                {WRITE_FORMULA("\\partial E(t) = L \\cdot I(t) \\partial I(t)", false)}
                Resolvemos la ecuación diferencial anterior, integrando en ambas partes. Suponiendo que en el instante inicial no circula corriente por el circuito, tenemos que {WRITE_FORMULA("\\hspace{0.1cm} E(0) = 0", true)} e {WRITE_FORMULA("\\hspace{0.1cm} I(0) = 0", true)}, 
                luego:
                {WRITE_FORMULA("\\int_{0}^{E(t)} \\partial E(t) = \\int_{0}^{I(t)} L \\cdot I(t) \\partial I(t)", false)}
                {WRITE_FORMULA("E(t) = L \\int_{0}^{I(t)} I(t) \\partial I(t) = L \\left[ \\frac{I(t)^2}{2} \\right]_{0}^{I(t)}", false)}
                Obteniendo finalmente que la energía almacenada en el inductor es
                {WRITE_FORMULA(RL_ENERGY, false)}
                Además, hay que tener en cuenta que al  a sustituir en {WRITE_FORMULA("\\hspace{0.1cm}I(t)",true)}, debemos de utilizar su expresión correspondiente, dependiendo de si la bobina se encuentra en estado de almacenamiento o de disipación de energía.
             
                <br />
                <br />
                <h2 id="fem-inductor">Fuerza electromotriz (F.E.M)</h2>
                Para un campo electromagnético, la ley de Lenz se encarga de relacionar el flujo magnético de ocasionado por un conductor a los cambios que se 
                producen por el campo magnético de este. Según esta ley, existe una fuerza opuesta a la corriente generada por el flujo magnético del inductor. Esta viene dada por la siguiente expresión
                {WRITE_FORMULA(RL_FEM, false)}
                <br />
                <br />

                <h2 id="flujo-magnetico-inductor">Flujo magnético</h2>
                Definimos como flujo mágnetico al flujo asociado a un campo magnético, similar a la utilizada para definir el flujo eléctrico. Denotado como {WRITE_FORMULA("\\hspace{0.1cm} \\phi ", true)}, el flujo magnético depende de valor del campo magnético y de la superficie del elemento. Entonces tenemos que
                {WRITE_FORMULA("\\phi(t) = B(t) \\cdot S", false)}
                Aplicando la ley de <i>Biot-Savart</i> para el campo mágnetico, la cuál define mediante la siguiente expresión:
                {WRITE_FORMULA(BIOT_SAVART, false)}
                Sustituimos en la expresión de flujo magnetico y nos queda que:
                {WRITE_FORMULA("\\phi(t) = \\mu_0 \\cdot \\frac{N^2 \\cdot S}{l} \\cdot I(t)", false)}
                Como se puede observar, nos faltan bastantes datos, como puede ser la longitud del inductor o el número de espiras de este. Sin embargo, la definición de inductancia viene dada por la expresión
                {WRITE_FORMULA("L = \\mu_0 \\cdot \\frac{N^2 \\cdot S}{l}", false)}
                , luego
                {WRITE_FORMULA(PHI, false)}
                Por último, podemos obtener el flujo máximo de campo magnético que se puede generar, calculando el límite en infinito de la expresión anterior:
                {WRITE_FORMULA("\\phi_{max} = \\lim_{t \\to \\infty} \\phi(t) = \\lim_{t \\to \\infty} L \\cdot I(t) = L \\cdot I_{max}", false)}
                O lo que es lo mismo
                {WRITE_FORMULA(PHI_MAX,false)}
                <br />
                <br />
            </div>
        )
    }
}