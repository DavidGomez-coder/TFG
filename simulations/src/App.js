import logo from './logo.svg';
import './App.css';
import SimpleRC from './SimpleRC/SimpleRC';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Component } from 'react';
import Home from './Home/Home';
import Theory from './Theory/Theory';


class ExternalView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      wndow: "teoria"
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
        <Navbar bg="dark" variant="dark">
          <Container fluid>
            {/* NAVBAR */}
            <Navbar.Brand href="#home" onClick={(ev) => {this.updateWindow("home")}}>
              Física Interactiva
            </Navbar.Brand>
            <Nav className='me-auto'>
              <Nav.Link href="#about"  onClick={(ev) => {this.updateWindow("home")}}>About</Nav.Link>
              <Nav.Link href="#teoria" onClick={(ev) => {this.updateWindow("teoria")}}>Teoría</Nav.Link>
              <Nav.Link href="#rc-sim" onClick={(ev) => {this.updateWindow("rc-sim")}}>Simulación RC</Nav.Link>
              <Nav.Link href="#rl-sim" onClick={(ev) => {this.updateWindow("rl-sim")}}>Simulación RL</Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        <Container fluid="xs sm md lg xl xxl">
          {
            this.state.wndow === "home" ? <Home/> : 
            this.state.wndow === "rc-sim" ? <SimpleRC /> :
            this.state.wndow === "rl-sim" ? "" :
            this.state.wndow === "teoria" ? <Theory /> : undefined
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
