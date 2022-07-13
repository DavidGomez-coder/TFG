import Dropdown from 'react-bootstrap/Dropdown';
import React, { Component } from "react";
import MathJax from 'react-mathjax';
import { Container, Row, Col, ListGroup, Accordion } from "react-bootstrap";

import rc_circuit from "../assets/img/rc-circuit.png"
import { I_DEFINITION, OHM_LAW, SCND_KIRKCHOFF, SUST_DEFINITION, SUST_DEFINITION2 } from './TheoryFormulas';



export default class RCTheory extends Component {

    render() {
        return (

            <div id="scrool_section">
                <br />
                <h1 id="introduccion-rc" style={{"textAlign" : "center"}}>Simulación de un circuito RC</h1>
                <h2 >Introducción</h2>
                Definimos los circuitos RC, como aquellos que están formados por resistencias y condensadores, alimentados por una fuente de corriente contínua o alterna. En este caso, estudiaremos
                el caso más simple de todos; es decir, aquellos formados por una pila, un solo condensador y una sola resistencia. El circuito a estudiar será el mostrado en la siguiente figura:
                <br />
                <div style={{ "textAlign": "center" }}>
                    <img src={rc_circuit} height="350"></img>
                </div>
                <br />
                Antes de continuar con el estudio del comportamiento del circuito, hay que tener en cuenta los siguientes conceptos, los cuáles serán utilizados para entender y obtener las expresiones necesarias
                que nos ayudarán a entender este fenómeno.
                <br />
                <br />
                <Accordion defaultActiveKey={['k-0', 'k-1', 'k-2']} alwaysOpen>
                    <Accordion.Item eventKey='k-0'>
                        <Accordion.Header><strong>Segunda Ley de Kirchhoff</strong></Accordion.Header>
                        <Accordion.Body>
                            La segunda Ley de Kirchhoff, dice lo siguiente: <i>En cada una de las mallas que definen un circuito, la suma de las diferencias de potencial de cada uno de los elementos es cero. Es decir,
                                la suma de todas las tensiones suministradas es igual a la suma de todas las tensiones consumidas. <br />
                            </i>
                            <MathJax.Provider>
                                <MathJax.Node formula={SCND_KIRKCHOFF} />
                            </MathJax.Provider>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey='k-1'>
                        <Accordion.Header><strong>Ley de Ohm</strong></Accordion.Header>
                        <Accordion.Body>
                            Se trata de una de las leyes más básicas en teoría de circuitos, la cuál viene dada por la siguiente expresión:
                            <MathJax.Provider>
                                <MathJax.Node formula={OHM_LAW} />
                            </MathJax.Provider>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey='k-2'>
                        <Accordion.Header><strong>Intensidad de corriente</strong></Accordion.Header>
                        <Accordion.Body>
                            Definiremos intensidad de corriente, como la cantidad de carga que atraviesa un circuito por unidad de tiempo. La expresión a utilizar será la siguiente:
                            <MathJax.Provider>
                                <MathJax.Node formula={I_DEFINITION} />
                            </MathJax.Provider>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <br />
                <h2 id="carga-del-condensador">Carga del condensador</h2>
                Para comprender el funcionamiento del circuito, lo analizaremos en término de energías de sus componenentes. Para ello, haremos uso de la <i>Ley de Kirchhoff</i> presentada anteriormente, aplicando
                dicha ley sobre la malla de nuestro circuito.
                <MathJax.Provider>
                    <MathJax.Node formula="\varepsilon = V_R(t) + V_C(t)" />
                </MathJax.Provider>
                , dónde <MathJax.Provider> <MathJax.Node inline formula="\varepsilon" /> </MathJax.Provider> es el valor de la fuente, <MathJax.Provider> <MathJax.Node inline formula="V_R(t)" /> </MathJax.Provider> la diferencia de potencial
                entre los bornes de la resistencia y <MathJax.Provider> <MathJax.Node inline formula="V_C(t)" /> </MathJax.Provider> la diferencia de potencial en el condensador. Además, la carga del condensador a lo largo del tiempo puede determinarse
                utilizando la siguiente expresión:
                <MathJax.Provider>
                    <MathJax.Node formula="q(t) = V_C(t) \cdot C" />
                </MathJax.Provider>
                Si hacemos uso de la expresión anterior, además de las definiciones de la <i>Ley de Ohm</i> e <i>Intensidad de corriente</i>, sustituimos en la primera ecuación planteada, quedando algo tal que así:
                <MathJax.Provider>
                    <MathJax.Node formula={SUST_DEFINITION} />
                </MathJax.Provider>
                , obeniendo el planteamiento de la siguiente ecuación diferencial:
                <MathJax.Provider>
                    <MathJax.Node formula={SUST_DEFINITION2} />
                </MathJax.Provider>
                <br />
                <br />
                <h2 id="descarga-del-condensador">Descarga del condensador</h2>
                <h2 id="energia-del-condensador">Energía almacenada</h2>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec eleifend elit. Nam turpis dolor, ultrices vel arcu sed, fringilla condimentum nisi. Donec tincidunt cursus lorem, quis sodales nulla iaculis quis. Pellentesque eget fermentum nisi. In egestas ullamcorper ultrices. Nulla libero nibh, imperdiet vel varius non, porttitor a dolor. Nam ac suscipit diam, nec viverra nulla. Fusce scelerisque risus quis diam lobortis, ut ultricies lectus dapibus. Fusce at orci id orci consequat semper id ut lacus. Sed at lacinia nisi. Nulla maximus turpis metus, et venenatis mauris pretium ut. Ut vestibulum purus quis mollis pharetra. Nulla erat lorem, suscipit sit amet nunc sit amet, euismod molestie risus.

                Aenean cursus metus lacus, nec pellentesque risus vulputate non. Proin in tellus accumsan, laoreet nulla in, commodo sem. Curabitur vulputate venenatis porttitor. Nunc in urna quam. Morbi ut tristique nisl. Nunc tincidunt aliquet mi, eget dapibus purus porttitor eu. Nam risus tellus, mattis rutrum dictum sit amet, laoreet id eros. Cras eu nisl tincidunt, convallis libero a, commodo elit. Vestibulum vitae urna leo. Nullam ante leo, dapibus non erat in, faucibus blandit justo. In venenatis eget mauris in cursus. In porta cursus vestibulum. Suspendisse malesuada enim id ipsum aliquet tincidunt. Nullam interdum sed velit vel luctus. Morbi non nulla gravida, fringilla elit sit amet, faucibus magna. Maecenas consequat massa at sem dapibus, sed mollis enim accumsan.

                Curabitur placerat ut nunc sed condimentum. Nam sit amet vehicula lacus. Curabitur efficitur eros sapien, at imperdiet justo lacinia quis. Mauris lacinia augue magna, a sodales purus pretium eget. Nulla nibh mauris, facilisis at erat ac, sagittis vestibulum turpis. Duis aliquam ipsum ut tortor varius facilisis. Curabitur vel lectus et mi aliquam suscipit.

                Nunc accumsan at urna id porta. Integer ut rutrum tellus, et volutpat neque. Maecenas quam leo, ornare sit amet elementum at, consectetur quis enim. Sed consequat a erat et fermentum. Sed ornare convallis vestibulum. Duis at porta dolor. Nulla pretium congue nulla sed rhoncus. Nam ullamcorper ipsum a dui sollicitudin varius. Quisque dolor magna, pellentesque ac erat non, aliquet vehicula tellus. Proin malesuada risus ut velit sollicitudin efficitur. Aenean interdum ultrices sem tristique egestas. Morbi in enim sit amet dolor placerat imperdiet eu eu lacus. Etiam laoreet est non tortor venenatis pretium. Proin vitae dolor id est malesuada semper ac nec libero. Pellentesque feugiat vulputate volutpat.

                Vivamus non leo euismod urna pellentesque pellentesque eget sed odio. Mauris cursus ligula nec lectus egestas, eu suscipit lorem molestie. Nullam iaculis mollis iaculis. Maecenas sollicitudin maximus risus, quis gravida dolor dictum et. Aliquam vestibulum turpis lorem, quis congue orci laoreet rutrum. Phasellus elementum est ante, ac fringilla tortor fringilla sit amet. Maecenas porttitor porta libero at dictum. In vitae eleifend orci. Phasellus porttitor mi malesuada fringilla sagittis. Pellentesque convallis dui nec massa vestibulum euismod.

                Quisque consectetur, tortor in molestie fermentum, libero nulla mattis lectus, eget congue libero quam non turpis. Sed vel felis ut eros ultricies pellentesque vitae ac ipsum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque consectetur aliquam sem, eget condimentum nisi bibendum quis. Sed ultricies efficitur ipsum, eu volutpat neque aliquam at. Phasellus hendrerit, tellus ut iaculis porta, nibh lacus pretium augue, id pellentesque tortor massa in est. Phasellus sed odio tellus. Nulla mauris mauris, mattis a feugiat eget, interdum at felis. Donec convallis, nisi a feugiat facilisis, nibh nibh tempus ligula, porta auctor nisl est in metus. Pellentesque nunc est, venenatis nec rhoncus eu, laoreet nec dui.

                Sed vitae metus diam. Vestibulum in elit in ipsum viverra sodales sit amet sed dolor. Sed volutpat imperdiet aliquet. Vestibulum tempus, felis id congue rutrum, felis dui blandit dui, at porttitor sapien leo ut nisl. Nam efficitur condimentum laoreet. Morbi luctus at est eu molestie. Aliquam erat volutpat. Aliquam augue nisl, tristique vitae dictum in, aliquet ut magna. Fusce egestas in erat at elementum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque a tellus ex. Cras eu nisl rutrum, laoreet enim fermentum, vulputate massa. Nam et odio at enim dignissim finibus ac id purus. Nam non varius tortor.

                Nam leo mauris, laoreet et condimentum at, condimentum ut dui. Donec tristique id elit quis vulputate. Cras imperdiet erat sit amet est porta vulputate. Maecenas congue metus sit amet egestas aliquet. Maecenas at libero nisl. Sed dui nunc, porta ut nibh in, elementum bibendum nibh. Etiam iaculis, ligula ut rutrum interdum, odio lacus semper massa, et tempus mi nibh at diam. Suspendisse tincidunt vestibulum neque ut dictum. Vestibulum urna lectus, ornare id massa in, porttitor ultrices ex. Donec gravida, justo ac consectetur tincidunt, felis purus cursus diam, quis molestie nisl odio id diam.

                Aliquam tortor leo, vehicula id facilisis quis, hendrerit nec sem. Sed eleifend accumsan pharetra. Sed commodo dignissim sollicitudin. Suspendisse est felis, pellentesque et nisi vel, finibus feugiat nunc. Sed maximus eros ac fermentum cursus. Nulla a libero et diam placerat consectetur. Quisque posuere volutpat magna id convallis. Integer nunc dui, dapibus non tortor eget, ornare volutpat tellus. Pellentesque non luctus nunc. Cras finibus ante quis magna vehicula, id bibendum ipsum tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;

                Fusce volutpat lorem sapien, a cursus augue fringilla ut. Maecenas elit mauris, congue in libero id, sagittis cursus ipsum. Donec nec aliquet mi. Proin pharetra nisl a quam lacinia tincidunt. Sed sit amet mauris et eros gravida iaculis. Cras nisi nunc, mattis ac venenatis iaculis, ultricies in diam. Nunc scelerisque sapien ac ipsum lobortis congue.

                Phasellus et dictum dolor. Nulla pellentesque sodales maximus. Morbi sit amet lorem in mi aliquam bibendum. Sed risus metus, efficitur pharetra iaculis et, tincidunt at arcu. Morbi cursus ac nisl ut fermentum. Maecenas quis dui et lorem lobortis efficitur sit amet a diam. Aenean ac posuere risus, a commodo justo. Nullam placerat sagittis diam non suscipit. In nec venenatis magna, sit amet interdum odio. Quisque rhoncus interdum magna non vehicula. Suspendisse eu dictum ligula.

                Suspendisse potenti. Sed nec arcu sit amet ligula auctor commodo. Suspendisse mauris neque, faucibus vel risus in, blandit condimentum arcu. Nulla viverra at turpis id ullamcorper. Etiam congue elit ac nunc volutpat, vel viverra metus pretium. Pellentesque ex sapien, fringilla ultrices bibendum in, dignissim quis orci. Curabitur tincidunt dictum erat. Nunc non dictum augue. Sed tincidunt ultrices nulla, sit amet faucibus dolor interdum sed. Ut non felis finibus, euismod massa ut, vestibulum elit.

                Donec tortor mauris, vehicula a posuere vitae, euismod nec ante. Proin a urna maximus, ultrices ligula quis, suscipit ipsum. Aliquam vel ornare libero. Aliquam sed velit nec magna faucibus consectetur. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris enim velit, dictum et velit eget, aliquet eleifend diam. Aliquam facilisis nunc a erat sodales, at dictum mi sollicitudin. Nunc ut dapibus tortor. Quisque congue, ipsum vitae efficitur lobortis, quam massa vestibulum justo, sit amet dignissim metus lacus at sem. Ut blandit tempor erat iaculis tempus. In et mi lectus. Sed hendrerit felis eget ullamcorper mattis. Nullam non massa ornare, sagittis tortor vel, iaculis nulla. Cras varius semper bibendum. Suspendisse fermentum condimentum pellentesque.

                Pellentesque id posuere purus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris nec neque eu turpis aliquam lobortis. Vestibulum hendrerit dolor tortor, sed malesuada augue faucibus at. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In sit amet orci turpis. Sed hendrerit massa ante, vitae convallis est volutpat ut. Maecenas posuere mauris sed aliquet rutrum. Sed condimentum tellus in mi mattis, ac porttitor massa pulvinar. Integer varius, risus in bibendum elementum, nisl sem aliquam purus, nec egestas nunc nisl vel justo. Sed est libero, feugiat efficitur sagittis vitae, hendrerit posuere dui. Cras dapibus arcu ut dui mattis pulvinar. Nunc tincidunt, dolor sed iaculis volutpat, nibh magna auctor nisi, non maximus odio libero eget justo. Praesent ultrices tincidunt sapien id scelerisque. Pellentesque non lorem egestas, laoreet est quis, sollicitudin massa.

                Donec sed augue erat. Nam congue tellus non augue rhoncus, consequat maximus lectus facilisis. Nullam euismod dui sit amet sapien sodales, porta bibendum sapien dictum. Praesent ullamcorper gravida est sed rhoncus. Aenean luctus neque quam, et auctor enim euismod id. Sed feugiat tempus nulla. Maecenas magna dui, eleifend vel dolor a, rhoncus molestie diam. Vestibulum finibus erat in nulla consequat, id fringilla magna cursus. Integer fermentum nec tellus ut ultrices.

                In et ligula id eros ultricies viverra. Donec hendrerit bibendum ipsum pellentesque molestie. Nunc sodales risus sed lacus volutpat cursus. Donec non massa odio. Nam elementum viverra hendrerit. Vivamus scelerisque laoreet nibh, ac dignissim tellus. Maecenas faucibus erat vitae neque tristique, eget accumsan tellus facilisis. Morbi commodo ultrices molestie.

                Sed ullamcorper, sapien vel mattis porttitor, eros dolor sollicitudin purus, sit amet laoreet lectus justo at nisl. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque malesuada justo nunc. Cras nec ligula eget nibh aliquet aliquam ac eu quam. Vivamus ultricies, dui non suscipit egestas, nisi ipsum rhoncus enim, sit amet ultricies nulla diam sit amet orci. Suspendisse nec ex dui. Sed iaculis sapien vulputate arcu tincidunt, viverra posuere lacus dapibus. Nullam in est et ligula ornare molestie.

                Cras ex urna, porttitor congue accumsan lobortis, vehicula vitae sapien. Vestibulum libero mi, ullamcorper id velit eget, lacinia ultricies nunc. Cras vitae massa lacinia, finibus augue non, tristique lectus. Fusce pretium eget urna eget cursus. Phasellus fermentum euismod finibus. Proin risus erat, hendrerit vel arcu at, rhoncus vestibulum diam. Morbi sed justo at metus gravida lacinia sit amet sit amet dolor. Sed risus elit, semper vel erat ac, molestie aliquet ex. Ut eget elit feugiat, molestie purus et, pharetra turpis. Aenean cursus, lorem sit amet mollis faucibus, tellus dolor mattis dolor, quis efficitur justo elit at arcu. Vestibulum viverra mattis ligula, quis tincidunt enim dictum sit amet. Quisque magna lacus, accumsan sed erat non, varius posuere ante. Integer scelerisque turpis sed finibus tempus. Nulla facilisi.

                Nam aliquet vulputate diam, eu gravida nisl molestie nec. Pellentesque laoreet ultricies metus, eu blandit dui iaculis id. Phasellus sed lorem rhoncus, malesuada arcu in, semper justo. Phasellus id varius elit. Curabitur viverra tincidunt ante, eget imperdiet ex dictum ut. In lectus ante, varius nec dui ut, efficitur commodo ligula. Pellentesque pulvinar nisl turpis, eu sollicitudin diam feugiat ut. Donec feugiat sem ac nulla tincidunt, sed ornare felis varius. Nullam non felis tortor. In ac velit elementum, facilisis elit sed, eleifend libero. Curabitur ante lorem, volutpat vel nisl vel, faucibus rutrum diam. In vel diam at neque facilisis convallis. Integer lobortis id odio vitae congue. Maecenas ac tincidunt augue. Vestibulum enim turpis, placerat at malesuada vel, vulputate quis risus. In ut bibendum urna, ac feugiat augue.

                Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus et ex molestie, egestas nisi pharetra, gravida magna. Nulla vulputate commodo posuere. Integer ipsum libero, fermentum nec odio ac, viverra commodo lacus. Aliquam ut purus laoreet, maximus mauris vitae, vulputate ipsum. Donec tellus neque, ornare non ante ut, aliquet pulvinar quam. Aliquam erat volutpat. Mauris suscipit urna ut lacus ultricies dignissim. Fusce tincidunt euismod urna sit amet cursus. Quisque interdum accumsan lacinia.
            </div>
        )
    }
}