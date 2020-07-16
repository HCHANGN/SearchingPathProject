import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter,Switch} from "react-router-dom";
import App from "./App";

// let elem=React.createElement("h3", {}, "Hello React");
// class MyHead extends React.Component{
//     constructor(props){
//         super(props);
//     }

//     render(){
//         return <h3>Hello React JSX</h3>  //JSX
//     }
// }
ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <App/>
        </Switch>
    </BrowserRouter>
, document.querySelector("#root"));