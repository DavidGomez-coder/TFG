import React, { useEffect, useState, Component} from 'react'
import { Navbar } from 'react-bootstrap';
import ErrorComponent from '../Errors/ErrorComponent';
import NavBar from '../NavBar/NavBar';

class SimpleRC extends Component {
    constructor (){
        super();
        this.state = {
            done: false, 
            components : []
        };
        //this.getExampleCircuit()
    }

   getExampleCircuit () {
        fetch("http://localhost:8080/circuit/create/simpleRC")
        .then(result => result.json())
        .then(response => this.setState({
            done: true, 
            components : response
        }))
        .catch(()=> {
            this.setState({
                done: true, 
                success: false
            })
        })
    }

    render () {

        if (this.state.done){
            return(
                <div>
                    <NavBar />
                    {this.state.components.components.map((elem) => {
                        return (
                            <p key={elem.id}>
                                {elem.type}
                            </p>
                        )
                    })}
                </div>
            )
        } else{
            return (
                <div>
                    <ErrorComponent err_type="CIRCUIT_NOT_FOUND"></ErrorComponent>
                </div>
            )
        }
    }
}

export default SimpleRC;