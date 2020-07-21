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
            <div id="backToTop" onClick={()=>{this.contentTop.scrollIntoView({ behavior: "smooth" });}}></div>
            <div id="homePageBanner">
                <div id="bannerText">Path Searching App</div>
                <div id="bannerBtn">
                    <button onClick={()=>{this.contentOne.scrollIntoView({ behavior: "smooth" });}} id="bannerTurtorialBtn">Turtorial</button>
                    <button id="bannerStartBtn"><Link id="StartBtnLink" to="/graph">Start</Link></button>
                </div>              
            </div>
            <div id="describeContentOne" ref={(line)=>{this.contentOne=line}}>
                <div id="imgIntro"></div>
                <div className="desDetailDiv">
                    <h2 className="desTitle">What is this?</h2>
                    <div className="desDetail">
                        <p>Path Searching App is a demonstration app which visualized various type of graph search alogorithm using simple grid!</p>
                        <p>Searching methods:</p>

                        <button onClick={()=>{this.contentTwo.scrollIntoView({ behavior: "smooth" });}}>Depth First Search (DFS)</button>
                        <button onClick={()=>{this.contentThree.scrollIntoView({ behavior: "smooth" });}}>Breadth First Search (BFS)</button>
                        <button onClick={()=>{this.contentFour.scrollIntoView({ behavior: "smooth" });}}>Dijkstra's Alogorithm</button>
                        <button onClick={()=>{this.contentFive.scrollIntoView({ behavior: "smooth" });}}>A* Alogorithm</button>
                    </div>
                </div>
            </div>
            <div id="describeContentTwo" ref={(line)=>{this.contentTwo=line}}>
                <div className="desDetailDiv">
                    <h2 className="desTitle">Depth First Search (DFS)</h2>
                    <div className="desDetail">DFS is a searching method which simply search one direction to end
                     and change other direction until it finds the target.
                     </div>
                </div>
                <div id="imgDFS"></div>
            </div>
            <div id="describeContentThree" ref={(line)=>{this.contentThree=line}}>
                <div id="imgBFS"></div>
                <div className="desDetailDiv">
                    <h2 className="desTitle">Breadth First Search (BFS)</h2>
                    <div className="desDetail">BFS is a searching method which search all near by vertex until it find target.
                    </div>
                </div>
            </div>
            <div id="describeContentFour" ref={(line)=>{this.contentFour=line}}>
                <div className="desDetailDiv">
                    <h2 className="desTitle">Dijkstra's Alogorithm</h2>
                    <div className="desDetail">Dijkstra's alogorithm is differnet from DFS and BFS, it will take the weight in account,
                     and search the lowest total weight vertex first until find the target. so it can guarantee the find path is shortest from start to target.
                     </div>
                </div>
                <div id="imgDijk"></div>
            </div>
            <div id="describeContentFive" ref={(line)=>{this.contentFive=line}}>
                <div id="imgAstar">
                </div>
                <div className="desDetailDiv">
                    <h2 className="desTitle">A* Alogorithm</h2>
                    <div className="desDetail">A* alogorithm is a advenced version of Dijkstra, it will guess the possible shortest way first, if we choose the
                     guess properly, it will also guarantee the find path is shortest from start to target and with lower visited vertex than Dijkstra.
                     </div>
                </div>
            </div>
        </div>
        )
    }
}

export default HomePage;