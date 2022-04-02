import React, {Component} from 'react'
import logo from '../../assets/images/logo.svg'

class Navbar extends Component {
    render (){
        return (
            <nav className='navbar navbar-dark bg-dark px-3 position-sticky'>
                <a className='navbar-brand' href='#'>
                  <img src={logo} width="30" height="30" className='d-inline-block align-top' alt='logo'></img>
                   Física Interactiva
                </a>
                <ul className='nav nav-pills'>
                    <li className='nav-item'>
                        <a className='nav-link' href='#'>Simulación</a>
                    </li>
                    <li className='nav-item'> 
                        <a className='nav-link' href='#'>Teoría</a>
                    </li>
                </ul> 
            </nav>
        );
    }
}
export default Navbar;