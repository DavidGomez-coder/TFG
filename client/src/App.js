import './assets/css/App.css';
import MainLogoComponent from './components/MainLogoComponent/MainLogoComponent';
import NavBar from './components/NavBarComponent/NavBar';



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
