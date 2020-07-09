import React from "react";
import "./Graph.css";

class Graph extends React.Component{
    constructor(props){
        super(props);
        this.state={
            init:false,
            adjacencyList:{},
            w:30,
            h:20,
            start:"0_0",
            end:"5_5",
            visitedPath:[],
            speed:1,
            wall:[],
            keypress:false,
            cStart:false,
            cEnd:false
        }

        this.addVertex=this.addVertex.bind(this);
        this.addEdge=this.addEdge.bind(this);
        this.removeEdge=this.removeEdge.bind(this);
        this.initGraph=this.initGraph.bind(this);
        this.makeDrawData=this.makeDrawData.bind(this);
        this.DFSI=this.DFSI.bind(this);
        this.BFS=this.BFS.bind(this);
        this.reset=this.reset.bind(this);
    }

    addVertex(vertex){
        if(!this.state.adjacencyList[vertex]) this.state.adjacencyList[vertex]=[];
    }

    addEdge(vertex1,vertex2,weight){
        this.state.adjacencyList[vertex1].push({node:vertex2, weight});
        this.state.adjacencyList[vertex2].push({node:vertex1, weight});
    }

    removeEdge(vertex){
        this.state.adjacencyList[vertex].forEach(item=>{
            this.state.adjacencyList[item.node]=this.state.adjacencyList[item.node].filter(itemN=>{
                return itemN.node!=vertex;
            })
        })
        this.state.adjacencyList[vertex]=[];
        this.setState({
            wall:[...this.state.wall,vertex]
        })
        console.log(this.state.adjacencyList);
    }

    initGraph(){
        let w=this.state.w;
        let h=this.state.h;
        for(let i=0;i<=w;i++){
            for(let j=0;j<=h;j++){
                this.addVertex(`${i}_${j}`);
                if(j!=0){
                    this.addEdge(`${i}_${j-1}`,`${i}_${j}`,1);
                }
                if(i!=0){
                    this.addEdge(`${i-1}_${j}`,`${i}_${j}`,1)
                }
            }
        }
    }

    reset(){
        this.setState({
            init:false,
            adjacencyList:{},
            visitedPath:[],
            wall:[]
        })
    }

    makeDrawData(){
        let counter=0;
        let graphArray=[];
        let tempArray=[];
        for(let vertex in this.state.adjacencyList){
            tempArray.push(vertex);
            if(counter===this.state.h){
                graphArray.push(tempArray);
                tempArray=[];
                counter=0;
            }
            else{
                counter++;
            }
        }
        return graphArray;
    }

    //search graph
    DFSI(){
        let dataStack=[];
        let result=[];
        let visited={};
        this.state.visitedPath=[];

        dataStack.push(this.state.start);

        while(dataStack.length!=0){
            let data=dataStack.pop();
            if(data===this.state.end){
                break;
            }
            if(!visited.hasOwnProperty(data)){
                result.push(data);
                visited[data]=true;
                this.state.adjacencyList[data].forEach(e=>{
                    if(!visited.hasOwnProperty(e.node)){
                        dataStack.push(e.node);
                    }
                })
            }
        }
        let setter = setInterval(()=>{
            if(result.length!=0){
                let visitedV = result.shift();
                this.setState({
                    visitedPath:[...this.state.visitedPath,visitedV]
                })
            }
            else{
                clearInterval(setter);
            }
            
        },this.state.speed)
        return result;
    }

    BFS(){
        let result=[];
        let visited={};
        let dataQueue=[];
        this.state.visitedPath=[];

        dataQueue.push(this.state.start);
        while(dataQueue.length!=0){
            let data=dataQueue.shift();
            if(data===this.state.end){
                break;
            }
            if(!visited.hasOwnProperty(data)){
                result.push(data);
                visited[data]=true;
                this.state.adjacencyList[data].forEach(e=>{
                    if(!visited.hasOwnProperty(e.node)){
                        dataQueue.push(e.node);
                    }
                })
            }
        }
        let setter = setInterval(()=>{
            if(result.length!=0){
                let visitedV = result.shift();
                this.setState({
                    visitedPath:[...this.state.visitedPath,visitedV]
                })
            }
            else{
                clearInterval(setter);
            }
            
        },this.state.speed)
            
        return result;
    }

    ///// View part

    render(){
        if(!this.state.init){
            this.initGraph();
            this.state.init=true;
        }
        let graphData = this.makeDrawData();
        return(
            <div id="container">
                <h1>HiHi~</h1>
                <button onClick={this.DFSI}>Start DFS</button>
                <button onClick={this.BFS}>Start BFS</button>
                <button onClick={this.reset}>Reset</button>
                <div id="graphContainer" 
                    onMouseDown={(e)=>{
                        e.preventDefault();
                        this.setState({
                            keypress:true
                        })
                        if(e.target.className==="startVertex"){
                            this.setState({
                                cStart:true
                            })
                        }
                        if(e.target.className==="endVertex"){
                            this.setState({
                                cEnd:true
                            })
                        }
                    }}
                    onMouseUp={(e)=>{
                        e.preventDefault();
                        this.setState({
                            keypress:false
                        })
                        if(this.state.cStart){
                            this.setState({
                                cStart:false,
                                start:e.target.id
                            })
                            this.reset();
                        }
                        if(this.state.cEnd){
                            this.setState({
                                cEnd:false,
                                end:e.target.id
                            })
                            this.reset();
                        }
                    }}
                    onMouseMove={(e)=>{
                        e.preventDefault();
                        if(this.state.keypress){
                            if(e.target.className==="vertex"){
                                this.removeEdge(e.target.id);
                            }
                            if(e.target.className==="visited"){
                                this.removeEdge(e.target.id);
                            }
                            if(this.state.cStart){
                                if(e.target.className!="endVertex"){
                                    e.target.className="startVertex";
                                }
                            
                            }
                            if(this.state.cEnd){
                                if(e.target.className!="startVertex"){
                                    e.target.className="endVertex";
                                }
                            }
                        }
                    }}
                    onMouseOut={(e)=>{
                        e.preventDefault();
                        if(this.state.cStart){
                            e.target.className="vertex"
                        }
                        if(this.state.cEnd){
                            e.target.className="vertex"
                        }
                    }}
                >
                    {graphData.map(item=>{
                        return <div key={"row"+item[0]}>{item.map(vertex=>{
                            if(this.state.wall.indexOf(vertex)!=-1){
                                return <div key={vertex} id={vertex} className="wall"></div>
                            }
                            if(vertex===this.state.start){
                                return <div key={vertex} id={vertex} className="startVertex"></div>
                            }
                            if(vertex===this.state.end){
                                return <div key={vertex} id={vertex} className="endVertex"></div>
                            }
                            if(this.state.visitedPath){
                                if(this.state.visitedPath.indexOf(vertex)!=-1){
                                    return <div key={vertex} id={vertex} className="visited"></div>
                                }
                            }
                            return <div key={vertex} id={vertex} className="vertex"></div>
                        })}</div>
                    })}
                </div>
            </div>   
        )
    }
}

export default Graph;
