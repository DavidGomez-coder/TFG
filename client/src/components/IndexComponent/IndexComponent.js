import React, {Component} from "react";
import FooterComponent from "../FooterComponent/FooterComponent";
import NavBar from "../NavBarComponent/NavBar";

class IndexComponent extends Component {
    render (){
        return  (
            <div>
                <NavBar />
                <FooterComponent/>
            </div>

        );
    }
}

export default IndexComponent;