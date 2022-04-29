import React, {Component} from "react";
import "./CircuitNotFound.css"

class ErrorComponent extends Component {
    constructor (props){
        super(props)
        this.err_type = props.err_type
    }

    render() {
        if (this.err_type === "CIRCUIT_NOT_FOUND"){
            return (
                <div className="circuit_not_found">
                    <p className="err_paragraph">{this.err_msg}</p>
                </div>
            )
        }
        
    }
}

export default ErrorComponent;