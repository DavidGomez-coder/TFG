import logo from './logo.svg';
import './App.css';
import SimpleRC from './Circuits/SimpleRC';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Component } from 'react';
import Theory from './Theory/Theory';
import SimpleRL from './Circuits/SimpleRL';
import Rc from './Circuits/Rc'


class ExternalView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      wndow: "rc-simulation"
    }
  }

  updateWindow(newWndow) {
    this.setState({
      wndow: newWndow
    });
  }

  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark"    >
          <Container fluid>
            {/* NAVBAR */}
            <Navbar.Brand href="#teoria">
              Física Interactiva
            </Navbar.Brand>
            <Nav className='me-auto'>
              {/*<Nav.Link href="#teoria" onClick={(ev) => { this.updateWindow("teoria");  window.location.reload(false);} }>Teoría</Nav.Link>*/}
              { /*<Nav.Link href="#rc-sim" onClick={(ev) => { this.updateWindow("rc-sim"); }}>Simulación RC</Nav.Link> */}
              <Nav.Link href="#rc-simulation" onClick={(ev) => { this.updateWindow("rc-simulation"); }}>Simulación RC</Nav.Link>
              <Nav.Link href="#rl-sim" onClick={(ev) => { this.updateWindow("rl-sim"); }}>Simulación RL</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link>Ⓒ2023 David Gómez Pérez</Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        <Container fluid="xs sm md lg xl xxl">
          {
            this.state.wndow === "rc-sim" ? <SimpleRC /> :
            this.state.wndow === "rl-sim" ? <SimpleRL /> : 
            this.state.wndow === "rc-simulation" ? <Rc /> : undefined
            /*this.state.wndow === "teoria" ? <Theory /> : undefined */
          }
        </Container>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <ExternalView></ExternalView>
    </div>
  );
}

export default App;
