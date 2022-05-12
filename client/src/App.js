import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar/NavBar.js';
import Home from './components/Home/Home.js';
import './App.css';
import SimpleRC from './components/Circuit/SimpleRC';




function App() {


  return (
    <div>
      <NavBar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route index element={<Home />} />
          <Route path='/RCSim' element={<SimpleRC />} />
        </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;
