import logo from './logo.svg';
import './App.css';
import SideBar from './components/SideBar/SideBar';
import { useEffect, useState } from 'react';

function App() {

  const [circuito, setCircuito] = useState([])

  useEffect(() => {
    fetch('http://localhost:8080/circuit/create/simpleRC')
      .then((response) => {
        return response.json()
      })
      .then((circuito) => {
        console.log(circuito.components)
        setCircuito(circuito.components)
      })
  }, []);


  return (
    <div className="App">
    <SideBar></SideBar>
      <div>
        {circuito.map( item => {
          return (
            <div key={item.id}>
              <p>Value: {item.value}, Multiplier: {item.multiplier}, C.Value: {item.componentValue}</p>
            </div>
          )
        })}
      </div>

    </div>
  );
}

export default App;
