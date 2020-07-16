import React from "react";
import {Link} from "react-router-dom";
import "./NavBar.css";


class NavBar extends React.Component{
    constructor(props){
        super(props);
        this.state={
            yPosition:0
        }
        this.listenToScroll=this.listenToScroll.bind(this);
    }

    componentDidMount(){
        window.addEventListener("scroll", this.listenToScroll);
    }

    componentWillUnmount(){
        window.removeEventListener("scroll",this.listenToScroll);
    }

    listenToScroll(){
        this.setState({
            yPosition:window.pageYOffset
        })
    }

    toggleLogoText(){
        if(this.state.yPosition>=300){
            return <div id="navLogoText" style={{animation: "fadeInOpacity 0.5s linear 0s 1"}}>Path Searching App</div>
        }
        else{
            return <div id="navLogoText"></div>
        }
    }

    setOpacity(){
        if(this.state.yPosition<=300){
            return {opacity: "1"},{boxShadow: "5px 0.5px 5px gray"}
        }
        else{
            return {opacity: "0.3"},{boxShadow: "5px 0.5px 5px gray"}
        }
    }


    render(){
        return(
            <div id="navBarContainer" style={this.setOpacity()}>
                <div id="navLogo">
                    <Link to="/"><img src="https://cdn3.iconfinder.com/data/icons/faticons/32/grid-01-512.png" id="navIcon"></img></Link>
                    {this.toggleLogoText()}
                </div>
                <div id="navBtn">
                    <button id="navGitHub" onClick={()=>{window.open("https://github.com/HCHANGN/SearchingPathProject")}}>GitHub</button>
                    <button id="navAbout">About</button>
                </div>
            </div>
        )  
    }
}

export default NavBar;