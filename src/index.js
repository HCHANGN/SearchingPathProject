import React from "react";
import ReactDOM from "react-dom";
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
ReactDOM.render(<App/>, document.querySelector("#root"));