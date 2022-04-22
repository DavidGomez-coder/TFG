import React, {Component} from 'react'
import NavBar from '../components/NavBarComponent/NavBar';
import CircuitComponent from '../components/SimulationComponents/CircuitComponent';
import EditorComponent from '../components/SimulationComponents/EditorComponent';
import GraphComponent from '../components/SimulationComponents/GraphComponent';

class RcSim extends Component {
    render (){
        return (
            <div>
                <NavBar />
                <div className='container'>
                <div className='row align-items-'>
                    <div className='col-sm-3'>
                        <EditorComponent />
                    </div>
                    <div className='col-sm-9'>
                        <div className='row align-items-center'>
                            <CircuitComponent />
                            <GraphComponent />
                        </div>

                    </div>
                </div>
            </div>
            </div>
            
        );
    }
}

export default RcSim;