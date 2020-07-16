import React from "react";
import NavBar from "./NavBar";
import HomePage from "./HomePage";
import Graph from "./Graph";
import {Route} from "react-router-dom";

class App extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                <NavBar/>
                <Route exact path="/">
                    <HomePage/>
                </Route>
                <Route path="/graph">
                    <Graph/>
                </Route>               
            </div>
        )
    }
}

export default App;