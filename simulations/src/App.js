import logo from './logo.svg';
import './App.css';
import SimpleRC from './SimpleRC/SimpleRC';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Component } from 'react';


class ExternalView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      wndow: "home"
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
            <Navbar.Brand href="#home" >
              Física Interactiva
            </Navbar.Brand>
            <Nav className='me-auto'>
              <Nav.Link href="#about">About</Nav.Link>
              <Nav.Link href="#teoría">Teoría</Nav.Link>
              <Nav.Link href="#rc-sim">Simulación RC</Nav.Link>
              <Nav.Link href="#rl-sim">Simulación RL</Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        <Container fluid="xs sm md lg xl xxl">
          <SimpleRC />
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
