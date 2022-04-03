import logo from './assets/images/logo.svg';
import './assets/css/App.css';
import MainLogoComponent from './components/MainLogoComponent/MainLogoComponent';
import NavBar from './components/navBar/NavBar';



function App() {
  return (
    <div className="App">
      <NavBar />
      <header className="App-header">

        <h1>Física Interactiva</h1>

        <MainLogoComponent />
       
      </header>
    </div>
  );
}

export default App;
