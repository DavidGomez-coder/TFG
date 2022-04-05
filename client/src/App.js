import './assets/css/App.css';


import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import IndexComponent from './components/IndexComponent/IndexComponent';
import AboutComponent from './components/AboutComponent/AboutComponent';


function App() {
  return (
    <>
      <Router>
        <Routes>
            <Route exact path="/" element={<IndexComponent />} />
            <Route exact path="/about" element={<AboutComponent />} />
        </Routes>
          
      </Router>
    </>
  );
}

export default App;
