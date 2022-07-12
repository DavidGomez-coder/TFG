import React, { Component } from "react";
import { Container, Navbar } from "react-bootstrap";
import Nav from 'react-bootstrap/Nav';
import RCTheory from "./RCTheory";
import RLTheory from "./RLTheory";
import './Theory.css'

export default class Theory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theory_window: "teoria-circuito-rc"
        }
    }


    updateTheoryWindow(nWindow){
        this.setState({
            theory_window : nWindow
        });
    }

    render() {
        return (
            <div id="theory-container">
                <Navbar bg="light" variant="light">
                    <Container fluid>
                        <Nav className="me-auto">
                            <Nav.Link href="#teoria-circuito-rc" onClick={(ev) => {this.updateTheoryWindow("teoria-circuito-rc")}}>Circuito RC</Nav.Link>
                            <Nav.Link href="#teoria-circuito-rl" onClick={(ev) => {this.updateTheoryWindow("teoria-circuito-rl")}}>Circuito RL</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>
                <Container fluid="xs sm md lg xl xxl">
                    {
                        this.state.theory_window === "teoria-circuito-rc" ? <RCTheory /> :
                        this.state.theory_window === "teoria-circuito-rl" ? <RLTheory /> : undefined
                    }
                </Container>
            </div>
        )
    }
}