import React from "react";
import {Link} from "react-router-dom";
import "./HomePage.css";

class HomePage extends React.Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    render(){
        return(
        <div id="homePageContainer" ref={(line)=>{this.contentTop=line}}>
            <div id="bannerBackground"></div>
            <div id="backToTop" onClick={()=>{this.contentTop.scrollIntoView({ behavior: "smooth" });}}>^</div>
            <div id="homePageBanner">
                <div id="bannerText">Path Searching App</div>
                <div id="bannerBtn">
                    <button onClick={()=>{this.contentOne.scrollIntoView({ behavior: "smooth" });}}>Turtorial</button>
                    <button><Link to="/graph">Start</Link></button>
                </div>              
            </div>
            <div id="describeContentOne" ref={(line)=>{this.contentOne=line}}>
                <div>Image Goes Here</div>
                <div>
                    <h2>What is this?</h2>
                    <p>Path Searching App is a demonstration app which shows various type of graph search alogorithm using simple grid!</p>
                    <p>Now support searching methods:</p>

                    <button onClick={()=>{this.contentTwo.scrollIntoView({ behavior: "smooth" });}}>Depth First Search (DFS)</button>
                    <button onClick={()=>{this.contentThree.scrollIntoView({ behavior: "smooth" });}}>Breadth First Search (BFS)</button>
                    <button onClick={()=>{this.contentFour.scrollIntoView({ behavior: "smooth" });}}>Dijkstra's Alogorithm</button>
                    
                    
                </div>
            </div>
            <div id="describeContentTwo" ref={(line)=>{this.contentTwo=line}}>
                <div>
                    <h2>Depth First Search (DFS)</h2>
                </div>
                <div>Content Goes Here</div>
            </div>
            <div id="describeContentThree" ref={(line)=>{this.contentThree=line}}>
                <div>Image Goes Here</div>
                <div>
                    <h2>Breadth First Search (BFS)</h2>
                </div>
            </div>
            <div id="describeContentFour" ref={(line)=>{this.contentFour=line}}>
                <div>
                    <h2>Dijkstra's Alogorithm</h2>
                </div>
                <div>Dijkstra's Alogorithm</div>
            </div>
        </div>
        )
    }
}

export default HomePage;