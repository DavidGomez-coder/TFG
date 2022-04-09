import React, {Component} from "react";
import NavBar from "../NavBarComponent/NavBar";
import "../../assets/css/component.about/AboutComponent.css"

import FooterComponent from "../FooterComponent/FooterComponent";

class AboutComponent extends Component {
    render () {
        return (
            <div>
                <NavBar />
                <div className="about_content">
                    <h1 className="about_title">Sobre esta aplicación</h1>
                    <p className="head_about_text">
                        El principal objetivo de esta aplicación web reside en ayudar al alumnado de las diferentes asignaturas de Física
                        de la ETSI Informática en su comprensión de los diferentes fenómenos físicos dados en estas asignaturas, usando como 
                        medio las simulaciones de estos fenómenos.
                    </p>
                </div>
                <FooterComponent/>
            </div>

        );
    }
}

export default AboutComponent;