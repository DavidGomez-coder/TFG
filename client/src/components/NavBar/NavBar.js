
import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js'
import './NavBar.css'

class SideBar extends Component {
    render () {
        return (
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
                <a className="navbar-brand" href="#">Física Interactiva</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample03" aria-controls="navbarsExample03" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarsExample03">
                    <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">About</a>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="dropdown03" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Simulaciones</a>
                        <div className="dropdown-menu" aria-labelledby="dropdown03">
                            <a className="dropdown-item" href="#">Circuito RC Simple</a>
                            <a className="dropdown-item" href="#">Circuito RL Simple</a>
                        </div>
                    </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default SideBar;