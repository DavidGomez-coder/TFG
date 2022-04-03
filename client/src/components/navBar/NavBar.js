import React, {Component} from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import logo from '../../assets/images/logo.svg'
import house from '../../assets/images/house.svg'

class NavBar extends Component {

    render (){
        return (
           <nav className='navbar navbar-expand-sm navbar-dar bg-dark'>
               <div className='container-fluid'>
                    <a className='navbar-brand' style={{color: 'white'}}>
                        <img src={logo} width='30'></img>
                        Física Interactiva
                    </a>

                    <div className='collapse navbar-collapse d-flex'>
                        <ul className='navbar-nav me-auto'>
                            <li className='nav-item'>
                                <a className='nav-link' href='#'>Simulaciones</a>
                            </li>
                            <li className='nav-item'>
                                <a className='nav-link' href='#'>Teoría</a>
                            </li>
                            <li className='nav-item'>
                                <a className='nav-link' href='#'>About</a>
                            </li>
                            <li className='nav-item'>
                                
                            </li>
                            <li className='nav-item'>
                                <a className='nav-link' href='#'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/>
                                        <path fillRule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/>
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </div>

               </div>
           </nav>
        );
    }

}

export default NavBar;