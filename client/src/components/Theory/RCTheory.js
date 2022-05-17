import React, {Component} from 'react'
import Latex from 'react-latex';
import { MathJaxContext, MathJax } from 'better-react-mathjax';

import "./RCTheory.css"
import 'katex/dist/katex.min.css';


class RCTheory extends Component {

    constructor(props){
        super(props);
        this.state = {
            introduction_text : []
        }

        this.config = {
            loader: { load: ["input/asciimath"] }
        }
    }

    componentDidMount(){
        this.readFile()
    }

    async readFile(){
        await fetch(`${process.env.REACT_APP_API_SERVER}/RCTheory`)
            .then(result => result.json())
            .then(response => {
                let json_file = JSON.parse(response.file)

                console.log(json_file.theory)
                this.setState({
                    introduction_text : json_file.theory.plain_text.introduction
                })
            });

        return "texto"
    }

    render(){
        return (
            <div >
                <MathJaxContext config={this.config}>
                
                    <h2 className='title'>Planteamiento teórico</h2>
                    <div className='center-text'>
                        {this.state.introduction_text.map((text) => {
                        return (
                            <div>{text}<br/></div>
                         )
                    })}</div>
                </MathJaxContext>
                
            </div>
        )
    }
}

export default RCTheory;