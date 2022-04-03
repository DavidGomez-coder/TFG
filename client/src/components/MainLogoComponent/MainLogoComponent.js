import React, {Component} from "react";

import logo from '../../assets/images/logo.svg'

import '../../assets/css/component.mainlogo/MainLogoComponent.css'


class MainLogoComponent extends Component {

    gotoSimulations = () => {
        return (
            <div>HOLA</div>
        );
    }

    render (){
        return (
            <div className="main-logo">
                <img src={logo} className="App-logo" alt="logo"/>
            </div>
        );
    }
}

export default MainLogoComponent;