import React, {Component} from "react";


class ErrorComponent extends Component {
    constructor (props){
        super(props)
        this.err_type = props.err_type
    }

    render() {
        if (this.err_type === "CIRCUIT_NOT_FOUND"){
            return (
                <div >
                    <p>{this.err_msg}</p>
                </div>
            )
        }
        
    }
}

export default ErrorComponent;