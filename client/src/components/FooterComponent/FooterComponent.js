import React, {Component} from "react";
import "../../assets/css/component.footer/FooterComponent.css"
import umalogo from "../../assets/images/uma-logo.png"
class FooterComponent extends Component {
    render (){
        return (
            <div className="footer_box">
                <footer>
                    <div className="image_content">
                    <img src={umalogo} width="100"></img>
                    </div>  
                </footer>
            </div>
            

        );
    }
}

export default FooterComponent;