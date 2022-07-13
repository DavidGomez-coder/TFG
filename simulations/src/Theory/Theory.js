import React, { Component } from "react";
import { Container, Row, Col, ListGroup, Accordion, Navbar } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import RCTheory from "./RCTheory";
import RLTheory from "./RLTheory";
import './Theory.css'

export default class Theory extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div id="theory-container">
                <Navbar bg="light" variant="light">
                    <Container fluid>
                        <Nav className="me-auto">
                            <Nav.Link href="#introduccion-rc">Circuito RC</Nav.Link>
                            <Nav.Link href="#introduccion-rl">Circuito RL</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>
                <Container fluid="xs sm md lg xl xxl">
                    <Row>
                        <Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2} style={{"position" : "sticky"}}>
                        <div className='sticky-top' style={{"top" : "2%" ,"textAlign" : "left"}}>
                        <div className="dropdown-menu-left">
                            <h6 className="dropdown-header">Índice</h6>
                            <div className="dropdown-divider"></div>
                            <h6 className="dropdown-header">Circuito RC</h6>
                            <a className="dropdown-item" href="#introduccion-rc">Introducción</a>
                            <a className="dropdown-item" href="#carga-del-condensador">Carga del condensador</a>
                            <a className="dropdown-item" href="#descarga-del-condensador">Descarga del condensador</a>
                            <a className="dropdown-item" href="#energia-del-condensador">Enegía almacenada en el condensador</a>
                            <div className="dropdown-divider"></div>
                            <h6 className="dropdown-header">Circuito RL</h6>
                            <a className="dropdown-item" href="#introduccion-rl">Introducción</a>
                            <a className="dropdown-item" href="#carga-del-inductor">Carga de un inductor</a>
                            <a className="dropdown-item" href="#descarga-del-inductor">Descarga de un inductor</a>
                            <a className="dropdown-item" href="#energia-del-inductor">Enegía almacenada en el inductor</a>
                            <a className="dropdown-item" href="#fem-inductor">Fuerza electromotriz (F.E.M)</a>
                            <a className="dropdown-item" href="#flujo-magnetico-inductor">Flujo magnético</a>
                        </div>
                    </div>
                        </Col>
                        <Col xs={8} sm={8} md={8} lg={8} xl={8} xxl={8}>
                            
                            <div id="#top"></div>
                            <RCTheory />
                            <RLTheory />
                        </Col>

                    </Row>
                </Container>
            </div>
        )
    }
}